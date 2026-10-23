import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'dynamic-enum',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: getTranslation('label'),
        defaultMessage: 'Dynamic Enum',
      },
      intlDescription: {
        id: getTranslation('description'),
        defaultMessage: 'Single select with ability to create new options',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/DynamicEnumInput'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: getTranslation('options.base.settings'),
              defaultMessage: 'Settings',
            },
            items: [
              {
                // Stored as attribute.options (a newline-separated string); keep the
                // name so schemas created with 1.x keep working.
                name: 'options',
                type: 'textarea',
                intlLabel: {
                  id: getTranslation('options.enum'),
                  defaultMessage: 'Initial Options',
                },
                description: {
                  id: getTranslation('options.enum.description'),
                  defaultMessage: 'Enter initial enum values, one per line',
                },
                placeholder: {
                  id: getTranslation('options.enum.placeholder'),
                  defaultMessage: 'Option 1\nOption 2\nOption 3',
                },
              },
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('options.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslation('options.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
        advanced: [],
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
