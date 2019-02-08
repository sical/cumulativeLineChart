import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'

import logger from './utils/logger.store'
import { rootReducer } from './reducers'

const configureStore = preloadedState => {
  const enhancers = compose( applyMiddleware( thunk, logger ))
  // const composedEnhancers = composeWithDevTools( enhancers )

  const store = createStore( rootReducer, preloadedState, enhancers )

  // if ( process.env.NODE_ENV !== 'production' && module.hot ) {
  //   module.hot.accept( './reducers', _ => store.replaceReducer( rootReducer ))
  // }

  return store
}

export default configureStore
