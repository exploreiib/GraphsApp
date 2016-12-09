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
})

})();