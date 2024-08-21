export interface IRoute {
  path: string,
  component?: string,
  name?: string,
  children?: IRoute[],
  redirectTo?: string,
}

export type ModuleType = Record<string, () => Promise<any>>;

export type HistoryType = 'browser' | 'hash' | 'memory'

export interface CreateRouterOption {
  history?: {
    type: HistoryType
  },
  base?: string,
}