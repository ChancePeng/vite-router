import React, { Fragment } from 'react'
import {
  createBrowserRouter,
  createHashRouter,
  Navigate,
  createMemoryRouter,
} from 'react-router-dom';

import type { ModuleType, IRoute, CreateRouterOption, HistoryType } from '@/types';


const ROUTER_CREATERS: Record<HistoryType, Function> = {
  'browser': createBrowserRouter,
  'hash': createHashRouter,
  'memory': createMemoryRouter
}

class ViteRouter {
  modules: ModuleType;
  constructor(modules?: ModuleType) {
    this.modules = {};
    if (modules) {
      this.load(modules)
    }
  }
  load(modules: ModuleType) {
    const result: ModuleType = {}
    Object.keys(modules).forEach(pathname => {
      const key = pathname.replace(/.+pages\//, '').replace(/.(jsx|js|tsx|ts)$/, '')
      result[key] = modules[pathname]
    })
    this.modules = result;
  }
  import(path: string) {
    // 如果 path 以 ./ 开头，去除 ./
    let key = path;
    if (path.startsWith('./')) {
      key = path.replace('./', '')
    }
    // 如果以 index 结尾，可能指向 index 文件
    if (path.endsWith('index')) {
      // 查找这个 module
      const module = this.modules[key]
      if (module) {
        // 找到直接返回 lazyComponent
        return module
      }
    }
    // 不是 index 结尾或者 以 index 文件的方式没查找到，则按文件夹查找
    key = key.concat('/index')
    const module = this.modules[key]
    if (module) {
      return module;
    }
    // 没有找到，抛出错误
    throw new Error(`can not found module named ${path}`)
  }
  lazy(path: string) {
    const module = this.import(path)
    return React.lazy(module);
  }
  createRouter(routes: IRoute[], option?: CreateRouterOption) {
    const { history, base } = option || {};
    const { type = 'browser' } = history || {};
    const creater = ROUTER_CREATERS[type];
    const router = creater(
      routes.map(route => {
        const { path, component, redirectTo } = route;
        const config: Record<string, any> = {
          path,
          element: undefined,
          Component: undefined
        }
        if (redirectTo) {
          return {
            path,
            element: (
              <Fragment>
                <Navigate to={redirectTo} replace />
              </Fragment>
            )
          }
        }
        if (component) {
          return {
            path,
            Component: this.lazy(component)
          }
        }
        return {
          path,
          element: <Fragment />
        }
      }),
      {
        basename: base
      }
    )
    return router;
  }
}

export default ViteRouter;
