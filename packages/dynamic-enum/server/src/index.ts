import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'dynamic-enum',
      plugin: 'dynamic-enum',
      type: 'string',
    });
  },
};
