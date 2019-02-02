import { DataAction } from '../actions/data'

const data = ( state = { data: [], attrs: [], id: '' }, action ) => {
  switch ( action.type ) {
    case DataAction.SELECT_DATASET: {
      const { datasetById, id } = action.payload
      const { data, attrs, meta } = datasetById[id]
      return { ...state, id, data, attrs, meta }
    }
    default:
      return state
  }
}

export default data
