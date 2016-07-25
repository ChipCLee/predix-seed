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
              url: '/api/asset-service',
                method: 'POST',
                isArray: true,
                transformRequest: function (data) {
                    data.createdAt = Date.now();
                    data.updatedAt = Date.now();
                    var objectKeys = Object.keys(data.attributes);
                    var patchArray = {};

                    if(data.name !== undefined) {
                      patchArray.name = data.name;
                    }

                    if(data.sourceKey !== undefined) {
                      patchArray.sourceKey = data.sourceKey;
                    }

                    if(data.sourceKey !== undefined) {
                      patchArray.type = data.type;
                    }

                    if(data.description !== undefined) {
                      patchArray.description = data.description;
                    }

                    for (var i = 0; i < objectKeys.length; i++) {

                      var property = objectKeys[i];
                      var attributes = {};

                      attributes[property] = {};
                      attributes[property].value = [ data.attributes[property].value[0] ];

                      patchArray.attributes = attributes;
                    }

                    data = patchArray;

                    return angular.toJson([data]);
                },
                interceptor: {
                    responseError: function(e) {
                        console.warn('Problem making request to backend: ', e);
                        //$injector.get('$state').go('oops');
                    }
                }
            },
            update: {
                url: '/api/asset-service/:id',
                method: 'PATCH',
                isArray: true,
                transformRequest: function (data) {

                    data.updatedAt = Date.now();
                    var objectKeys = Object.keys(data.attributes);
                    var patchArray = [];

                    if(data.name !== undefined) {
                      patchArray.push({
                        'op': 'add',
                        'path': '/name',
                        'value': data.name
                      });
                    }

                    if(data.description !== undefined) {
                      patchArray.push({
                        'op': 'add',
                        'path': '/description',
                        'value': data.description
                      });
                    }

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
                        if(data.attributes[property] === undefined) {

                          toPush.value = {
                            'type' : 'string',
                            'value' : [ '' ]
                          };

                        } else {

                          toPush.value = {
                            'type' : 'string',
                            'value' : [ data.attributes[property].value[0] ]
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
