import { scaleLinear, scaleTime } from 'd3'
import { get, random, each, map } from 'lodash'
export const DotAction = {
  INIT_DOTS: 'INIT_DOTS',
}

export const initDots = payload => {
  // const { datasetById, id } = payload
  // const { data, attrs } = datasetById[id]
  // const ykey = 'sumscore',
  //   xkey = 'key'

  const data = Array.from({ length: 20 }, ( _, k ) => ({
    id: k,
    style: {
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

  each( data, o => {
    o.children = map( o.values, d => ({
      cx: xScale( get( d, 'x' )),
      cy: yScale( get( d, 'y' )),
    }))
  })

  return {
    type: DotAction.INIT_DOTS,
    payload: { dots: data },
  }
}
