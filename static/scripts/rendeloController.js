var loginApp = angular.module('loginApp', []); 
var megrendeloApp = angular.module('megrendeloApp', []); 


megrendeloApp.controller('loginSwitchDivController', [              
    '$scope', '$http', '$window',                       
	function loginSwitchDivController($scope, $http, $window) {
		$scope.nev = localStorage.getItem('Nev');
		$scope.termelo = localStorage.getItem('Termelo');

		$scope.termekadatok = {};
		$scope.navigationOptionSelected01 = 'kezdolap';	// Kezdolap
		$scope.kosar = {};
		$scope.navigationStrip01_Clicked = function(optionString01) {
			$scope.navigationOptionSelected01 = optionString01;
		};
		$scope.navigationOptionSelected03 = 'm_termekek';	// Profilom
		$scope.uzenetkuldes = {};
		$scope.navigationStrip03_Clicked = function(optionString03) {
			$scope.navigationOptionSelected03 = optionString03;
		};
		$scope.termekekBetoltes = function() {
			$http.post('/mindentermek/', {})
			.success(function(data, status, headers, config) {
				$scope.termekadatok = data['termekek']
				$scope.navigationStrip03_Clicked('m_termekek');
				$scope.termekLeirasVisible = false;
			});

		}
		$scope.logout = function() {
			$window.location.href = '/logout';
		};
		$scope.termeloOldal = function() {
			$window.location.href = '/termelo';
		}
		
		$scope.termekLeirasVisible = false;
		$scope.showTermek = function(termek) {
			$scope.termekLeirasVisible = true;
			$scope.kivalasztottTermek = termek;
		}

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
		$scope.adatok.tipus1CB = false;
		$scope.adatok.tipus2CB = false;
		$scope.success = "";
		
		$scope.testTipus = function() {
			$scope.checkboxError = !$scope.adatok.tipus1CB && !$scope.adatok.tipus2CB;
		}
		
		$scope.submit = function() {
			$scope.success = true;
			document.getElementById("pass1").value = document.getElementById("pass1").value;
			if( $scope.adatok.tipus1CB || $scope.adatok.tipus2CB) {
				$scope.checkboxError = false;
				regisztracioAdatok = angular.copy($scope.adatok);
				regisztracioAdatok.pass1 = md5(regisztracioAdatok.pass1);
				regisztracioAdatok.pass2 = "";

				$http.post('/register/', regisztracioAdatok)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					$scope.adatok = {};
					$scope.adatok.tipus1CB = false;
					$scope.adatok.tipus2CB = false;
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
			loginAdatok = angular.copy($scope.log);
			loginAdatok.loginPass = md5(loginAdatok.loginPass);
			$http.post('/login/', loginAdatok)
				.success(function(data, status, headers, config) {
					$scope.bejelentkezes.loginSuccess = data.loginSuccess;
					$scope.bejelentkezes.loggedinUser = data.user;
					console.log($scope.bejelentkezes.loggedinUser);
					$scope.log = {};
					loginStoreSession( $scope.bejelentkezes.loggedinUser );
					if($scope.bejelentkezes.loggedinUser[3] == 1)
						$window.location.href = '/termelo';
					else if($scope.bejelentkezes.loggedinUser[4] == 1)
						$window.location.href = '/megrendelo';
				});
		
		};

	}
]);  
