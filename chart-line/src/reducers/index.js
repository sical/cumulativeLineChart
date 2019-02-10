import { combineReducers } from 'redux'

import dataset from './dataset'
import data from './data'
import line from './line'
import scale from './scale'
import entity from './entity'
import tick from './tick'

export const rootReducer = combineReducers({
  dataset,
  data,
  line,
  scale,
  entity,
  tick,
})
