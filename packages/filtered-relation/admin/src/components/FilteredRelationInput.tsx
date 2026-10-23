import { Box, Field, Flex, SingleSelect, SingleSelectOption, Typography } from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { getTranslation } from '../utils/getTranslation';
import {
  buildFilterQuery,
  describeFilters,
  guessRelationModel,
  parseCollectionName,
  resolveFilters,
  toRelatedItems,
  type FilteredRelationOptions,
  type RelatedItem,
} from '../utils/filters';

export const UPDATED_EVENT = 'filtered-relation-updated';

interface FilteredRelationInputProps {
  name: string;
  label?: string;
  error?: string;
  value?: unknown;
  documentId?: string;
  id?: string;
  attribute?: { options?: FilteredRelationOptions };
}

type Entry = Record<string, any>;

const listResults = (response: any): Entry[] =>
  response?.data?.results || response?.results || response?.data || [];

const FilteredRelationInput = (props: FilteredRelationInputProps) => {
  const { name, error, value, attribute } = props;
  const { formatMessage } = useIntl();
  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [relationTarget, setRelationTarget] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const lastSegment = location.pathname.split('/').pop();
  const documentId = props.documentId || props.id || (lastSegment && lastSegment !== 'create' ? lastSegment : null);

  const options = attribute?.options || {};
  const { targetModel: targetModelInput, filterField1, filterValue1, filterField2, filterValue2, statusField } = options;
  const displayField = options.displayField || 'id';
  const targetModel = parseCollectionName(targetModelInput);
  const relationModel = relationTarget || guessRelationModel(displayField);

  const filters = useMemo(
    () => resolveFilters({ filterField1, filterValue1, filterField2, filterValue2 }, documentId),
    [filterField1, filterValue1, filterField2, filterValue2, documentId]
  );

  const t = (id: string, defaultMessage: string, values?: Record<string, string>) =>
    formatMessage({ id: getTranslation(id), defaultMessage }, values);

  // The target schema gives the status choices and the model the display field points to.
  useEffect(() => {
    if (!targetModel) return;
    get(`/content-type-builder/content-types/${targetModel}`)
      .then((response: any) => {
        const attributes = response?.data?.data?.schema?.attributes || {};
        const enumValues = statusField ? attributes[statusField]?.enum : undefined;
        if (Array.isArray(enumValues)) setStatusOptions(enumValues);
        if (typeof attributes[displayField]?.target === 'string') setRelationTarget(attributes[displayField].target);
      })
      .catch(() => {
        // Without Content-Type Builder access: no status dropdown, guessed relation model.
      });
  }, [targetModel, statusField, displayField, get]);

  const fetchItems = useCallback(async () => {
    if (!targetModel || Object.keys(filters).length === 0) return;

    setLoading(true);
    try {
      const response = await get(
        `/content-manager/collection-types/${targetModel}?${buildFilterQuery(filters)}&populate[${displayField}][populate]=*`
      );
      setItems(toRelatedItems(listResults(response), { displayField, statusField, relationModel, targetModel }));
    } catch (err) {
      console.error('[FilteredRelation] Error fetching filtered relations:', err);
    } finally {
      setLoading(false);
    }
  }, [get, targetModel, filters, displayField, statusField, relationModel]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, value]);

  // Other filtered-relation fields on the same entry refresh after a status change.
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      if ((event as CustomEvent).detail?.documentId === documentId) fetchItems();
    };
    window.addEventListener(UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(UPDATED_EVENT, handleUpdate);
  }, [documentId, fetchItems]);

  // Moving an entry to another status means taking it off this record and adding it to the
  // record that has the new status (and the same second filter), which must already exist.
  const handleStatusChange = async (item: RelatedItem, newStatus: string) => {
    if (!statusField || !targetModel || !displayField || !item.originalId) return;

    const itemId = item.originalId;
    setUpdating((current) => ({ ...current, [itemId]: true }));

    try {
      const current = await get(`/content-manager/collection-types/${targetModel}/${itemId}?populate=*`);
      const currentData: Entry = (current as any)?.data?.data || {};
      const currentRelated: Entry[] = Array.isArray(currentData[displayField]) ? currentData[displayField] : [];
      const toMove = currentRelated.find((rel) => (rel?.documentId || rel?.id) === item.relatedDocumentId);

      if (!toMove) {
        toggleNotification({
          type: 'danger',
          message: t('error.notInRecord', 'This entry is no longer in the record. Please refresh the page.'),
        });
        return;
      }

      const targetFilters = resolveFilters(
        { filterField1, filterValue1: newStatus, filterField2, filterValue2 },
        documentId
      );
      const search = await get(
        `/content-manager/collection-types/${targetModel}?${buildFilterQuery(targetFilters)}&populate[${displayField}]=*`
      );
      const targetRecord = listResults(search)[0];

      if (!targetRecord) {
        toggleNotification({
          type: 'danger',
          message: t('error.noTarget', 'No {collection} found with status "{status}" for these filters. Please create one first.', {
            collection: targetModelInput || 'record',
            status: newStatus,
          }),
        });
        return;
      }

      const targetId = targetRecord.documentId || targetRecord.id;
      const target = await get(`/content-manager/collection-types/${targetModel}/${targetId}?populate=*`);
      const targetData: Entry = (target as any)?.data?.data || {};

      if (!targetData.documentId) {
        toggleNotification({
          type: 'danger',
          message: t('error.targetMissing', 'Target record not found. Please refresh and try again.'),
        });
        return;
      }

      const ref = { id: toMove.id, documentId: toMove.documentId };

      await put(`/content-manager/collection-types/${targetModel}/${itemId}`, {
        documentId: currentData.documentId,
        [displayField]: { connect: [], disconnect: [ref] },
        [statusField]: currentData[statusField],
      });

      await put(`/content-manager/collection-types/${targetModel}/${targetId}`, {
        documentId: targetData.documentId,
        [displayField]: { connect: [ref], disconnect: [] },
        [statusField]: targetData[statusField],
      });

      await fetchItems();
      window.dispatchEvent(new CustomEvent(UPDATED_EVENT, { detail: { documentId, targetModel } }));

      toggleNotification({ type: 'success', message: t('status.changed', 'Status changed successfully') });
    } catch (err) {
      console.error('[FilteredRelation] Error changing status:', err);
      toggleNotification({ type: 'danger', message: t('error.changeFailed', 'Failed to change status. Please try again.') });
    } finally {
      setUpdating((current) => ({ ...current, [itemId]: false }));
    }
  };

  const hasFilters = Object.keys(filters).length > 0;
  // Field.Hint only renders the hint passed to Field.Root.
  const hint = hasFilters
    ? t('filters', 'Filters: {filters}', { filters: describeFilters(filters, documentId) })
    : t('filters.none', 'No filters configured');

  let content;
  if (loading) {
    content = (
      <Typography variant="omega" textColor="neutral600">
        {t('loading', 'Loading...')}
      </Typography>
    );
  } else if (items.length === 0) {
    content = (
      <Typography variant="omega" textColor="neutral600">
        {t('no-results', 'No matching records found')}
      </Typography>
    );
  } else {
    content = (
      <Flex direction="column" alignItems="stretch" gap={1}>
        {items.map((item) => (
          <Box
            key={item.id}
            background="neutral0"
            borderColor="neutral200"
            borderStyle="solid"
            borderWidth="1px"
            hasRadius
            paddingTop={2}
            paddingBottom={2}
            paddingLeft={4}
            paddingRight={4}
            style={{
              cursor: 'pointer',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={() =>
              navigate(`/content-manager/collection-types/${item.relationModel}/${item.relatedDocumentId}`)
            }
          >
            <Typography variant="omega" textColor="primary600">
              {item.label}
            </Typography>

            {statusField && statusOptions.length > 0 && (
              <Box onClick={(event: React.MouseEvent) => event.stopPropagation()} style={{ minWidth: '150px' }}>
                <SingleSelect
                  size="S"
                  aria-label={t('status.label', 'Status')}
                  value={item.currentStatus}
                  onChange={(next: string | number) => handleStatusChange(item, String(next))}
                  disabled={item.originalId ? updating[item.originalId] : true}
                >
                  {statusOptions.map((status) => (
                    <SingleSelectOption key={status} value={status}>
                      {status}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    );
  }

  return (
    <Field.Root name={name} error={error} hint={hint}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label>
          {props.label || name} {items.length > 0 && `(${items.length})`}
        </Field.Label>
        {content}
        <Field.Hint />
      </Flex>
      <Field.Error />
    </Field.Root>
  );
};

export default FilteredRelationInput;
