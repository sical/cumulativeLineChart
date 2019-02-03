import { EntityAction } from '../actions/entity'

export const entity = (
  state = {
    byId: {},
    ids: [],
  },
  action
) => {
  switch ( action.type ) {
    case EntityAction.INIT_ENTITY: {
      return {
        ...state,
        byId: {},
        ids: [],
      }
    }
    case EntityAction.ADD_ENTITY: {
      const { entity, name } = action.payload

      if ( !name ) {
        return state
      }
      const e = state.byId[name]
      if ( e ) {
        return state
      }

      return {
        ...state,
        byId: { ...state.byId, [name]: entity },
        ids: [ ...state.ids, name ],
      }
    }
    default:
      return state
  }
}

export default entity
