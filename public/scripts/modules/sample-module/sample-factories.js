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
                    return JSON.parse(data);
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        $injector.get('$state').go('oops');
                    }
                }
            },
            get: {
              url: '/api/asset-service/?components=FULL&type=:type&sourceKey=:id',
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
              url: '/api/asset-service/:id',
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
                url: '/api/asset-service/:id',
                method: 'PATCH',
                isArray: true,
                transformRequest: function (data) {
                    data.updatedAt = Date.now();
                    var objectKeys = Object.keys(data);
                    var patchArray = [];
                    console.log(data, objectKeys);
                    for (var i = 0; i < objectKeys.length; i++) {

                      var property = objectKeys[i];

                      var toPush = {
                        'op' : 'add',
                      };

                      if(property === 'name' || property === 'description') {

                        toPush.path = '/' + property;

                        if(data[property] === undefined) {

                          toPush.value = '';

                        } else {

                          toPush.value = data[property];
                        }

                      }
                      else {
                        toPush.path = '/attributes/' + property;
                        if(data[property] === undefined) {

                          toPush.value = {
                            'type' : 'string',
                            'value' : [ '' ]
                          };

                        } else {

                          toPush.value = {
                            'type' : 'string',
                            'value' : [ data[property] ]
                          };
                        }

                      }
                      patchArray.push(toPush);
                    }
                    data = patchArray;
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
