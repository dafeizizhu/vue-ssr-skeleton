const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) { console.warn(e) }
}

module.exports = (app, cb) => {
  let bundle, clientManifest
  let resolve

  const readyPromise = new Promise(r => { resolve = r })
  const ready = (...args) => {
    resolve()
    cb(...args)
  }

  clientConfig.entry = ['webpack-hot-middleware/client', clientConfig.entry]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const koaDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath
  })
  app.use(koaDevMiddleware)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    if (stats.errors.length) {
      console.warn(stats.errors)
      return
    }

    clientManifest = JSON.parse(readFile(koaDevMiddleware.fileSystem, 'vue-ssr-client-manifest.json'))
    if (bundle) {
      ready(bundle, { clientManifest })
    }
  })

  app.use(hotMiddleware(clientCompiler, { heartbeat: 5000 }))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) {
      console.warn(stats.errors)
      return
    }

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    if (clientManifest) {
      ready(bundle, { clientManifest })
    }
  })

  return readyPromise
}
