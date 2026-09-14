export const DEFAULT_STORYBOOK_URL = 'https://web-components.carbondesignsystem.com';

/**
 * Fetches the Storybook index.json from the specified baseUrl.
 *
 * @param {string} [baseUrl=DEFAULT_STORYBOOK_URL]
 * @returns {Promise<object>} Parsed index.json object
 */
export async function fetchStorybookIndex(baseUrl = DEFAULT_STORYBOOK_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const indexUrl = `${cleanBase}/index.json`;

  const response = await fetch(indexUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'carbon-figma-storybook-sync',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Storybook index from ${indexUrl}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data || (!data.entries && !data.stories)) {
    throw new Error(`Invalid Storybook index format received from ${indexUrl}`);
  }

  return data;
}

/**
 * Builds the live Storybook URL for a story or doc ID.
 *
 * @param {string} storyId - The Storybook story ID (e.g. 'components-button--default')
 * @param {object} [options]
 * @param {string} [options.baseUrl=DEFAULT_STORYBOOK_URL]
 * @param {string} [options.type='story'] - 'story' or 'docs'
 * @returns {string} Live Storybook URL
 */
export function buildStoryUrl(storyId, { baseUrl = DEFAULT_STORYBOOK_URL, type = 'story' } = {}) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const pathPrefix = type === 'docs' ? 'docs' : 'story';
  return `${cleanBase}/?path=/${pathPrefix}/${encodeURIComponent(storyId)}`;
}
