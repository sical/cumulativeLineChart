import { get, sortBy } from 'lodash'
import { DataAction } from '../actions/data'

const data = (
  state = {
    data: [],
    attrs: [],
    id: '',
    meta: {},
  },
  action
) => {
  switch ( action.type ) {
    case DataAction.SELECT_DATASET: {
      const { datasetById, id } = action.payload
      const {
        data,
        attrs,
        meta: { xDefaultKey, yDefaultKey, id: keyId, date },
      } = datasetById[id]

      //DefaultKey = 'time'
      const xAttr = get( attrs, xDefaultKey )
      const yAttr = get( attrs, yDefaultKey )

      const xType = get( xAttr, 'type' )
      const yType = get( yAttr, 'type' )

      const xKey = get( xAttr, 'cumulative', xDefaultKey )
      const yKey = get( yAttr, 'cumulative', yDefaultKey )

      const sortedData = sortBy( data, [ yKey ])
      const colors = [
        '#00c6d0',
        '#eb007c',
        '#00c367',
        '#7335ba',
        '#56aa04',
        '#a00095',
        '#b3d167',
        '#fd55cc',
        '#9f9400',
        '#005bb7',
        '#786c00',
        '#c9a5ff',
        '#3d5b0c',
        '#ff568c',
        '#43dbcc',
        '#9a2920',
        '#30d4ff',
        '#8c5400',
        '#0182d1',
        '#ff9567',
        '#01a1ad',
        '#ff94a1',
        '#80d8ac',
        '#8a354f',
        '#b9cf84',
        '#534c81',
        '#ffabee',
        '#8b4f41',
        '#7681b6',
        '#d6a9d9',
      ]

      return {
        ...state,
        id,
        data: sortedData,
        xDefaultKey,
        yDefaultKey,
        attrs,
        date,
        keyId,
        xType,
        yType,
        xKey,
        yKey,
        colors,
      }
    }
    default:
      return state
  }
}

export default data
