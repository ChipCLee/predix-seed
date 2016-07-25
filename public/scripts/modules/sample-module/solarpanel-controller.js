define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    controllers.controller('SolarpanelListCtrl', ['$scope', 'entries', function ($scope, entries) {

        $scope.data = entries;
        console.log(entries);

    }]);
});
