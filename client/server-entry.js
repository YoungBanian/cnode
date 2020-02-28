import React from 'react';
import { StaticRouter } from 'react-router'
import { Provider, useStaticRendering } from 'mobx-react'

import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'

import App from './views/App'
import { createStoreMap } from './store'

useStaticRendering(true)

export default (stores, rooterContext, sheetsRegistry, jss, theme, url) => {
  jss.options.createGenerateClassName = createGenerateClassName
  return (
    <Provider {...stores}>
      <StaticRouter context={rooterContext} location={url}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
