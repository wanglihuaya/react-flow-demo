import { Card, Input } from 'antd';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface NodeProps {
  isConnectable: boolean;
  type: string;
  xPos: number;
  yPos: number;
  data: any;
  zIndex: number;
  id: string;
}

const LineChartNodePreview = (props: NodeProps) => {
  const { isConnectable } = props;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="c"
        style={{ top: -6, width: 12, height: 12, bottom: 'auto', background: '#888', zIndex: 2 }}
        isConnectable={isConnectable}
      />
      <Card
        size="small"
        title="高斯拟合"
        style={{ width: 200 }}
        headStyle={{ background: '#f0f2f5' }}
      >
        <p>拟合强度</p>
        <Input placeholder="请输入数字" />
      </Card>
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

export default memo(LineChartNodePreview);
