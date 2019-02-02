import { line, curveMonotoneX, nest, timeParse } from 'd3'
import { get, map, mapValues, keys } from 'lodash'

export const LineAction = {
  INIT_LINES: 'INIT_LINES',
  HIGHLIGHT: 'HIGHLIGHT',
  CLICK: 'CLICK',
}

export const initLines = () => ( dispatch, getState ) => {
  const {
    data,
    attrs,
    keyId,
    xKey,
    yKey,
    xType,
    yType,
    xDefaultKey,
    yDefaultKey,
  } = getState().data

  const { xScale, yScale } = getState().scale

  let byId = nest()
    .key( d => d[keyId])
    //.key( d => mft( parseTime( d.key )))
    //.rollup( Helpers.sumMapper )
    .object( data )

  const xAttr = get( attrs, xDefaultKey )
  const yAttr = get( attrs, yDefaultKey )

  const getX = d => {
    const x = get( d, xKey )
    if ( xType !== 'date' ) {
      return x
    } else {
      const pattern = get( xAttr, 'pattern', '%d/%m/%Y' )
      const parse = timeParse( pattern )
      return parse( x )
    }
  }
  const getY = d => {
    const y = get( d, yKey )
    if ( yType !== 'date' ) {
      return y
    } else {
      const pattern = get( yAttr, 'pattern', '%d/%m/%Y' )
      const parse = timeParse( pattern )
      return parse( y )
    }
  }

  const path = line()
    .curve( curveMonotoneX )
    .x( d => xScale( getX( d )))
    .y( d => yScale( getY( d )))

  byId = mapValues( byId, ( values, key ) => ({
    values: values,
    id: key,
    isHovered: false,
    isPressed: false,
    d: path( values ),
    dots: map( values, d => ({
      cx: xScale( getX( d )),
      cy: yScale( getY( d )),
    })),
  }))

  dispatch({
    type: LineAction.INIT_LINES,
    payload: { byId, ids: keys( byId ) },
  })
}

export const lineOver = payload => ({
  type: LineAction.HIGHLIGHT,
  payload,
})

export const lineClick = payload => ({
  type: LineAction.CLICK,
  payload,
})
