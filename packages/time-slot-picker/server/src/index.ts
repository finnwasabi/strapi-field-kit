import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'time-slot-picker',
      plugin: 'time-slot-picker',
      type: 'json',
    });
  },
};
