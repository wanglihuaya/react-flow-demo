import { history } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-3">
      <Button
        type="primary"
        className="mb-4"
        onClick={() => {
          // 返回上一级
          history.back();
        }}
      >
        返回
      </Button>
      <div className="mb-6">
        <div className=" text-2xl font-medium">数据</div>
        <div onDragStart={(event) => onDragStart(event, 'dataNode')} draggable>
          <div className="p-2 mt-2 mb-4 bg-white rounded-md shadow-md">
            <div className="text-lg font-medium">初始数据</div>
            <div className="text-sm text-gray-500">制作图表的数据</div>
          </div>
        </div>
      </div>
      <div className=" text-2xl font-medium">函数</div>
      <div onDragStart={(event) => onDragStart(event, 'lineChartNode')} draggable>
        <div className="p-2 mt-2 mb-4 bg-white rounded-md shadow-md">
          <div className="text-lg font-medium">折线图</div>
          <div className="text-sm text-gray-500">折线图</div>
        </div>
      </div>
      <div onDragStart={(event) => onDragStart(event, 'barChartNode')} draggable>
        <div className="p-2 mt-2 mb-4 bg-white rounded-md shadow-md">
          <div className="text-lg font-medium">柱状图</div>
          <div className="text-sm text-gray-500">柱状图</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
