(function () {
    'use strict';

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