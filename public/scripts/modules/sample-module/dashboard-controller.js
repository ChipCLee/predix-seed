// jshint ignore: start
define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http', '$interval', '$scope', function($http, $interval, $scope) {

      $interval(function() {

        $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=raw&tagList=TemperatureTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=15&endTime=' + new Date().getTime()).then(function(tempSensorData) {

          var seriesDataTemp = [];
          var tempLabels = [];

          for (var i = 0; i < tempSensorData.data.tagList[0].data.length; i++) {
            var dataPoint = tempSensorData.data.tagList[0].data[i];
            seriesDataTemp.push(dataPoint.v);
          }

          tempLabels.reverse();
          seriesDataTemp.reverse();
          new Chartist.Line("#line-area2", {
              labels: tempLabels,
              series: [
                  seriesDataTemp
              ]
          });
        });

        $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=raw&tagList=LightTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=15&endTime=' + new Date().getTime()).then(function(lightSensorData) {

          var lightLabels = [];
          var seriesDataLight = [];

            for (var i = 0; i < lightSensorData.data.tagList[0].data.length; i++) {
              var dataPoint = lightSensorData.data.tagList[0].data[i];
              lightLabels.push(moment(dataPoint.ts).fromNow());
              seriesDataLight.push(dataPoint.v);
            }


            lightLabels.reverse();
            seriesDataLight.reverse();
            new Chartist.Line("#line-area", {
                labels: lightLabels,
                series: [
                    seriesDataLight
                ]
            });

            $scope.loaded = true;

          });


      }, 5000);

    }]);
});
