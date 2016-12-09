;(function(angular) {
(function () {
    'use strict';

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    run.$inject = ["$http", "$rootScope", "$window", "$location"];
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
(function () {
    'use strict';

    Controller.$inject = ["$window", "UserService", "FlashService"];
    angular
        .module('app')
        .controller('Account.Controller', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashBoard.Controller', ["$scope", "$http", "$anchorScroll", "$applicationService", "$window", function ($scope,$http,$anchorScroll,$applicationService,$window) {

 
  $scope.mecampaignsList={
	   data: []
  };
  $scope.customKPIList={
	   data: []
  };
   $scope.modelKPIList={
	   data: []
  };
  
 loadCustomerModelData();

 
 $scope.trendof13 = function (id) {
	 populateTrendReportGraphs(id);
	 $anchorScroll('trendrep');  
}
$scope.campAnalysisPopup = function (action) {
	 alert("Action"+action); 
	 $window.open("http://localhost:3000/app/#/analyticalReps", "popup", "width=950,height=600,left=10,top=50");
	 
}


 $scope.modelBasedTrend = function (id) {
	 populatemodelBasedTrendGraphs(id);
	 $anchorScroll('modelBasedTrend');  
}
 
 
 
 

function loadCustomerModelData(){
	
	
	$http.get('/getfiles').success(function(data) { 
    console.log("success!");
    $applicationService.customerModelDataData(data);

	var period;
	var x_values = [];
	var lifeCycleList = [];

    var j=0; 
	for(var i=0;i< data.life_cycle.length;i++){
		
					
       if(data.life_cycle[i].Period === period){
 	      continue;
	    }else{
			
			x_values[j] = {"periodID":data.life_cycle[i].Period};
			j=j+1;
			period = data.life_cycle[i].Period
		}
	  
  }
   
   for(var lfsIndex=0;lfsIndex< data.life_cycle.length;lfsIndex++){
		
					
       if(data.life_cycle[lfsIndex].Period === x_values[0].periodID){
     	   lifeCycleList[lfsIndex] = {"label":data.life_cycle[lfsIndex].life_cycle_stages,"id": data.life_cycle[lfsIndex].life_cycle_stages}; 	      
	    }
  }
$scope.periodList =   x_values;
$scope.lifeCycleStagedata = lifeCycleList;

populateGraphListData();
 });  
	
}




function populateGraphListData(){
		
		$scope.mecampaignsList.data = ($applicationService.customerModelDataData())['effective_campaigns'];
		$scope.customKPIList.data = ($applicationService.customerModelDataData())['custom_kpi_data'];
		$scope.modelKPIList.data = ($applicationService.customerModelDataData())['model_based_kpi_data'];	
		
		populateGraphs();
		populateTrendReportGraphs('sport_bet');
        populatemodelBasedTrendGraphs('sport_bet');
	
}
 
 function readColumnData(component_type,column_name){
	
	var x_values = [];
    var i;
    var json_data = ($applicationService.customerModelDataData())[component_type];
   
				
			
    for(i=0;i< json_data.length;i++){       
			   
			  
        x_values[i] = json_data[i][column_name];
			   
    }
		   
	
     
   return  x_values;
	
 }
 
  
 function populateTrendReportGraphs(id){
 /*Custom KPI trend */
 
 $scope.customKPITrendobj = {
	 
	 options: {
            chart: {
                type: 'line'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
        series: [{
            data: readColumnData(id,'value')
        }],
        title: {
            text: '13 weeks Trend Report'
        },
		credits: {
          enabled: false
		},
	   loading: false
    }
 }
/*Model Based KPI */
 
 
function populatemodelBasedTrendGraphs(id){
	$scope.modelBasedTrendConfig = {
	 
	 options: {
            chart: {
                type: 'line'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
        series: [{
            data: readColumnData('sport_bet','value')
        }],
        title: {
            text: '13 weeks Trend Report'
        },
		credits: {
          enabled: false
		},
	   loading: false
    }
 
 }
 /* Custom KPI trend Ends */
 
 
 
 
 
 
 
 function populateGraphs(){

 
 $scope.liveCustomerTrendsChartConfig = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'column'            },
				colors: ['#058DC7', '#50B432', '#ED561B'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
			          
					  },
				  credits: {
					enabled: false
				},
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		credits: {
          enabled: false
		},
		
            title: {
                text: 'Distribution',
				align: "left"
            },
			
			
			series: [{
            name: 'became_churn',
            data: readColumnData('live_customers_trend','became_churn') //[3, 2, 1, 3, 4]
        }, {
            name: 'became_live',
            data: readColumnData('live_customers_trend','became_live')
        },
		
		{
            type: 'spline',
            name: 'NO Of live customers',
            data: readColumnData('live_customers_trend','NoOf_live_customers')
        }],
                      
            /*series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readDataWithOutPeriod('live_customers_trend','became_churn','became_live',false)
            }],*/
		
            loading: false
    }

/* Future Prediction Chart Config Starts*/

	
 $scope.futurePredictionChartConfig = {
	 
	 options: {
            chart: {
				type: 'column'            
				},
				colors: ['#e45d15', '#50B432', '#ED561B'],
				legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
               },
     			xAxis: {
				
					categories: readColumnData('predicted_future_value','date')
                },
				yAxis: {
					min: 0,
					title: {
					text: 'Future Value Prediction'
					}
				},
				
													exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
			credits: {
          enabled: false
		},
	 	series: [{
            name: 'Acquisition Fv',
			data: readColumnData('predicted_future_value','acquisition_fv') 
               }, {
					name: 'Database Fv',
					data: readColumnData('predicted_future_value','database_fv')
				}],
		title: {
            text: 'Future Trend Prediction'
        },
            loading: false
    
 }

 /*Prediction Donut Chart */
 
 $scope.futurePredictionDonut = {
	 
	 options: {
            chart: {
				type: 'pie',
					options3d: {
					enabled: true,
					alpha: 45
					}				
				},
				colors: ['#ED561B', '#5C2508'],
				
													exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
				
        },
		
		plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
		credits: {
          enabled: false
		},
	 	series: [{
            name: 'Future Prediction',
			 data: [
                ['AcquisitionFv', 25],
                ['DatabaseFv',75]]
				}],
		title: {
            text: 'Future Trend'
        },
            loading: false
    
 }

 /*Donut Ends*/
 
 
 
 
 
/*Future Prediction Chart Config ENds */

	

	


	
  }
  
  
 }])

})();
(function () {
    'use strict';

    Controller.$inject = ["UserService"];
    angular
        .module('app')
        .controller('Home.Controller', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }

})();
(function () {
    'use strict';

    Controller.$inject = ["UserService"];
    angular
        .module('app')
        .controller('PlayerCampaign.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }

})();
(function () {
    'use strict';

    ARepController.$inject = ["UserService", "$scope", "$http", "$applicationService"];
   angular
        .module('app')	
        .controller('analyticalcontroller', ARepController)
		.filter('gtf', function() {
			var i=0;
    return function(item,val,d) {

var fret=[];
for(i=0;i<item.length;i++)
{
	
	if(item[i][d]>=val)
	{
		fret.push(item[i]);
	}
		}
		if(fret==0)
		{
			return item
		}
		console.log(fret);
		return fret;
    };
});

    function ARepController(UserService,$scope,$http,$applicationService) {
        var vm = this;
        vm.user = null;
		$scope.playerPreview = false;
        $scope.trend = { "value" : "Net Revenue"};
		$scope.distribution = { "period" : "2016_09_10"};
		$scope.meCampList = {
			data: []
		};
		
		$scope.playerList = {
    data: []
  };
		$scope.colors = [
{name:'black', shade:'dark'},
{name:'white', shade:'light'},
{name:'red', shade:'dark'},
{name:'red', shade:'dark'},
{name:'yellow', shade:'light'}];
        initController();

        function initController() {
            // get current user
	
	
	
	
	
	
			console.log($scope.items);
			$http.get('/getfiles').success(function(data) { 
    console.log("success!");
    $applicationService.customerModelDataData(data);
			});
			
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        $scope.playerList.data = readListData('player_data');
		$scope.playerPreview = false;
		}
		$scope.previewResults = function(){
			console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
	    $scope.playerList.data = readListData('player_data');
        $scope.playerPreview = true;
         }
		 $scope.hideResults = function(){
	  
        $scope.playerPreview = false;
         }
		 
		function readListData(component_type){
			
			
	           
				var x_values = [];
				var i;
				var json_data = ($applicationService.customerModelDataData())[component_type];
				console.log("Data::",json_data);
				var j=0;

   $scope.periodList =   json_data;
   return  json_data;
	
 }
 
 
    }
 
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Romania.Controller', /* @ngInject */ ["$scope", "$http", "$applicationService", function ($scope,$http,$applicationService) {
			 "ngInject";

$scope.lifeCycleData = [];
$scope.distribution = { "period" : "2016_09_10"};

$scope.valueSegmentList={
	   data: []
  };
  
loadCustomerModelData();

$scope.updateGraph = function(){
	$scope.lifeCyclePiechartConfig1.series[0].data = readData($scope.distribution.period,'romania_1','life_cycle_stages','distribution',true);
	$scope.lifeCyclePiechartConfig2.series[0].data = readData($scope.distribution.period,'romania_2','life_cycle_stages','distribution',true);
}

function loadCustomerModelData(){
	$http.get('/getfiles').success(function(data) { 
    console.log("success!");
    $applicationService.customerModelDataData(data);

	var period;
	var x_values = [];
	var lifeCycleList = [];

    var j=0; 
	for(var i=0;i< data.life_cycle.length;i++){
		
		if(data.life_cycle[i].Period === period){
 	      continue;
	    }else{
			
			x_values[j] = {"periodID":data.life_cycle[i].Period};
			j=j+1;
			period = data.life_cycle[i].Period
		}
	}
   
   for(var lfsIndex=0;lfsIndex< data.life_cycle.length;lfsIndex++){
		
		if(data.life_cycle[lfsIndex].Period === x_values[0].periodID){
     	   lifeCycleList[lfsIndex] = {"label":data.life_cycle[lfsIndex].life_cycle_stages,"id": data.life_cycle[lfsIndex].life_cycle_stages}; 	 
		}
  }
$scope.periodList =   x_values;
$scope.lifeCycleStagedata = lifeCycleList;

populateGraphListData();

});  
}

function populateGraphListData(){
		
		$scope.valueSegmentList.data = readListData($scope.distribution.period,'valueseg');
		
		populateGraphs();
} 

function readColumnData(component_type,column_name){
	
	var x_values = [];
    var i;
    var json_data = ($applicationService.customerModelDataData())[component_type];
   
	for(i=0;i< json_data.length;i++){       
		x_values[i] = json_data[i][column_name];
	}
		   
	return  x_values;
}

function readData(period,component_type,series_name,series_y,isPercentage){
	
	
	var x_values = [];
    var i;
    var json_data = ($applicationService.customerModelDataData())[component_type];
    var j=0;
    for(i=0;i< json_data.length;i++){
      if(json_data[i].Period === period){
	       var xval =  {
		       "name" : json_data[i][series_name],
		       "y": (isPercentage)  ? (Number(((json_data[i][series_y]) * 100).toFixed(2))) : (Number(json_data[i][series_y])) 		
		  }	
  
        console.log("Data::",xval);
        x_values[j] = xval;
        j=j+1;
	  } 
   }
   
   return  x_values;
	
 }
 
function readListData(period,component_type){
	
	var x_values = [];
    var i;
    var json_data = ($applicationService.customerModelDataData())[component_type];
    var j=0;
    for(i=0;i< json_data.length;i++){
      if(json_data[i].Period === period){
	        
			var xval =  json_data[i];
		    console.log("Data::",xval);
            x_values[j] = xval;
            j=j+1;
	  } 
   }
   
   return  x_values;
	
 }
 
function populateGraphs(){
	
	$scope.lifeCyclePiechartConfig1 = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        verticalAlign: 'top',
                enabled: true,
                color: '#fff',
				
                connectorWidth: 1,
                distance: -30,
                //connectorColor: '#000000',
						formatter: function () {
                    return Math.round(this.y) + ' %';
                }
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		title: {
                text: 'Registrations',
				align: "left"
				
            },
                      
            series: [{
                name: 'registration',
                colorByPoint: true,
                data: readData($scope.distribution.period,'romania_1','life_cycle_stages','distribution',true)
            }],
		
            loading: false
    }
	
	$scope.lifeCyclePiechartConfig2 = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        verticalAlign: 'top',
                enabled: true,
                color: '#fff',
                connectorWidth: 1,
                distance: -30,
                //connectorColor: '#000000',
						formatter: function () {
                    return Math.round(this.y) + ' %';
                }
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		title: {
                text: 'Depositors Breakdown  ',
				
				align: "left"
            },
			
			series: [{
                name: 'Depositors',
                colorByPoint: true,
                data: readData($scope.distribution.period,'romania_2','life_cycle_stages','distribution',true)
            }],
		
            loading: false
    }
	
	$scope.lifeCycleBarchartConfig1 = {
       options: {
            chart: {
 
                type: 'column'            },
				
				
				colors: [ '#e45d15', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			
        },
		
title: {
                text: '',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'values',
                data: readData($scope.distribution.period,'romania_3','life_cycle_stages','avg_future_value',false),
				   dataLabels: {
                enabled: true,
                color: '#058DC7',
                align: 'right',
                format: '{point.y:,.0f}', 
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
 
 $scope.lifeCyclePiechartConfig3 = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        verticalAlign: 'top',
                enabled: true,
                color: '#fff',
                connectorWidth: 1,
                distance: -30,
                //connectorColor: '#000000',
						formatter: function () {
                    return Math.round(this.y) + ' %';
                }
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		title: {
                text: 'Hybrid Players  ',
				
				align: "left"
            },
			
			series: [{
                name: 'Depositors',
                colorByPoint: true,
                data: readData($scope.distribution.period,'product_distribution','life_cycle_stages','distribution',true)
            }],
		
            loading: false
    }
 
$scope.lifeCycleBarchartConfig2 = {
       options: {
            chart: {
 
                type: 'column'            },
				
				colors: [ '#6480e8', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			
        },
		
		title: {
                text: '',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'values',
                data: readData($scope.distribution.period,'product_distribution_bar','life_cycle_stages','avg_future_value',false),
				   dataLabels: {
                enabled: true,
                color: '#058DC7',
                align: 'right',
                format: '{point.y:,.0f}', 
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
 
 $scope.lifeCyclePiechartConfig4 = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        verticalAlign: 'top',
                enabled: true,
                color: '#fff',
                connectorWidth: 1,
                distance: -30,
                //connectorColor: '#000000',
						formatter: function () {
                    return Math.round(this.y) + ' %';
                }
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		title: {
                text: '',
				
				align: "left"
            },
			
			series: [{
                name: 'Depositors',
                colorByPoint: true,
                data: readData($scope.distribution.period,'product_distribution_pie','life_cycle_stages','distribution',true)
            }],
		
            loading: false
    }
 
 
 $scope.lifeCyclePiechartConfig5 = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        verticalAlign: 'top',
                enabled: true,
                color: '#fff',
                connectorWidth: 1,
                distance: -30,
                //connectorColor: '#000000',
						formatter: function () {
                    return Math.round(this.y) + ' %';
                }
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		title: {
                text: '',
				
				align: "left"
            },
			
			series: [{
                name: 'Depositors',
                colorByPoint: true,
                data: readData($scope.distribution.period,'survival_rate','life_cycle_stages','distribution',true)
            }],
		
            loading: false
    }
	
$scope.lifeCycleBarchartConfig3 = {
       options: {
            chart: {
 
                type: 'column'            },
				
				colors: [ '#6480e8', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			
        },
		
		title: {
                text: '',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'values',
                data: readData($scope.distribution.period,'retention_rate','life_cycle_stages','avg_future_value',false),
				   dataLabels: {
                enabled: true,
                color: '#058DC7',
                align: 'right',
                format: '{point.y:,.0f}', 
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
	
	 $scope.futurePredictionChartConfig1 = {
	 
	 options: {
            chart: {
				type: 'column'            
				},
				colors: ['#e45d15', '#50B432'],
				legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
               },
     			xAxis: {
				
					categories: readColumnData('product_frequency','date')
                },
				yAxis: {
					min: 0,
					title: {
					text: ''
					}
				},
				
													exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
			credits: {
          enabled: false
		},
	 	series: [{
            name: 'Casino Frequency',
			data: readColumnData('product_frequency','acquisition_fv') 
               }, {
					name: 'Sports Frequency',
					data: readColumnData('product_frequency','database_fv')
				}],
		title: {
            text: ''
        },
            loading: false
    
 }
 
 
 $scope.lifeCycleLinechartConfig1 = {
	 
	 options: {
            chart: {
                type: 'line'
            },
			colors: ['#e45d15'],
			xAxis: {
				
					categories: readColumnData('deposit_progression','life_cycle_stages')
                },
				
													exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
        series: [{
            data: readData($scope.distribution.period,'deposit_progression','life_cycle_stages','avg_future_value',false),
        }],
        title: {
            text: ''
        },
		credits: {
          enabled: false
		},
	   loading: false
    }
	
	
	
	$scope.liveCustomerTrendsChartConfig = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'column'            },
				colors: ['#058DC7', '#50B432', '#ED561B'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
			          
					  },
				  credits: {
					enabled: false
				},
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		credits: {
          enabled: false
		},
		
            title: {
                text: '',
				align: "left"
            },
			
			
			series: [{
            name: 'bar',
            data: readColumnData('revenue_distribution','became_churn') //[3, 2, 1, 3, 4]
        }, 
		
		{
            type: 'spline',
            name: 'line',
            data: readColumnData('revenue_distribution','NoOf_live_customers')
        }],
                      
            /*series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readDataWithOutPeriod('live_customers_trend','became_churn','became_live',false)
            }],*/
		
            loading: false
    }
	
	
	$scope.survivabilityanalysisconfig = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'column'            },
				xAxis: {
				
					categories: readColumnData('survivability_analysis','date')
                },
				colors: ['#058DC7', '#50B432', '#ED561B'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
			          
					  },
				  credits: {
					enabled: false
				},
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		credits: {
          enabled: false
		},
		
            title: {
                text: '',
				align: "left"
            },
			
			
			series: [{
            name: 'bar',
            data: readColumnData('survivability_analysis','became_churn') //[3, 2, 1, 3, 4]
        }, 
		
		{
            type: 'spline',
            name: 'line',
            data: readColumnData('survivability_analysis','NoOf_live_customers')
        }],
                      
            /*series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readDataWithOutPeriod('live_customers_trend','became_churn','became_live',false)
            }],*/
		
            loading: false
    }

	
	
	$scope.migrationconfig = {
       options: {
            chart: {
 
                type: 'bar'            },
				
				
				colors: [ '#6480e8', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			
        },
		
		
		
            title: {
                text: '',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'values',
                data: readData($scope.distribution.period,'migration','life_cycle_stages','avg_future_value',false),
				   dataLabels: {
                enabled: true,
                color: '#058DC7',
                align: 'right',
                format: '{point.y:,.0f}', 
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
	
	
	
	$scope.retentionconfig = {
       options: {
            chart: {
 plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'line'            },
				xAxis: {
				
					categories: readColumnData('retention','date')
                },
				colors: ['#058DC7', '#50B432', '#ED561B'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
			          
					  },
				  credits: {
					enabled: false
				},
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		credits: {
          enabled: false
		},
		
            title: {
                text: '',
				align: "left"
            },
			
			
			series: [{
            name: 'Actual',
            data: readColumnData('retention','became_churn') //[3, 2, 1, 3, 4]
        }, 
		
		{
            type: 'line',
            name: 'Standard',
            data: readColumnData('retention','NoOf_live_customers')
        }],
                      
            /*series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readDataWithOutPeriod('live_customers_trend','became_churn','became_live',false)
            }],*/
		
            loading: false
    }

}
 
}])

})();
(function () {
    'use strict';
    angular
	    .module('app')
		.controller('Cohort.Controller', ["$scope", "$http", "$applicationService", function ($scope,$http,$applicationService) {
			$scope.cohort = { "product" : "Poker"};
		    $scope.productList = [{"productID":"Poker"},{"productID":"Casino"}];
			populateGraphs();
			
			$scope.updateGraph = function(){
				
				populateGraphs();
			}	
 
            function readData(){
				var data=[];
				if($scope.cohort.product === "Casino"){
					
					data = [[0, 0, 10],    
	                        [1, 0, 92], [1, 1, 58],  
	                        [2, 0, 35], [2, 1, 15], [2, 2, 123],  
	                        [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19],
	                        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
	                        [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [5, 5, 45],
	                        [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [6, 5, 54],
	                        [6, 6, 12],
	                        [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [7, 5, 76], 
	                        [7, 6, 76], [7, 7, 23],
                            [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [8, 5, 76],
	                        [8, 6, 23], [8, 7, 67], [8, 8, 34],
	                        [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91], [9, 5, 91],
	                        [9, 6, 91], [9, 7, 91], [9, 8, 91], [9, 9, 91], 
	                        [10, 0, 74], [10, 1, 114], [10, 2, 31], [10, 3, 48], [10, 4, 91], [10, 5, 91],
	                        [10, 6, 91], [10, 7, 91], [10, 8, 91], [10, 9, 91], [10, 10, 91],
	                        [11, 0, 3], [11, 1, 114], [11, 2, 31], [11, 3, 48], [11, 4, 91], [11, 5, 91],
	                        [11, 6, 91], [11, 7, 91], [11, 8, 91], [11, 9, 91], [11, 10, 91],
	                        [11, 11, 91],
	                        [12, 0, 5], [12, 1, 114], [12, 2, 31], [12, 3, 48], [12, 4, 91], [12, 5, 91], 
	                        [12, 6, 91], [12, 7, 91], [12, 8, 91], [12, 9, 91], [12, 10, 91],
	                        [12, 11, 91],[12, 12, 91]] ;
				}else{
					
					data= [[0, 0, 21],    
	                       [1, 0, 29], [1, 1, 85],  
	                       [2, 0, 53], [2, 1, 51], [2, 2, 321],  
	                       [3, 0, 27], [3, 1, 56], [3, 2, 23], [3, 3, 98],
	                       [4, 0, 67], [4, 1, 89], [4, 2, 45], [4, 3, 89], [4, 4, 45],
	                       [5, 0, 23], [5, 1, 87], [5, 2, 35], [5, 3, 87], [5, 4, 98], [5, 5, 45],
	                       [6, 0, 12], [6, 1, 67], [6, 2, 98], [6, 3, 56], [6, 4, 34], [6, 5, 23],
	                       [6, 6, 23],
	                       [7, 0, 12], [7, 1, 56], [7, 2, 89], [7, 3, 34], [7, 4, 23], [7, 5, 87], 
	                       [7, 6, 23], [7, 7, 65],
                           [8, 0, 23], [8, 1, 87], [8, 2, 98], [8, 3, 12], [8, 4, 76], [8, 5, 98],
	                       [8, 6, 12], [8, 7, 45], [8, 8, 12],
	                       [9, 0, 78], [9, 1, 98], [9, 2, 12], [9, 3, 67], [9, 4, 23], [9, 5, 12],
	                       [9, 6, 78], [9, 7, 21], [9, 8, 12], [9, 9, 45], 
	                       [10, 0, 34], [10, 1, 67], [10, 2, 87], [10, 3, 98], [10, 4, 56], [10, 5, 23],
	                       [10, 6, 12], [10, 7, 45], [10, 8, 67], [10, 9, 23], [10, 10, 34],
	                       [11, 0, 56], [11, 1, 32], [11, 2, 78], [11, 3, 23], [11, 4, 45], [11, 5, 21],
	                       [11, 6, 21], [11, 7, 54], [11, 8, 78], [11, 9, 87], [11, 10, 34], [11, 11, 45],
	                       [12, 0, 56], [12, 1, 87], [12, 2, 45], [12, 3, 67], [12, 4, 34], [12, 5, 23], 
	                       [12, 6, 23], [12, 7, 12], [12, 8, 12], [12, 9, 67], [12, 10, 76], [12, 11, 23],
	                       [12, 12, 1]];
				}
				
				return data;
			} 
            function populateGraphs(){
	
	                 $scope.heatMapchartConfig = {
		              		    options: {
                                    chart: {
                                      marginTop: 40,
				                      marginBottom: 80,
                                      type: 'heatmap'            
							        },
							
							        colorAxis: {
                                      min: 0,
                                      minColor: '#FFFFFF',
                                      maxColor: Highcharts.getOptions().colors[0]
                                    },
							
									plotOptions: {
                                      heatmap: {
                                          allowPointSelect: true,
                                          cursor: 'pointer',
                                          dataLabels: {
                                               enabled: false
                                          },
                                          showInLegend: true
                                       }
                                    },
				
				                    legend: { 
							            enabled: true,
		                                align: "right",
                                        layout: "vertical",
                                        margin: 0,
                                        verticalAlign: "top",
                                        y: 25,
                                        symbolHeight: 280
						            },
				                    credits: {
                                        enabled: false
                                    },
				                    tooltip: {
                                        formatter: function () {
                                                 return '<b>' + this.series.xAxis.categories[this.point.x] + '<br>' + this.point.value;
                                        }
                                    },
        
                                    title: {
                                        text: ''
                                    },
							
							        xAxis:{
								        opposite: true,
                                        categories: ['Oct', 'Nov', 'Dec', 'Jan','Feb', 'Mar', 'Apr', 'May' , 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
							        },
							
							        yAxis:{
								        categories: ['Nov', 'Dec', 'Jan','Feb', 'Mar', 'Apr', 'May' , 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov'],
                                        title: null,
	                                    reversed: true
							        },
									
									exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
                                },
		
                                series: [{
                                          borderWidth: 1,
                                          data: readData(),
                                          dataLabels: {
                                              enabled: true,
                                              color: '#000000',
		                                  }
                                }],
		                        loading: false
                    }
            }
 
}])

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();

(function () {
    'use strict';

    angular
        .module('app')
        .controller('CustomerModel.Controller', ["$scope", "$http", "$applicationService", function ($scope,$http,$applicationService) {

              $scope.lifeCycleData = [];
              $scope.distribution = { "period" : "2016_09_10"};
              $scope.daysSinceRegList = {
                           data: []
              };
  
  
              $scope.daysSinceLastActivityList = {
                  data: []
              };
  
              $scope.playerActivityList = {
                   data: []
              };
  
              $scope.productReferenceList = {
                  data: []
              };
			  
              $scope.microSegmentList = {
                  data: []
              };
			  
              $scope.valueSegmentList={
	              data: []
              };
            
			$scope.lifeCycleStageModel = [{id: 'Non Depositor'}]
            $scope.showDaysSinceReg = true
            $scope.showDaysSinceLastActivity = false;
            $scope.showProductRefs = false;
            $scope.showPlayerActivity = false;
           
		   loadCustomerModelData();

           $scope.updateGraph = function(){
	
	          console.log("inside updateGraph",$scope.distribution.period);
	          $scope.lifeCyclePiechartConfig.series[0].data = readData($scope.distribution.period,'life_cycle','life_cycle_stages','distribution',true);  
	          $scope.lifeCycleBarchartConfig.series[0].data = readData($scope.distribution.period,'life_cycle','life_cycle_stages','avg_future_value',false);  
	       	  
			  $scope.daysSinceRegPiechartConfig.series[0].data = readData($scope.distribution.period,'days_since_reg','days_since_reg','distribution',true);
	          $scope.daysSinceRegBarchartConfig.series[0].data = readData($scope.distribution.period,'days_since_reg','days_since_reg','future_value',false);
          	  
			  if (typeof $scope.daysSinceLastPiechartConfig !== 'undefined') {
                    $scope.daysSinceLastPiechartConfig.series[0].data = readData($scope.distribution.period,'days_since_last_activity','days_since_last_activity','distribution',true);
	                $scope.daysSinceLastBarchartConfig.series[0].data = readData($scope.distribution.period,'days_since_last_activity','days_since_last_activity','future_value',false);
              }	
   
              if (typeof $scope.playerActivityPiechartConfig !== 'undefined') {
	                $scope.playerActivityPiechartConfig.series[0].data = readData($scope.distribution.period,'player_activity','player_activity','distribution',true);
	                $scope.playerActivityBarchartConfig.series[0].data = readData($scope.distribution.period,'player_activity','player_activity','future_value',false);
              }
             
			  if (typeof $scope.productReferencePiechartConfig !== 'undefined') {
                 $scope.productReferencePiechartConfig.series[0].data = readData($scope.distribution.period,'product_preferences','Activity_type','distribution',true);
	             $scope.productReferenceBarchartConfig.series[0].data = readData($scope.distribution.period,'product_preferences','Activity_type','future_value',false);
              }
	
              populateGraphListData();

            }

            function loadCustomerModelData(){
	
	        	$http.get('/getfiles').success(function(data) { 
                    console.log("success!");
                    $applicationService.customerModelDataData(data);
            	    var period;
	                var x_values = [];
	                var lifeCycleList = [];
                    var j=0; 
	                for(var i=0;i< data.life_cycle.length;i++){
		                if(data.life_cycle[i].Period === period){
 	                          continue;
	                    }else{
			 			       x_values[j] = {"periodID":data.life_cycle[i].Period};
			                   j=j+1;
			                   period = data.life_cycle[i].Period
		                }
	  
                    }
   
                    for(var lfsIndex=0;lfsIndex< data.life_cycle.length;lfsIndex++){ 					
                        if(data.life_cycle[lfsIndex].Period === x_values[0].periodID){
     	                    lifeCycleList[lfsIndex] = {"label":data.life_cycle[lfsIndex].life_cycle_stages,"id": data.life_cycle[lfsIndex].life_cycle_stages}; 	      
	                    }
                    }
                    $scope.periodList =   x_values;
                    $scope.lifeCycleStagedata = lifeCycleList;
                    populateGraphListData();
                });  
	
            }

            function populateGraphListData(){
		  		$scope.daysSinceRegList.data = readListData($scope.distribution.period,'days_since_reg');
		        $scope.daysSinceLastActivityList.data = readListData($scope.distribution.period,'days_since_last_activity');
		        $scope.playerActivityList.data = readListData($scope.distribution.period,'player_activity');
		        $scope.productReferenceList.data = readListData($scope.distribution.period,'product_preferences');
		        $scope.valueSegmentList.data = readListData($scope.distribution.period,'valueseg');
		        populateMicroSegmentsData();
		        populateGraphs();
	
            }
 
            function readListData(period,component_type){
	            var x_values = [];
                var i;
                var json_data = ($applicationService.customerModelDataData())[component_type];
                var j=0;
                for(i=0;i< json_data.length;i++){
                    if(json_data[i].Period === period){
	        			var xval =  json_data[i];
		                console.log("Data::",xval);
                        x_values[j] = xval;
                        j=j+1;
	                } 
                }
                return  x_values;
	
            }


            function readData(period,component_type,series_name,series_y,isPercentage){
		          var x_values = [];
                  var i;
                  var json_data = ($applicationService.customerModelDataData())[component_type];
                  var j=0;
                  for(i=0;i< json_data.length;i++){
                     if(json_data[i].Period === period){
	                    var xval =  {
		                     "name" : json_data[i][series_name],
		                     "y": (isPercentage)  ? (Number(((json_data[i][series_y]) * 100).toFixed(2))) : (Number(json_data[i][series_y])) 		
		                }	
                        console.log("Data::",xval);
                        x_values[j] = xval;
                        j=j+1;
	                 } 
                  }
   
                  return  x_values;
	
            }
 
            function populateGraphs(){
				
				
                $scope.lifeCyclePiechartConfig = {
                        options: {
                            chart: {
                                  plotBackgroundColor: null,
                                  plotBorderWidth: null,
                                  plotShadow: false,
                                  type: 'pie'            
							},
				
				            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                          enabled: false
                                    },
                                    showInLegend: true
                                }
                            },
			
			                legend: { 
							       enabled: true,
		                           align: "right",
				                   verticalAlign:"top",
				                   labelFormat: '{name}- {y}%',
				                   layout:"vertical"
						    },
				            credits: {
                               enabled: false
                            },
				            tooltip: {
                               pointFormat: '{series.name}: <b>{point.y}%</b>'
                            },
							exporting:{
								buttons: {
							     		contextButton:{
											enabled : false
										}
									}
							}							
                        },
		
		                title: {
                            text: 'Distribution',
				            align: "left"
                        },
                      
                        series: [{
                            name: 'Distribution',
                            colorByPoint: true,
                            data: readData($scope.distribution.period,'life_cycle','life_cycle_stages','distribution',true)
                        }],
		
                        loading: false
                }

	
	
	
	$scope.lifeCycleBarchartConfig = {
       options: {
            chart: {
 
                type: 'column'            },
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			exporting: {
						  buttons: {
							    		contextButton:{
												enabled : false
											}
									}
						}			
			/*	  ,tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            }*/
        },
		
		
		
            title: {
                text: 'Avg.Future value',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'Avg.Future Value',
                data: readData($scope.distribution.period,'life_cycle','life_cycle_stages','avg_future_value',false),
				   dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:,.0f}', // one decimal
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
	
	
	
	$scope.daysSinceRegPiechartConfig = {
       options: {
            chart: {
				plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
  				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		
		
            title: {
                text: 'Distribution',
				align: "left"
            },
                      
            series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readData($scope.distribution.period,'days_since_reg','days_since_reg','distribution',true)
            }],
		
            loading: false
    }
	
	
  	$scope.daysSinceRegBarchartConfig = {
       options: {
            chart: {
 
                type: 'column'            },
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			/*	  ,tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            }*/
        },
		
		
		
            title: {
                text: 'Future value',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'Future Value',
                data: readData($scope.distribution.period,'days_since_reg','days_since_reg','future_value',false),
				   dataLabels: {
                enabled: true,
                align: 'right',
                format: '{point.y}', // one decimal
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
  }
  
  
  $scope.displyDaysSinceReg = function(){
	  
 $scope.showDaysSinceReg = true;
 $scope.showDaysSinceLastActivity = false;
 $scope.showProductRefs = false;
 $scope.showPlayerActivity = false;
	
  }
  
  $scope.displyDaysSinceLast = function(){
	
     $scope.showDaysSinceReg = false;
     $scope.showDaysSinceLastActivity = true;
     $scope.showProductRefs = false;
     $scope.showPlayerActivity = false;
 
    $scope.daysSinceLastPiechartConfig = {
       options: {
            chart: {
				plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				colors: ['#ED561B', '#5C2508','#e45d15', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
					
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
  				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		
		
            title: {
                text: 'Distribution',
				align: "left"
            },
                      
            series: [{
                name: 'Distribution',
                data: readData($scope.distribution.period,'days_since_last_activity','days_since_last_activity','distribution',true)
            }],
		
            loading: false
    }
	
	
  	$scope.daysSinceLastBarchartConfig = {
       options: {
            chart: {
 
                type: 'column'            
				},
				
				plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
               },
			   credits: {
					  enabled: false
			   },
							
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			/*	  ,tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            }*/
        },
		
		
		
            title: {
                text: 'Future value',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'Future Value',
				colorByPoint: true,
                data: readData($scope.distribution.period,'days_since_last_activity','days_since_last_activity','future_value',false),
				   dataLabels: {
                enabled: true,
                align: 'right',
                format: '{point.y}', // one decimal
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
  }
  
  
  
  $scope.displyPlayerActivity = function(){
	
     $scope.showDaysSinceReg = false;
     $scope.showDaysSinceLastActivity = false;
     $scope.showProductRefs = false;
     $scope.showPlayerActivity = true;
	 
     $scope.playerActivityPiechartConfig = {
       options: {
            chart: {
				plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				colors: ['#ED561B', '#5C2508','#e45d15', '#50B432', '#058DC7'],
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
  				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		
		
            title: {
                text: 'Distribution',
				align: "left"
            },
                      
            series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readData($scope.distribution.period,'player_activity','player_activity','distribution',true)
            }],
		
            loading: false
    }
	
	
  	$scope.playerActivityBarchartConfig = {
       options: {
            chart: {
 
                type: 'column'            },
				color:['#ED561B', '#5C2508','#e45d15'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
			/*	  ,tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            }*/
        },
		
		
		
            title: {
                text: 'Future value',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'Future Value',
				data: readData($scope.distribution.period,'player_activity','player_activity','future_value',false),
				   dataLabels: {
                enabled: true,
				colorByPoint: true,
                align: 'right',
                format: '{point.y}', // one decimal
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	
  }
  
  
  $scope.displyProductPreference = function(){

     $scope.showDaysSinceReg = false;
     $scope.showDaysSinceLastActivity = false;
     $scope.showProductRefs = true;
     $scope.showPlayerActivity = false;

    $scope.productReferencePiechartConfig = {
       options: {
            chart: {
				plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'            },
				colors: ['#ED561B', '#5C2508','#e45d15', '#50B432', '#058DC7'],
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			
			legend: { enabled: true,
		          align: "right",
				  verticalAlign:"top",
  				  labelFormat: '{name}- {y}%',
				  layout:"vertical"},
				  credits: {
      enabled: false
  },
				  tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            },
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
        },
		
		
		
            title: {
                text: 'Distribution',
				align: "left"
            },
                      
            series: [{
                name: 'Distribution',
                colorByPoint: true,
                data: readData($scope.distribution.period,'product_preferences','Activity_type','distribution',true)
            }],
		
            loading: false
    }
	
	
  	$scope.productReferenceBarchartConfig = {
       options: {
            chart: {
 
                type: 'column'            },
				
				 plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },credits: {
      enabled: false
  },
			
			legend: { enabled: false},
			
												exporting:{
										
										buttons: {
											contextButton:{
												enabled : false
											}
										}
									}
									
			/*	  ,tooltip: {
                pointFormat: '{series.name}: <b>{point.y}%</b>'
            }*/
        },
		
		
		
            title: {
                text: 'Future value',
				align: "left"
            },
			
			        xAxis: {
            type: 'category',
            labels: {
							rotation : 0,

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
		
		yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
                      
            series: [{
                name: 'Future Value',
                data: readData($scope.distribution.period,'product_preferences','Activity_type','future_value',false),
				   dataLabels: {
                enabled: true,
                colorByPoint: true,
                align: 'right',
                format: '{point.y}', // one decimal
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
            }],
		
            loading: false
    }
	


	
  }
  
  
    $scope.lifeCycleStageSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true
    };

	
	$scope.lifeCycleStageTexts = {
                    checkAll: 'All',
                    uncheckAll: 'None',
                    selectionCount: 'checked',
                    selectionOf: '/',
                    searchPlaceholder: 'Quick Find...',
                    buttonDefaultText: 'Select',
                    dynamicButtonTextSuffix: 'checked'
                };

$scope.microSegEvents = {onSelectAll: function(item) {populateMicroSegmentsData();},
                         onItemDeselect: function(item) {populateMicroSegmentsData();},
						 onItemSelect: function(item) {populateMicroSegmentsData();},
						 onDeselectAll: function(item) {$scope.microSegmentList.data=[];},
						 onInitDone: function(item) {populateMicroSegmentsData(); }						 						 
						 };
				

function CheckScopeBeforeApply() {
    if(!$scope.$$phase) {
         $scope.$apply();
    }
};

function populateMicroSegmentsData(){
	    var j=0;
		var x_values = [];
	 	var microSegmentsData = readListData($scope.distribution.period,'micro_seg');
		var selectedLifeCycleOptions = $scope.lifeCycleStageModel;
		
		if(selectedLifeCycleOptions.length === 0){
			
			$scope.microSegmentList.data = [];
			return;
		}
		
		for(var selectedOptionsIndex=0; selectedOptionsIndex < selectedLifeCycleOptions.length; selectedOptionsIndex++){
			
			for(var microSegmentsDataIndex=0; microSegmentsDataIndex < microSegmentsData.length;microSegmentsDataIndex++){
				
				      if(microSegmentsData[microSegmentsDataIndex].life_cycle_stages === selectedLifeCycleOptions[selectedOptionsIndex].id){
	        
			            var xval =  microSegmentsData[microSegmentsDataIndex];
		                console.log("Data::",xval);
                        x_values[j] = xval;
                        j=j+1;
	                }   
						
			} 
		}
		
		$scope.microSegmentList.data = 	x_values;
        CheckScopeBeforeApply();

 }    
}])

})();
})(angular);