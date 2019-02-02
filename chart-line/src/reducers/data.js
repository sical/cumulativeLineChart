import { DataAction } from '../actions/data'

const data = ( state = { isFetching: false, error: '' }, action ) => {
  switch ( action.type ) {
    case DataAction.REQ_FETCH_DATA: {
      return { ...state, isFetching: true }
    }
    case DataAction.FETCH_DATA_SUCCESS: {
      return { ...state, isFetching: false, datasets: action.payload }
    }
    case DataAction.FETCH_DATA_FAILURE: {
      return { ...state, isFetching: false, error: 'Something bad!!' }
    }
    default:
      return state
  }
}

export default data
