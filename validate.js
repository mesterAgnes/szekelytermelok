function userController($scope) {

	$scope.error = false;
	$scope.incomplete = false; 

	$scope.$watch('pass1',function() {$scope.test();});
	$scope.$watch('pass2',function() {$scope.test();});
	$scope.$watch('nev', function() {$scope.test();});
	$scope.$watch('cim', function() {$scope.test();});
	$scope.$watch('tel', function() {$scope.test();});

	$scope.test = function() {
	  if ($scope.pass1 !== $scope.pass2) {
		$scope.error = true;
	  } 
	  else {
		$scope.error = false;
	  }
	  $scope.incomplete = false;
	  if ($scope.edit && (!$scope.nev.length || !$scope.cim.length || !$scope.tel.length || !$scope.pass1.length || !$scope.pass2.length)) {
		   $scope.incomplete = true;
	  }
	};

}