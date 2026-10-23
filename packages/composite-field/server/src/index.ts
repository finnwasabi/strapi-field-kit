import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'composite',
      plugin: 'composite-field',
      type: 'string',
    });
  },
};
