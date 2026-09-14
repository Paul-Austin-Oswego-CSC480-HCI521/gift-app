export const FIGMA_API_BASE = 'https://api.figma.com/v1';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates an authorized Figma API client with automatic rate-limit retry and backoff.
 *
 * @param {object} options
 * @param {string} options.token - Figma Personal Access Token
 * @param {string} [options.apiBase=FIGMA_API_BASE]
 * @param {number} [options.maxRetries=5]
 * @param {number} [options.batchDelayMs=300]
 */
export function createFigmaClient({
  token,
  apiBase = FIGMA_API_BASE,
  maxRetries = 5,
  batchDelayMs = 300,
} = {}) {
  if (!token) {
    throw new Error('Figma API token is required. Set FIGMA_API_TOKEN or FIGMA_API_KEY environment variable.');
  }

  const headers = {
    'X-Figma-Token': token,
    'Content-Type': 'application/json',
    'User-Agent': 'carbon-figma-storybook-sync',
  };

  /**
   * Helper for Figma API fetch requests with exponential backoff for 429 rate limits.
   */
  async function request(endpoint, options = {}, attempt = 0) {
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfterHeader = response.headers.get('retry-after');
          const waitTimeMs = retryAfterHeader
            ? parseInt(retryAfterHeader, 10) * 1000
            : Math.min(30000, 1000 * Math.pow(2, attempt) + Math.random() * 500);

          console.warn(`   ⚠️ Rate limited by Figma (429). Waiting ${Math.round(waitTimeMs / 1000)}s before retry (${attempt + 1}/${maxRetries})...`);
          await sleep(waitTimeMs);
          return request(endpoint, options, attempt + 1);
        }

        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {
          // ignore
        }
        throw new Error(`Figma API error [${response.status} ${response.statusText}] at ${url}: ${errorBody}`);
      }

      return response.json();
    } catch (err) {
      if (err.message && err.message.includes('Figma API error')) {
        throw err;
      }
      if (attempt < maxRetries) {
        const waitTimeMs = 1000 * Math.pow(2, attempt);
        await sleep(waitTimeMs);
        return request(endpoint, options, attempt + 1);
      }
      throw err;
    }
  }

  return {
    /**
     * Fetches file metadata and document tree for a Figma file.
     * @param {string} fileKey
     * @param {object} [options]
     * @param {number} [options.depth]
     */
    async getFile(fileKey, { depth } = {}) {
      if (!fileKey) throw new Error('Figma file key is required');
      const query = depth ? `?depth=${depth}` : '';
      return request(`/files/${encodeURIComponent(fileKey)}${query}`);
    },

    /**
     * Fetches components list directly via Figma components endpoint.
     * @param {string} fileKey
     */
    async getComponents(fileKey) {
      if (!fileKey) throw new Error('Figma file key is required');
      const data = await request(`/files/${encodeURIComponent(fileKey)}/components`);
      return data?.meta?.components || [];
    },

    /**
     * Fetches component sets list directly via Figma component_sets endpoint.
     * @param {string} fileKey
     */
    async getComponentSets(fileKey) {
      if (!fileKey) throw new Error('Figma file key is required');
      const data = await request(`/files/${encodeURIComponent(fileKey)}/component_sets`);
      return data?.meta?.component_sets || [];
    },

    /**
     * Fetches existing dev resources for a Figma file.
     * @param {string} fileKey
     * @returns {Promise<Array<object>>}
     */
    async getDevResources(fileKey) {
      if (!fileKey) throw new Error('Figma file key is required');
      const data = await request(`/files/${encodeURIComponent(fileKey)}/dev_resources`);
      return data?.dev_resources || [];
    },

    /**
     * Creates new dev resources in Figma.
     * @param {Array<{ name: string, url: string, file_key: string, node_id: string }>} devResources
     * @param {object} [options]
     * @param {number} [options.batchSize=25]
     */
    async createDevResources(devResources, { batchSize = 25 } = {}) {
      if (!devResources || devResources.length === 0) return { created: [] };

      const results = [];
      for (let i = 0; i < devResources.length; i += batchSize) {
        if (i > 0 && batchDelayMs > 0) {
          await sleep(batchDelayMs);
        }
        const batch = devResources.slice(i, i + batchSize);
        const data = await request('/dev_resources', {
          method: 'POST',
          body: JSON.stringify({ dev_resources: batch }),
        });
        if (data?.links_created) {
          results.push(...data.links_created);
        } else if (data?.dev_resources) {
          results.push(...data.dev_resources);
        }
      }
      return { created: results };
    },

    /**
     * Updates existing dev resources in Figma.
     * @param {Array<{ id: string, name: string, url: string, file_key: string, node_id: string }>} devResources
     * @param {object} [options]
     * @param {number} [options.batchSize=25]
     */
    async updateDevResources(devResources, { batchSize = 25 } = {}) {
      if (!devResources || devResources.length === 0) return { updated: [] };

      const results = [];
      for (let i = 0; i < devResources.length; i += batchSize) {
        if (i > 0 && batchDelayMs > 0) {
          await sleep(batchDelayMs);
        }
        const batch = devResources.slice(i, i + batchSize);
        const data = await request('/dev_resources', {
          method: 'PUT',
          body: JSON.stringify({ dev_resources: batch }),
        });
        if (data?.links_updated) {
          results.push(...data.links_updated);
        } else if (data?.dev_resources) {
          results.push(...data.dev_resources);
        }
      }
      return { updated: results };
    },
  };
}

/**
 * Recursively walks a Figma document tree and extracts all COMPONENT and COMPONENT_SET nodes.
 *
 * @param {object} documentRoot - The root node of the Figma document (e.g. data.document)
 * @returns {Array<{ id: string, name: string, type: 'COMPONENT'|'COMPONENT_SET', parentId?: string }>}
 */
export function extractFigmaComponents(documentRoot) {
  if (!documentRoot) return [];

  const components = [];

  function traverse(node, parent = null) {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      components.push({
        id: node.id,
        name: node.name,
        type: node.type,
        parentId: parent?.id || null,
        parentName: parent?.name || null,
        parentType: parent?.type || null,
      });
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child, node);
      }
    }
  }

  traverse(documentRoot);
  return components;
}
