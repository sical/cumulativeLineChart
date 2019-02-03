import { timeParse } from 'lodash'
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
      let {
        data,
        attrs,
        meta: { xDefaultKey, yDefaultKey, id: keyId, date },
      } = datasetById[id]

      xDefaultKey = 'date'
      keyId = 'userId'
      //DefaultKey = 'time'
      const xAttr = get( attrs, xDefaultKey )
      const yAttr = get( attrs, yDefaultKey )

      const xType = get( xAttr, 'type' )
      const yType = get( yAttr, 'type' )

      const xKey = get( xAttr, 'cumulative', xDefaultKey )
      const yKey = get( yAttr, 'cumulative', yDefaultKey )

      const sortedData = sortBy( data, [ yKey ])

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
      }
    }
    default:
      return state
  }
}

export default data
