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
  type TraceList = {
    meta: Meta;
    data: {
      name: string;
      id: string;
      canvasStr: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };

  type SourceTrace = {
    meta: Meta;
    data: {
      id: string;
      attributes: {
        name: string;
        canvasStr: string;
        desc: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };

  type TraceListItem = {
    id: string;
    name: string;
    canvasStr?: string;
    updatedAt?: string;
    createdAt?: string;
  };

  type Trace = {
    meta: Meta;
    data: TraceListItem[];
  };

  type TraceParams = {
    name?: string;
    canvasStr?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
}
