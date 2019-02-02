import { extent, timeParse, scaleLinear, scaleTime } from 'd3'
import { get, map, uniq } from 'lodash'

export const ScaleAction = {
  INIT_AXIS_SCALE: 'INIT_AXIS_SCALE',
}

export const initAxisScale = () => ( dispatch, getState ) => {
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

  const xRange = [ 0, 500 ],
    yRange = [ 300, 0 ]

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
    payload: { xScale, yScale, xExtent, yExtent, xRange, yRange },
  })
}
