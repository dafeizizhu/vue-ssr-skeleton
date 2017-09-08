# Vue SSR Skeleton

A Skeleton built with Vue 2.0 + vue-router + vuex, with server-side rendering.

## Build Setup

**Requires Node.js 7+ (maybe with `--harmony`)**

```bash
# install dependencies
npm install

# dev
NODE_ENV=dev node server

# prod
NODE_ENV=prod npm run build
NODE_ENV=prod node server
```

## Tree

```
├── build                                                 # configs or scripts for webpack building bundles
│   ├── setup-dev-server.js                               # relate to webpack dev plugins and middleware
│   ├── webpack.base.config.js                            # webpack base config
│   ├── webpack.client.config.js                          # webpack client entry config
│   └── webpack.server.config.js                          # webpack server entry config
├── lib
│   └── vue-render.js                                     # vue createBuldleRenderer helper
├── package.json
├── server.js                                             # koa server entry
└── src
    ├── app.js                                            # vue app entry
    ├── App.vue                                           # root vue app component
    ├── components                                        # components for routers
    │   └── Home.vue
    ├── entry-client.js                                   # webpack client entry
    ├── entry-server.js                                   # webpack server entry
    ├── index.template.html                               # server html template
    ├── router.js                                         # simple router register
    └── store.js                                          # simple vuex store
```
