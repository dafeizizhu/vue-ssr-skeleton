const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')

module.exports = (app, template) => {
  let renderer
  let readyPromise

  const createRenderer = (bundle, options) => {
    return createBundleRenderer(bundle, Object.assign(options, {
      template,
      runInNewContext: false
    }))
  }

  if (process.env.NODE_ENV == 'dev') {
    readyPromise = require('../build/setup-dev-server')(app, (bundle, options) => {
      renderer = createRenderer(bundle, options)
    })
  } else {
    const bundle = require('../dist/vue-ssr-server-bundle.json')
    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, { clientManifest })
  }

  return vueContext => {
    const render = () => {
      return new Promise((resolve, reject) => {
        renderer.renderToString(vueContext, (err, html) => {
          if (err) {
            console.warn(err)
            if (err.code == 404) resolve('404') 
            else resolve('500')
          } else {
            resolve(html)
          }
        })
      })
    }
    if (readyPromise) {
      return readyPromise.then(render)
    } else {
      return render()
    }
  }
}
