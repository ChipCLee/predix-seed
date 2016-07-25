define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    controllers.controller('AssetCtrl', ['$scope', 'entries', function ($scope, entries) {

        $scope.data = entries;

    }]);
});
