export const DataAction = {
  SELECT_DATASET: 'SELECT_DATASET',
}

export const selectDataset = payload => ({
  type: DataAction.SELECT_DATASET,
  payload,
})
