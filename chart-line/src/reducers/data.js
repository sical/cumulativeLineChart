import { DataAction } from '../actions/data'

const data = ( state = {}, action ) => {
  switch ( action.type ) {
    case DataAction.SELECT_DATASET: {
      const { datasetById, id } = action.payload
      const { data, attrs } = datasetById[id]
      return { ...state, id, data, attrs }
    }
    default:
      return state
  }
}

export default data
