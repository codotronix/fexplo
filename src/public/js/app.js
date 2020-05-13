angular.module('fexPloFE', [])
.controller('mainController', ['$http', function($http){
    let mvm = this;
    mvm.url = '';
    mvm.selectedIndex = '';
    mvm.files = [];

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

    mvm.select = i => mvm.selectedIndex = i;
    mvm.open = open;
    mvm.goPrev = goPrev;
    mvm.goForward = goForward;
    init();

    /**
     * When Fexplo is openend
     * TODO: If opened from terminal user might pass some parameter like which folder to open
     */
    function init () {
        $http.get('/get-home-content')
        .then(res => populate(res.data))
        .catch(err => console.log(err))
    }
    
    /**
     * When user double-clicks on any file/folder
     * @param {Number} i | the index of mvm.files where user has double-clicked
     */
    function open (i) {
        let f = mvm.files[i]
        let data = {
            current: mvm.url,
            target: f.name
        }

        if(f.isDirectory) {
            $http.post('/get-dir-content', data)
            .then(res => populate(res.data))
            .catch(err => console.log(err))
        }
        else {
            $http.post('/open-file', data)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
        }
    }

    function openFileFolderUrl (url) {
        $http.post('/open-url', { url })
        .then(res => populate(res.data))
        .catch(err => console.log(err))
    }

    /**
     * Populate the view models after receving content from server
     * For logic of history, see baove where the history variable is declared
     * @param {Object} data | The "getDirectory content" received from server
     */
    function populate(data) {
        if(!data.content) return
        mvm.url = data.url
        mvm.files = data.content
        mvm.selectedIndex = ''
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
    }

    function goPrev () {
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
    
}])
