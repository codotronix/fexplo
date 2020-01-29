import * as ActionTypes from '../actionTypes'

const initState = {
    url: "",
    ffList: []
}

const fileManagerReducer = (state=initState, action) => {
    switch(action.type) {
        case ActionTypes.URL_UPDATE: {
            return {
                ...state,
                url: action.payload
            }
        }
        case ActionTypes.FF_LIST_UPDATE: {
            return {
                ...state,
                ffList: action.payload
            }
        }
        case ActionTypes.FF_UPDATE: {
            return action.payload
        }
        default:
            return state
    }
}

export default fileManagerReducer