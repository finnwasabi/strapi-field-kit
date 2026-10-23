import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'time-slot-picker',
      pluginId: PLUGIN_ID,
      type: 'json',
      intlLabel: {
        id: getTranslation('label'),
        defaultMessage: 'Time Slot Picker',
      },
      intlDescription: {
        id: getTranslation('description'),
        defaultMessage: 'Select time slots for specific dates',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/TimeSlotInput'),
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
              {
                name: 'options.allowDateEditing',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('options.allowDateEditing'),
                  defaultMessage: 'Editors can add and remove dates',
                },
                description: {
                  id: getTranslation('options.allowDateEditing.description'),
                  defaultMessage:
                    'Show a date picker in the edit view. Leave off when dates come from your API.',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: getTranslation('options.advanced.slots'),
              defaultMessage: 'Time Slots Configuration',
            },
            items: [
              {
                name: 'options.morningSlots',
                type: 'textarea',
                intlLabel: {
                  id: getTranslation('options.morningSlots'),
                  defaultMessage: 'Morning Slots (one per line)',
                },
                description: {
                  id: getTranslation('options.morningSlots.description'),
                  defaultMessage:
                    'Enter morning time slots, one per line. Example:\n8:00-9:00\n9:00-10:00\n10:00-11:00\n11:00-12:00\n12:00-13:00',
                },
              },
              {
                name: 'options.afternoonSlots',
                type: 'textarea',
                intlLabel: {
                  id: getTranslation('options.afternoonSlots'),
                  defaultMessage: 'Afternoon Slots (one per line)',
                },
                description: {
                  id: getTranslation('options.afternoonSlots.description'),
                  defaultMessage:
                    'Enter afternoon time slots, one per line. Example:\n13:00-14:00\n14:00-15:00\n15:00-16:00\n16:00-17:00\n17:00-18:00',
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
