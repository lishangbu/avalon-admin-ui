import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useMemo, useState } from 'react';
import { EntityDrawer } from '../../shared/components/EntityDrawer';
import {
  getGameDataReferenceService,
  type GameDataListQuery,
  type GameDataRecord,
  type GameDataResourceService,
} from '../../services/game-data/shared';
import type { GameDataResourceConfig } from './game-data-resources';
import { message } from '../../shared/feedback/message';
import { GameDataCrudHeader } from './GameDataCrudHeader';
import { GameDataEditModal } from './GameDataEditModal';
import { GameDataFilterBar } from './GameDataFilterBar';
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
import { GameDataRecordTable } from './GameDataRecordTable';
import { useReferenceLookupState } from './GameDataReferenceLookup';

interface GameDataCrudTableProps {
  config: GameDataResourceConfig;
  service: GameDataResourceService;
  referenceServiceResolver?: GameDataReferenceServiceResolver;
}

/**
 * 游戏资料 CRUD 表格组件。
 *
 * 页面显式传入自己的 service；组件只复用表格、表单和引用展示交互，不再按资源 key 分发主表 API。
 */
export function GameDataCrudTable({
  config,
  service,
  referenceServiceResolver = getGameDataReferenceService,
}: GameDataCrudTableProps) {
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

  return (
    <div className="space-y-4">
      <GameDataCrudHeader config={config} onCreate={openCreateModal} />
      <GameDataFilterBar
        config={config}
        keyword={keyword}
        fieldFilters={fieldFilters}
        referenceServiceResolver={referenceServiceResolver}
        onKeywordChange={updateKeyword}
        onKeywordSearch={searchKeyword}
        onFieldFilterChange={updateFieldFilter}
        onClearFieldFilters={clearFieldFilters}
      />
      <GameDataRecordTable
        config={config}
        rows={recordsQuery.data?.rows ?? []}
        totalRowCount={Number(recordsQuery.data?.totalRowCount ?? 0)}
        page={page}
        loading={recordsQuery.isLoading || recordsQuery.isFetching}
        error={recordsQuery.isError ? recordsQuery.error : null}
        referenceLookup={referenceLookup}
        onPageChange={(current, pageSize) => setPage({ current, pageSize })}
        onDetail={setDetailRecord}
        onEdit={openEditModal}
        onDelete={(record) => deleteMutation.mutate(record)}
      />
      <EntityDrawer
        open={Boolean(detailRecord)}
        title={`${config.title}详情`}
        onClose={() => setDetailRecord(null)}
        items={detailItems(config, detailRecord, referenceLookup)}
      />
      <GameDataEditModal
        config={config}
        form={form}
        mode={modalMode}
        open={modalOpen}
        saving={saveMutation.isPending}
        referenceServiceResolver={referenceServiceResolver}
        onCancel={closeModal}
        onSubmit={(values) => saveMutation.mutate(values)}
      />
    </div>
  );

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
