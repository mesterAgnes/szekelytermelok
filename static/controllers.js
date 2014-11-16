var loginApp = angular.module('loginApp', []); 

loginApp.controller('loginSwitchDivController', [              
    '$scope',                              
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
		$scope.radioError = false;
		
		$scope.testPasswords = function() {
			$scope.passError = $scope.adatok.pass1 !== $scope.adatok.pass2;
		};
		
		$scope.adatok = {};
		$scope.success = "";
		
		// ezt itt meg at kell irni, mert igy mindig a Termelok-be szur be
		
		$scope.submit = function() {
			$scope.success = true;
			
			if( $('input[name=tipus]:checked').val() == "Termelo") {
				$scope.radioError = false;
				$http.post('/register/', $scope.adatok)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					$scope.adatok = {};
					$scope.regisztracio.$setPristine();
					$scope.navigationStrip01_Clicked('regisztracioSuccess');
				});
			}
			else if( $('input[name="tipus"]:checked').val() == "Megrendelo") {
				$scope.radioError = false;
				$http.post('/register/', $scope.adatok)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					$scope.adatok = {};
					$scope.regisztracio.$setPristine();
					$scope.navigationStrip01_Clicked('regisztracioSuccess');
				});
			}
			else {
				$scope.radioError = true;
			}
		};

	}
]);  



function writeOutUserName( pID ){
	document.getElementById(pID).innerHTML =
	"Udv, " + localStorage.Nev;
}

function loginStoreSession( user ) {
	localStorage.ID = user[0]; 	// passes the value of the userID to the local storage object
	localStorage.Nev = user[1];
	localStorage.Jelszo = user[2];
	
	writeOutUserName( "userUdvDiv" );
}



loginApp.controller('bejelentkezesController', [              
	'$http','$scope', 
	function bejelentkezesController($http, $scope) {
		
		$scope.log={};
		$scope.login = function() {
			$http.post('/login/', $scope.log)
				.success(function(data, status, headers, config) {
					$scope.bejelentkezes.loginSuccess = data.loginSuccess;
					$scope.bejelentkezes.loggedinUser = data.user;
					$scope.log = {};
					loginStoreSession( $scope.bejelentkezes.loggedinUser );
				//	$scope.bejelentkezesForm.$setPristine();
					$scope.navigationStrip01_Clicked('bejelentkezesSuccess');
				});
		
		};

	}
]);  

