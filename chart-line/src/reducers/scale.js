import {
  axisBottom,
  axisLeft,
  select,
  timeMonth,
  timeDay,
  timeFormat,
} from 'd3'
import { dropRight, map, reverse } from 'lodash'
import { ScaleAction } from '../actions/scale'

const scale = (
  state = {
    xScale: null,
    yScale: null,
    xExtent: [],
    yExtent: [],
    xRange: [],
    yRange: [],
    xTickSelection: {},
    yTickSelection: {},
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
      const yRange = [ height - state.margin.bottom, state.margin.top ]
      // update scale
      const xScale = state.xScale
      const yScale = state.yScale

      xScale.range( xRange )
      yScale.range( yRange )

      return { ...state, xRange, yRange, width, height, xScale, yScale }
    }
    case ScaleAction.XTICK_ADD_SELECTION: {
      const { id, s, e } = action.payload

      return {
        ...state,
        xTickSelection: {
          ...state.xTickSelection,
          [[ s, e ]]: { s, e, id },
        },
      }
    }
    case ScaleAction.YTICK_ADD_SELECTION: {
      const { id, s, e } = action.payload

      return {
        ...state,
        yTickSelection: {
          ...state.yTickSelection,
          [[ s, e ]]: { s, e, id },
        },
      }
    }
    case ScaleAction.ADD_AXIS: {
      return { ...state, ...action.payload }
    }

    default:
      return state
  }
}

export default scale
