const path = require('path')

// NOTE: __dirname represents where index.html is present, which
// is being pointed to by main.js of electron
const channel = require(path.join(__dirname, '..', 'common', 'channel.js'))
const comm = require(path.join(__dirname, 'services', 'comm.js'))
const KEYCODES = require(path.join(__dirname, 'services', 'keycode.js'))

angular.module('fexPloFE', [])
.controller('mainController', ['$http', '$scope', function($http, $scope){
    let mvm = this;
    let currentUrl = '';    //  will strictly hold current url
    mvm.url = '';           // this is the model, so might change with input url
    mvm.selectedIndices = [];   // All the selected Items in current view
    mvm.files = [];

    let isKeyDown = {}  // Will hold all the keyDown info

    /**
     * Logic for history
     * History array will store all the urls user opens
     * i. either by directly entering url in address-bar
     * ii. double-clicking / entering any folder
     * iii. use up arrow to go to parent folder
     * Each time any of these things happen, an url will be appended after
     * currentHistoryIndex and everything after that should be discarded
     * 
     * However, history object will not be edited navigates history 
     * using left and right button
     */
    mvm.history = [];
    mvm.currentHistoryIndex = -1;
    let isHistoryNav = false;   // will be tru only for history left-right buttons

    mvm.select = select
    mvm.clickedOnWhiteArea = clickedOnWhiteArea
    mvm.open = open
    mvm.goBackward = goBackward
    mvm.goForward = goForward
    mvm.goUpward = goUpward
    mvm.handleUrlKeyUp = handleUrlKeyUp

    mvm.keydown = e => isKeyDown[e.keyCode] = true
    mvm.keyup = e => isKeyDown[e.keyCode] = false

    init();

    /**
     * When Fexplo is openend
     * TODO: If opened from terminal user might pass some parameter like which folder to open
     */
    function init () {
        bindAllListeners()
        comm.send(channel.GET_HOME_CONTENT)
    }

    function bindAllListeners () {
        comm.on(channel.GET_HOME_CONTENT, (e, data) => populate(data))
        comm.on(channel.GET_DIR_CONTENT, (e, data) => populate(data))
        comm.on(channel.OPEN_URI, (e, data) => populate(data))
    }
    
    /**
     * When user double-clicks on any file/folder
     * @param {Number} i | the index of mvm.files where user has double-clicked
     */
    function open (e, i) {
        e.stopPropagation()
        let f = mvm.files[i]
        let data = {
            current: currentUrl,
            target: f.name
        }

        if(f.isDirectory) {
            comm.send(channel.GET_DIR_CONTENT, data)
        }
        else {
            comm.send(channel.OPEN_FILE, data)
        }
    }

    function openFileFolderUrl (url) {
        if(url === currentUrl) return
        comm.send(channel.OPEN_URI, { url })
    }

    /**
     * Populate the view models after receving content from server
     * For logic of history, see baove where the history variable is declared
     * @param {Object} data | The "getDirectory content" received from server
     */
    function populate(data) {
        if(!data.content || currentUrl === data.url) return
        currentUrl = data.url
        mvm.url = currentUrl
        mvm.files = data.content
        mvm.selectedIndices = []
        if(!isHistoryNav) {
            // remove everything from history after current url object
            // if currentHistoryIndex < (history.lenght-1)
            if(mvm.currentHistoryIndex < (mvm.history.length-1)) {
                mvm.history = mvm.history.slice(0, mvm.currentHistoryIndex+1)
            }
            
            mvm.history.push(data.url)
            mvm.currentHistoryIndex = mvm.history.length-1
        }
        isHistoryNav = false
        $scope.$apply()
    }

    function goBackward () {
        if(mvm.currentHistoryIndex > 0) {
            --mvm.currentHistoryIndex;
            isHistoryNav = true;
            openFileFolderUrl(mvm.history[mvm.currentHistoryIndex])
        }
        
    }

    function goForward () {
        if(mvm.currentHistoryIndex < (mvm.history.length-1)) {
            ++mvm.currentHistoryIndex;
            isHistoryNav = true;
            openFileFolderUrl(mvm.history[mvm.currentHistoryIndex])
        }
        
    }

    /**
     * Get the parent directory content
     */
    function goUpward () {
        let parentUrl = currentUrl + '/..';
        openFileFolderUrl(parentUrl)
    }

    /**
     * Catch the enter key press on url bar
     * @param {Event} e 
     */
    function handleUrlKeyUp(e) {
        // console.log(e.keyCode)
        e.stopPropagation()
        if(e.keyCode === 13) {
            let newUrl = e.target.value
            if(newUrl !== currentUrl) {
                openFileFolderUrl(newUrl)
            }
        }
    }

    function clickedOnWhiteArea (e) {
        e.stopPropagation()
        mvm.selectedIndices = []
    }

    /**
     * When user clicks on a file / folder
     * If Ctrl is pressed, then multi-select
     * Else single select
     * 
     * If Shift is pressed
     * push the entire range of last selected index to/from this index to selectedIndices
     */
    function select (e, i) {
        e.stopPropagation()

        // Check for SHIFT key
        if(isKeyDown[KEYCODES.SHIFT]) {
            // Start the shift selection range from the last selected Index
            // Let's call it firstShiftIndex
            let firstShiftIndex = mvm.selectedIndices[mvm.selectedIndices.length-1]
            
            if (firstShiftIndex === i) return
            // add the range of |thisIndex ~ firstShiftIndex| to selectedIndices
            let start = (i < firstShiftIndex) ? i : firstShiftIndex
            let end = (i > firstShiftIndex) ? i : firstShiftIndex

            while(start <= end) {
                mvm.selectedIndices.push(start)
                ++start
            }
        }

        // Check for CTRL key
        else if(isKeyDown[KEYCODES.CTRL]) {
            mvm.selectedIndices.push(i)
        } 
        else {
            mvm.selectedIndices = [i]
        }

        
    }
    
}])
