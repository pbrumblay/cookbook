'use strict';

var app = angular.module('app', ['app.services', 'app.controllers', 'xeditable']);
app.run(function(editableOptions) {
   editableOptions.theme='bs3';
});