import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'composite',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('label'),
        defaultMessage: 'Composite',
      },
      intlDescription: {
        id: getTranslation('description'),
        defaultMessage: 'Combine multiple fields into one display value',
      },
      components: {
        Input: async () => import('./components/CompositeInput'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: getTranslation('section.title'),
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.fields',
                type: 'textarea',
                intlLabel: {
                  id: getTranslation('fields.label'),
                  defaultMessage: 'Fields to combine',
                },
                description: {
                  id: getTranslation('fields.description'),
                  defaultMessage:
                    'Enter field names (one per line). Only text/string fields are supported.',
                },
                placeholder: {
                  id: getTranslation('fields.placeholder'),
                  defaultMessage: 'salutation\nfirstName\nlastName\nemail',
                },
              },
              {
                name: 'options.separator',
                type: 'text',
                intlLabel: {
                  id: getTranslation('separator.label'),
                  defaultMessage: 'Separator',
                },
                description: {
                  id: getTranslation('separator.description'),
                  defaultMessage: 'Separator between fields (default: " - ")',
                },
                placeholder: {
                  id: getTranslation('separator.placeholder'),
                  defaultMessage: ' - ',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: getTranslation('advanced.title'),
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.autoGenerate',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('autoGenerate.label'),
                  defaultMessage: 'Auto-generate',
                },
                description: {
                  id: getTranslation('autoGenerate.description'),
                  defaultMessage: 'Automatically generate value when source fields change',
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
