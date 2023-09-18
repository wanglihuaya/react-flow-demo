import { FormattedMessage, history, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { DragEventHandler, useCallback, useRef, useState } from 'react';
import InlineSVG from 'react-inlinesvg';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
  OnConnect,
  OnEdgeUpdateFunc,
  Panel,
  ReactFlowProvider,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { addFlow, getFlow, updateFlow } from '@/services/flow';
import { addTemplate, getTemplate, updateTemplate } from '@/services/template';

import { addTrace } from '@/services/trace';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import BarChartNode from '../components/BarChartNode';
import DataNode from '../components/DataNode';
import LineChartNode from '../components/LineChartNode';
import CustomEdge from './components/CustomEdge';
import Sidebar from './components/Sidebar';

const edgeTypes: any = {
  custom: CustomEdge,
};
const nodeTypes: NodeTypes = {
  dataNode: DataNode,
  lineChartNode: LineChartNode,
  barChartNode: BarChartNode,
};

const CreateFlow = () => {
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [createFlowOpen, handleCreateFlowOpen] = useState<boolean>(false);
  const [createTemplateOpen, handleCreateTemplateOpen] = useState<boolean>(false);
  const [svgStr, setSvgStr] = useState<string>('');

  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const templateId = searchParams.get('templateId');

  useRequest<API.SourceFlow, any>(
    () => {
      if (id) {
        return getFlow(id);
      } else if (templateId) {
        console.log(templateId);
        return getTemplate(templateId);
      } else {
        // 返回一个空promise
        return new Promise((resolve) => {
          resolve({} as API.SourceFlow);
        });
      }
    },
    {
      onSuccess: (res: API.SourceFlow) => {
        const { nodes, edges } = JSON.parse(res.data.attributes.flowData);
        console.log(nodes, edges);
        setNodes(nodes);
        setEdges(edges);
      },
    },
  );

  const onConnect: OnConnect = useCallback((params: any) => {
    params.animated = true;
    params.type = 'custom';
    params.labelBgPadding = [8, 4];
    params.labelBgBorderRadius = 4;
    params.labelBgStyle = { fill: '#fff', fillOpacity: 0.9 };
    params.labelStyle = { fill: '#222', fontWeight: 700 };
    params.style = { stroke: '#222', strokeWidth: 1.5 };
    params.className = 'animated';
    params.labelShowBg = true;

    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver: DragEventHandler = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  );

  const onDrop: DragEventHandler = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => any };
      clientX: number;
      clientY: number;
    }) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Date.now().toString(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  // 操作 flow list
  const OperateFlow = () => (
    <>
      <Button
        type="primary"
        onClick={async () => {
          if (!id) {
            message.error('请先保存流程');
            return;
          } else {
            const res = await updateFlow(id, {
              flowData: JSON.stringify(reactFlowInstance.toObject()),
            });
            if (res) {
              message.success('保存成功');
            }
          }
        }}
      >
        仅保存
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        onClick={async () => {
          if (!id) {
            message.error('请先保存流程');
            return;
          } else {
            await updateFlow(id, {
              flowData: JSON.stringify(reactFlowInstance.toObject()),
            });
            const flowRes = await getFlow(id);
            // console.log(flowRes);
            const traceRes = await addTrace({
              name: flowRes.data.attributes.name,
              canvasStr: reactFlowInstance.toObject(),
              // data: inputData,
            });
            setSvgStr(traceRes.canvasStr);
            message.success('保存成功');
          }
        }}
      >
        保存并运行
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        onClick={async () => {
          handleCreateTemplateOpen(true);
        }}
      >
        保存为模板
      </Button>
    </>
  );

  // 操作 template
  const OperateTemplate = () => (
    <>
      <Button
        type="primary"
        onClick={async () => {
          if (!templateId) {
            message.error('请先保存流程');
            return;
          } else {
            const res = await updateTemplate(templateId, {
              flowData: JSON.stringify(reactFlowInstance.toObject()),
            });
            if (res) {
              message.success('保存成功');
            }
          }
        }}
      >
        保存模板
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        onClick={async () => {
          handleCreateFlowOpen(true);
          // if (!id) {
          //   message.error('请先保存流程');
          //   return;
          // } else {
          //   const res = await updateTemplate(id, {
          //     flowData: JSON.stringify(reactFlowInstance.toObject()),
          //   });
          //   if (res) {
          //     message.success('保存成功');
          //   }
          // }
        }}
      >
        保存为新的流程
      </Button>
    </>
  );

  return (
    <div className="flex h-[100vh]">
      <div className="w-1/5 bg-slate-100">
        <Sidebar />
      </div>
      <ReactFlowProvider>
        <div className=" w-4/5" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Panel position="top-left">
              {id && <OperateFlow />}
              {templateId && <OperateTemplate />}
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      {svgStr && (
        <div className=" fixed top-0 right-0 bg-slate-100">
          <InlineSVG src={svgStr} />
        </div>
      )}
      {/* 新建保存流程的弹窗 */}
      {templateId && (
        <ModalForm
          title="新建流程"
          width="400px"
          open={createFlowOpen}
          onOpenChange={handleCreateFlowOpen}
          onFinish={async (value) => {
            const success = await addFlow({
              ...value,
              flowData: JSON.stringify(reactFlowInstance.toObject()),
            } as API.FlowParams);
            if (success) {
              handleCreateFlowOpen(false);
              message.success('创建成功');
              history.push('/flowlist');
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
      )}
      {/* 新建保存模板的弹窗 */}
      {id && (
        <ModalForm
          title="新建模板"
          width="400px"
          open={createTemplateOpen}
          onOpenChange={handleCreateTemplateOpen}
          onFinish={async (value) => {
            if (!id) {
              message.error('请先保存流程');
              return;
            } else {
              await updateFlow(id, {
                flowData: JSON.stringify(reactFlowInstance.toObject()),
              });
              await addTemplate({
                name: value.name,
                flowData: JSON.stringify(reactFlowInstance.toObject()),
                desc: value.desc,
              });
              message.success('保存成功');
              history.push('/flowtemplate');
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
            label="模版名称"
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" label="模版名称" />
        </ModalForm>
      )}
    </div>
  );
};

export default CreateFlow;
