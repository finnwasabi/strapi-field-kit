import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { prefixKey } from './utils/prefixKey';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'multiselect-checkbox',
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: prefixKey('label'),
        defaultMessage: 'Multiselect Checkbox',
      },
      intlDescription: {
        id: prefixKey('description'),
        defaultMessage: 'Select multiple options using checkboxes. Data stored as JSON array.',
      },
      components: {
        Input: async () => import('./components/Multiselect'),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'options',
                type: 'textarea-enum',
                intlLabel: {
                  id: prefixKey('options.available-options.label'),
                  defaultMessage: 'Options (one per line)',
                },
                description: {
                  id: prefixKey('options.available-options.description'),
                  defaultMessage: 'Enter one option per line.',
                },
                placeholder: {
                  id: prefixKey('options.available-options.placeholder'),
                  defaultMessage: 'Option 1\nOption 2\nOption 3',
                },
              },
              {
                name: 'default',
                type: 'json',
                intlLabel: {
                  id: prefixKey('options.default.label'),
                  defaultMessage: 'Default value',
                },
                description: {
                  id: prefixKey('options.default.description'),
                  defaultMessage:
                    'Set the default value in JSON format, ex: ["Option 1", "Option 2"]',
                },
                defaultValue: '[]',
              },
            ],
          },
        ],

        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'content-type-builder.form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'content-type-builder.form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
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
