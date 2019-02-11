import {
  line,
  curveMonotoneX,
  nest,
  timeParse,
  timeFormat,
  timeMonth,
  timeYear,
} from 'd3'
import {
  get,
  map,
  mapValues,
  keys,
  each,
  join,
  values,
  flatten,
  filter,
  size,
} from 'lodash'
import * as moment from 'moment'

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
  } else {
    dispatch( initLines())
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

  dispatch( addAxis())

  dispatch({
    type: LineAction.INIT_LINES,
    payload: { byId, ids: keys( byId ) },
  })
}

export const progLine = payload => ( dispatch, getState ) => {
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

  const { level } = payload

  const threshold = {
    'Prog++': {
      sumscore: { days: 10, delta0: 50 },
    },
    'Prog+': {
      sumscore: { days: 20, delta0: 20, delta1: 50 },
    },
    Prog: {
      sumscore: { days: 30, delta0: 20 },
    },
  }

  const grouped = nest()
    .key( d => d[keyId])
    .entries( data )

  const filtered = filter( grouped, userData => {
    const s = userData.values
    const attr = 'sumscore'
    let isHappy = false,
      diffDays

    if ( userData.key === '2660090' ) {
      console.log( '"2660090"', userData )
    }
    for ( let i = 0; i <= size( s ); i++ ) {
      for ( let j = i + 1; j <= size( s ) - 1; j++ ) {
        // if out of time window
        diffDays = moment( s[j].dateObj ).diff( moment( s[i].dateObj ), 'days' )

        if (
          level === 'Prog' &&
          diffDays >= threshold[level][attr].days &&
          s[j][attr] - s[i][attr] <= threshold[level][attr].delta0
        ) {
          isHappy = true
          break
        }

        if (
          level === 'Prog+' &&
          diffDays >= threshold[level][attr].days &&
          s[j][attr] - s[i][attr] > threshold[level][attr].delta0 &&
          s[j][attr] - s[i][attr] < threshold[level][attr].delta1
        ) {
          isHappy = true
          break
        }

        if (
          level === 'Prog++' &&
          s[j][attr] - s[i][attr] >= threshold[level][attr].delta0
        ) {
          isHappy = true
          break
        }
        // if ( diffDays > threshold[attr].days ) {
        //   break
        // }
      }

      if ( isHappy ) {
        break
      }
    }

    return isHappy
  })

  console.log( 'filtered', filtered )

  dispatch( lineClick({ id: map( filtered, 'key' ) }))
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
