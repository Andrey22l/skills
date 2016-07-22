'use strict';

var skillsApp = angular.module('skillsApp', [
    'restangular',
    'ngFacebook',
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'ngCookies'
]);

skillsApp.config(function ($facebookProvider) {
    $facebookProvider.setAppId('146893399048200');
    $facebookProvider.setVersion("v2.2");
    $facebookProvider.setPermissions("email, user_likes, user_friends, public_profile");
});


skillsApp.directive('themed', function () {
    return {
        restrict: 'A',
        scope: {
            'condition': '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('condition', function (condition) {
                if (condition == '0') {
                    element.css('color', 'red');
                }else if (condition == '1') {
                    element.css('color', 'green');
                } else {
                    element.css('color', 'black');
                }
                ;
            }, false);
        }
    };
});
skillsApp.config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    
    RestangularProvider.setBaseUrl("/skills");
    
    $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'LoginCtrl'
            })
            .state('friends', {
                url: '/friends',
                views: {
                    "internalView": {
                        templateUrl: 'pages/friends.html'
                    }
                },
                controller: 'SkillsCtrl',
                parent: "login"

            });
    $urlRouterProvider.otherwise("/login");
});
skillsApp.run(function ($rootScope, $state, $cookieStore) {
    // Load the facebook SDK asynchronously
    (function () {
        console.log('load FB plugin');
        // If we've already installed the SDK, we're done
        if (document.getElementById('facebook-jssdk')) {
            return;
        }

        // Get the first script element, which we'll use to find the parent node
        var firstScriptElement = document.getElementsByTagName('script')[0];
        // Create a new script element and set its id
        var facebookJS = document.createElement('script');
        facebookJS.id = 'facebook-jssdk';
        // Set the new script's source to the source of the Facebook JS SDK
        facebookJS.src = 'scripts/directives/all.js';
        // Insert the Facebook JS SDK into the DOM
        firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());
    $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
//                console.log('$stateChangeStart');
                var token = $cookieStore.get('accessToken');
//                console.log(token);
                if (toState.name !== "login" && (token === undefined || token === null)) {
                    $state.go("login");
                    event.preventDefault();
                }
            });
});

