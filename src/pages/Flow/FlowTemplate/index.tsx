import { deleteTemplate, getTemplates, updateTemplate } from '@/services/template';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProList,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Divider } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [editModalOpen, handleEditModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.TemplateParams>();
  const actionRef = useRef<ActionType>();

  const { data, refresh } = useRequest(getTemplates, {
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

  return (
    <PageContainer>
      <ProList<any>
        dataSource={tableListData}
        showActions="hover"
        grid={{ gutter: 16, column: 4 }}
        actionRef={actionRef}
        headerTitle=" "
        onItem={(record: any) => {
          return {
            // onMouseEnter: () => {
            //   console.log(record);
            // },
            onClick: () => {
              console.log(record);
              history.push(`/createflow?templateId=${record.id}`);
            },
          };
        }}
        metas={{
          title: {
            dataIndex: 'name',
          },
          content: {
            dataIndex: 'name',
            render: (_, row) => {
              return <div className="">{row.desc}</div>;
            },
          },
          actions: {
            render: (_, row) => (
              <>
                <EditOutlined
                  onClick={async () => {
                    handleEditModalOpen(true);
                    setCurrentRow(row);
                  }}
                  className="text-blue-400"
                />
                <Divider type="vertical" />
                <DeleteOutlined
                  onClick={async () => {
                    await deleteTemplate(row.id);
                    refresh();
                  }}
                  className="text-red-400"
                  key="delete"
                />
              </>
            ),
          },
        }}
      ></ProList>
      <ModalForm
        title="编辑模板"
        width="400px"
        open={editModalOpen}
        onOpenChange={handleEditModalOpen}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (value) => {
          const success = await updateTemplate(currentRow?.id as string, value as API.FlowParams);
          if (success) {
            handleEditModalOpen(false);
            refresh();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        initialValues={currentRow}
      >
        <ProFormText label="模板名称" width="md" name="name" />
        <ProFormTextArea width="md" name="desc" label="模板名称" />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
