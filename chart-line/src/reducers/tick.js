import { TickAction } from '../actions/tick'

function tick ( state = {}, action ) {
  switch ( action.type ) {
    case TickAction.TICK_ADD_DRAG_TO_RESIZE: {
      return state
    }
    case TickAction.TICK_DRAG_STARTED: {
      const { start, sClazz } = action.payload
      return { ...state, start, sClazz, end: null, eClazz: null }
    }
    case TickAction.TICK_DRAG_ENDED: {
      const { end, eClazz } = action.payload
      return { ...state, end, eClazz }
    }
    default:
      return state
  }
}

export default tick
