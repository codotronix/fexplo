import * as ActionTypes from '../actionTypes'

const initState = {
    url: "",            // current url shown in topNav
    urlHistory: [],     // Array of all the urls visited in this session
    urlIndex: -1,       // Which index in history is current url
    ffList: []          // list of Files and Folders
}

const fileManagerReducer = (state=initState, action) => {
    switch(action.type) {
        /**
         * ADD_NEW_URL_FFLIST should do the following
         * 1. add new url in history
         * 2. increment index
         * 3. update the ffList with new list
         */
        case ActionTypes.ADD_NEW_URL_FFLIST: {
            const { url, ffList } = action.payload
            return {
                url,
                ffList,
                urlHistory: [...state.urlHistory, url],
                urlIndex: state.urlIndex + 1
            }
        }

        /**
         * This is to update the ffList only
         * This operation will be followed by either of
         * Forward or Backward
         */
        case ActionTypes.UPDATE_FFLIST_ONLY: {
            const { ffList } = action.payload
            return {
                ...state,
                ffList
            }
        }

        /**
         * GO_FORWARD should do the following
         * Increase the urlIndex by 1 (if possible)
         * Update the url
         */
        case ActionTypes.GO_FORWARD: {
            if (state.urlIndex < (state.urlHistory.length - 1)) {
                const urlIndex = state.urlIndex + 1
                return {
                    ...state,
                    urlIndex,
                    url: state.urlHistory[urlIndex]
                }
            }
            return state
        }

        /**
         * GO_BACKWARD should do the following
         * Decrease the urlIndex by 1 (if possible)
         * Update the url
         */
        case ActionTypes.GO_BACKWARD: {
            if (state.urlIndex > 0) {
                const urlIndex = state.urlIndex - 1
                return {
                    ...state,
                    urlIndex,
                    url: state.urlHistory[urlIndex]
                }
            }
            return state
        }

        default:
            return state
    }
}

export default fileManagerReducer