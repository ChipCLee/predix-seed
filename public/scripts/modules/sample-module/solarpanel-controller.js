define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    controllers.controller('SolarpanelListCtrl', ['$scope', '$log', 'entries', 'resource', function ($scope, $log, entries, resource) {

        $scope.data = entries;

        $scope.delete = function(item) {
            item.$delete({id: item.id}, function() {
                resource.solarpanel.query(function(data) {
                    $scope.data = data;
                });
            });
        };

    }]);
});
