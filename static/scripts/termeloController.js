var termeloApp = angular.module('termeloApp', ["xeditable", "checklist-model"]); 

termeloApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

termeloApp.controller('loginSwitchDivController', [              
    '$scope', '$http', '$window',                             
	function loginSwitchDivController($scope, $http, $window) {
	
		$scope.megrendelo =  localStorage.getItem('Megrendelo');	// lekerjuk a felhasznalo termeloi statuszat(0 vagy 1), hogy tudjuk, megrendelokent is van-e szerepe	
		$scope.logoid = localStorage.getItem('ID');
		$scope.nev = localStorage.getItem('Nev');

		$scope.navigationOptionSelected = 'kezdolap';	// Kezdolap
		jQuery( "button#kezdolap" ).attr("id","selected");
		
		$scope.navigationStrip1_Clicked = function(option) {
			$scope.navigationOptionSelected = option;
		};
		$scope.navigationStrip2_Clicked = function(option) {
			$scope.navigationOptionSelected = option;
		};
		$scope.logout = function() {
			$window.location.href = '/logout';
		};
		$scope.megrendeloOldal = function() {
			$window.location.href = '/megrendelo';
		}
		
		$scope.aktualizalPromociok = function(){
		;
		}
	}

]);


termeloApp.controller('termekFeltoltesController', [              
	'$http', '$scope', '$filter', 
	function termek_feltoltesController($http, $scope, $filter) {
	
		$scope.sorModosithato = false;
		$scope.sorModositas = function(value) {
			$scope.sorModosithato = value;
		};
		
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

			if (filter.test(data)) {
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
					location.reload();
				});
				if(document.getElementById('fileinput'+data['id']).value != "")
					document.getElementById('click'+data['id']).click();
			}
			if($scope.ujtermek == 1) {
				$http.post('/termekfeltoltes/', data)
				.success(function(data, status, headers, config) {
					$scope.success = data.success;
					alert('Sikeres feltöltés.');
					location.reload();
				});
				if(document.getElementById('fileinput').value != "")
					document.getElementById('click').click();
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
		
		$scope.cancelAdd = function() {
			if ($scope.ujtermek == 1) {
				$scope.termekek.pop();
				$scope.ujtermek = 0;
			}
		}
	}
]);  


termeloApp.controller('profilomController', [ '$http', '$scope', '$filter', 
	function profilom_Controller($http, $scope, $filter) {
	
	$scope.profilom_adatok = { nap: []};
	$scope.selected = [];
	
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
		$scope.selected = [];
		angular.forEach($scope.napok, function(n) {
			if ($scope.profilom_adatok.nap.indexOf(n.value) >= 0) {
				$scope.selected.push(n.text);
			}
		});
		return $scope.selected.length ? $scope.selected.join(', ') : 'Nincs kiválasztva';
	};
	
	// profilom eddig kitoltott adatainak betoltese
	$scope.profilomBetolt = function() {
		$http.post('/profilombetoltes/', {})
		.success(function(data, status, headers, config) {
			$scope.profilom = data['profilom'];
			$scope.penznemek = data['penznemek'];
			$scope.rendszeresseg = data['rendszeresseg'];
			$scope.profilom_adat = data['profilom_adat'];
		});
	};
	
	// profilom lementese
	$scope.profilomMentes = function(data) {
		if(document.getElementById('fileinputProfil').value != "")
			document.getElementById('clickProfil').click();
		$http.post('/profilommodositas/', data)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Sikeres feltöltés.');
			
		});	
	}; 
	
	$scope.vizsgalEmail = function(data) {
		var filter = /[@][a-z]+[\.][a-z]*$/;
		if (!filter.test(data)) {
			return "A megadott e-mail cím nem megfelelő.";
		}
	};
	
	$scope.vizsgalAr = function(data) {
		var filter = /^[0-9]+[\.]?[0-9]*$/;

		if (!filter.test(data)) {
			return "A beírt ár nem megfelelő.";
		}
	};
	
	$scope.regipassError = false;
	$scope.passError = false;
	
	$scope.vizsgal_regiPassword = function() {
		regipass = angular.copy($scope.adatok.regipass);
		regipass = md5(regipass);   // ebben taroljuk a felhasznalo altal beirt jelszot
		// console.log(regipass);
		$http.post('/jelszolekeres/', {})
		.success(function(data, status, headers, config) {
			$scope.pass = data['pass'];
			// console.log($scope.pass[0]);
		});	
		$scope.regipassError = $scope.pass[0] !== regipass; 
	};
	
	$scope.vizsgalPasswords = function() {
		$scope.passError = $scope.adatok.ujpass1 !== $scope.adatok.ujpass2;
	};
	
	// jelszo modositas
	$scope.jelszoModositas = function() {
		Adatok = angular.copy($scope.adatok);
		Adatok.ujpass1 = md5(Adatok.ujpass1);
		console.log(Adatok.ujpass1)
		$http.post('/jelszomodositas/', Adatok)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Sikeres jelszó módosítás.');
		});	
	};
	
}]);

