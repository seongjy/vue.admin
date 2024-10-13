# master-admin-test

관리자 어드민(브랜디/하이버/서울스토어/셀피) 프로젝트입니다.  
Composition API 방식으로 작업되었습니다.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install or npm ci
```

### Compile and Hot-Reload for Development

```sh
npm run dev:brandi
npm run dev:hiver
npm run dev:seoulstore
npm run dev:selpi
```

### Type-Check, Compile and Minify for Production

```sh
npm run build (production)
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Architecture

- [Vue@3](https://ko.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) (store)
- [Vite](https://vitejs.dev/) (builder)
- [Ant Design Vue](https://www.antdv.com/components/overview/) (UI)
- [tailwindcss](https://tailwindcss.com/) (CSS)
- TypeScript
- node.js@18/20+
- npm@8+


## Directory Structure

```sh
├── public              // index.html and static files
├── src
│   ├── assets          // images, fonts, etc.
│   ├── components      // shared components
│   ├── composition     // composition API
│   ├── router          // vue-router
│   ├── stores          // pinia store
│   ├── types           // typescript types
│   ├── styles          // global styles
│   ├── views           // pages
```