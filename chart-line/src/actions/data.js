import { initLines } from './line'
import { initDots } from './dot'

export const DataAction = {
  SELECT_DATASET: 'SELECT_DATASET',
}

export const selectDataset = payload => ( dispatch, getState ) => {
  dispatch( initLines( payload ))
  dispatch( initDots( payload ))

  dispatch({
    type: DataAction.SELECT_DATASET,
    payload,
  })
}
