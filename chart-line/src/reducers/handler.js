/* global svgRoot */

// TODO NOT USED TO REMOVE
// ----------------
class Handler {
  static selectMany ({ ids }) {
    svgRoot
      .selectAll( `.ink.id-${ids.join( ',.ink.id-' )}` )
      .classed( 'ink-pressed', true )
      .style( 'stroke', ids.color )
  }

  static unselectMany ({ ids }) {
    svgRoot
      .selectAll( `.ink.id-${ids.join( ',.ink.id-' )}` )
      .classed( 'ink-pressed', false )
      .style( 'stroke', ids.color )
  }

  static highlightMany ({ ids }) {
    svgRoot.selectAll( '.ink' ).style( 'opacity', 0.1 )
    svgRoot
      .selectAll( `.shadow.id-${ids.join( ',.shadow.id-' )}` )
      .style( 'opacity', 0.4 )
    svgRoot.selectAll( `.ink.id-${ids.join( ',.ink.id-' )}` ).style( 'opacity', 0.8 )
  }

  static unhighlightMany ({ ids }) {
    svgRoot.selectAll( '.ink' ).style( 'opacity', 0.5 )
    svgRoot.selectAll( '.shadow' ).style( 'opacity', 0 )
  }

  static buildHistogramBands ( data, { bins = 20 }) {
    const scale = d3.scaleLinear()
    const xExtent = d3.extent( data )

    scale.domain( xExtent ).nice( _.size( data ))
    const bands = d3
      .histogram()
      .domain( xExtent )
      .value( d => d )
      .thresholds( scale.ticks( bins ))( data )
    const yExtent = [ 0, d3.max( bands, dd => _.size( dd )) ]

    return { bands, xExtent, yExtent }
  }

  static mmdragStartedHandler ( svg, el, { xScale, yScale, store }) {
    Handler.addDragCirclePlaceholder( svg, { clazz: 'margin-drag-placeholder' })
    Handler.addDragLinePlaceholder( el, { clazz: 'margin-drag-line' })

    const clazz = el.attr( 'class' )

    store.dispatch({
      type: InputType.MARGIN_DRAG_STARTED,
      payload: {
        start: d3.mouse( el.node()),
        sClazz: clazz,
        xScale,
        yScale,
        svg,
        store,
      },
    })
  }

  static mmdragEndedHandler ( svg, el, { xScale, yScale, store }) {
    Handler.removeDragCirclePlaceholder( svg, {
      clazz: 'margin-drag-placeholder',
    })

    const clazz = el.attr( 'class' )

    store.dispatch({
      type: InputType.MARGIN_DRAG_ENDED,
      payload: {
        end: d3.mouse( el.node()),
        eClazz: clazz,
        xScale,
        yScale,
        svg,
        store,
      },
    })

    store.dispatch({
      type: InputType.CORNER_UPDATE_QUERY_INTERSECT,
      payload: {
        ...store.getState().margin[clazz],
        clazz,
      },
    })

    store.dispatch({
      type: InputType.CORNER_ADD_QUERY_INTERSECT,
      payload: {
        clazz,
        svg,
        ...store.getState().margin[clazz],
      },
    })
  }

  static mmdragHandler ( svg, el, { xScale, yScale, store }) {
    // log('here', store.getState().margin) return

    const clazz = el.attr( 'class' )

    const { start, end } = store.getState().margin[clazz]

    const [ mousex, mousey ] = d3.mouse( svgRoot.node())
    const [ elmousex, elmousey ] = d3.mouse( el.node()) // TO REMOVE

    switch ( clazz ) {
      case 'right-margin':
      case 'left-margin': {
        Handler.dragCirclePlaceholder( svg, {
          clazz: 'margin-drag-placeholder',
          cx: xScale( xScale.invert( mousex )),
          cy: yScale( yScale.invert( mousey )),
        })
        Handler.dragLinePlaceholder( el, {
          clazz: 'margin-drag-line',
          x1: xScale( xScale.invert( start.x )),
          x2: xScale( xScale.invert( start.x )),
          y1: yScale( yScale.invert( start.y )),
          y2: yScale( yScale.invert( elmousey )),
          strokeWidth: 4,
        })
        return
      }
      case 'bottom-margin':
      case 'top-margin': {
        Handler.dragCirclePlaceholder( svg, {
          clazz: 'margin-drag-placeholder',
          cx: xScale( xScale.invert( mousex )),
          cy: yScale( yScale.invert( mousey )),
        })
        Handler.dragLinePlaceholder( el, {
          clazz: 'margin-drag-line',
          x1: xScale( xScale.invert( start.x )),
          x2: xScale( xScale.invert( elmousex )),
          y1: yScale( yScale.invert( start.y )),
          y2: yScale( yScale.invert( start.y )),
          strokeWidth: 4,
        })
        return
      }
      default: {
        return
      }
    }
  }

