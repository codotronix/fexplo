angular.module('fexPloFE', [])
.controller('mainController', ['$http', function($http){
    let mvm = this
    mvm.url = ''
    mvm.files = []

    $http.get('/get-home-content')
    .then(res => {
        // console.log(res.data)
        mvm.url = res.data.url
        mvm.files = res.data.content
    })
}])
