import { initLines } from './line'

export const DataAction = {
  SELECT_DATASET: 'SELECT_DATASET',
}

export const selectDataset = payload => ( dispatch, getState ) => {
  dispatch( initLines( payload ))

  return {
    type: DataAction.SELECT_DATASET,
    payload,
  }
}
