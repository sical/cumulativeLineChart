import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

import './index.css'
import Root from './containers/Root'
import * as serviceWorker from './serviceWorker'
import configureStore from './configureStore'

const store = configureStore()

const renderApp = () =>
  render(
    <Provider store={store}>
      <DragDropContextProvider backend={HTML5Backend}>
        <Root />
      </DragDropContextProvider>
    </Provider>,
    document.getElementById( 'root' )
  )

// if ( process.env.NODE_ENV !== 'production' && module.hot ) {
//   module.hot.accept( './components/App', renderApp )
// }

renderApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
