import { extent, timeParse, scaleLinear, scaleTime } from 'd3'
import { get, map, uniq } from 'lodash'
import { LineAction, initLines } from './line'

export const ScaleAction = {
  INIT_AXIS_SCALE: 'INIT_AXIS_SCALE',
  UPDATE_AXIS_SCALE: 'UPDATE_AXIS_SCALE',
}

export const initAxisScale = payload => ( dispatch, getState ) => {
  const {
    data,
    attrs,
    xDefaultKey,
    yDefaultKey,
    xType,
    yType,
    xKey,
    yKey,
  } = getState().data

  const { width, height } = payload
  const margin = { top: 30, right: 30, bottom: 30, left: 30 }
  const xRange = [ margin.left, width - margin.right ]
  const yRange = [ height - margin.top, margin.bottom ]

  let xScale = null,
    yScale = null

  let xExtent = [],
    yExtent = []

  const xAttr = get( attrs, xDefaultKey ),
    yAttr = get( attrs, yDefaultKey )

  const xVect = uniq( map( data, xKey ))
  const yVect = uniq( map( data, yKey ))

  if ( xType === 'date' ) {
    const pattern = get( xAttr, 'pattern', '%d/%m/%Y' )
    const parse = timeParse( pattern )
    xExtent = extent( xVect, d => parse( d ))
    xScale = scaleTime().domain( xExtent )
  } else {
    xExtent = extent( xVect )
    xScale = scaleLinear().domain( xExtent )
  }

  if ( yType === 'date' ) {
    const pattern = get( yAttr, 'pattern', '%d/%m/%Y' )
    const parse = timeParse( pattern )
    yExtent = extent( yVect, d => parse( d ))
    yScale = scaleTime().domain( yExtent )
  } else {
    yExtent = extent( yVect )
    yScale = scaleLinear().domain( yExtent )
  }

  xScale.range( xRange )
  yScale.range( yRange )

  dispatch({
    type: ScaleAction.INIT_AXIS_SCALE,
    payload: { xScale, yScale, xExtent, yExtent, xRange, yRange, margin },
  })
}

export const updateAxisScale = payload => ( dispatch, getState ) => {
  dispatch({
    type: ScaleAction.UPDATE_AXIS_SCALE,
    payload,
  })

  dispatch( initLines())
}
