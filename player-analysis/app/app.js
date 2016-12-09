(function () {
    'use strict';

    angular
        .module('app', ['ui.router','highcharts-ng','LocalStorageModule','angularjs-dropdown-multiselect','hljs','ui.bootstrap','templates'])
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

        }]).filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };
  var a={}
	  a[filterOn]='';
	  newItems.push(a);
	  console.log(newItems);
      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
	
      items = newItems;
    }
    return items;
  };
})
		.run(run);

    /* @ngInject */function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
		    .state('ang-login', {
                url: '/ang-login',
                //templateUrl: 'components/login/login.html',
                templateUrl: 'login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('home', {
                url: '/',
                //templateUrl: 'components/home/home.html',
				templateUrl: 'home/home.html',
                controller: 'Home.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
			.state('customerModel', {
                url: '/customerModel',
                //templateUrl: 'components/customerModel/customerModel.html',
				templateUrl: 'customerModel/customerModel.html',
                controller: 'CustomerModel.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'customerModel' }
            })
			.state('dashBoard', {
                url: '/dashBoard',
                //templateUrl: 'components/dashBoard/dashBoard.html',
                templateUrl: 'dashBoard/dashBoard.html',
                controller: 'DashBoard.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'dashBoard' }
            })
			.state('playerCampaign', {
                url: '/playerCampaign',
                //templateUrl: 'components/playerCampaign/index.html',
                templateUrl: 'playerCampaign/index.html',
                controller: 'PlayerCampaign.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'playerCampaign' }
            })
			.state('analyticalReps', {
                url: '/analyticalReps',
                //templateUrl: 'components/analyticalReps/analyticalreps.html',
                templateUrl: 'analyticalReps/analyticalreps.html',
                controller: 'analyticalcontroller',
                controllerAs: 'vm',
                data: { activeTab: 'analyticalReps' }
            }).state('cohort', {
                url: '/cohort',
                //templateUrl: 'components/cohort/cohort.html',
                templateUrl: 'cohort/cohort.html',
                controller: 'Cohort.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'cohort' }
            })
			
			.state('romania', {
                url: '/romania',
                templateUrl: 'romania/romania.html',
               // templateUrl: 'components/romania/romania.html',
                controller: 'Romania.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'romania' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/account.html',
                //templateUrl: 'components/account/account.html',
                controller: 'Account.Controller',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }

	
    function run($http, $rootScope, $window,$location) {
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