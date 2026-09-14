import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeName,
  toCompact,
  getSegments,
  selectBestStory,
  buildStoryLookup,
  matchComponentToStory,
} from '../scripts/lib/matcher.js';
import { extractFigmaComponents, createFigmaClient } from '../scripts/lib/figma.js';
import { buildStoryUrl } from '../scripts/lib/storybook.js';
import { syncFigmaDevResources, parseArgs } from '../scripts/sync-figma-dev-resources.js';

describe('Matcher Library', () => {
  test('normalizeName cleans punctuation and whitespace', () => {
    assert.equal(normalizeName('Button / Primary'), 'button primary');
    assert.equal(normalizeName('  Combo-Box  (Large) '), 'combo box large');
    assert.equal(normalizeName('UI_Shell / Header'), 'ui shell header');
    assert.equal(normalizeName(''), '');
    assert.equal(normalizeName(null), '');
  });

  test('toCompact strips all non-alphanumeric characters', () => {
    assert.equal(toCompact('Combo-Box / Large'), 'comboboxlarge');
    assert.equal(toCompact('Data Table (v11)'), 'datatablev11');
    assert.equal(toCompact(''), '');
  });

  test('getSegments splits on various separators', () => {
    assert.deepEqual(getSegments('Button / Primary'), ['Button', 'Primary']);
    assert.deepEqual(getSegments('Tag - Filter'), ['Tag', 'Filter']);
    assert.deepEqual(getSegments('Notification | Toast | Error'), ['Notification', 'Toast', 'Error']);
    assert.deepEqual(getSegments('Standalone'), ['Standalone']);
    assert.deepEqual(getSegments(''), []);
  });

  test('selectBestStory picks default story over other variants', () => {
    const stories = [
      { id: 'btn--secondary', name: 'Secondary', type: 'story' },
      { id: 'btn--default', name: 'Default', type: 'story' },
      { id: 'btn--overview', name: 'Overview', type: 'docs' },
    ];
    assert.equal(selectBestStory(stories)?.id, 'btn--default');
  });

  test('selectBestStory falls back to first story when no default exists', () => {
    const stories = [
      { id: 'tag--dismissible', name: 'Dismissible', type: 'story' },
      { id: 'tag--skeleton', name: 'Skeleton', type: 'story' },
    ];
    assert.equal(selectBestStory(stories)?.id, 'tag--dismissible');
  });

  test('buildStoryLookup and matchComponentToStory matches various component names', () => {
    const mockIndex = {
      entries: {
        'components-button--default': {
          id: 'components-button--default',
          title: 'Components/Button',
          name: 'Default',
          type: 'story',
        },
        'components-button--secondary': {
          id: 'components-button--secondary',
          title: 'Components/Button',
          name: 'Secondary',
          type: 'story',
        },
        'components-combo-box--default': {
          id: 'components-combo-box--default',
          title: 'Components/Combo box',
          name: 'Default',
          type: 'story',
        },
        'components-notifications-toast--default': {
          id: 'components-notifications-toast--default',
          title: 'Components/Notifications/Toast',
          name: 'Default',
          type: 'story',
        },
        'components-pagination--default': {
          id: 'components-pagination--default',
          title: 'Components/Pagination',
          name: 'Default',
          type: 'story',
        },
        'components-datatable-pagination--default': {
          id: 'components-datatable-pagination--default',
          title: 'Components/DataTable/Pagination',
          name: 'Default',
          type: 'story',
        },
      },
    };

    const lookup = buildStoryLookup(mockIndex);

    // Exact component match
    const btnMatch = matchComponentToStory('Button', lookup);
    assert.equal(btnMatch.matched, true);
    assert.equal(btnMatch.storyId, 'components-button--default');

    // Variant segment match
    const btnVariantMatch = matchComponentToStory('Button / Primary', lookup);
    assert.equal(btnVariantMatch.matched, true);
    assert.equal(btnVariantMatch.storyId, 'components-button--default');

    // Multi-word component match
    const comboBoxMatch = matchComponentToStory('ComboBox', lookup);
    assert.equal(comboBoxMatch.matched, true);
    assert.equal(comboBoxMatch.storyId, 'components-combo-box--default');

    // Nested group match
    const toastMatch = matchComponentToStory('Notification / Toast', lookup);
    assert.equal(toastMatch.matched, true);
    assert.equal(toastMatch.storyId, 'components-notifications-toast--default');

    // Top-level pagination takes precedence over nested DataTable/Pagination
    const paginationMatch = matchComponentToStory('Pagination', lookup);
    assert.equal(paginationMatch.matched, true);
    assert.equal(paginationMatch.storyId, 'components-pagination--default');
  });

  test('matchComponentToStory respects manual overrides', () => {
    const mockIndex = {
      entries: {
        'components-button--default': {
          id: 'components-button--default',
          title: 'Components/Button',
          name: 'Default',
          type: 'story',
        },
        'custom-story--special': {
          id: 'custom-story--special',
          title: 'Custom/Special',
          name: 'Special',
          type: 'story',
        },
      },
    };

    const lookup = buildStoryLookup(mockIndex);
    const overrides = { 'Special Button': 'custom-story--special' };

    const match = matchComponentToStory('Special Button', lookup, overrides);
    assert.equal(match.matched, true);
    assert.equal(match.storyId, 'custom-story--special');
    assert.equal(match.matchReason, 'manual_override');
  });

  test('matchComponentToStory matches child variants using parentName', () => {
    const mockIndex = {
      entries: {
        'components-button--default': {
          id: 'components-button--default',
          title: 'Components/Button',
          name: 'Default',
          type: 'story',
        },
      },
    };

    const lookup = buildStoryLookup(mockIndex);
    const component = {
      name: 'Size=md, Kind=primary',
      parentName: 'Button',
    };

    const match = matchComponentToStory(component, lookup);
    assert.equal(match.matched, true);
    assert.equal(match.storyId, 'components-button--default');
  });

  test('matchComponentToStory returns unmatched for unknown component', () => {
    const lookup = buildStoryLookup({ entries: {} });
    const match = matchComponentToStory('UnknownComponent123', lookup);
    assert.equal(match.matched, false);
    assert.equal(match.storyId, null);
  });
});

