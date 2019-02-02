import { ScaleAction } from '../actions/scale'

const scale = (
  state = {
    xScale: null,
    yScale: null,
    xExtent: [],
    yExtent: [],
    xRange: [],
    yRange: [],
  },
  action
) => {
  switch ( action.type ) {
    case ScaleAction.INIT_AXIS_SCALE: {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}

export default scale
