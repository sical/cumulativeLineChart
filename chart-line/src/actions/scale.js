import {
  extent,
  timeParse,
  scaleLinear,
  scaleTime,
  select,
  selectAll,
  axisBottom,
  axisLeft,
  timeMonth,
} from 'd3'
import {
  get,
  map,
  uniq,
  reverse,
  isNil,
  sample,
  sortBy,
  pickBy,
  first,
  last,
  groupBy,
  keys,
} from 'lodash'
import { initLines, lineAddSelectionSignal } from './line'
import { tickAddDragToResize } from './tick'

export const ScaleAction = {
  INIT_AXIS_SCALE: 'INIT_AXIS_SCALE',
  UPDATE_AXIS_SCALE: 'UPDATE_AXIS_SCALE',
  RESIZE_AXIS_SCALE: 'RESIZE_AXIS_SCALE',
  ADD_AXIS: 'ADD_AXIS',
  XTICK_ADD_SELECTION: 'XTICK_ADD_SELECTION',
  YTICK_ADD_SELECTION: 'YTICK_ADD_SELECTION',
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
  const margin = { top: 5, right: 20, bottom: 40, left: 50 }
  const xRange = [ margin.left, width - margin.right ]
  const yRange = [ height - margin.bottom, margin.top ]

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

  xScale.range( xRange ).nice()
  yScale.range( yRange ).nice()

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

  dispatch( addAxis())
  dispatch( initLines())
}

export const addAxis = payload => ( dispatch, getState ) => {
  const { xScale, yScale, xRange, yRange } = getState().scale

  const xAxisbottom = axisBottom( xScale )
  const yAxisleft = axisLeft( yScale )

  const xTicks = get( payload, 'xTicks', null )
  const yTicks = get( payload, 'yTicks', null )

  if ( !isNil( xTicks )) {
    xAxisbottom.ticks( xTicks )
  }
  if ( !isNil( yTicks )) {
    yAxisleft.ticks( yTicks )
  }

  // var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues

  const xDomainVals = xScale.ticks()
  const yDomainVals = reverse( yScale.ticks())

  xAxisbottom.tickSizeOuter( 35 )
  xAxisbottom.tickSizeInner( 25 )

  yAxisleft.tickSizeOuter( 35 )
  yAxisleft.tickSizeInner( 25 )

  select( '.x-axis' )
    .attr( 'transform', `translate(0, ${yRange[0]})` )
    .call( xAxisbottom )

  select( '.y-axis' )
    .attr( 'transform', `translate(${xRange[0]},0)` )
    .call( yAxisleft )

  dispatch({
    type: ScaleAction.ADD_AXIS,
    payload: { xDomainVals, yDomainVals },
  })

  dispatch( addTickPartition())
  dispatch( tickAddDragToResize())
}

export const addTickPartition = _ => ( dispatch, getState ) => {
  const { xScale, yScale, xDomainVals, yDomainVals } = getState().scale
  const { colors, data, xKey, yKey, keyId } = getState().data

  const yVlas = [ ...yDomainVals ].reverse()

  selectAll( '.x-axis,.y-axis' )
    .selectAll( '.tick rect' )
    .remove()

  let selection = {}
  select( '.x-axis' )
    .selectAll( '.tick' )
    .append( 'rect' )
    .classed( 'tick-rect', true )
    .attr( 'x', 1 )
    .attr(
      'width',
      ( d, i ) => xScale( xDomainVals[i + 1]) - xScale( xDomainVals[i]) - 1
    )
    .attr( 'height', 20 )
    .on( 'mousedown', function ( d, i ) {
      selection.s = i
      selection.color = sample( colors )
      select( this ).style( 'fill', selection.color )
    })
    .on( 'mouseup', function ( d, i ) {
      selection.e = i + 1
      let id = groupBy( data, keyId )
      id = pickBy( id, ( array, key ) => {
        const sorted = sortBy( array, [ yKey ])
        return (
          first( sorted ).dateObj >= +xDomainVals[selection.s] &&
          last( sorted ).dateObj <= +xDomainVals[selection.e]
        )
      })

      id = keys( id )
      id.color = selection.color

      dispatch( xTickAddSelection({ id, ...selection }))
      dispatch( xTickAddSelectionSignal({ ...selection }))

      selection = {}
    })
    .on( 'mouseenter', function () {
      if ( !isNil( selection.s )) {
        select( this ).style( 'fill', selection.color )
      }
    })

  select( '.y-axis' )
    .selectAll( '.tick' )
    .append( 'rect' )
    .classed( 'tick-rect', true )
    .attr( 'x', -20 )
    .attr( 'y', ( d, i ) => -yScale( yVlas[i]) + yScale( yVlas[i + 1]) + 1 )
    .attr( 'height', ( d, i ) => yScale( yVlas[i]) - yScale( yVlas[i + 1]) - 1 )
    .attr( 'width', 20 )
    .on( 'mousedown', function ( d, i ) {
      selection.s = i
      selection.color = sample( colors )
      select( this ).style( 'fill', selection.color )
    })
    .on( 'mouseup', function ( d, i ) {
      selection.e = i + 1
      let id = groupBy( data, keyId )

      const id2 = pickBy( id, ( array, key ) => {
        const sorted = sortBy( array, [ yKey ])
        return (
          first( sorted )[yKey] >= yVlas[selection.s] &&
          last( sorted )[yKey] <= yVlas[selection.e]
        )
      })

      id = keys( id2 )
      id.color = selection.color

      dispatch( yTickAddSelection({ id, ...selection }))
      dispatch( yTickAddSelectionSignal({ ...selection }))

      selection = {}
    })
    .on( 'mouseenter', function () {
      if ( !isNil( selection.s )) {
        select( this ).style( 'fill', selection.color )
      }
    })
}

export const xTickAddSelection = payload => ({
  type: ScaleAction.XTICK_ADD_SELECTION,
  payload,
})

export const yTickAddSelection = payload => ({
  type: ScaleAction.YTICK_ADD_SELECTION,
  payload,
})

export const xTickAddSelectionSignal = payload => ( dispatch, getState ) => {
  const { xTickSelection } = getState().scale
  const { s, e } = payload
  const { id } = xTickSelection[[ s, e ]]

  dispatch( lineAddSelectionSignal({ id }))
}

export const yTickAddSelectionSignal = payload => ( dispatch, getState ) => {
  const { yTickSelection } = getState().scale
  const { s, e } = payload
  const { id } = yTickSelection[[ s, e ]]

  dispatch( lineAddSelectionSignal({ id }))
}

export const xTickRemoveSelection = payload => ({
  type: ScaleAction.XTICK_ADD_SELECTION,
  payload,
})

export const resizeAxisScale = payload => ( dispatch, getState ) => {
  dispatch({
    type: ScaleAction.RESIZE_AXIS_SCALE,
    payload,
  })

  dispatch( addAxis())
  dispatch( addTickPartition())
  dispatch( initLines())
}
