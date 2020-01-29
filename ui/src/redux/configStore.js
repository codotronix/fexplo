import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import fileManagerReducer from './reducers/fileManagerReducer'

const rootReducer = combineReducers({
    fmr: fileManagerReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store