  static drawLinesHandler ( svg, grouped, { line, clazz }) {
    drawLines( svg, grouped, { line, clazz })
  }

  static drawCirclesHandler (
    svg,
    grouped,
    { clazz, xScale, yScale, circle, xkey, ykey, parseTime }
  ) {
    drawCircles( svg, grouped, {
      clazz,
      xScale,
      yScale,
      circle,
      xkey,
      ykey,
      parseTime,
    })
  }

  static drawAxisHandler ({
    svg,
    t,
    clazz,
    scale,
    ticks,
    tickSize,
    tickFormat,
    position,
    tickSizeInner,
    tickSizeOuter,
    tickValues,
  }) {
    let ax
    switch ( position ) {
      case 'left': {
        ax = d3.axisLeft( scale )
        break
      }
      case 'right': {
        ax = d3.axisRight( scale )
        break
      }
      case 'bottom': {
        ax = d3.axisBottom( scale )
        break
      }
      case 'top': {
        ax = d3.axisTop( scale )
        break
      }
      default:
        break
    }

    if ( ticks ) {
      ax.ticks( ticks )
    }
    if ( tickFormat ) {
      ax.tickFormat( tickFormat )
    }
    if ( tickSize ) {
      ax.tickSize( ...tickSize )
    }
    if ( tickSizeInner ) {
      ax.tickSizeInner( tickSizeInner )
    }
    if ( tickSizeOuter ) {
      ax.tickSizeOuter( tickSizeOuter )
    }
    if ( tickValues ) {
      ax.tickValues( tickValues )
    }

    svgRoot
      .select( `.${clazz}` )
      .attr( 'transform', t )
      .call( ax )

    return ax
  }

  static updateAxisHandler ({ svg, clazz, axis, tmpXScale, tmpYScale }) {
    switch ( clazz ) {
      case 'x-grid':
      case 'x-axis': {
        svgRoot.select( '.x-axis' ).call( axis['x-axis'].scale( tmpXScale ))
        svgRoot.select( '.x-grid' ).call( axis['x-grid'].scale( tmpXScale ))
        break
      }
      case 'y-grid':
      case 'y-axis': {
        svgRoot.select( '.y-axis' ).call( axis['y-axis'].scale( tmpYScale ))
        svgRoot.select( '.y-grid' ).call( axis['y-grid'].scale( tmpYScale ))
        break
      }
      default: {
        break
      }
    }
  }

  static lmenterHandler ({ cssClassId }) {
    svgRoot.selectAll( '.ink' ).style( 'opacity', 0.1 )
    svgRoot.selectAll( `.line-shadow--el.${cssClassId}` ).style( 'opacity', 0.5 )
    svgRoot.selectAll( `.ink.${cssClassId}` ).style( 'opacity', 1 )
  }

  static lmleaveHandler ({ cssClassId }) {
    svgRoot.selectAll( '.ink' ).style( 'opacity', 0.5 )
    svgRoot.selectAll( `.line-shadow--el.${cssClassId}` ).style( 'opacity', 0 )
    svgRoot.selectAll( `.ink.${cssClassId}` ).style( 'opacity', 0.5 )
  }

  static tmenterHandler ( el ) {
    d3.select( el )
      .style( 'stroke', 'red' )
      .style( 'stroke-width', 5 )
      .style( 'cursor', 'grab' )
  }

  static tmleaveHandler ( el ) {
    d3.select( el )
      .style( 'stroke', '#000' )
      .style( 'stroke-width', 1 )
      .style( 'cursor', 'default' )
  }