describe('Figma Library', () => {
  test('extractFigmaComponents extracts COMPONENT and COMPONENT_SET nodes recursively', () => {
    const mockDocument = {
      id: '0:0',
      name: 'Document',
      type: 'DOCUMENT',
      children: [
        {
          id: '0:1',
          name: 'Page 1',
          type: 'CANVAS',
          children: [
            {
              id: '1:100',
              name: 'Button',
              type: 'COMPONENT_SET',
              children: [
                {
                  id: '1:101',
                  name: 'Size=md, Kind=primary',
                  type: 'COMPONENT',
                },
                {
                  id: '1:102',
                  name: 'Size=sm, Kind=danger',
                  type: 'COMPONENT',
                },
              ],
            },
            {
              id: '2:200',
              name: 'Standalone Banner',
              type: 'COMPONENT',
            },
            {
              id: '3:300',
              name: 'Regular Frame',
              type: 'FRAME',
              children: [
                {
                  id: '3:301',
                  name: 'Nested Tag',
                  type: 'COMPONENT',
                },
              ],
            },
          ],
        },
      ],
    };

    const components = extractFigmaComponents(mockDocument);
    assert.equal(components.length, 5);

    const buttonSet = components.find(c => c.id === '1:100');
    assert.equal(buttonSet?.name, 'Button');
    assert.equal(buttonSet?.type, 'COMPONENT_SET');

    const buttonVariant = components.find(c => c.id === '1:101');
    assert.equal(buttonVariant?.name, 'Size=md, Kind=primary');
    assert.equal(buttonVariant?.parentId, '1:100');
    assert.equal(buttonVariant?.parentName, 'Button');

    const nestedTag = components.find(c => c.id === '3:301');
    assert.equal(nestedTag?.name, 'Nested Tag');
    assert.equal(nestedTag?.parentId, '3:300');
  });

  test('createFigmaClient throws error when token is missing', () => {
    assert.throws(() => createFigmaClient({ token: '' }), /token is required/);
  });
});

describe('Storybook Library', () => {
  test('buildStoryUrl creates proper URLs for stories and docs', () => {
    const storyUrl = buildStoryUrl('components-button--default', {
      baseUrl: 'https://web-components.carbondesignsystem.com',
    });
    assert.equal(storyUrl, 'https://web-components.carbondesignsystem.com/?path=/story/components-button--default');

    const docsUrl = buildStoryUrl('components-button--overview', {
      baseUrl: 'https://web-components.carbondesignsystem.com',
      type: 'docs',
    });
    assert.equal(docsUrl, 'https://web-components.carbondesignsystem.com/?path=/docs/components-button--overview');
  });
});

