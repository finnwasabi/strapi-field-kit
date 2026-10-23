import type { Core } from '@strapi/strapi';

import { buildStaticFilters, collectRelatedIds, FILTERED_RELATION_UID, parseCollectionName } from './utils';

interface FilteredRelationField {
  uid: string;
  schema: { attributes: Record<string, any> };
  fieldName: string;
  targetModel: string | null;
  filters: Record<string, string>;
  displayField?: string;
}

// Schemas are fixed once Strapi is running, so the filtered-relation fields are collected once.
let fieldsCache: FilteredRelationField[] | null = null;

const getFilteredRelationFields = (strapi: Core.Strapi): FilteredRelationField[] => {
  if (fieldsCache) return fieldsCache;

  fieldsCache = [];
  for (const uid of Object.keys(strapi.contentTypes)) {
    if (!uid.startsWith('api::')) continue;

    const schema = strapi.getModel(uid as any) as unknown as FilteredRelationField['schema'];
    for (const [fieldName, config] of Object.entries(schema?.attributes || {})) {
      if (config.customField !== FILTERED_RELATION_UID) continue;

      const options = config.options || {};
      fieldsCache.push({
        uid,
        schema,
        fieldName,
        targetModel: parseCollectionName(options.targetModel),
        filters: buildStaticFilters(options),
        displayField: options.displayField,
      });
    }
  }
  return fieldsCache;
};

const findRelatedEntities = (event: any, schema: FilteredRelationField['schema'], contentTypeUid: string) => {
  const { result, params } = event;
  const ids = new Set<string | number>();

  for (const [fieldName, config] of Object.entries(schema.attributes)) {
    if (config.type === 'relation' && config.target === contentTypeUid) {
      const relatedId = result?.[fieldName]?.id || params?.data?.[fieldName];
      if (relatedId) ids.add(relatedId);
    }
  }
  return [...ids];
};

const updateFilteredField = async (strapi: Core.Strapi, field: FilteredRelationField, entityId: string | number) => {
  try {
    const items = (await strapi.entityService.findMany(field.targetModel as any, {
      filters: field.filters,
      populate: field.displayField ? [field.displayField] : [],
    } as any)) as any[];

    await strapi.entityService.update(field.uid as any, entityId as any, {
      data: { [field.fieldName]: JSON.stringify(collectRelatedIds(items, field.displayField)) },
    } as any);
  } catch (error) {
    strapi.log.error(`Error updating filtered field ${field.fieldName} for ${field.uid}:${entityId}`, error);
  }
};

const updateRelatedFilteredFields = async (event: any, strapi: Core.Strapi) => {
  const { model } = event;
  if (!model) return;

  try {
    const fields = getFilteredRelationFields(strapi).filter((field) => field.targetModel === model.uid);
    for (const field of fields) {
      for (const entityId of findRelatedEntities(event, field.schema, field.uid)) {
        await updateFilteredField(strapi, field, entityId);
      }
    }
  } catch (error) {
    strapi.log.error('Error updating related filtered fields:', error);
  }
};

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'filtered-relation',
      plugin: 'filtered-relation',
      type: 'json',
    });

    strapi.db.lifecycles.subscribe({
      afterCreate: (event) => updateRelatedFilteredFields(event, strapi),
      afterUpdate: (event) => updateRelatedFilteredFields(event, strapi),
      afterDelete: (event) => updateRelatedFilteredFields(event, strapi),
    });
  },
};
