import { combineReducers } from 'redux'

import dataset from './dataset'
import data from './data'

export const rootReducer = combineReducers({ dataset, data })
