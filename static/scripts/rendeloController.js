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
			});

		}
		$scope.logout = function() {
			$window.location.href = '/logout';
		};
		$scope.termeloOldal = function() {
			$window.location.href = '/termelo';
		}

	}

]);