  static addDragLinePlaceholder ({ clazz }) {
    svgRoot
      .append( 'line' )
      .attr( 'class', clazz )
      .style( 'stroke', 'red' )
  }

  static removeDragLinePlaceholder ({ clazz }) {
    svgRoot.select( 'line.' + clazz ).remove()
  }

  static dragLinePlaceholder ( svg, { clazz, x1, x2, y1, y2, strokeWidth }) {
    svgRoot
      .select( 'line.' + clazz )
      .style( 'stroke-width', strokeWidth || 1 )
      .attr( 'x1', x1 || 0 )
      .attr( 'x2', x2 || 0 )
      .attr( 'y1', y1 || 0 )
      .attr( 'y2', y2 || 0 )
  }

  static addDragCirclePlaceholder ( svg, { clazz }) {
    svgRoot
      .append( 'circle' )
      .attr( 'class', clazz )
      .style( 'fill', 'red' )
  }

  static removeDragCirclePlaceholder ( svg, { clazz }) {
    svgRoot.select( 'circle.' + clazz ).remove()
  }

  static dragCirclePlaceholder ( svg, { clazz, cx, cy }) {
    svgRoot
      .select( 'circle.' + clazz )
      .attr( 'r', 5 )
      .attr( 'cx', cx )
      .attr( 'cy', cy )
  }

  // m drag

  static tmdragStartedHandler ( el, gfather, { xScale, yScale, store }) {
    Handler.addDragLinePlaceholder({ clazz: 'drag-line-placeholder' })

    store.dispatch({
      type: InputType.TICK_DRAG_STARTED,
      payload: {
        start: d3.mouse( svgRoot.node()),
        sClazz: gfather.attr( 'class' ),
        xScale,
        yScale,
        store,
      },
    })
  }

  static tmdragHandler ( el, gfather, { xScale, yScale }) {
    const clazz = gfather.attr( 'class' )
    const [ mousex, mousey ] = d3.mouse( svgRoot.node())
    switch ( clazz ) {
      case 'x-grid':
      case 'x-axis': {
        Handler.dragLinePlaceholder( svg, {
          clazz: 'drag-line-placeholder',
          x1: xScale( xScale.invert( mousex )),
          x2: xScale( xScale.invert( mousex )),
          y1: 0,
          y2: yScale.range()[0] + yScale.range()[1],
        })
        return
      }
      case 'y-grid':
      case 'y-axis': {
        Handler.dragLinePlaceholder( svg, {
          clazz: 'drag-line-placeholder',
          y1: yScale( yScale.invert( mousey )),
          y2: yScale( yScale.invert( mousey )),
          x1: 0,
          x2: xScale.range()[1] + xScale.range()[0],
        })
        return
      }
      default: {
        return
      }
    }
  }

  static tmdragEndedHandler ( el, gfather, { xScale, yScale, store }) {
    Handler.removeDragLinePlaceholder({ clazz: 'drag-line-placeholder' })
    const clazz = gfather.attr( 'class' )
    const end = d3.mouse( svgRoot.node())

    store.dispatch( tickDragEnded({ svg, clazz, xScale, yScale, end }))

    function tickDragEnded ({ end, clazz, store, xScale, yScale, svg }) {
      return function ( dispatch, getState ) {
        dispatch({
          type: InputType.TICK_DRAG_ENDED,
          payload: { end, eClazz: clazz, xScale, yScale, svg },
        })

        dispatch({
          type: InputType.UPDATE_SCALE,
          payload: {
            clazz,
            xScale,
            yScale,
            end,
            start: getState().tick.start,
          },
        })

        dispatch({
          type: InputType.UPDATE_AXIS,
          payload: {
            clazz,
            tmpXScale: getState().scale.tmpXScale,
            tmpYScale: getState().scale.tmpYScale,
            axis: getState().axis,
          },
        })

        dispatch({
          type: InputType.UPDATE_LINES,
          payload: {
            ...getState().scale,
            xScale: getState().scale.tmpXScale,
            yScale: getState().scale.tmpYScale,
            ...getState().line,
          },
        })

        dispatch({
          type: InputType.UPDATE_DOTS,
          payload: {
            ...getState().scale,
            xScale: getState().scale.tmpXScale,
            yScale: getState().scale.tmpYScale,
            ...getState().dot,
          },
        })
      }
    }
  }

