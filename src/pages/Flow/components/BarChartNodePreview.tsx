import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Divider, Dropdown } from 'antd';
import { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

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
    icon: <CopyOutlined />,
  },
  {
    label: '删除模块',
    key: 'delete',
    icon: <DeleteOutlined />,
  },
];

const BarChartNodePreview = (props: NodeProps) => {
  const { isConnectable, type, xPos, yPos, data, zIndex, id } = props;
  const reactFlow = useReactFlow();

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
      <Handle
        type="target"
        position={Position.Top}
        id="c"
        style={{ top: -6, width: 12, height: 12, bottom: 'auto', background: '#888', zIndex: 2 }}
        isConnectable={isConnectable}
      />
      <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
        <Card
          size="small"
          title="Echarts"
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
          <p>柱状图</p>
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

export default memo(BarChartNodePreview);
