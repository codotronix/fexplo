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
    mvm.editableIndex = null // The index which is currently editable for renaming

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
    mvm.markEditableForRename = markEditableForRename
    mvm.clickedOnWhiteArea = clickedOnWhiteArea
    mvm.open = open
    mvm.goBackward = goBackward
    mvm.goForward = goForward
    mvm.goUpward = goUpward
    mvm.handleUrlKeyUp = handleUrlKeyUp
    mvm.enterToRename = enterToRename
    mvm.stopPropagation = e => e.stopPropagation()  // A generic stop propagation function

    mvm.keydown = e => isKeyDown[e.keyCode] = true
    mvm.keyup = e => {
        isKeyDown[e.keyCode] = false
        
        // Is 'ENTER' keyup ?
        if(e.keyCode === KEYCODES.ENTER) {
            enterFileFolder()
        }

        //Is 'BACKSPACE' keyup
        if(e.keyCode === KEYCODES.BACKSPACE) {
            goBackward()
        }

        console.log(e.keyCode)
    }

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
        e && e.stopPropagation()
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

        // Check if any renaming was in progress
        doRename()
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

        // Was any rename in Progress
        doRename()
    }

    /**
     * When ENTER key is pressed, check how many items are selected
     * IF Single, try to Open it
     * IF Multiple, show warning as this might be done accidentally 
     * and might clog the processor and hang everything
     */
    function enterFileFolder () {
        if(mvm.selectedIndices.length === 1) {
            open(null, mvm.selectedIndices[0])
        }
        else if (mvm.selectedIndices.length > 1) {
            console.log("WARNING: Multiple Selected... Select 1 and try again ...")
        }
    }

    /**
     * Mark the specified item as Editable
     */
    function markEditableForRename (e, i) {
        e.stopPropagation()
        // console.log('Edit at item index = ', i)
        mvm.editableIndex = i
    }

    /**
     * When the focus goes out of the renaming-input field,
     * Then retrieve the value, do validation, and if all goes well,
     * Do the Rename
     * Finally reset the mvm.editableIndex 
     */
    function doRename () {
        if(mvm.editableIndex === null) return

        let i = mvm.editableIndex
        mvm.editableIndex = null // to come out of the Editable state
        let newName = document.querySelectorAll('.ffbox .rename-txt')[i].value.trim()
        let oldName = mvm.files[i].name

        if(!newName || (newName === oldName)) return

        console.log(i, 'th index to be renamed to = ', newName)
        
        // Finally Cleanup / Reset
        
    }

    /**
     * If user clicks ENTER in an editable/rename field,
     * Detect and Respond accordingly
     */
    function enterToRename (e) {
        e.stopPropagation()

        if(e.keyCode === KEYCODES.ENTER) {
            doRename()
        }
    }

    
}])
