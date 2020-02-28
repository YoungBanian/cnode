import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { indigo, pink, teal } from 'material-ui/colors'

import App from './views/App'
import { AppState, TopicState } from './store'

const initalState = window.__INITIAL_STATE__ || {} // eslint-disable-line

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    grey: teal,
    type: 'light',
  },
})

const createApp = (TheApp) => {
  class ClientApp extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }
    render() {
      return <TheApp />
    }
  }
  return ClientApp
}

const appState = new AppState()
appState.init(initalState.appState)
const topicStore = new TopicState(initalState.topicStore)

const Render = (Component) => {
  render(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

Render(createApp(App))

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    Render(createApp(NextApp))
  })
}
