// jshint ignore: start
define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http', '$interval', function($http, $interval) {

      $interval(function() {
        $http.get('/api/timeseries-service?direction=backward&useOnlyGoodData=true&operation=raw&tagList=LightTAE&startTime=' + (new Date().getTime() - (1000 * 3600)) + '&sampleCount=15&endTime=' + new Date().getTime()).then(function(lightSensorData) {
            var lightLabels = [];
            var seriesData = [];
            for (var i = 0; i < lightSensorData.data.tagList[0].data.length; i++) {
              var dataPoint = lightSensorData.data.tagList[0].data[i];
              // var timeago = timeago();
              //timeago.format(dataPoint.ts);
              lightLabels.push(moment(dataPoint.ts).fromNow());
              seriesData.push(dataPoint.v);
            }
            lightLabels.reverse();
            seriesData.reverse();
            new Chartist.Line("#line-area", {
                labels: lightLabels,
                series: [
                    seriesData
                ]
            });

          });
      }, 5000);

    }]);
});
