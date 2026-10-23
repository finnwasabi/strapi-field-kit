import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'multiselect-checkbox',
      plugin: 'multiselect-checkbox',
      type: 'json',
      inputSize: {
        default: 12,
        isResizable: true,
      },
    });
  },
};
