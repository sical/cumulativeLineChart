import { initLines } from './line'
import { initAxisScale, addAxis } from './scale'
import { initEntity } from './entity'

export const DataAction = {
  SELECT_DATASET: 'SELECT_DATASET',
}

export const selectAttribute = payload => {}

export const selectDataset = payload => ( dispatch, getState ) => {
  dispatch({
    type: DataAction.SELECT_DATASET,
    payload,
  })

  dispatch( initAxisScale( payload.state ))

  dispatch( initLines())
  dispatch( initEntity())
  dispatch( addAxis())
}
