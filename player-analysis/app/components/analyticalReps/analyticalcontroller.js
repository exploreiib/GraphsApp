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