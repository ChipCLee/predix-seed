define(['angular', './sample-module', './predix-transform-service'], function(angular, module) {
    'use strict';

    module.factory('apiResource', ['$resource', 'PredixTransformService', '$injector', function($resource, PredixTransformService, $injector) {

        var predixBaseConfiguration = {
            id: '@id',
            type: '@type',
            search: {
                isArray: true,
                transformResponse: function (data) {
                    return PredixTransformService.appendPredixUUIDAsID(JSON.parse(data));
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            query: {
                url: '/api/asset-service/?components=FULL&type=:type',
                isArray: true,
                transformResponse: function (data) {
                    return PredixTransformService.appendPredixUUIDAsID(JSON.parse(data));
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            get: {
                transformResponse: function (data) {
                    return PredixTransformService.appendPredixUUIDAsID(JSON.parse(data))[0];
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            save: {
                method: 'POST',
                isArray: true,
                transformRequest: function (data) {
                    data.createdAt = Date.now();
                    data.updatedAt = Date.now();
                    return angular.toJson([data]);
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            update: {
                method: 'PUT',
                isArray: true,
                transformRequest: function (data) {
                    data.updatedAt = Date.now();
                    data = PredixTransformService.appendPredixUUIDAsID([data]);
                    return angular.toJson(data);
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            delete: {
                method: 'DELETE',
                isArray: false,
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }

            }
        };


        var solarpanelResource = $resource('/api/asset-service/', {}, predixBaseConfiguration);

        return {
            solarpanel: solarpanelResource,
        };

    }]);

});