termeloApp.controller('termekPromFeltoltesController', [ '$http', '$scope', '$filter',
	function promociostermek_Controller($http, $scope, $filter) {
	
		// eddig feltoltott promocios termekek betoltese
		$scope.termekekPromBetolt = function() {  
			$http.post('/promtermekekbetoltes/', {})
			.success(function(data, status, headers, config) {
				$scope.termekek = data['termekek'];
				$scope.promtermekek = data['promtermekek'];
				console.log($scope.promtermekek);
				$scope.datumok = data['datumok'];
				$scope.penznemek = data['penznemek'];
				$scope.promtermekek_regiadatai = data['promtermekek_regiadatai']
			});
		};
		
		// a termek valtoztatasanal aktualizaljuk az adatokat
		promtermek_aktualizal = function(szam) {
			// console.log(szam);
			data = document.getElementById('nev'+szam).options[document.getElementById('nev'+szam).selectedIndex].innerHTML;
			// console.log(data);
			$http.post('/promtermek_aktualizal/', {'nev':data})
			.success(function(data, status, headers, config) {
				//$scope.promtermekek_regiadatai = data['promtermekek_regiadatai'];
				promtermekek_lista = data['promtermekek_lista'];
				// console.log(promtermekek_lista);
				$scope.promtermekek[szam][0] = promtermekek_lista[0];
				$scope.promtermekek_regiadatai[szam][2] = promtermekek_lista[2];
				$scope.promtermekek_regiadatai[szam][4] = promtermekek_lista[4];
			});
		};
		
		$scope.termekError = false;
		
		$scope.vizsgalTermekek = function(data) {
			termek1 = data['nev0'];
			termek2 = data['nev1'];
			termek3 = data['nev2'];
			//console.log(termek1);
			//console.log(termek2);
			//console.log(termek3);
			
			if ((termek1 == termek2) || (termek1 == termek3) || (termek2 == termek3)) {
				document.getElementById('termek_ismetlodes').style.opacity = 1;
				return "Hiba!";
			}
			else {
				document.getElementById('termek_ismetlodes').style.opacity = 0;
				$scope.promtermekMent(data);
			}
		};
		
		$scope.vizsgalDatum = function(data, szam) {
			vdatum = data;
			// console.log(vdatum);
			if (szam == 0) {
				kdatum = angular.copy($scope.tableform.kezdeti_d0.$viewValue);
			}
			if (szam == 1) {
				kdatum = angular.copy($scope.tableform.kezdeti_d1.$viewValue);
			}
			if (szam == 2) {
				kdatum = angular.copy($scope.tableform.kezdeti_d2.$viewValue);
			}
			// console.log(kdatum);
		    if (kdatum > vdatum) {
					return "A kezdeti dátum nem lehet később, mint a befejezés!";
			}
		};
		
		$scope.vizsgalUjAr = function(data,szam) {
			// console.log(data);  // promocios ar 
			// console.log(szam);
			regiar = parseInt(document.getElementById('ar'+szam).innerHTML);
			// console.log(regiar);
			if (regiar <= data)
				return "A promóciós ár kevesebb kell legyen, mint a régi ár!";
		};
		
		// promocios termekek mentese
		$scope.promtermekMent = function(data) {
			$http.post('/promtermekekmodositas/', data)
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				alert('Sikeres feltöltés.');
			});
			$scope.termekekPromBetolt();
		};
		
		/* $scope.showStatus = function(promtermekek_regiadatai[szam][1]) {
			var selected = [];
			selected = $filter('filter')($scope.termekek, {value: promtermekek_regiadatai[szam][1]});
			return selected.length ? selected[0].text : 'Not set';
		}; */ 
	}	
]);

termeloApp.controller('MegrendelesekController', function($scope, $filter, $http) {
	$scope.sorModosithato = false;
	$scope.sorModositas = function(value) {
		$scope.sorModosithato = value;
	};
	
	$scope.megrendelesekBetolt = function() {
		$http.post('/megrendeleseim/', {})
		.success(function(data, status, headers, config) {
			$scope.rendeleseim = data['rendeleseim'];
			$scope.datumok = data['datumok']
			$scope.termeknevek = data['termeknevek'];
			$scope.mertekegysegek = data['mertekegysegek']
			$scope.penznemek = data['penznemek'];
			$scope.megrendelonevek = data['megrendelonevek'];
			$scope.statuszok = data['statuszok'];
			$scope.osszesstatusz = data['osszstat'];
			$scope.megrendelesek = [];
			$scope.statusz = [];
			
			for	(i = 0; i < $scope.osszesstatusz.length; i++) {
				$scope.statusz.push({text:$scope.osszesstatusz[i] , value:i+1});
			} 
			
			for	(i = 0; i < $scope.rendeleseim.length; i++) {
				$scope.megrendelesek[i] = {
					'0' : $scope.termeknevek[i],
					'1' : $scope.rendeleseim[i][1],
					'2' : $scope.statuszok[i],
					'3' : $scope.datumok[i],
					'4' : $scope.rendeleseim[i][0],
					'5' : $scope.rendeleseim[i][3],
					'6' : $scope.penznemek[i],
					'7' : $scope.mertekegysegek[i],
					'8' : $scope.megrendelonevek[i],
					'9' : $scope.rendeleseim[i][3]*$scope.rendeleseim[i][1],
					'10': $scope.rendeleseim[i][2]
				}
			}
		});
	}
	
	$scope.statuszMent = function(data) {
		console.log(data);
		$http.post('/megrendelesMent/', data)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Sikeres modositas.');
		});
		$scope.megrendelesekBetolt();
	};
	
	$scope.cancelModify = function() {
		$scope.megrendelesekBetolt();
	};
});

termeloApp.controller('UzenetKuldesCtrl', function($scope, $filter, $http) {
	$scope.uzenetKuldes = function() {
		$scope.adatok.datum = new Date();
		$http.post('/uzenetkuldes/', $scope.adatok)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			$scope.navigationStrip02_Clicked('uzenetSuccess');		
		});
	};
	
});


termeloApp.directive('myNavigation', function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {            
			elm.bind("click", function () {
				jQuery("nav#navigationStrip1 button").attr("id","");
				jQuery("nav#navigationStrip2 button").attr("id","");
				
				var jqueryElm = $(elm[0]);
				$(jqueryElm).attr("id","selected");
			});
		}
    };
});



