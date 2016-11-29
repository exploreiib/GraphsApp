(function () {
    'use strict';

    angular
        .module('app', ['ui.router','highcharts-ng','LocalStorageModule','angularjs-dropdown-multiselect','hljs','ui.bootstrap'])
        .config(config)
		.service('$applicationService',['$http','localStorageService', function($http,localStorageService){
            
               var _customerModelDataObj = null;

            

            return {
                

                customerModelDataData: function(customerModelDataObj) {
                    if(customerModelDataObj) {
                        _customerModelDataObj = customerModelDataObj;
                        localStorageService.set('graphs.customerModelData', customerModelDataObj);
                        return;
                    }

                    return _customerModelDataObj || localStorageService.get('graphs.customerModelData');
                }              
	
				
            }

        }])
		.run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'components/home/home.html',
                controller: 'Home.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
			.state('customerModel', {
                url: '/customerModel',
                templateUrl: 'components/customerModel/customerModel.html',
                controller: 'CustomerModel.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'customerModel' }
            })
			.state('dashBoard', {
                url: '/dashBoard',
                templateUrl: 'components/dashBoard/dashBoard.html',
                controller: 'DashBoard.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'dashBoard' }
            })
			.state('playerCampaign', {
                url: '/playerCampaign',
                templateUrl: 'components/playerCampaign/index.html',
                controller: 'PlayerCampaign.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'playerCampaign' }
            })
			.state('analyticalReps', {
                url: '/analyticalReps',
                templateUrl: 'components/analyticalReps/analyticalreps.html',
                controller: 'analyticalcontroller',
                controllerAs: 'vm',
                data: { activeTab: 'analyticalReps' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'components/account/account.html',
                controller: 'Account.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();