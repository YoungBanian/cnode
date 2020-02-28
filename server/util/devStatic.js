const axios = require('axios')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
const MemoryFs = require('memory-fs')
const path = require('path')
const proxy = require('http-proxy-middleware')
const serverRender = require('./server-render')

// 读取webpack内存中客户端配置编译出来模版
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => { resolve(res.data) })
      .catch(reject)
  })
}

// 在node环境，不需要重复打公共包： react，mobx等
const NativeModule = require('module') // 等同于获取module.exports 中的module
const vm = require('vm')
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrap = NativeModule.wrap(bundle)
  const script = new vm.Script(wrap, {
    filename: filename,
    displayErrors: true // 报异常错误往外抛
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs()
const ServerCompiler = webpack(serverConfig)

// const Module = module.constructor
let serverBundle
ServerCompiler.outputFileSystem = mfs
ServerCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(e => console.error(e))
  stats.warnings.forEach(w => console.warn(w))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)

  const bundle = mfs.readFileSync(bundlePath, 'utf8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js')
  // serverBundle = m.exports.default
  // createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {
  app.use('/public', proxy({ target: 'http://localhost:8888' }))

  app.get('*', function (req, res) {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    })
  })
}
