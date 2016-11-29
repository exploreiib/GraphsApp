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
(function () {
    'use strict';

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

    angular
        .module('app')
        .controller('CustomerModel.Controller', function ($scope,$http,$applicationService) {

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
			
			legend: { enabled: false}
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
			
			legend: { enabled: false}
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
							
			legend: { enabled: false}
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
			
			legend: { enabled: false}
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
			
			legend: { enabled: false}
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
})

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashBoard.Controller', function ($scope,$http,$anchorScroll,$applicationService,$window) {

 
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
  
  
 })

})();
(function () {
    'use strict';

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

    angular
        .module('app')
        .controller('analyticalcontroller', ARepController);

    function ARepController(UserService,$scope,$http,$applicationService) {
        var vm = this;
        alert("Here");
        vm.user = null;
        $scope.trend = { "value" : "Net Revenue"};
		$scope.distribution = { "period" : "2016_09_10"};
		$scope.meCampList = {
			data: []
		};
		$scope.meCampList.data = readListData($scope.distribution.period,'valueseg');
		
		
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
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

		
    }

})();
(function () {
    'use strict';

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