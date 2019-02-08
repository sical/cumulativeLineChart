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
    case ScaleAction.UPDATE_AXIS_SCALE: {
      const { width, height } = action.payload
      const xRange = [ state.margin.left, width - state.margin.right ]
      const yRange = [ height - state.margin.top, state.margin.bottom ]
      // update scale
      const xScale = state.xScale
      const yScale = state.yScale

      xScale.range( xRange )
      yScale.range( yRange )

      return { ...state, xRange, yRange, width, height, xScale, yScale }
    }
    default:
      return state
  }
}

export default scale
