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


    controllers.controller('SolarpanelUpdateCtrl', ['$scope', '$log', 'entry', 'resource', function ($scope, $log, entry, resource) {
        $scope.data = entry;

        $scope.save = function() {
            if(!$scope.form.$invalid) {
                var updateData = {
                  name: $scope.data.name,
                  description: $scope.data.description,
                  attributes: $scope.data.attributes
                };
                resource.solarpanel.update({id: $scope.data.id}, updateData, function() {
                  toastr.options = { closeButton: true, showMethod: 'fadeIn', hideMethod: 'fadeOut', timeOut: '3200' };
                  toastr.success('Successfully updated ' + $scope.data.name);
                });
            }
        };

    }]);

    controllers.controller('SolarpanelCreateCtrl', ['$scope', '$log', 'entry', '$state', 'Resource', 'PredixTransformService', function ($scope, $log, entry, $state, resource, PredixTransformService) {
        $scope.data = entry;
        $scope.data.uri = '/asset/solarpanel/' + PredixTransformService.generateUUID();

        $scope.save = function() {
            if(!$scope.form.$invalid) {
                $scope.data.$save(function() {
                    $state.go('solarpanel_list', {}, { reload: true });
                    //successToast.show({text: 'Entry creation successful'});
                });
            }
        };

    }]);



});
