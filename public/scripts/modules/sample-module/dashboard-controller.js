// jshint ignore: start
define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http', function($http) {

      $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=interpolated&tagList=LightTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=30&endTime=' + new Date().getTime()).then(function(lightSensorData) {
        console.log(lightSensorData);
        var lightLabels = [];
        var seriesData = [];
        for (var i = 0; i < lightSensorData.data.tagList[0].data.length; i++) {
          var dataPoint = lightSensorData.data.tagList[0].data[i];
          lightLabels.push(dataPoint.ts);
          seriesData.push(dataPoint.v);
        }
        new Chartist.Line("#line-area", {
            labels: lightLabels,
            series: [
                seriesData
            ]
        });

      });

    }]);
});
