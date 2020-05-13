angular.module('fexPloFE', [])
.controller('mainController', ['$http', function($http){
    let mvm = this;
    mvm.url = '';
    mvm.selectedIndex = '';
    mvm.files = [];

    mvm.select = i => mvm.selectedIndex = i;
    mvm.open = open;
    init();

    function init () {
        $http.get('/get-home-content')
        .then(res => populate(res.data))
        .catch(err => console.log(err))
    }
    
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

    function populate(data) {
        mvm.url = data.url
        mvm.files = data.content
        mvm.selectedIndex = ''
    }

    
}])
