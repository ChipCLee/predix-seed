/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function ($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                            deferred.resolve(userInfo);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })
            .state('dashboards', {
                parent: 'secure',
                url: '/dashboards',
                templateUrl: 'views/dashboards.html',
                controller: 'DashboardsCtrl'
            })
            .state('solarpanel_list', {
                parent: 'secure',
                url: '/asset/solarpanel',
                templateUrl: 'views/asset/solarpanel/list.html',
                controller: 'SolarpanelListCtrl',
                resolve: {
                    resource: 'apiResource',
                    entries: ['apiResource', function(resource){
                        return resource.solarpanel.query({type: '153961f4-9e25-49eb-83ca-fa89dab1cceb'}).$promise;
                    }]
                }
            })
            .state('solarpanel_update', {
                parent: 'secure',
                url: '/asset/solarpanel/{id}/update',
                templateUrl: 'views/asset/solarpanel/form.html',
                controller: 'SolarpanelUpdateCtrl',
                resolve: {
                    resource: 'apiResource',
                    entry: ['apiResource', '$stateParams', function(resource, $stateParams){
                        return resource.solarpanel.get({id: $stateParams.id, type: '153961f4-9e25-49eb-83ca-fa89dab1cceb'}).$promise;
                    }]
                }
            })
            .state('solarpanel_create', {
                parent: 'secure',
                url: '/asset/solarpanel/create',
                templateUrl: 'views/asset/solarpanel/form.html',
                controller: 'SolarpanelCreateCtrl',
                resolve: {
                    Resource: 'apiResource',
                    entry: ['apiResource', function(Resource){
                        return new Resource.solarpanel();
                    }]
                }
            })
            .state('blankpage', {
                url: '/blankpage',
                templateUrl: 'views/blank-page.html'
            })
            .state('blanksubpage', {
                url: '/blanksubpage',
                templateUrl: 'views/blank-sub-page.html'
            });


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            //document.querySelector('px-app-nav').markSelected('/dashboards');
            console.log('Cant find the state, redirecting to dashboard');
            $state.go('dashboards');
        });

    }]);
});
