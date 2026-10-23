import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'filtered-relation',
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('label'),
        defaultMessage: 'Filtered Relation',
      },
      intlDescription: {
        id: getTranslation('description'),
        defaultMessage: 'Relation field with filtering by field value and status change',
      },
      components: {
        Input: async () => import('./components/FilteredRelationInput'),
      },
      options: {
        base: [
          {
            intlLabel: {
              id: getTranslation('displayField.label'),
              defaultMessage: 'Display Field',
            },
            name: 'options.displayField',
            type: 'text',
            description: {
              id: getTranslation('displayField.description'),
              defaultMessage:
                "Relation field name to display (e.g., 'investors')",
            },
            placeholder: {
              id: getTranslation('displayField.placeholder'),
              defaultMessage: 'investors',
            },
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: getTranslation('section.target'),
              defaultMessage: 'Target Collection',
            },
            items: [
              {
                name: 'options.targetModel',
                type: 'text',
                intlLabel: {
                  id: getTranslation('targetModel.label'),
                  defaultMessage: 'Collection Name',
                },
                description: {
                  id: getTranslation('targetModel.description'),
                  defaultMessage:
                    "Collection display name (e.g., 'Meeting Participation Status'). Will auto-convert to API ID.",
                },
                placeholder: {
                  id: getTranslation('targetModel.placeholder'),
                  defaultMessage: 'Meeting Participation Status',
                },
              },
            ],
          },
          {
            sectionTitle: {
              id: getTranslation('section.filters'),
              defaultMessage: 'Filter Conditions',
            },
            items: [
              {
                name: 'options.filterField1',
                type: 'text',
                intlLabel: {
                  id: getTranslation('filterField1.label'),
                  defaultMessage: 'Filter Field 1',
                },
                placeholder: {
                  id: getTranslation('filterField1.placeholder'),
                  defaultMessage: 'participantStatus',
                },
              },
              {
                name: 'options.filterValue1',
                type: 'text',
                intlLabel: {
                  id: getTranslation('filterValue1.label'),
                  defaultMessage: 'Filter Value 1',
                },
                placeholder: {
                  id: getTranslation('filterValue1.placeholder'),
                  defaultMessage: 'Rejected',
                },
              },
              {
                name: 'options.filterField2',
                type: 'text',
                intlLabel: {
                  id: getTranslation('filterField2.label'),
                  defaultMessage: 'Filter Field 2 (Optional)',
                },
                placeholder: {
                  id: getTranslation('filterField2.placeholder'),
                  defaultMessage: 'event',
                },
              },
              {
                name: 'options.filterValue2',
                type: 'text',
                intlLabel: {
                  id: getTranslation('filterValue2.label'),
                  defaultMessage: 'Filter Value 2 (Optional)',
                },
                description: {
                  id: getTranslation('filterValue2.description'),
                  defaultMessage:
                    'Use {{documentId}} to filter by the current entry',
                },
                placeholder: {
                  id: getTranslation('filterValue2.placeholder'),
                  defaultMessage: '{{documentId}}',
                },
              },
            ],
          },
          {
            sectionTitle: {
              id: getTranslation('section.statusChange'),
              defaultMessage: 'Status Change Configuration',
            },
            items: [
              {
                name: 'options.statusField',
                type: 'text',
                intlLabel: {
                  id: getTranslation('statusField.label'),
                  defaultMessage: 'Status Field Name',
                },
                description: {
                  id: getTranslation('statusField.description'),
                  defaultMessage:
                    "Field name in target model that contains status (e.g., 'participantStatus'). Leave empty to disable status change.",
                },
                placeholder: {
                  id: getTranslation('statusField.placeholder'),
                  defaultMessage: 'participantStatus',
                },
              },
            ],
          },
        ],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
