import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useMemo, useState } from 'react';
import {
  getGameDataReferenceService,
  type GameDataListQuery,
  type GameDataRecord,
  type GameDataResourceService,
} from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';
import { message } from '../../shared/feedback/message';
import { detailItems, showMutationError } from './GameDataCrudFormatters';
import {
  type GameDataFieldFilters,
  type GameDataFilters,
  type GameDataFormValues,
  type GameDataModalMode,
  type GameDataReferenceServiceResolver,
} from './GameDataCrudTypes';
import {
  createInitialValues,
  isEmptyFilterValue,
  normalizeFieldFilters,
  toFormValues,
  toRecordFields,
} from './GameDataRecordTransforms';
import { useReferenceLookupState } from './GameDataReferenceLookup';

export interface UseGameDataCrudPageOptions {
  config: GameDataResourceConfig;
  service: GameDataResourceService;
  referenceServiceResolver?: GameDataReferenceServiceResolver;
}

/**
 * 资料维护页的通用状态控制器。
 *
 * 这里故意只返回子组件 props，不直接渲染页面。每个资料子页面都显式组合 Header、筛选、表格、详情抽屉和编辑弹窗，
 * 以后某个页面需要定制列、批量操作或特殊表单时，可以只改自己的页面，不再被统一表格组件卡住。
 */
export function useGameDataCrudPage({
  config,
  service,
  referenceServiceResolver = getGameDataReferenceService,
}: UseGameDataCrudPageOptions) {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<GameDataFilters>({ q: '' });
  const [fieldFilters, setFieldFilters] = useState<GameDataFieldFilters>({});
  const [page, setPage] = useState({ current: 1, pageSize: 20 });
  const [detailRecord, setDetailRecord] = useState<GameDataRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<GameDataModalMode>('create');
  const [editingRecord, setEditingRecord] = useState<GameDataRecord | null>(null);
  const [form] = Form.useForm<GameDataFormValues>();
  const queryClient = useQueryClient();

  const query = useMemo<GameDataListQuery>(
    () => ({
      q: filters.q || undefined,
      ...normalizeFieldFilters(fieldFilters),
      page: page.current - 1,
      size: page.pageSize,
    }),
    [fieldFilters, filters, page],
  );

  const recordsQuery = useQuery({
    queryKey: ['game-data', config.key, query],
    queryFn: () => service.list(query),
  });
  const referenceLookup = useReferenceLookupState(
    config,
    recordsQuery.data?.rows ?? [],
    referenceServiceResolver,
  );

  const invalidateRecords = async () => {
    await queryClient.invalidateQueries({ queryKey: ['game-data', config.key] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: GameDataFormValues) => {
      const fields = toRecordFields(config, values);
      if (modalMode === 'create') {
        return service.create(fields);
      }
      if (!editingRecord) {
        throw new Error('缺少正在编辑的资料');
      }
      return service.update(editingRecord.id, fields);
    },
    onSuccess: async () => {
      message.success('资料已保存');
      closeModal();
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (record: GameDataRecord) => service.remove(record.id),
    onSuccess: async () => {
      message.success('资料已删除');
      await invalidateRecords();
    },
    onError: showMutationError,
  });

  return {
    headerProps: {
      config,
      onCreate: openCreateModal,
    },
    filterBarProps: {
      config,
      keyword,
      fieldFilters,
      referenceServiceResolver,
      onKeywordChange: updateKeyword,
      onKeywordSearch: searchKeyword,
      onFieldFilterChange: updateFieldFilter,
      onClearFieldFilters: clearFieldFilters,
    },
    recordTableProps: {
      rows: recordsQuery.data?.rows ?? [],
      totalRowCount: Number(recordsQuery.data?.totalRowCount ?? 0),
      page,
      loading: recordsQuery.isLoading || recordsQuery.isFetching,
      error: recordsQuery.isError ? recordsQuery.error : null,
      referenceLookup,
      onPageChange: (current: number, pageSize: number) => setPage({ current, pageSize }),
      onDetail: setDetailRecord,
      onEdit: openEditModal,
      onDelete: (record: GameDataRecord) => deleteMutation.mutate(record),
    },
    detailDrawerProps: {
      open: Boolean(detailRecord),
      title: `${config.title}详情`,
      onClose: () => setDetailRecord(null),
      items: detailItems(config, detailRecord, referenceLookup),
    },
    editModalProps: {
      config,
      form,
      mode: modalMode,
      open: modalOpen,
      saving: saveMutation.isPending,
      referenceServiceResolver,
      onCancel: closeModal,
      onSubmit: (values: GameDataFormValues) => saveMutation.mutate(values),
    },
  };

  function openCreateModal() {
    setModalMode('create');
    setEditingRecord(null);
    form.setFieldsValue(createInitialValues(config));
    setModalOpen(true);
  }

  function openEditModal(record: GameDataRecord) {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(toFormValues(config, record));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }

  function updateKeyword(value: string) {
    setKeyword(value);
    if (!value) {
      setPage((prev) => ({ ...prev, current: 1 }));
      setFilters({ q: '' });
    }
  }

  function searchKeyword(value: string) {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFilters({ q: value.trim() });
  }

  function updateFieldFilter(fieldName: string, value: string | number | boolean | undefined) {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFieldFilters((prev) => {
      const next = { ...prev };
      if (isEmptyFilterValue(value)) {
        delete next[fieldName];
      } else {
        next[fieldName] = value;
      }
      return next;
    });
  }

  function clearFieldFilters() {
    setPage((prev) => ({ ...prev, current: 1 }));
    setFieldFilters({});
  }
}
