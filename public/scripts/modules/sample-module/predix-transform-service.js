define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    module.factory('PredixTransformService', ['rfc4122', function(rfc4122) {

        var appendPredixUUIDAsID = function(entities) {
            var result = [];
            for (var i = 0; i < entities.length; i++) {
                
                var entity = entities[i];
                var splitUri = entity.uri.split('/');
                var entityUuid = splitUri.pop();

                if (entityUuid !== undefined){
                    entity.id = entityUuid;
                }

                result.push(entity);
            }

            return result;
        };

        var generateAndAppendPredixURI = function(entity, prepend) {
            entity.uri = '/' + prepend + '/' + rfc4122.v4();
            return entity;
        };

        var generateUUID = function() {
            return rfc4122.v4();
        };


        return {
            appendPredixUUIDAsID: appendPredixUUIDAsID,
            generateAndAppendPredixURI: generateAndAppendPredixURI,
            generateUUID: generateUUID
        };

    }]);
});
