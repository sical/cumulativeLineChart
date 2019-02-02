import { combineReducers } from 'redux'

import dataset from './dataset'
import data from './data'
import line from './line'

export const rootReducer = combineReducers({ dataset, data, line })
