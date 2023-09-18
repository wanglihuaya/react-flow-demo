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
  type TemplateList = {
    meta: Meta;
    data: {
      name: string;
      id: string;
      flowData: string;
      desc: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };

  type SourceTemplate = {
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

  type TemplateListItem = {
    id: string;
    name: string;
    desc?: string;
    flowData?: string;
    updatedAt?: string;
    createdAt?: string;
  };

  type Template = {
    meta: Meta;
    data: TemplateListItem[];
  };

  type TemplateParams = {
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