  static updateScaleHandler ({ clazz, xScale, yScale, start, end }) {
    const tmpXScale = d3
      .scaleTime()
      .domain( xScale.domain())
      .range( xScale.range())
    const tmpYScale = d3
      .scaleLinear()
      .domain( yScale.domain())
      .range( yScale.range())

    switch ( clazz ) {
      case 'x-grid':
      case 'x-axis': {
        const [ dx0, dx1 ] = xScale.domain(),
          [ rx0, rx1 ] = xScale.range()

        tmpXScale
          .domain([ dx0, xScale.invert( start[0]), dx1 ])
          .range([ rx0, xScale( xScale.invert( end[0])), rx1 ])
        return { tmpXScale, tmpYScale }
      }
      case 'y-grid':
      case 'y-axis': {
        const [ dy0, dy1 ] = yScale.domain(),
          [ ry0, ry1 ] = yScale.range()

        tmpYScale
          .domain([ dy0, yScale.invert( start[1]), dy1 ])
          .range([ ry0, yScale( yScale.invert( end[1])), ry1 ])
        return { tmpXScale, tmpYScale }
      }
      default: {
        return { tmpXScale, tmpYScale }
      }
    }
  }

  static initSvgMarginAndCornerGroups ({
    svg,
    tickSizeInner,
    width,
    height,
    margin,
  }) {
    const offset = 0
    svg
      .append( 'rect' )
      .attr( 'x', margin.left - offset - tickSizeInner )
      .attr( 'y', margin.top - offset - tickSizeInner )
      .attr( 'width', width - 2 * margin.left + 2 * offset + 2 * tickSizeInner )
      .attr( 'height', height - 2 * margin.top + 2 * offset + 2 * tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', 'none' )

    svg
      .append( 'g' )
      .attr( 'class', 'top-left-corner' )
      .attr( 'transform', `translate( 0, 0 )` )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#eee4' )

    svg
      .append( 'g' )
      .attr( 'class', 'bottom-left-corner' )
      .attr(
        'transform',
        `translate( 0, ${height - ( margin.top - offset - tickSizeInner )} )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#eee4' )

    svg
      .append( 'g' )
      .attr( 'class', 'bottom-right-corner' )
      .attr(
        'transform',
        `translate( ${width -
          ( margin.left - offset - tickSizeInner )}, ${height -
          ( margin.top - offset - tickSizeInner )} )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#eee4' )

    svg
      .append( 'g' )
      .attr( 'class', 'top-right-corner' )
      .attr(
        'transform',
        `translate( ${width - ( margin.left - offset - tickSizeInner )}, 0 )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#eee4' )

    /// mar
    svg
      .append( 'g' )
      .attr( 'class', 'left-margin' )
      .attr(
        'transform',
        `translate(0, ${margin.top - offset - tickSizeInner} )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', height - 2 * margin.top + 2 * offset + 2 * tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#ccc4' )

    svg
      .append( 'g' )
      .attr( 'class', 'right-margin' )
      .attr(
        'transform',
        `translate( ${width -
          ( margin.left - offset - tickSizeInner )}, ${margin.top -
          offset -
          tickSizeInner} )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', margin.left - offset - tickSizeInner )
      .attr( 'height', height - 2 * margin.top + 2 * offset + 2 * tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#ccc4' )

    svg
      .append( 'g' )
      .attr( 'class', 'top-margin' )
      .attr(
        'transform',
        `translate( ${margin.left - offset - tickSizeInner}, 0 )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', width - 2 * margin.left + 2 * offset + 2 * tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#ccc4' )

    svg
      .append( 'g' )
      .attr( 'class', 'bottom-margin' )
      .attr(
        'transform',
        `translate( ${margin.left - offset - tickSizeInner}, ${height -
          ( margin.top - offset - tickSizeInner )} )`
      )
      .append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', 0 )
      .attr( 'width', width - 2 * margin.left + 2 * offset + 2 * tickSizeInner )
      .attr( 'height', margin.top - offset - tickSizeInner )
      .style( 'stroke', 'orange' )
      .style( 'fill', '#ccc4' )
  }
}
