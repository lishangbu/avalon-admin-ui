#!/usr/bin/env python3
"""
Scaffold a CRUD page module for avalon-admin-ui.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from textwrap import dedent


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate index.tsx, service.ts, and types.ts for a CRUD page.",
    )
    parser.add_argument("domain", help="Top-level page domain under src/pages")
    parser.add_argument("feature", help="Feature directory under the domain")
    parser.add_argument(
        "--title",
        required=True,
        help="Page title, for example: 用户管理",
    )
    parser.add_argument(
        "--endpoint",
        required=True,
        help="Backend endpoint prefix, for example: /iam/users",
    )
    parser.add_argument(
        "--entity-name",
        help="PascalCase entity name override. Defaults to the feature name.",
    )
    parser.add_argument(
        "--subject-name",
        help="Entity label override. Defaults to the title with common suffixes removed.",
    )
    parser.add_argument(
        "--permission-prefix",
        help="Permission prefix for local page constants, for example: system:user",
    )
    parser.add_argument(
        "--shared-permission-group",
        help="Use SYSTEM_PERMISSION_CODES.<group> instead of local page constants.",
    )
    parser.add_argument(
        "--output-root",
        default=".",
        help="Project root to write into. Defaults to the current directory.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing files in the target feature directory.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    domain = normalize_segment(args.domain, "domain")
    feature = normalize_segment(args.feature, "feature")
    entity_name = normalize_entity_name(args.entity_name or to_pascal_case(feature))
    subject_name = normalize_subject_name(args.subject_name or derive_subject_name(args.title))
    permission_prefix = normalize_permission_prefix(
        args.permission_prefix or f"{domain}:{feature}"
    )
    shared_permission_group = args.shared_permission_group

    project_root = Path(args.output_root).resolve()
    feature_dir = project_root / "src" / "pages" / domain / feature

    files = {
        feature_dir / "types.ts": build_types_template(entity_name),
        feature_dir / "service.ts": build_service_template(entity_name, args.endpoint),
        feature_dir / "index.tsx": build_page_template(
            domain=domain,
            feature=feature,
            title=args.title.strip(),
            entity_name=entity_name,
            subject_name=subject_name,
            endpoint=args.endpoint.strip(),
            permission_prefix=permission_prefix,
            shared_permission_group=shared_permission_group,
        ),
    }

    ensure_paths_writable(files.keys(), args.force)
    feature_dir.mkdir(parents=True, exist_ok=True)

    for path, content in files.items():
        path.write_text(content, encoding="utf-8")
        print(path.relative_to(project_root))

    return 0


def normalize_segment(value: str, label: str) -> str:
    normalized = value.strip().strip("/\\")
    if not normalized:
        raise ValueError(f"{label} must not be empty")
    if "/" in normalized or "\\" in normalized:
        raise ValueError(f"{label} must be a single path segment")
    if not re.fullmatch(r"[A-Za-z0-9-]+", normalized):
        raise ValueError(f"{label} must contain only letters, digits, and hyphens")
    return normalized


def normalize_entity_name(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9]", "", value.strip())
    if not normalized:
        raise ValueError("entity name must contain at least one letter or digit")
    if not normalized[0].isalpha():
        raise ValueError("entity name must start with a letter")
    return normalized


def normalize_subject_name(value: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise ValueError("subject name must not be empty")
    return normalized


def normalize_permission_prefix(value: str) -> str:
    normalized = value.strip().strip(":")
    if not normalized:
        raise ValueError("permission prefix must not be empty")
    if not re.fullmatch(r"[A-Za-z0-9:-]+", normalized):
        raise ValueError(
            "permission prefix must contain only letters, digits, hyphens, and colons"
        )
    return normalized


def derive_subject_name(title: str) -> str:
    normalized = title.strip()
    for suffix in ("管理", "列表", "维护"):
        if normalized.endswith(suffix) and len(normalized) > len(suffix):
            return normalized[: -len(suffix)].strip()
    return normalized


def to_pascal_case(value: str) -> str:
    return "".join(part.capitalize() for part in re.split(r"[^A-Za-z0-9]+", value) if part)


def ensure_paths_writable(paths: list[Path] | tuple[Path, ...] | dict, force: bool) -> None:
    for path in paths:
        if path.exists() and not force:
            raise FileExistsError(f"refusing to overwrite existing file: {path}")


def build_types_template(entity_name: str) -> str:
    return dedent(
        f"""\
        export interface {entity_name}View {{
          id?: string
          code?: string | null
          name?: string | null
          enabled?: boolean | null
          remark?: string | null
          createdAt?: string | null
          updatedAt?: string | null
        }}

        export interface {entity_name}Query {{
          keyword?: string
          enabled?: boolean | null
        }}

        export interface Save{entity_name}Input {{
          code?: string
          name: string
          enabled?: boolean | null
          remark?: string | null
        }}

        export interface Update{entity_name}Input extends Save{entity_name}Input {{
          id: string
        }}
        """
    )


def build_service_template(entity_name: str, endpoint: str) -> str:
    endpoint_value = endpoint.strip()
    return dedent(
        f"""\
        import type {{ Page, PageRequest }} from '@/types/common'
        import {{ request }} from '@/shared/api/http'
        import {{ compactParams }} from '@/utils/request'
        import type {{
          {entity_name}Query,
          {entity_name}View,
          Save{entity_name}Input,
          Update{entity_name}Input,
        }} from './types'

        const endpoint = '{endpoint_value}'

        export async function get{entity_name}ById(id: string) {{
          return request<{entity_name}View>({{
            url: `${{endpoint}}/${{id}}`,
            method: 'GET',
          }})
        }}

        export async function get{entity_name}Page(
          pageRequest: PageRequest<{entity_name}Query>,
        ) {{
          return request<Page<{entity_name}View>>({{
            url: endpoint,
            method: 'GET',
            params: compactParams({{
              page: Math.max(pageRequest.page ?? 1, 1),
              size: pageRequest.size ?? 10,
              sort: pageRequest.sort ?? 'id,asc',
              ...pageRequest.query,
            }}),
          }})
        }}

        export async function create{entity_name}(payload: Save{entity_name}Input) {{
          return request<{entity_name}View>({{
            url: endpoint,
            method: 'POST',
            data: payload,
          }})
        }}

        export async function update{entity_name}(payload: Update{entity_name}Input) {{
          return request<{entity_name}View>({{
            url: `${{endpoint}}/${{payload.id}}`,
            method: 'PUT',
            data: payload,
          }})
        }}

        export async function delete{entity_name}(id: string) {{
          return request<void>({{
            url: `${{endpoint}}/${{id}}`,
            method: 'DELETE',
          }})
        }}
        """
    )


def build_page_template(
    *,
    domain: str,
    feature: str,
    title: str,
    entity_name: str,
    subject_name: str,
    endpoint: str,
    permission_prefix: str,
    shared_permission_group: str | None,
) -> str:
    page_name = f"{entity_name}ManagementPage"
    row_key_fallback = f"{domain}-{feature}-row"
    permission_block = build_permission_block(
        shared_permission_group=shared_permission_group,
        permission_prefix=permission_prefix,
    )
    permission_import = (
        "import { SYSTEM_PERMISSION_CODES } from '@/constants/permissions'\n"
        if shared_permission_group
        else ""
    )
    template = dedent(
        """\
        import {
          DeleteOutlined,
          EditOutlined,
          PlusOutlined,
          ReloadOutlined,
        } from '@ant-design/icons'
        import { PageContainer } from '@ant-design/pro-components'
        import {
          App,
          Button,
          Card,
          Form,
          Input,
          Modal,
          Popconfirm,
          Result,
          Select,
          Space,
          Switch,
          Table,
          Tag,
        } from 'antd'
        import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
        import {
          keepPreviousData,
          useQuery,
          useQueryClient,
        } from '@tanstack/react-query'
        import { useState } from 'react'
        import { PermissionGuard } from '@/components/PermissionGuard'
        __PERMISSION_IMPORT__import { usePermission } from '@/hooks/usePermission'
        import {
          create__ENTITY__,
          delete__ENTITY__,
          get__ENTITY__ById,
          get__ENTITY__Page,
          update__ENTITY__,
        } from './service'
        import type {
          __ENTITY__Query,
          __ENTITY__View,
          Save__ENTITY__Input,
          Update__ENTITY__Input,
        } from './types'

        type SearchValues = {
          keyword?: string
          enabled?: boolean
        }

        type FormValues = {
          id?: string
          code?: string
          name: string
          enabled: boolean
          remark?: string
        }

        __PERMISSION_BLOCK__
        function toSearchQuery(values: SearchValues): __ENTITY__Query {
          return {
            keyword: values.keyword?.trim() || undefined,
            enabled: values.enabled,
          }
        }

        function toOptionalString(value?: string | null) {
          const normalized = value?.trim()
          return normalized ? normalized : undefined
        }

        function toFormValues(record?: __ENTITY__View | null): FormValues {
          return {
            id: record?.id ?? undefined,
            code: record?.code ?? '',
            name: record?.name ?? '',
            enabled: record?.enabled !== false,
            remark: record?.remark ?? '',
          }
        }

        function normalizePayload(
          values: FormValues,
        ): Save__ENTITY__Input | Update__ENTITY__Input {
          const payload: Save__ENTITY__Input = {
            code: toOptionalString(values.code),
            name: values.name.trim(),
            enabled: values.enabled,
            remark: toOptionalString(values.remark),
          }

          if (values.id) {
            return {
              id: values.id,
              ...payload,
            }
          }

          return payload
        }

        function renderEnabledTag(value?: boolean | null) {
          return value === false ? (
            <Tag color="red">禁用</Tag>
          ) : (
            <Tag color="green">启用</Tag>
          )
        }

        export default function __PAGE_NAME__() {
          const { message } = App.useApp()
          const { has } = usePermission()
          const [searchForm] = Form.useForm<SearchValues>()
          const [form] = Form.useForm<FormValues>()
          const queryClient = useQueryClient()
          const [saving, setSaving] = useState(false)
          const [detailLoading, setDetailLoading] = useState(false)
          const [editingId, setEditingId] = useState<string | null>(null)
          const [modalOpen, setModalOpen] = useState(false)
          const [page, setPage] = useState(1)
          const [pageSize, setPageSize] = useState(10)
          const [query, setQuery] = useState<__ENTITY__Query>({})
          const canQuery = has(permissionCodes.query)
          const canUpdate = has(permissionCodes.update)
          const canDelete = has(permissionCodes.delete)
          const rowsQuery = useQuery({
            queryKey: ['__DOMAIN__', '__FEATURE__', 'page', page, pageSize, query],
            queryFn: () =>
              get__ENTITY__Page({
                page,
                size: pageSize,
                sort: 'id,asc',
                query,
              }),
            enabled: canQuery,
            placeholderData: keepPreviousData,
          })
          const loading = canQuery ? rowsQuery.isFetching : false
          const rows = rowsQuery.data?.items ?? []
          const total = rowsQuery.data?.totalItems ?? 0

          async function loadRows(
            nextPage = page,
            nextPageSize = pageSize,
            nextQuery: __ENTITY__Query = query,
          ) {
            const isSameQuery =
              nextPage === page &&
              nextPageSize === pageSize &&
              JSON.stringify(nextQuery) === JSON.stringify(query)

            if (!isSameQuery) {
              await queryClient.ensureQueryData({
                queryKey: ['__DOMAIN__', '__FEATURE__', 'page', nextPage, nextPageSize, nextQuery],
                queryFn: () =>
                  get__ENTITY__Page({
                    page: nextPage,
                    size: nextPageSize,
                    sort: 'id,asc',
                    query: nextQuery,
                  }),
              })
              setPage(nextPage)
              setPageSize(nextPageSize)
              setQuery(nextQuery)
              return
            }

            await rowsQuery.refetch()
          }

          function openCreate() {
            setEditingId(null)
            form.resetFields()
            form.setFieldsValue(toFormValues())
            setModalOpen(true)
          }

          async function openEdit(record: __ENTITY__View) {
            const id = record.id
            if (!id) {
              return
            }

            setDetailLoading(true)
            setEditingId(id)
            try {
              const result = await get__ENTITY__ById(id)
              form.resetFields()
              form.setFieldsValue(toFormValues(result))
              setModalOpen(true)
            } finally {
              setDetailLoading(false)
            }
          }

          async function handleDelete(record: __ENTITY__View) {
            const id = record.id
            if (!id) {
              return
            }

            await delete__ENTITY__(id)
            message.success('__SUBJECT__删除成功')
            const nextPage = rows.length === 1 && page > 1 ? page - 1 : page
            await loadRows(nextPage, pageSize)
          }

          async function handleSubmit() {
            const values = await form.validateFields()
            setSaving(true)
            try {
              const payload = normalizePayload(values)
              if (values.id) {
                await update__ENTITY__(payload as Update__ENTITY__Input)
                message.success('__SUBJECT__更新成功')
              } else {
                await create__ENTITY__(payload as Save__ENTITY__Input)
                message.success('__SUBJECT__创建成功')
              }
              setModalOpen(false)
              setEditingId(null)
              form.resetFields()
              await loadRows(page, pageSize)
            } finally {
              setSaving(false)
            }
          }

          function handleTableChange(pagination: TablePaginationConfig) {
            const nextPage = pagination.current ?? 1
            const nextPageSize = pagination.pageSize ?? 10
            void loadRows(nextPage, nextPageSize)
          }

          const columns: ColumnsType<__ENTITY__View> = [
            {
              title: '__SUBJECT__编码',
              dataIndex: 'code',
              key: 'code',
              width: 180,
              render: (value?: string | null) => value || '-',
            },
            {
              title: '__SUBJECT__名称',
              dataIndex: 'name',
              key: 'name',
              width: 220,
              render: (value?: string | null) => value || '-',
            },
            {
              title: '状态',
              dataIndex: 'enabled',
              key: 'enabled',
              width: 100,
              render: (value?: boolean | null) => renderEnabledTag(value),
            },
            {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
              width: 260,
              render: (value?: string | null) => value || '-',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 180,
              render: (value?: string | null) => value || '-',
            },
            {
              title: '更新时间',
              dataIndex: 'updatedAt',
              key: 'updatedAt',
              width: 180,
              render: (value?: string | null) => value || '-',
            },
            {
              title: '操作',
              key: 'actions',
              width: 180,
              fixed: 'right',
              render: (_, record) => (
                <Space size="small">
                  {canUpdate ? (
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      loading={detailLoading && editingId === record.id}
                      onClick={() => void openEdit(record)}
                    >
                      编辑
                    </Button>
                  ) : null}
                  {canDelete ? (
                    <Popconfirm
                      title="确认删除当前记录吗？"
                      onConfirm={() => void handleDelete(record)}
                    >
                      <Button size="small" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  ) : null}
                </Space>
              ),
            },
          ]

          if (!canQuery) {
            return (
              <PageContainer title="__TITLE__">
                <Result
                  status="403"
                  title="无权查看"
                  subTitle="当前账号缺少查询权限，无法查看__SUBJECT__数据。"
                />
              </PageContainer>
            )
          }

          return (
            <PageContainer
              title="__TITLE__"
              subTitle="已接入基础分页、查询和增删改流程，请按实际实体字段调整表格、表单和服务映射。"
              extra={[
                <PermissionGuard key="add" permission={permissionCodes.create}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => void openCreate()}
                  >
                    新增__SUBJECT__
                  </Button>
                </PermissionGuard>,
                <Button
                  key="reload"
                  icon={<ReloadOutlined />}
                  loading={loading}
                  onClick={() => void rowsQuery.refetch()}
                >
                  刷新
                </Button>,
              ]}
            >
              <Card style={{ marginBottom: 16 }}>
                <Form
                  form={searchForm}
                  layout="inline"
                  onFinish={(values) => void loadRows(1, pageSize, toSearchQuery(values))}
                >
                  <Form.Item name="keyword" label="关键字">
                    <Input allowClear placeholder="搜索编码或名称" />
                  </Form.Item>
                  <Form.Item name="enabled" label="状态">
                    <Select
                      allowClear
                      placeholder="全部状态"
                      style={{ width: 140 }}
                      options={[
                        { label: '启用', value: true },
                        { label: '禁用', value: false },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        onClick={() => {
                          searchForm.resetFields()
                          void loadRows(1, pageSize, {})
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>

              <Table<__ENTITY__View>
                rowKey={(record) => record.id || record.code || '__ROW_KEY_FALLBACK__'}
                loading={loading}
                columns={columns}
                dataSource={rows}
                onChange={handleTableChange}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  showTotal: (count) => `共 ${count} 条`,
                }}
                scroll={{ x: 1280 }}
              />

              <Modal
                destroyOnHidden
                title={editingId ? '编辑__SUBJECT__' : '新增__SUBJECT__'}
                open={modalOpen}
                width={720}
                confirmLoading={saving}
                onCancel={() => {
                  setEditingId(null)
                  setModalOpen(false)
                  form.resetFields()
                }}
                onOk={() => void handleSubmit()}
              >
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={toFormValues()}
                >
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="code" label="__SUBJECT__编码">
                    <Input allowClear placeholder="请输入编码" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="__SUBJECT__名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Input allowClear placeholder="请输入名称" />
                  </Form.Item>
                  <Form.Item
                    name="enabled"
                    label="启用状态"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Form.Item name="remark" label="备注">
                    <Input.TextArea
                      allowClear
                      rows={4}
                      placeholder="输入备注信息"
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </PageContainer>
          )
        }
        """
    )
    replacements = {
        "__PERMISSION_IMPORT__": permission_import,
        "__PERMISSION_BLOCK__": permission_block,
        "__ENTITY__": entity_name,
        "__PAGE_NAME__": page_name,
        "__DOMAIN__": domain,
        "__FEATURE__": feature,
        "__TITLE__": title,
        "__SUBJECT__": subject_name,
        "__ROW_KEY_FALLBACK__": row_key_fallback,
    }
    for key, value in replacements.items():
        template = template.replace(key, value)
    return template


def build_permission_block(
    *, shared_permission_group: str | None, permission_prefix: str
) -> str:
    if shared_permission_group:
        return (
            f"const permissionCodes = SYSTEM_PERMISSION_CODES.{shared_permission_group}\n"
        )

    return dedent(
        f"""\
        const permissionCodes = {{
          query: '{permission_prefix}:query',
          create: '{permission_prefix}:create',
          update: '{permission_prefix}:update',
          delete: '{permission_prefix}:delete',
        }} as const
        """
    )


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        raise SystemExit(1)
