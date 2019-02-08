import { from, of, forkJoin } from 'rxjs'
import { mergeMap, toArray } from 'rxjs/operators'
import { json, dsv } from 'd3'
import { flow, first, groupBy, mapValues, pickBy } from 'lodash/fp'
import { each, keys } from 'lodash'

const API_URL =
  'https://raw.githubusercontent.com/sical/cumulativeLineChart/master/data/'

export const DatasetAction = {
  FETCH_DATA: 'FETCH_DATA',
  REQ_FETCH_DATA: 'REQ_FETCH_DATA',
  FETCH_DATA_SUCCESS: 'FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE: 'FETCH_DATA_FAILURE',
}

const castAttrs = ( attrs, d ) => {
  each( keys( attrs ), key => {
    d[key] = +d[key]
    d[attrs[key].cumulative] = +d[attrs[key].cumulative]
  })
  return d
}
export const fetchData = payload => ( dispatch, getState ) => {
  dispatch( reqFetchData())

  const source$ = from( json( `${API_URL}datasets.json` )).pipe(
    mergeMap( datasetsArray => datasetsArray ),
    mergeMap( datasetName => json( `${API_URL}${datasetName}` )),
    mergeMap( datasetSpec => {
      console.log( 'datasetSpec', datasetSpec )
      const attrs = flow(
        groupBy( 'name' ),
        mapValues( first )
      )( datasetSpec.attributes )
      const quantiAttrs = pickBy( d => d.type === 'quantitative' )( attrs )

      const { separator, file } = datasetSpec

      console.log( 'dksjfdjg', separator, file )
      return forkJoin(
        of( datasetSpec ),
        of( attrs ),
        dsv( separator, `${API_URL}${file}`, castAttrs.bind( null, quantiAttrs ))
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
