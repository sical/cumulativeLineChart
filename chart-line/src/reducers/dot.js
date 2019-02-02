import { DotAction } from '../actions/dot'

export const dot = ( state = { dots: [] }, action ) => {
  switch ( action.type ) {
    case DotAction.INIT_DOTS: {
      const { dots } = action.payload

      return { ...state, dots }
    }
    default:
      return state
  }
}

export default dot
