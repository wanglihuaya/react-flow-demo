import { addFlow, deleteFlow, getFlows, updateFlow } from '@/services/flow';
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
import { FormattedMessage, history, useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Divider, Drawer } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { NodeTypes, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import BarChartNodePreview from '../components/BarChartNodePreview';
import DataNodePreview from '../components/DataNodePreview';
import LineChartNodePreview from '../components/LineChartNodePreview';
import FlowCom from './components/FlowCom';

const nodeTypes: NodeTypes = {
  dataNode: DataNodePreview,
  lineChartNode: LineChartNodePreview,
  barChartNode: BarChartNodePreview,
};

const FlowListPage: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, handleEditModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.FlowParams>();
  // const [selectedRowsState, setSelectedRows] = useState<API.FlowParams[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data, refresh } = useRequest(getFlows, {
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

  const handleCheck = useCallback(
    (id: string) => {
      const flowJson = tableListData.find((item) => item.id === id);
      const flow = JSON.parse(flowJson.flowData);
      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    },
    [tableListData],
  );

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.FlowListItem>[] = [
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
              handleCheck(record.id);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '详情',
      dataIndex: 'desc',
      valueType: 'textarea',
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
              handleEditModalOpen(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              history.push(`/createflow?id=${record.id}`);
            }}
          >
            编辑流程图
          </a>
          <Divider type="vertical" />
          <a
            href="#"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
              handleCheck(record.id);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            href="#"
            onClick={async () => {
              await deleteFlow(record.id);
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
      <ProTable<API.FlowListItem, API.PageParams>
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
          const success = await addFlow(value as API.FlowParams);

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
      {/* 编辑弹窗 */}
      <ModalForm
        title="编辑流程"
        width="400px"
        open={editModalOpen}
        onOpenChange={handleEditModalOpen}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (value) => {
          const success = await updateFlow(currentRow?.id as string, value as API.FlowParams);
          if (success) {
            handleEditModalOpen(false);
            if (actionRef.current) {
              refresh();
              actionRef.current.reload();
            }
          }
        }}
        initialValues={currentRow}
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
          setNodes([]);
          setEdges([]);
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
        {showDetail && (
          <ReactFlowProvider>
            <FlowCom
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            ></FlowCom>
          </ReactFlowProvider>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default FlowListPage;
