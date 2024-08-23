# @change/vite-router

vite-router-tools

# use

```tsx
import ViteRouter, { defineRoutes } from '@change/vite-router';
import { RouterProvider } from 'react-router-dom';
import React, { Suspense } from 'react';

const viteRouter = new ViteRouter(
  import.meta.glob('./pages/**/index.{js,jsx,ts,tsx}'),
);

const routes = defineRoutes([
  {
    path: '/',
    redirectTo: '/login',
  },
  {
    path: '/login',
    component: './login',
  },
]);

const router = viteRouter.createRouter(routes);
// or
// const router = viteRouter.createRouter(routes,{
//   history:{
//     type:'hash'
//   }
// })

export default function () {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

## 提示

引入 react-router-dom 的属性是，请从此导入，避免项目存在多个版本的 react-router-dom 而造成冲突

```diff
- import {RouterProvider} from 'react-router-dom'
+ import {RouterProvider} from '@change/vite-router'
```

## Development

```bash
# install dependencies
$ yarn install

# develop library by docs demo
$ yarn start

# build library source code
$ yarn run build

# build library source code in watch mode
$ yarn run build:watch

# build docs
$ yarn run docs:build

# Locally preview the production build.
$ yarn run docs:preview

# check your project for potential problems
$ yarn run doctor
```

## LICENSE

MIT
