import { from, of, forkJoin } from 'rxjs'
import { mergeMap, toArray } from 'rxjs/operators'
import { json, dsv } from 'd3'
import { flow, first, groupBy, mapValues, pickBy } from 'lodash/fp'
import { each, keys } from 'lodash'

const API_URL =
  'https://raw.githubusercontent.com/ezzaouia/cumulativeData/master/'

export const DatasetAction = {
  FETCH_DATA: 'FETCH_DATA',
  REQ_FETCH_DATA: 'REQ_FETCH_DATA',
  FETCH_DATA_SUCCESS: 'FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE: 'FETCH_DATA_FAILURE',
}

const url = ( name, ext ) => `${API_URL}${name}/${name}-data.${ext}`

const castAttrs = ( attrs, d ) => {
  each( keys( attrs ), key => {
    d[key] = +d[key]
    d[attrs[key].cumulative] = +d[attrs[key].cumulative]
  })
  return d
}
export const fetchData = payload => ( dispatch, getState ) => {
  dispatch( reqFetchData())

  const datasets = [ 'foot', 'learning' ]
  const source$ = from( datasets ).pipe(
    mergeMap( name => forkJoin( of( name ), json( url( name, 'json' )))),
    mergeMap(([ name, json ]) => {
      const attrs = flow(
        groupBy( 'name' ),
        mapValues( first )
      )( json.attributes )
      const quantiAttrs = pickBy( d => d.type === 'quantitative' )( attrs )

      return forkJoin(
        of( json ),
        of( attrs ),
        dsv( json.separator, url( name, 'csv' ), castAttrs.bind( null, quantiAttrs ))
      )
    }),
    mergeMap(([ json, attrs, csv ]) => {
      return of({ key: json.name, data: csv, attrs, meta: json.meta })
    }),
    toArray()
  )

  source$.subscribe( data => dispatch( fetchDataSuccess( data )))
}
export const reqFetchData = _ => ({ type: DatasetAction.REQ_FETCH_DATA })
export const fetchDataSuccess = payload => ({
  type: DatasetAction.FETCH_DATA_SUCCESS,
  payload,
})
export const fetchDataFailure = _ => ({
  type: DatasetAction.FETCH_DATA_FAILURE,
})
