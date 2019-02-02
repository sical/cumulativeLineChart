import { LineAction } from '../actions/line'

export const line = ( state = { lines: [] }, action ) => {
  switch ( action.type ) {
    case LineAction.INIT_LINES: {
      const { lines } = action.payload

      return { ...state, lines }
    }
    default:
      return state
  }
}

export default line
