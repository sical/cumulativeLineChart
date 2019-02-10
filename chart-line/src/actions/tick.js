import { selectAll, drag, select, mouse } from 'd3'
import { resizeAxisScale } from '../actions/scale'

export const TickAction = {
  TICK_DRAG_STARTED: 'TICK_DRAG_STARTED',
  TICK_DRAG_ENDED: 'TICK_DRAG_ENDED',
  TICK_ADD_DRAG_TO_RESIZE: 'TICK_ADD_DRAG_TO_RESIZE',
}

export const tickAddDragToResize = _ => ( dispatch, getStet ) => {
  const ticksEl = selectAll( '.tick line' )
  const tickdrag = drag()
  const svg = select( '#svg' )

  const resize = { clazz: '', start: null, end: null }
  function tstart ( d ) {
    const gfather = select( this.parentNode.parentNode )
    resize.clazz = gfather.attr( 'class' )
    resize.start = mouse( svg.node())
  }
  function tdrag ( d ) {
    // const gfather = select( this.parentNode.parentNode )
  }
  function tend ( d ) {
    const gfather = select( this.parentNode.parentNode )

    const endClazz = gfather.attr( 'class' )

    if ( endClazz !== resize.clazz ) {
      return
    }

    resize.end = mouse( svg.node())
    dispatch( resizeAxisScale( resize ))
  }

  tickdrag
    .on( 'start', tstart )
    .on( 'drag', tdrag )
    .on( 'end', tend )

  ticksEl.call( tickdrag )
}

export const tickResizeStarted = payload => ({
  type: TickAction.TICK_DRAG_STARTED,
  payload,
})

export const tickResizeEnded = payload => ({
  type: TickAction.TICK_DRAG_ENDED,
  payload,
})
