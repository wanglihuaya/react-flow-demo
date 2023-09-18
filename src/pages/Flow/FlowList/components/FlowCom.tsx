import ReactFlow, { Controls } from 'reactflow';
import CustomEdge from '../../CreateFlow/components/CustomEdge';

const edgeTypes: any = {
  deleteEdge: CustomEdge,
};

const FlowCom = (props: {
  nodes: any;
  edges: any;
  onNodesChange: any;
  onEdgesChange: any;
  nodeTypes: any;
}) => {
  return (
    <div className="w-full h-5/6 bg-slate-100">
      <ReactFlow edgeTypes={edgeTypes} fitView {...props}>
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default FlowCom;
