import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'section-divider',
      plugin: 'section-divider',
      type: 'string',
      // A divider only makes sense on its own row, so default to the full grid
      // width and keep editors from shrinking it in "Configure the view".
      inputSize: {
        default: 12,
        isResizable: false,
      },
    });
  },
};
