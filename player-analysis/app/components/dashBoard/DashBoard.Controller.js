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