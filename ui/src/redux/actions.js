import * as ActionTypes from './actionTypes'
import * as FM from '../service/FileManager'

export const initStateToHome = () => {
    return dispatch => {
        const url = FM.getHomePath()
        const ffList = FM.getDirContent(url)
        dispatch({
            type: ActionTypes.ADD_NEW_URL_FFLIST,
            payload: { url, ffList }
        })
    }
}

export const actionOpenFolder = folderName => {
    return (dispatch, getState) => {
        const currentUrl = getState().fmr.url
        const url = FM.joinPath(currentUrl, folderName)
        const ffList = FM.getDirContent(url)
        dispatch({
            type: ActionTypes.ADD_NEW_URL_FFLIST,
            payload: { url, ffList }
        })
    }
}

export const actionGoForward = () => {
    return (dispatch, getState) => {
        const prevUrl = getState().fmr.url
        dispatch({type: ActionTypes.GO_FORWARD})
        const newUrl = getState().fmr.url
        if(prevUrl !== newUrl) {
            const ffList = FM.getDirContent(newUrl)
            dispatch({
                type: ActionTypes.UPDATE_FFLIST_ONLY,
                payload: { ffList }
            })
        }
    }
}

export const actionGoBackward = () => {
    return (dispatch, getState) => {
        const prevUrl = getState().fmr.url
        dispatch({type: ActionTypes.GO_BACKWARD})
        const newUrl = getState().fmr.url
        if(prevUrl !== newUrl) {
            const ffList = FM.getDirContent(newUrl)
            dispatch({
                type: ActionTypes.UPDATE_FFLIST_ONLY,
                payload: { ffList }
            })
        }
    }
}