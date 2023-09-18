import { Card } from 'antd';
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

const DataNodePreview = (props: NodeProps) => {
  const { isConnectable } = props;

  return (
    <>
      <Card
        size="small"
        title="化合物"
        style={{ width: 200 }}
        headStyle={{ background: '#f0f2f5' }}
      >
        <p>蛋白质</p>
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

export default memo(DataNodePreview);
