import { isArray, each } from 'lodash'
import undoable, {
  distinctState,
  excludeAction,
  combineFilters,
} from 'redux-undo'

import { LineAction } from '../actions/line'

export const line = ( state = { byId: {}, ids: [] }, action ) => {
  switch ( action.type ) {
    case LineAction.INIT_LINES: {
      return { ...state, ...action.payload }
    }
    case LineAction.HIGHLIGHT: {
      const { id, status } = action.payload

      let ids = id
      const lines = {}
      if ( !isArray( id )) {
        ids = [ id ]
      }

      each( ids, id => {
        lines[id] = { ...state.byId[id], isHovered: status ? true : false }
      })

      return {
        ...state,
        byId: { ...state.byId, ...lines, isHovered: status ? true : false },
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

// const undoableLine = undoable( line, {
//   filter: excludeAction([ LineAction.HIGHLIGHT ]),
//   limit: 5, // set a limit for the history
// })

// export default undoableLine

export default line
