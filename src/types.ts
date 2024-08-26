export interface IRoute {
  path?: string; // 路由路径
  index?: boolean;
  component?: string; // 对应的页面组建所在位置
  children?: IRoute[]; // 子路由
  redirectTo?: string; // 重定向地址
}

export type ModuleType = Record<string, () => Promise<any>>;

export type HistoryType = 'browser' | 'hash' | 'memory';

export interface CreateRouterOption {
  history?: {
    type: HistoryType;
  };
}
