export interface IRoute {
  path: string, // 路由路径
  component?: string, // 对应的页面组建所在位置
  name?: string, // 名称, 暂时没用到
  children?: IRoute[], // 子路由，暂时没用到
  redirectTo?: string, // 重定向地址
}

export type ModuleType = Record<string, () => Promise<any>>;

export type HistoryType = 'browser' | 'hash' | 'memory'

export interface CreateRouterOption {
  history?: {
    type: HistoryType
  },
  base?: string,
}