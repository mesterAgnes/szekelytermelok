var termeloApp = angular.module('termeloApp', ["xeditable", "checklist-model"]); 

termeloApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

termeloApp.controller('loginSwitchDivController', [              
    '$scope', '$http', '$window',                             
	function loginSwitchDivController($scope, $http, $window) {
	
		$scope.nev = localStorage.getItem('Nev');
		$scope.megrendelo = localStorage.getItem('Megrendelo');
		$scope.navigationOptionSelected01 = 'kezdolap';	// Kezdolap
		$scope.navigationStrip01_Clicked = function(optionString01) {
			$scope.navigationOptionSelected01 = optionString01;
		};
		$scope.navigationStrip02_Clicked = function(optionString02) {
			$scope.navigationOptionSelected02 = optionString02;
		};
		$scope.logout = function() {
			$window.location.href = '/logout';
		};
		$scope.megrendeloOldal = function() {
			$window.location.href = '/megrendelo';
		}
	}

]);


termeloApp.controller('termekFeltoltesController', [              
	'$http', '$scope', '$filter', 
	function termek_feltoltesController($http, $scope, $filter) {

		$scope.ujtermek = 0;	// ha csak termeket modositok, akkor ujtermek = 0, azaz csak UPDATE szukseges
								// ha uj termeket adtam hozza, akkor ujtermek = 1, vagyis INSERT szukseges
	
		$scope.mertekegysegek = { egyseg: [] };
		$scope.kategoriak = { kategoria: [] };
		$scope.penznemek = { penznemek: [] };

	
		$scope.vizsgalAr = function(data, id) {
			var filter = /-/;
			if (filter.test(data)) {
				return "A beírt ár nem megfelelő.";
			}
		};
		
		$scope.vizsgalRend_menny = function(data, id) {
			var filter = /-/;

			if (filter.test(data)) {
				return "A beírt mennyiség nem megfelelő.";
			}
		};
		
		$scope.vizsgalKeszlet_menny = function(data, id) {
			var filter = /-/;

			if (filter.test(data.trim())) {
				return "A beírt mennyiség nem megfelelő.";
			}
		};
		
		$scope.vizsgalNev = function(data, id) {
			var filter = /^([a-zA-Z,.; 0-9])+$/;
			if (!filter.test(data.trim())) {
				return "A beírt név nem megfelelő.";
			}
		};
		
		// termekek betoltese
		$scope.termekekBetolt = function() {
			$http.post('/termekbetoltes/', {})
			.success(function(data, status, headers, config) {
				$scope.termekek = data['termekek'];	
				$scope.mertekegysegek = data['mertekegysegek'];
				$scope.penznemek = data['penznemek'];
				$scope.kategoriak = data['kategoriak'];
			});
		};
		
		// termek lementese
		$scope.termekMent = function(data) {
			if($scope.ujtermek == 0) {
				$http.post('/termekmodositas/', data)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					alert('Sikeres feltöltés.');
				});
			}
			if($scope.ujtermek == 1) {
				$http.post('/termekfeltoltes/', data)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					alert('Sikeres feltöltés.');
				});
				$scope.ujtermek == 0;
			}
			
			$scope.termekekBetolt();
		};

		// termek torlese
		$scope.termekTorol = function(data, index) {
			$scope.termekek.splice(index, 1);
			
			$http.post('/termektorles/', data)
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				alert('Sikeres torles.');
			});
		};

		// termek hozzaadasa
		$scope.termekHozzaad = function() {
			$scope.inserted = {
				id: $scope.termekek.length+1,
				nev: '',
				leiras: '',
				ar: '',
				rend_menny: '',
				kep: '',
				keszlet_menny: ''
			};
			$scope.termekek.push($scope.inserted);
			
			$scope.ujtermek = 1;
		};
	}
]);  


termeloApp.controller('profilomController', function($scope, $filter, $http) {
	
	$scope.profilom_adatok = { nap: [] };
	
	$scope.napok = [
		{value:1, text: 'Hétfő'},
		{value:2, text: 'Kedd'},
		{value:3, text: 'Szerda'},
		{value:4, text: 'Csütörtök'},
		{value:5, text: 'Péntek'},
		{value:6, text: 'Szombat'},
		{value:7, text: 'Vasárnap'}
	];
	
	$scope.showNapok = function() {
		var selected = [];
		angular.forEach($scope.napok, function(n) {
			if ($scope.profilom_adatok.nap.indexOf(n.value) >= 0) {
				selected.push(n.text);
			}
		});
		return selected.length ? selected.join(', ') : 'Nincs kiválasztva';
	};
	
	// profilom eddig kitoltott adatainak betoltese
	$scope.profilomBetolt = function() {
		$http.post('/profilombetoltes/', {})
		.success(function(data, status, headers, config) {
			$scope.profilom = data['profilom'];
			$scope.penznemek = data['penznemek'];
			$scope.rendszeresseg = data['rendszeresseg'];
		});
	};
	
	// profilom lementese
	$scope.profilomMentes = function(data) {
		$http.post('/profilommodositas/', data)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Sikeres feltöltés.');
		});	
	}; 
});

termeloApp.controller('UzenetKuldesCtrl', function($scope, $filter, $http) {
	$scope.uzenetetKuld = function() {
		$http.post('/uzenetkuldes/', {})
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Az üzenetet sikeresen elküldtük!');
		});
	};
});


