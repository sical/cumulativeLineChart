import { scaleLinear, nest, scaleOrdinal, schemeCategory10 } from 'd3'
import { sum, values, map, chain, mapValues, uniqBy, size, first } from 'lodash'

export const EntityAction = {
  ADD_ENTITY: 'ADD_ENTITY',
  INIT_ENTITY: 'INIT_ENTITY',
}

export const addEntity = payload => ( dispatch, getState ) => {
  const {
    attribute: { name },
  } = payload
  const { data, attrs, keyId } = getState().data
  const height = 400 // TODO get this from state

  console.log( '======== attrs', attrs, name )

  const { type } = attrs[name]

  const pyld = { entity: {}, name: '' }
  switch ( type ) {
    case 'string': {
      pyld.entity = nest()
        .key( d => d[name])
        .rollup( d => ({
          id: first( d )[keyId],
        }))
        .object( data )
      pyld.name = name
      break
    }
    case 'categorical': {
      const color = scaleOrdinal( schemeCategory10 )
      const cats = chain( data )
        .groupBy( name )
        .mapValues( d => {
          const a = uniqBy( map( d, keyId ))
          return {
            count: size( a ),
            id: a,
          }
        })
        .value()

      const scale = scaleLinear()
        .domain([ 0, sum( values( mapValues( cats, 'count' ))) ])
        .range([ 0, height ])

      pyld.entity = mapValues( cats, ( o, cat ) => ({
        ...o,
        style: {
          background: color( cat ),
          height: scale( o.count ),
        },
      }))

      pyld.name = name
      break
    }
    case 'quantitative': {
      break
    }
    default: {
      break
    }
  }

  dispatch({
    type: EntityAction.ADD_ENTITY,
    payload: pyld,
  })
}

export const initEntity = _ => ({
  type: EntityAction.INIT_ENTITY,
})
