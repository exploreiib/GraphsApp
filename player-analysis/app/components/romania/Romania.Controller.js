(function () {
    'use strict';

    angular
        .module('app')
        .controller('Romania.Controller', /* @ngInject */ function ($scope,$http,$applicationService) {
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
 
})

})();