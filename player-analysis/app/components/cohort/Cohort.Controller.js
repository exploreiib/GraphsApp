(function () {
    'use strict';
    angular
	    .module('app')
		.controller('Cohort.Controller', function ($scope,$http,$applicationService) {
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
 
})

})();