describe('Sync Engine & CLI', () => {
  test('parseArgs parses CLI arguments correctly', () => {
    const args = parseArgs([
      '--dry-run',
      '--fail-on-unmatched',
      '--file-key', 'CUSTOM_KEY',
      '--token', 'SECRET_TOKEN',
      '--overrides', 'custom-overrides.json',
      '--report', 'custom-report.json',
      '--verbose',
    ]);

    assert.equal(args.dryRun, true);
    assert.equal(args.failOnUnmatched, true);
    assert.equal(args.fileKey, 'CUSTOM_KEY');
    assert.equal(args.token, 'SECRET_TOKEN');
    assert.equal(args.overridesPath, 'custom-overrides.json');
    assert.equal(args.reportPath, 'custom-report.json');
    assert.equal(args.verbose, true);
  });

  test('syncFigmaDevResources performs create, update, and skip correctly', async () => {
    const createdCalls = [];
    const updatedCalls = [];

    const mockFigmaClient = {
      async getFile(fileKey) {
        return {
          document: {
            id: '0:0',
            type: 'DOCUMENT',
            children: [
              {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT',
              },
              {
                id: '1:2',
                name: 'Accordion',
                type: 'COMPONENT',
              },
              {
                id: '1:3',
                name: 'Dropdown',
                type: 'COMPONENT',
              },
              {
                id: '1:999',
                name: 'UnknownMysteryWidget',
                type: 'COMPONENT',
              },
            ],
          },
        };
      },
      async getDevResources(fileKey) {
        return [
          // Button has up-to-date link -> should SKIP
          {
            id: 'res-btn-1',
            node_id: '1:1',
            name: 'Storybook: Button',
            url: 'https://web-components.carbondesignsystem.com/?path=/story/components-button--default',
            file_key: fileKey,
          },
          // Accordion has outdated link -> should UPDATE
          {
            id: 'res-acc-1',
            node_id: '1:2',
            name: 'Storybook: Accordion',
            url: 'https://old-storybook-link.com/accordion',
            file_key: fileKey,
          },
          // Dropdown has no dev resource -> should CREATE
        ];
      },
      async createDevResources(items) {
        createdCalls.push(...items);
        return { created: items };
      },
      async updateDevResources(items) {
        updatedCalls.push(...items);
        return { updated: items };
      },
    };

    const mockStorybookIndex = {
      entries: {
        'components-button--default': {
          id: 'components-button--default',
          title: 'Components/Button',
          name: 'Default',
          type: 'story',
        },
        'components-accordion--default': {
          id: 'components-accordion--default',
          title: 'Components/Accordion',
          name: 'Default',
          type: 'story',
        },
        'components-dropdown--default': {
          id: 'components-dropdown--default',
          title: 'Components/Dropdown',
          name: 'Default',
          type: 'story',
        },
      },
    };

    const result = await syncFigmaDevResources({
      fileKey: 'TEST_FILE_KEY',
      token: 'TEST_TOKEN',
      figmaClient: mockFigmaClient,
      storybookIndex: mockStorybookIndex,
      reportPath: 'test-unmatched.json',
      dryRun: false,
    });

    assert.equal(result.total, 4);
    assert.equal(result.matchedCount, 3);
    assert.equal(result.unmatchedCount, 1);
    assert.equal(result.createdCount, 1);
    assert.equal(result.updatedCount, 1);
    assert.equal(result.skippedCount, 1);

    assert.equal(createdCalls.length, 1);
    assert.equal(createdCalls[0].node_id, '1:3');
    assert.equal(createdCalls[0].name, 'Storybook: Dropdown');

    assert.equal(updatedCalls.length, 1);
    assert.equal(updatedCalls[0].id, 'res-acc-1');
    assert.equal(updatedCalls[0].node_id, '1:2');
    assert.equal(updatedCalls[0].name, 'Storybook: Accordion');
  });

  test('syncFigmaDevResources in dry-run mode does not call write APIs', async () => {
    let createdCalled = false;
    let updatedCalled = false;

    const mockFigmaClient = {
      async getFile() {
        return {
          document: {
            children: [{ id: '1:1', name: 'Button', type: 'COMPONENT' }],
          },
        };
      },
      async getDevResources() {
        return [];
      },
      async createDevResources() {
        createdCalled = true;
      },
      async updateDevResources() {
        updatedCalled = true;
      },
    };

    const mockStorybookIndex = {
      entries: {
        'components-button--default': {
          id: 'components-button--default',
          title: 'Components/Button',
          name: 'Default',
          type: 'story',
        },
      },
    };

    const result = await syncFigmaDevResources({
      fileKey: 'TEST_FILE_KEY',
      token: 'TEST_TOKEN',
      figmaClient: mockFigmaClient,
      storybookIndex: mockStorybookIndex,
      dryRun: true,
    });

    assert.equal(result.dryRun, true);
    assert.equal(result.createdCount, 1);
    assert.equal(createdCalled, false);
    assert.equal(updatedCalled, false);
  });

  test('syncFigmaDevResources throws error with failOnUnmatched when unmatched components exist', async () => {
    const mockFigmaClient = {
      async getFile() {
        return {
          document: {
            children: [{ id: '1:999', name: 'NonExistentComponent', type: 'COMPONENT' }],
          },
        };
      },
      async getDevResources() {
        return [];
      },
    };

    const mockStorybookIndex = { entries: {} };

    await assert.rejects(
      () =>
        syncFigmaDevResources({
          fileKey: 'TEST_FILE_KEY',
          token: 'TEST_TOKEN',
          figmaClient: mockFigmaClient,
          storybookIndex: mockStorybookIndex,
          failOnUnmatched: true,
          dryRun: true,
        }),
      /unmatched component/
    );
  });
});
