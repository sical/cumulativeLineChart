import { line, curveMonotoneX, scaleLinear, scaleTime } from 'd3'
import { get, random, each, map } from 'lodash'
export const LineAction = {
  INIT_LINES: 'INIT_LINES',
}

export const initLines = payload => {
  // const { datasetById, id } = payload
  // const { data, attrs } = datasetById[id]
  // const ykey = 'sumscore',
  //   xkey = 'key'

  const data = Array.from({ length: 20 }, ( _, k ) => ({
    id: k,
    inkStyle: {
      fill: 'none',
      stroke: '#ccc',
      strokeWidth: 1,
      opacity: 0.5,
      pointerEvents: 'none',
    },
    shadowStyle: {
      fill: 'none',
      stroke: '#ccc',
      strokeWidth: 7,
      opacity: 0,
    },
    dotStyle: {
      stroke: 'none',
      fill: 'rgb(204, 204, 204)',
      r: 3,
    },
    values: Array.from({ length: 50 }, ( _, kk ) => ({
      x: kk,
      y: random( 0, 99 ),
    })),
  }))

  const xScale = scaleLinear()
    .domain([ 0, 100 ])
    .range([ 0, 700 ])
  const yScale = scaleLinear()
    .domain([ 0, 100 ])
    .range([ 500, 0 ])

  const path = line()
    .curve( curveMonotoneX )
    .x( d => xScale( get( d, 'x' )))
    .y( d => yScale( get( d, 'y' )))

  each( data, o => {
    o.d = path( o.values )
    o.dots = map( o.values, d => ({
      cx: xScale( get( d, 'x' )),
      cy: yScale( get( d, 'y' )),
    }))
  })

  return {
    type: LineAction.INIT_LINES,
    payload: { lines: data },
  }
}
