skillsApp.factory('RestService', function (Restangular) {
    return {
        deleteRecord: function (recordId) {
            var aPromise = Restangular.all("rest/record/delete/");
            return aPromise.post(recordId);
        }
    };
});