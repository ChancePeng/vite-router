import React, { Fragment } from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  Navigate,
  RouteObject,
} from 'react-router-dom';

import type {
  CreateRouterOption,
  HistoryType,
  IRoute,
  ModuleType,
} from '@/types';

type Router = ReturnType<typeof createBrowserRouter>;
type Params = Parameters<typeof createBrowserRouter>;

const ROUTER_CREATERS: Record<HistoryType, (...args: Params) => Router> = {
  browser: createBrowserRouter,
  hash: createHashRouter,
  memory: createMemoryRouter,
};

class ViteRouter {
  modules: ModuleType;
  /**
   * 初始化并且 load modules
   * 更多信息查看 load 方法
   * @param {object} modules
   */
  constructor(modules?: ModuleType) {
    this.modules = {};
    if (modules) {
      this.load(modules);
    }
  }
  /**
   * 倒入并解析全量模块
   * 配合 vite 的 import.meta.glob使用
   * @param {object} modules
   * @example
   * const modules = import.meta.glob('./pages/index.tsx')
   * viteRouter.load(modules)
   */
  load(modules: ModuleType) {
    const result: ModuleType = {};
    Object.keys(modules).forEach((pathname) => {
      // 去除前缀和后缀，如果这里index.tsx 和 index.{js,jsx,ts}也可能存在，这里统一认为是：代码不规范，后面的index文件替换检索之前的index
      const key = pathname
        .replace(/.+pages\//, '')
        .replace(/\/:[^/]+/g, '')
        .replace(/.(jsx|js|tsx|ts)$/, '');
      result[key] = modules[pathname];
    });
    this.modules = result;
  }
  /**
   * 类似 webpack 中的 import(), 加载模块
   * @param {string} path 模块的关键位置
   * @returns 模块 dynamic import 函数
   */
  import(path: string) {
    // 如果 path 以 ./ 开头，去除 ./
    let key = path;
    if (path.startsWith('./')) {
      key = path.replace('./', '');
    }
    // 如果以 index 结尾，可能指向 index 文件
    if (path.endsWith('index')) {
      // 查找这个 module
      const module = this.modules[key];
      if (module) {
        // 找到直接返回 lazyComponent
        return module;
      }
    }
    // 不是 index 结尾或者 以 index 文件的方式没查找到，则按文件夹查找
    key = key.concat('/index');
    const module = this.modules[key];
    if (module) {
      return module;
    }
    // 没有找到，抛出错误
    throw new Error(`can not found module named ${path}`);
  }
  /**
   * 懒加载模块
   * @param {string} path 模块的关键位置
   * @returns 查找模块，返回使用React.lazy包裹的结果
   */
  lazy(path: string) {
    const module = this.import(path);
    return React.lazy(module);
  }
  /**
   * 创建react-router
   * @param routes 配置的routes
   * @param option 创建路由的参数
   * @param option.history 路由的配置信息
   * @param option.history.type 路由类型，可选 browser | hash | memory, 同react-router的创建类型
   * @returns router 返回 react-router 的 router 实例
   */
  createRouter(routes: IRoute[], option?: CreateRouterOption): Router {
    const { history, ...opts } = option || {};
    const { type = 'browser' } = history || {};
    const creater = ROUTER_CREATERS[type];

    const createRoutes = (configs: IRoute[]): RouteObject[] => {
      return configs.map((item) => {
        const { path, component, children, index, redirectTo } = item;
        // 存在component去dynamic import
        // 不存在则创建一个碎片
        const Component = component ? this.lazy(component) : Fragment;
        return {
          path,
          index,
          children: children?.length ? createRoutes(children) : undefined,
          Component: (props) => (
            <Fragment>
              {redirectTo ? <Navigate to={redirectTo} /> : <></>}
              <Component {...props} />
            </Fragment>
          ),
        } as RouteObject;
      });
    };
    const router = creater(createRoutes(routes), opts);
    return router;
  }
}

export default ViteRouter;
