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
    const el = select( this ),
      gfather = select( this.parentNode.parentNode )

    resize.clazz = gfather.attr( 'class' )
    resize.start = mouse( svg.node())

    console.log( ' s el', resize )

    // Handler.tmdragStartedHandler( el, gfather, { xScale, yScale, store })
  }
  function tdrag ( d ) {
    const el = select( this ),
      gfather = select( this.parentNode.parentNode )

    // console.log( ' drag el', el, gfather )
    // Handler.tmdragHandler( el, gfather, { xScale, yScale })
  }
  function tend ( d ) {
    const el = select( this ),
      gfather = select( this.parentNode.parentNode )

    const endClazz = gfather.attr( 'class' )

    if ( endClazz !== resize.clazz ) {
      return
    }

    resize.end = mouse( svg.node())

    console.log( ' e el', resize )

    dispatch( resizeAxisScale( resize ))

    // Handler.tmdragEndedHandler( el, gfather, { xScale, yScale, store })
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
