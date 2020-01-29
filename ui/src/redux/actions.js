import * as ActionTypes from './actionTypes'
import * as FM from '../service/FileManager'

export const initStateToHome = () => {
    return dispatch => {
        const url = FM.getHomePath()
        const ffList = FM.getDirContent(url)
        dispatch({
            type: ActionTypes.FF_UPDATE,
            payload: { url, ffList }
        })
    }
}