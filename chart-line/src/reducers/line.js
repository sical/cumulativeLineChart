import { LineAction } from '../actions/line'

export const line = ( state = { byId: {}, ids: [] }, action ) => {
  switch ( action.type ) {
    case LineAction.INIT_LINES: {
      return { ...state, ...action.payload }
    }
    case LineAction.HIGHLIGHT: {
      const { id, status } = action.payload
      let line = state.byId[id]
      line = {
        ...line,
        isHovered: status ? true : false,
      }

      return {
        ...state,
        byId: { ...state.byId, [id]: line, isHovered: status ? true : false },
      }
    }
    case LineAction.CLICK: {
      const { id } = action.payload
      let line = state.byId[id]
      line = {
        ...line,
        isPressed: !line.isPressed,
      }

      return {
        ...state,
        byId: { ...state.byId, [id]: line, isPressed: !line.isPressed },
      }
    }
    default:
      return state
  }
}

export default line
