import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounceEffect } from 'ahooks';
import type { MenuProps } from 'antd';
import { Card, Divider, Dropdown, Input } from 'antd';
import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
const { TextArea } = Input;
interface NodeProps {
  isConnectable: boolean;
  type: string;
  xPos: number;
  yPos: number;
  data: any;
  zIndex: number;
  id: string;
}

const items: MenuProps['items'] = [
  {
    label: '复制模块',
    key: 'copy',
    //
    icon: <CopyOutlined />,
  },
  {
    label: '删除模块',
    key: 'delete',
    icon: <DeleteOutlined />,
  },
];

const DataNode = (props: NodeProps) => {
  const { isConnectable, type, xPos, yPos, data, zIndex, id } = props;
  const [inputValue, setInputValue] = useState(data.inputValue || ''); // 输入框的值
  const reactFlow = useReactFlow();

  useDebounceEffect(
    () => {
      data.inputValue = inputValue;
    },
    [inputValue],
    {
      wait: 1000,
    },
  );

  // 复制模块
  const copyNodeFun = () => {
    reactFlow.addNodes({
      id: Date.now().toString(),
      type,
      position: { x: xPos + 50, y: yPos + 20 },
      data,
      zIndex: zIndex + 1,
    });
  };

  // 删除模块
  const deleteNodeFun = () => {
    reactFlow.deleteElements({
      nodes: [
        {
          id,
        },
      ],
    });
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'copy') {
      copyNodeFun();
    } else if (key === 'delete') {
      deleteNodeFun();
    }
  };

  return (
    <>
      <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
        <Card
          size="small"
          title="初始数据"
          extra={
            <>
              <CopyOutlined
                onClick={() => {
                  copyNodeFun();
                }}
                className="text-blue-400"
              />
              <Divider type="vertical" />
              <DeleteOutlined
                onClick={() => {
                  deleteNodeFun();
                }}
                className="text-red-400"
              />
            </>
          }
          style={{ width: 200 }}
          headStyle={{ background: '#f0f2f5' }}
        >
          <TextArea
            placeholder="请输入数据，长度为7的数字数组"
            allowClear
            value={inputValue}
            onChange={(value) => {
              setInputValue(value.target.value);
            }}
          />
        </Card>
      </Dropdown>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{
          bottom: -6,
          top: 'auto',
          background: '#888',
          width: 12,
          height: 12,
        }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(DataNode);
