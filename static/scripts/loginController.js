var loginApp = angular.module('loginApp', []); 


loginApp.controller('loginSwitchDivController', [              
    '$scope', '$http',                             
	function loginSwitchDivController($scope, $http) {

		$scope.navigationOptionSelected = 'kezdolap';	// Kezdolap
		jQuery( "button#kezdolap" ).attr("id","selected");

		$scope.navigationStrip_Clicked = function(option) {
			$scope.navigationOptionSelected = option;
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


loginApp.controller('bejelentkezesController', [              
	'$http','$scope', '$window',
	function bejelentkezesController($http, $scope, $window) {
		
		$scope.log = {};
		$scope.bejelentkezes = {};
		$scope.login = function() {
			loginAdatok = angular.copy($scope.log);  // ebben taroljuk a felhasznalo altal beirt adatokat
			loginAdatok.loginPass = md5(loginAdatok.loginPass);
			
			$http.post('/login/', loginAdatok)
			.success(function(data, status, headers, config) {
				$scope.bejelentkezes.loginSuccess = data.loginSuccess;
				// console.log($scope.bejelentkezes.loginSuccess);
				if ($scope.bejelentkezes.loginSuccess == false) {
					document.getElementById('helytelen').style.opacity = 1;
				}
				else {
					document.getElementById('helytelen').style.opacity = 0;
					$scope.bejelentkezes.loggedinUser = data.user;
					$scope.log = {};
					if($scope.bejelentkezes.loggedinUser[3] == 1)
						$window.location.href = '/termelo';
					else if($scope.bejelentkezes.loggedinUser[4] == 1)
						$window.location.href = '/megrendelo';
				} 	
			});
		};
	}
]);  


loginApp.directive('myNavigation', function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {            
			elm.bind("click", function () {
				jQuery("nav#navigationStrip1 button").attr("id","");
				
				var jqueryElm = $(elm[0]);
				$(jqueryElm).attr("id","selected");
			});
		}
    };
});

