const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrapper = require('react-async-bootstrapper').default
const ReactSSR = require('react-dom/server')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const colors = require('material-ui')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const user = req.session.user
  const createApp = bundle.default
  const createStoreMap = bundle.createStoreMap
  const rooterContext = {}
  const stores = createStoreMap()
  if (user) {
    stores.appState.user.isLogin = true
    stores.appState.user.info = user
  }

  const theme = createMuiTheme({
    palette: {
      primary: colors.indigo,
      secondary: colors.pink,
      type: 'light'
    }
  })

  const sheetsRegistry = new SheetsRegistry()
  const jss = create(preset())

  const app = createApp(stores, rooterContext, sheetsRegistry, jss, theme, req.url)
  return new Promise((resolve, reject) => {
    asyncBootstrapper(app).then(() => {
      if (rooterContext.url) {
        res.status(302).setHeader('Location', rooterContext.url)
        res.end()
        return
      }

      const appString = ReactSSR.renderToString(app)
      const helmet = Helmet.rewind()
      const states = getStoreState(stores)

      // res.send(template.replace('<!-- App -->', content))
      res.send(ejs.render(template, {
        appString,
        initalState: serialize(states),
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        style: helmet.style.toString(),
        materialCss: sheetsRegistry.toString()
      }))
      resolve()
    }).catch(reject)
  })
}
