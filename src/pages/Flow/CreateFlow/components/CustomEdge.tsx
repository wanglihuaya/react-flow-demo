import { CloseOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { MouseEvent } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow';

interface EdgeTypes {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style: object;
  markerEnd: string;
}

const CustomEdge = (props: EdgeTypes) => {
  const { id, sourceX, sourceY, targetX, targetY, style, markerEnd } = props;
  const reactFlow = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onEdgeClick = (evt: MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    evt.stopPropagation();
    // 删除边
    reactFlow.setEdges((edges) => edges.filter((edge) => edge.id !== id));
    message.success(`删除成功`);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="flex justify-center items-center text-xl p-0 m-0 w-7 h-7 border"
          onClick={(event) => onEdgeClick(event, id)}
        >
          <Button danger type="primary" shape="circle" icon={<CloseOutlined />} size="small" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
