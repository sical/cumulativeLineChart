import {
  line,
  curveMonotoneX,
  nest,
  timeParse,
  timeFormat,
  timeMonth,
  timeYear,
} from 'd3'
import { get, map, mapValues, keys, each, join, values, flatten } from 'lodash'

import { addAxis } from './scale'

export const LineAction = {
  INIT_LINES: 'INIT_LINES',
  UPDATE_LINE: 'UPDATE_LINE',
  HIGHLIGHT: 'HIGHLIGHT',
  CLICK: 'CLICK',
  ADD_SELECTION_SIGNAL: 'ADD_SELECTION_SIGNAL',
  REMOVE_SELECTION_SIGNAL: 'REMOVE_SELECTION_SIGNAL',
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
    // values: values,
    id: key,
    isHovered: false,
    isPressed: false,
    inkStyle: {
      stroke: '#ccc',
    },
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

export const smallMultiple = payload => ( dispatch, getState ) => {
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
    quantiAttrs,
  } = getState().data

  const { xScale, yScale } = getState().scale

  let pattern
  if ( payload === 'month' ) {
    pattern = '%m/%Y'
  } else if ( payload === 'year' ) {
    pattern = '%Y'
  } else if ( payload === 'day' ) {
    pattern = '%d/%m/%Y'
  } else if ( payload === 'week' ) {
    pattern = '%V/%m/%Y'
  }

  let byId = nest()
    .key( d => d[keyId])
    .key( d => timeFormat( pattern )( d.dateObj ))
    .rollup( sumMapper.bind( null, quantiAttrs ))
    .object( data )

  const xAttr = get( attrs, xDefaultKey )
  const yAttr = get( attrs, yDefaultKey )

  const getX = d => {
    const x = get( d, xKey )
    if ( xType !== 'date' ) {
      return x
    } else {
      const pattern = get( xAttr, 'pattern', '%d/%m/%Y' )
      return timeParse( pattern )( x )
    }
  }
  const getY = d => {
    const y = get( d, yKey )
    if ( yType !== 'date' ) {
      return y
    } else {
      const pattern = get( yAttr, 'pattern', '%d/%m/%Y' )
      return timeParse( pattern )( y )
    }
  }

  const path = line()
    .curve( curveMonotoneX )
    .x( d => xScale( getX( d )))
    .y( d => yScale( getY( d )))

  byId = mapValues( byId, ( itemObj, key ) => ({
    // values: values,
    id: key,
    isHovered: false,
    isPressed: false,
    inkStyle: {
      stroke: '#ccc',
    },
    d: join( map( itemObj, ( values, _ ) => path( values )), ' ' ),
    dots: map( flatten( values( itemObj )), d => ({
      cx: xScale( getX( d )),
      cy: yScale( getY( d )),
    })),
  }))

  dispatch( addAxis({ xTicks: timeMonth.every( 1 ) }))

  dispatch({
    type: LineAction.INIT_LINES,
    payload: { byId, ids: keys( byId ) },
  })
}

export const updateLine = payload => ({
  type: LineAction.UPDATE_LINE,
  payload,
})

export const lineOver = payload => ({
  type: LineAction.HIGHLIGHT,
  payload,
})

export const lineClick = payload => ({
  type: LineAction.CLICK,
  payload,
})

export const lineAddSelectionSignal = payload => ({
  type: LineAction.ADD_SELECTION_SIGNAL,
  payload,
})

export const lineRemoveSelectionSignal = payload => ({
  type: LineAction.REMOVE_SELECTION_SIGNAL,
  payload,
})

const sumMapper = ( quantiAttrs, array ) => {
  const newO = {}
  each( keys( quantiAttrs ), key => {
    newO[quantiAttrs[key].cumulative] = 0
  })

  return map( array, o => {
    each( keys( quantiAttrs ), key => {
      newO[quantiAttrs[key].cumulative] += o[key]
    })
    return { ...o, ...newO }
  })
}
