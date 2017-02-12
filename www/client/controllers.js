'use strict';

angular.module('app.controllers', [])

    // Path: /
    .controller('homeController', ['$scope', '$filter', '$http', '$window', 'searchSvc', 'getSvc', 'getCategoriesSvc', 'saveRecipeSvc', function ($scope, $filter, $http, $window, searchSvc, getSvc, getCategoriesSvc,  saveRecipeSvc) {
        $scope.$root.title = 'Recipes';

        $scope.showSuccess = false;
        $scope.showFailure = false;
        $scope.alertMessage = '';

        $scope.searchText = '';
        $scope.recipes = [];
        $scope.error = null;
        $scope.currentRecipe = null;

        $scope.accessLevel = null;
        $scope.userPicture = null;
        $scope.userName = null;
        $scope.loginState = 'unknown';


        $scope.$watch('searchText', function () {
            $scope.error = null;
            doSearch();
        });

        function doSearch() {
            $scope.error = null;
            if ($scope.searchText) {
                searchSvc.async($scope.searchText).then(
                    function (data) {
                        $scope.recipes = data;
                    },
                    function (error) {
                        $scope.recipes = [];
                        $scope.error = error;
                    });
            }
        }

        $scope.login = function(googleToken) {
            var payload = { idToken: googleToken };
            $scope.error = null;
            $http.post('/api/auth', payload)
                .success(function(result) {
                    $scope.loginState = 'loggedIn';
                    $window.sessionStorage.token = result.authToken;
                    $scope.userName = result.fullName;
                    $scope.userPicture = result.picture;
                    if(result.isAdmin) {
                        $scope.accessLevel = "Read/Write";
                    } else {
                        $scope.accessLevel = "Read Only";
                    }
                });
        }

        $scope.logout = function() {
            $scope.loginState = 'loggedOut';
            $scope.error = null;
            $scope.accessLevel = null;
            $scope.userName = null;
            $scope.userPicture = null;
            $window.sessionStorage.token = null;
            $scope.$apply();
        }

        $scope.addNew = function () {
            $scope.error = null;
            $scope.currentRecipe = {
                "Id": 0,
                "Name": "",
                "CategoryName": "",
                "Source": "",
                "Description": "",
                "Instructions": "",
                "Ingredients": [],
                "Visible": true
            };
            $scope.recipeForm.$show();
        };

        $scope.getRecipe = function (id) {
            $scope.error = null;
            getSvc.async(id).then(
            function (data) {
                $scope.currentRecipe = data;
            },
            function (error) {
                $scope.currentRecipe = null;
                $scope.error = error;
            });
        };

        $scope.saveRecipe = function() {
            $scope.error = null;
            for (let i = $scope.currentRecipe.Ingredients.length; i--;) {
                let r = $scope.currentRecipe.Ingredients[i];
                if (r.isDeleted) {
                    $scope.currentRecipe.Ingredients.splice(i, 1);
                }
            };
            saveRecipeSvc.async($scope.currentRecipe).then(
                function(data) {
                    $scope.showSuccess = true;
                    $scope.showFailure = false;
                    $scope.alertMessage = 'Saved!';
                    doSearch();
                },
                function(error) {
                    $scope.showSuccess = false;
                    $scope.showFailure = true;
                    $scope.error = error;
                    $scope.alertMessage = 'Error saving recipe: ' + data.Name;
                }
            )
        };

        $scope.categories = [];
        $scope.loadCategories = function() {
            $scope.error = null;
            return getCategoriesSvc.async().then(
                function(data) {
                    $scope.categories = data;
                },
                function(error) {
                    $scope.currentRecipe = null;
                    $scope.error = error;
                }
            )
        };

        // add ingredient
        $scope.addIngredient = function() {
            $scope.currentRecipe.Ingredients.push({
                Name: '',
                Amount: '',
                isNew: true
            });
        };

        $scope.deleteIngredient = function(name) {
            var filtered = $filter('filter')($scope.currentRecipe.Ingredients, {Name: name});
            if (filtered.length) {
                filtered[0].isDeleted = true;
            }
        };

        $scope.filterIngredient = function(ingredient) {
            return ingredient.isDeleted != true;
        };

        // cancel all changes
        $scope.cancel = function() {
            for (let i = $scope.currentRecipe.Ingredients.length; i--;) {
                let r = $scope.currentRecipe.Ingredients[i];
                // undelete
                if (r.isDeleted) {
                    delete r.isDeleted;
                }
                // remove new
                if (r.isNew) {
                    $scope.currentRecipe.Ingredients.splice(i, 1);
                }
            };
        };
    }]);