import {
  axisBottom,
  axisLeft,
  select,
  timeMonth,
  timeDay,
  timeFormat,
} from 'd3'
import { dropRight, map, reverse, first, last } from 'lodash'
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
    case ScaleAction.RESIZE_AXIS_SCALE: {
      const { start, end, clazz } = action.payload
      const {
        xScale,
        yScale,
        xExtent,
        yExtent,
        xRange,
        yRange,
        xDomainVals,
        yDomainVals,
      } = state

      switch ( clazz ) {
        case 'x-grid':
        case 'x-axis': {
          const [ dx0, dx1 ] = [ first( xDomainVals ), last( xDomainVals ) ],
            [ rx0, rx1 ] = xRange

          const xTmpDomain = [ dx0, xScale.invert( start[0]), dx1 ]
          const xTmpRange = [ rx0, xScale( xScale.invert( end[0])), rx1 ]
          xScale.domain( xTmpDomain ).range( xTmpRange )

          break
        }
        case 'y-grid':
        case 'y-axis': {
          const [ dy0, dy1 ] = [ last( yDomainVals ), first( yDomainVals ) ],
            [ ry0, ry1 ] = yRange

          const yTmpDomain = [ dy0, yScale.invert( start[1]), dy1 ]
          const yTmpRange = [ ry0, yScale( yScale.invert( end[1])), ry1 ]
          yScale.domain( yTmpDomain ).range( yTmpRange )

          break
        }
        default: {
          break
        }
      }

      return { ...state, xScale, yScale }
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
