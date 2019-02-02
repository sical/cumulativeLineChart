import { combineReducers } from 'redux'

import dataset from './dataset'
import data from './data'
import line from './line'
import scale from './scale'

export const rootReducer = combineReducers({ dataset, data, line, scale })
