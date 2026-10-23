import { SectionDividerIcon } from './components/SectionDividerIcon';
import { PLUGIN_ID } from './pluginId';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'section-divider',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: `${PLUGIN_ID}.label`,
        defaultMessage: 'Section Divider',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.description`,
        defaultMessage: 'Add a visual divider to separate sections',
      },
      icon: SectionDividerIcon,
      components: {
        Input: async () => import('./components/Input'),
      },
      options: {
        base: [],
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
