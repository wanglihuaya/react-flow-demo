import { addTrace, deleteTrace, getTraces } from '@/services/trace';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Divider, Drawer } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import InlineSVG from 'react-inlinesvg';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.FlowParams>();

  const { data, refresh } = useRequest(getTraces, {
    refreshOnWindowFocus: true,
  });

  let tableListData: any[] = useMemo(() => {
    const newData = data?.data.map((item: any) => {
      return {
        ...item.attributes,
        id: item.id,
      };
    });
    return newData || [];
  }, [data]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.TraceListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '详情',
      dataIndex: 'canvasStr',
      render: (dom, record) => {
        return <InlineSVG className="w-24 h-24" src={record?.canvasStr || ''} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setCurrentRow(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            href="#"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            href="#"
            onClick={async () => {
              await deleteTrace(record.id);
              if (actionRef.current) {
                refresh();
                actionRef.current.reload();
              }
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.TraceListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        dataSource={tableListData}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />

      {/* 新建弹窗 */}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleCreateModalOpen}
        onFinish={async (value) => {
          const success = await addTrace(value as API.FlowParams);

          if (success) {
            handleCreateModalOpen(false);
            if (actionRef.current) {
              refresh();
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label="流程名称"
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" label="流程名称" />
      </ModalForm>

      {/* 查看弹窗 */}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
