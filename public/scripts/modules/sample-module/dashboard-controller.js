// jshint ignore: start
define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http', '$interval', '$scope', function($http, $interval, $scope) {

      $interval(function() {
        var lightLabels = [];
        var seriesDataLight = [];
        var seriesDataTemp = [];

        $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=raw&tagList=TemperatureTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=15&endTime=' + new Date().getTime()).then(function(tempSensorData) {
          for (var i = 0; i < tempSensorData.data.tagList[0].data.length; i++) {
            var dataPoint = tempSensorData.data.tagList[0].data[i];
            seriesDataTemp.push(dataPoint.v);
          }


          $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=raw&tagList=LightTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=15&endTime=' + new Date().getTime()).then(function(lightSensorData) {
              for (var i = 0; i < lightSensorData.data.tagList[0].data.length; i++) {
                var dataPoint = lightSensorData.data.tagList[0].data[i];
                lightLabels.push(moment(dataPoint.ts).fromNow());
                seriesDataLight.push(dataPoint.v);
              }


              lightLabels.reverse();
              seriesData.reverse();
              new Chartist.Line("#line-area", {
                  labels: lightLabels,
                  series: [
                      seriesData
                  ]
              });

              $scope.loaded = true;

            });

          });
      }, 5000);

    }]);
});
