import { reduce, keys } from 'lodash'

import { DatasetAction } from '../actions/dataset'

const dataset = ( state = { isFetching: false, error: '' }, action ) => {
  switch ( action.type ) {
    case DatasetAction.REQ_FETCH_DATA: {
      return { ...state, isFetching: true }
    }
    case DatasetAction.FETCH_DATA_SUCCESS: {
      const byId = reduce(
        action.payload,
        ( obj, d ) => {
          obj[d.key] = d
          return obj
        },
        {}
      )
      const ids = keys( byId )
      return { ...state, isFetching: false, byId, ids }
    }
    case DatasetAction.FETCH_DATA_FAILURE: {
      return { ...state, isFetching: false, error: 'Something bad!!' }
    }
    default:
      return state
  }
}

export default dataset
