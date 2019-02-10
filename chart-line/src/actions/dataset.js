import { from, of, forkJoin } from 'rxjs'
import { mergeMap, toArray } from 'rxjs/operators'
import { json, dsv, timeParse } from 'd3'
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

const castAttrs = ( quatattrs, attrs, meta, d ) => {
  each( keys( quatattrs ), key => {
    d[key] = +d[key]
    d[quatattrs[key].cumulative] = +d[quatattrs[key].cumulative]
    d.dateObj = +timeParse( attrs[meta.date].pattern )( d[meta.date])
  })
  return d
}
export const fetchData = payload => ( dispatch, getState ) => {
  dispatch( reqFetchData())

  const datasets = [
    'foot/foot-data.json',
    'learning/learning-data.json',
    'visits/visits-data.json',
    'population/population-data.json',
  ]
  const source$ = from( datasets /*json( `${API_URL}datasets.json` )*/ ).pipe(
    // mergeMap( datasetsArray => datasetsArray ),
    mergeMap( datasetName => json( `${API_URL}${datasetName}` )),
    mergeMap( datasetSpec => {
      const attrs = flow(
        groupBy( 'name' ),
        mapValues( first )
      )( datasetSpec.attributes )
      const quantiAttrs = pickBy( d => d.type === 'quantitative' )( attrs )

      const { separator, file } = datasetSpec

      return forkJoin(
        of( datasetSpec ),
        of( attrs ),
        dsv(
          separator,
          `${API_URL}${file}`,
          castAttrs.bind( null, quantiAttrs, attrs, datasetSpec.meta )
        )
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
