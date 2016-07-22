skillsApp.controller('LoginCtrl', function ($scope, $facebook, $cookieStore) {
    $scope.id = -1;


    $scope.login = function () {
        $facebook.login().then(function () {
            refresh();
            $cookieStore.put('accessToken', $facebook.getAuthResponse().accessToken);
        });
    };

    $scope.logout = function () {
        $facebook.logout().then(function () {
            $cookieStore.put('accessToken', null);
            $scope.welcomeMsg = "Welcome to skills page";
            $scope.imgUrl = null;
        });
    };

    function refresh() {
        $facebook.api('/me').then(
                function (response) {
                    $scope.id = response.id;
                    $scope.welcomeMsg = "Welcome, " + response.name;
                    $scope.imgUrl = "http://graph.facebook.com/" + response.id + "/picture";
                },
                function (err) {
                    $scope.welcomeMsg = "Welcome to skills page";
                    $scope.imgUrl = null;
                    $cookieStore.put('accessToken', null);
                });
    }

    refresh();

    $scope.hasAccess = function () {
        var token = $cookieStore.get('accessToken');
        return token !== null && token !== undefined;
    };
});

skillsApp.controller('DialogCtrl', function ($scope, $mdDialog, friend) {
    $scope.friend = friend;

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.querySearch = querySkillsSearch;


    function querySkillsSearch(query) {
        var results = query ? loadAllSkills().filter(createFilterForSkills(query)) : [];
        return results;
    }
    ;

    function loadAllSkills() {
        var allStates = 'AngularJS, AngularMaterial, Bootstrap, AngularStrap, RestAngular, HTML5, CSS3, JavaScript, Java, J2EE, J2SE, \n\
                       OHIP, JBoss, HL7, Dicom, HCV, JSON, Xml, Swing, Jxl, MaterialDesign, JIRA';
        return allStates.split(/, +/g).map(function (skill) {
            return {
                value: skill.toLowerCase(),
                display: skill
            };
        });
    }


//    $scope.skills = [];

    function createFilterForSkills(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(skill) {
            return (skill.value.indexOf(lowercaseQuery) === 0);
        };
    }

});


skillsApp.controller('SkillsCtrl', function ($scope, $facebook, $mdDialog, $mdMedia, $timeout, RestService) {
    $scope.loadFriends = function () {
        $facebook.api('me/invitable_friends').then(
                function (response) {
                    $scope.myFriends = response.data;
                },
                function (err) {
                    console.log(err);

                });

    };
    $scope.loadFriends();

    $scope.delete = function (index) {
        angular.element(document.querySelector('#record' + index)).attr('class', index % 2 ? 'animated hinge' : 'animated zoomOut');
        $timeout(function () {

            var data = RestService.deleteRecord(index);
            data.then(function (_data) {
                $scope.myFriends.splice(index, 1);
            });

        }, 1000);

    };


    $scope.showAdvanced = function (ev, obj) {
        $scope.friend = obj;
        if ($scope.friend.selectedSkills === undefined) {
            $scope.friend.selectedSkills = [];
        }


//        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: 'DialogCtrl',
            templateUrl: 'pages/skills.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                friend: $scope.friend
            }
//            fullscreen: useFullScreen
        })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
});


