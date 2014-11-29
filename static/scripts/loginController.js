var loginApp = angular.module('loginApp', []); 


loginApp.controller('loginSwitchDivController', [              
    '$scope', '$http',                             
	function loginSwitchDivController($scope, $http) {

		$scope.navigationOptionSelected = 'kezdolap';	// Kezdolap
		$scope.bejelentkezes = {};
		$scope.navigationStrip01_Clicked = function(optionString) {
			$scope.navigationOptionSelected = optionString;
		};
	}

]);  

loginApp.controller('regisztracioController', [              
	'$http','$scope', 
	function regisztracioController($http, $scope) {
	
		$scope.passError = false;
		$scope.checkboxError = false;
		
		$scope.testPasswords = function() {
			$scope.passError = $scope.adatok.pass1 !== $scope.adatok.pass2;
		};
		
		$scope.adatok = {};
		$scope.success = "";
		
		$scope.submit = function() {
			$scope.success = true;
			document.getElementById("pass1").value = document.getElementById("pass1").value;
			
			if( $("#tipus1CB").is(':checked') || $("#tipus2CB").is(':checked')) {
				$scope.checkboxError = false;
				$http.post('/register/', $scope.adatok)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					$scope.adatok = {};
					$scope.regisztracio.$setPristine();
					$scope.navigationStrip01_Clicked('regisztracioSuccess');
				});
			}
			else {
				$scope.checkboxError = true;
			}
		};

	}
]);  



function writeOutUserName( pID ){
	document.getElementById(pID).innerHTML =
	"Udv, " + localStorage.Nev;
}

function loginStoreSession( user ) {
	localStorage.setItem('ID', user[0]);
	localStorage.setItem('Nev', user[1]);
	localStorage.setItem('Jelszo', user[2]);
	localStorage.setItem('Termelo', user[3]);
	localStorage.setItem('Megrendelo', user[4]);
	writeOutUserName( "userUdvDiv" );
}

loginApp.controller('bejelentkezesController', [              
	'$http','$scope', '$window',
	function bejelentkezesController($http, $scope, $window) {
		
		$scope.log={};
		$scope.login = function() {
			$http.post('/login/', $scope.log)
				.success(function(data, status, headers, config) {
					$scope.bejelentkezes.loginSuccess = data.loginSuccess;
					$scope.bejelentkezes.loggedinUser = data.user;
					$scope.log = {};
					localStorage.setItem('test', 'marineni');
					loginStoreSession( $scope.bejelentkezes.loggedinUser );
					if(data.user[3] == 1)
						$window.location.href = '/termelo';
					else if(data.user[4] == 1)
						$window.location.href = '/megrendelo';
				});
		
		};

	}
]);  
