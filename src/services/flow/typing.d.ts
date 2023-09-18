declare namespace API {
  type Meta = {
    meta: {
      pagination: {
        total: number;
        page: number;
        pageCount: number;
        pageSize: number;
      };
    };
  };
  type FlowList = {
    meta: Meta;
    data: {
      name: string;
      id: string;
      flowData: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };

  type SourceFlow = {
    meta: Meta;
    data: {
      id: string;
      attributes: {
        name: string;
        flowData: string;
        desc: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };

  type FlowListItem = {
    id: string;
    name: string;
    desc?: string;
    flowData?: string;
    updatedAt?: string;
    createdAt?: string;
  };

  type Flow = {
    meta: Meta;
    data: FlowListItem[];
  };

  type FlowParams = {
    id?: string;
    name?: string;
    desc?: string;
    flowData?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
}
