'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', [])
.factory('searchSvc', ['$http', function ($http) {
    var svc = {
        async: function (search) {
            var promise = $http.get('/api/recipes?searchText=' + search).then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            });
            return promise;
        }
    };
    return svc;
}])
.factory('getSvc', ['$http', function ($http) {
    var svc = {
        async: function (id) {
            var promise = $http.get('/api/recipes/' + id).then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            });
            return promise;
        }
    };
    return svc;
}])
.factory('getCategoriesSvc', ['$http', function($http) {
    var svc = {
        async: function () {
            var promise = $http.get('/api/categories').then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            });
            return promise;
        }
    };
    return svc;
}])
.factory('saveRecipeSvc', ['$http', function($http) {
    var svc = {
        async: function (recipe) {
            if(recipe) {
                var promise;
                if(recipe.Id) {
                    promise = $http.put('/api/recipes/' + recipe.Id, recipe);
                } else {
                    promise = $http.post('/api/recipes', recipe);
                }
                return promise;
            }
        }
    };
    return svc;
}])
;
