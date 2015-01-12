var termeloApp = angular.module('termeloApp', ["xeditable", "checklist-model"]); 

termeloApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

termeloApp.controller('loginSwitchDivController', [              
    '$scope', '$http', '$window',                             
	function loginSwitchDivController($scope, $http, $window) {
		$scope.logoid = null;		   // a felhasznalo logoIDja
		$scope.nev = null;			   // a felhasznalo neve
		$scope.megrendelo = null;      // a felhasznalo termeloi statusza
		
		$scope.initFelhasznalo = function() {		// lekerjuk a felhasznalo adatait, vizsgaljuk, hogy a felhasznalo maradhat-e ezen az oldalon 
			$http.post('/lekerTermeloAdatok/', {})
			.success(function(data, status, headers, config) {
				
				if(data['ID'] == 'nincsID'){	// ha nincs beallitva a felhasznalo sessionje, visszalepunk a login oldalra
					$window.location.href = '/logout';
				}
				else {
					$scope.logoid = data['ID'];			   // logo IDja
					$scope.nev = data['Nev'];			   // a felhasznalo neve
					$scope.megrendelo = data['Megrendelo'] // a felhasznalo termeloi statusza(0 vagy 1), hogy tudjuk, megrendelokent is van-e szerepe
				}
			})
			.error(function(data, status, headers, config) {
				$window.location.href = '/logout';
			});
		}
		$scope.initFelhasznalo();	// user Session vizsgalat
		
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
		$scope.aktualizalPromociok = function(){	// a mai datum szerint vizsgaljuk a promociokat, ha valamelyik promocio lejart, azt toroljuk
			$http.post('/aktualizalPromociok/', {})
			.success(function(data, status, headers, config) {
			});
		}
		
		$scope.aktualizalPromociok();	// frissitjuk a Promociok tablat
		
		$scope.navigationOptionSelected = 'kezdolap';	// a Kezdolap a default
		jQuery( "button#kezdolap" ).attr("id","selected");
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

		$scope.vizsgalAr = function(data) {
			var filter = /^[0-9]+[\.]?[0-9]*$/;

			if (!filter.test(data)) {
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
		
		$scope.tablazatNagyit = function(){
			$(":input.nev").css("width", "200px");
			$(":input.leiras").css("width", "200px");
			$(":input.kategoria").css("width", "100px");
			$(":input.mertekegyseg").css("width", "80px");
			$(":input.ar").css("width", "50px");
			$(":input.rend_menny").css("width", "100px");
			$(":input.keszlet_menny").css("width", "100px");
		}
		
		// termekek betoltese
		$scope.termekekBetolt = function() {
			$http.post('/termekbetoltes/', {})
			.success(function(data, status, headers, config) {
				$scope.termekek = data['termekek'];	
				$scope.mertekegysegek = data['mertekegysegek'];
				$scope.kategoriak = data['kategoriak'];
				$scope.penznem = data['penznem'][0];
			});
		};
		
		// termek lementese
		$scope.termekMent = function(data) {
			console.log(data);
			if($scope.ujtermek == 0) {
				$http.post('/termekmodositas/', data)
				.error(function(data, status, headers, config) {
					showMyAlert("Hiba történt a módosítás során!");
				});
				if(document.getElementById('fileinput'+data['id']).value != "")
					document.getElementById('click'+data['id']).click();
			}
			if($scope.ujtermek == 1) {
				$http.post('/termekfeltoltes/', data)
				.error(function(data, status, headers, config) {
					showMyAlert("Hiba történt a termék beszúrása során!");
				});
				if(document.getElementById('fileinput').value != "")
					document.getElementById('click').click();
				$scope.ujtermek == 0;
			}
			$scope.termekekBetolt();
		};

		// termek torlese	
		$scope.termekTorol = function(id){
			console.log("ID:"+id);
		
			var $confirmBox=$("<div id='createdConfirmDiv' style='width:300px;max-width:95%'>");
			var $closeImg=$("<img id='closeImg' class='miniImg' src='./kepek/closeW2.png' height=30 onclick='$(\"div#createdConfirmDiv, div#overlayForCustomBoxes\").remove()'>");
			var $text=$("<span>CONFIRM?</span><br>");
			var $yButton=$("<button class='myConfirmButton' id='yesButton'>YES</button>");
			var $nButton=$("<button class='myConfirmButton' onclick='$(\"div#createdConfirmDiv, div#overlayForCustomBoxes\").remove()'>NO</button>");
			
			$yButton.on("click", function(){
				$("div#createdConfirmDiv, div#overlayForCustomBoxes").remove();	

				$http.post('/termektorles/', id)
				.success(function(data, status, headers, config) {
					showMyAlert("Sikeres törlés!");
					$scope.termekekBetolt();
				})
				.error(function(data, status, headers, config) {
					showMyAlert("Hiba történt a termék törlése során!");
				});
			});
			
			$confirmBox.append( $closeImg );
			$confirmBox.append( $text );
			$confirmBox.append( $yButton );
			$confirmBox.append( $nButton );
			
			$("body").prepend( $confirmBox );
			$("body").prepend("<div id='overlayForCustomBoxes'></div>");
			$("div#overlayForCustomBoxes").fadeTo(300,0.5);		
		}

		// termek hozzaadasa
		$scope.termekHozzaad = function() {
			$scope.inserted = {
				id: $scope.termekek.length+1,
				nev: '',
				leiras: '',
				kategoria: '',
				mertekegyseg: '',
				ar: '',
				penznem: '',
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
	
	$scope.profilom_adatok = { telepulesek: [] , napok: [] };
	
	// napokat kiir
	$scope.showNapok = function() {
		var selected = [];
		angular.forEach($scope.napok, function(n) {
			if ($scope.profilom_adatok.napok.indexOf(n.value) >= 0) {
				selected.push(n.text);
			}
		});
		return selected.length ? selected.join(', ') : 'Nincs kiválasztva';
	};
	
	// penznem aktualizal
	penznem_aktualizal = function() {
		data = document.getElementById('penznem').options[document.getElementById('penznem').selectedIndex].innerHTML;
		document.getElementsByClassName('penznem')[0].innerHTML = data;
	};
	
	// aktualizalt penznemet kiir
	$scope.showPenznem = function() {
		data = document.getElementsByClassName('penznem')[0].innerHTML;
		document.getElementById('penznem2').innerHTML = data;
		document.getElementById('penznem3').innerHTML = data;
	};
	
	// telepuleseket kiir
	$scope.showTelepulesek = function() {
		var selected = [];
		angular.forEach($scope.telepulesek, function(t) {
			if ($scope.profilom_adatok.telepulesek.indexOf(t.value) >= 0) {
				selected.push(t.text);
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
			$scope.telepulesek = data['telepulesek'];
			$scope.napok = data['napok'];
			$scope.profilom_adat = data['profilom_adat'];
			$scope.profilom_adatok.telepulesek = data['telepules_adat'];
			$scope.profilom_adatok.napok= data['nap_adat'];
		});
	};
	
	// profilom lementese
	$scope.profilomMentes = function(data) {
		console.log("mentes adatok:");
		console.log(data);
		if(document.getElementById('fileinputProfil').value != "")
			document.getElementById('clickProfil').click();
		$http.post('/profilommodositas/', data)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			showMyAlert('Sikeres feltöltés.');
			location.reload();
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
		$http.post('/jelszolekeres/', {})
		.success(function(data, status, headers, config) {
			$scope.pass = data['pass'];
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
			showMyAlert('Sikeres jelszó módosítás.');
		});	
	};
	
	$scope.telepError = false;
	// megvizsgaljuk, hogy a beirni kivant telepules mar letezik-e
	$scope.vizsgal_Telepules = function() {
		telepules = angular.copy($scope.adatok.telepules);  // ebben taroljuk a felhasznalo altal beirt uj telepules nevet
		
		if (telepules == null) {
			$scope.telepError = true;
		}
		else {
			$http.post('/telepulesvizsgalat/', {'telep':telepules})
			.success(function(data, status, headers, config) {
				$scope.telepError = data.success;
			});
		}
	};
	
	$scope.telepulesMentes = function() {
		telepules = angular.copy($scope.adatok.telepules);
		$http.post('/telepulesmentes/', {'telep':telepules})
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			showMyAlert('Sikeres település beszúrás.');
			$scope.profilomBetolt();
		});
	};
	
}]);

termeloApp.controller('termekPromFeltoltesController', [ '$http', '$scope', '$filter',
	function promociostermek_Controller($http, $scope, $filter) {
		// eddig feltoltott promocios termekek betoltese
		$scope.termekekPromBetolt = function() { 
			document.getElementById('termek_ismetlodes').style.opacity = 0;
			$http.post('/promtermekekbetoltes/', {})
			.success(function(data, status, headers, config) {
				$scope.termekek = data['termekek'];
				$scope.promtermekek = data['promtermekek'];
				$scope.datumok = data['datumok'];
				$scope.penznemek = data['penznemek'];
				$scope.promtermekek_regiadatai = data['promtermekek_regiadatai'];
			});
		};
		
		// a termek valtoztatasanal aktualizaljuk az adatokat
		promtermek_aktualizal = function(szam) {
			console.log(szam);
			data = document.getElementById('nev'+szam).options[document.getElementById('nev'+szam).selectedIndex].innerHTML;
			console.log(data);
			$http.post('/promtermek_aktualizal/', {'nev':data})
			.success(function(data, status, headers, config) {
				//$scope.promtermekek_regiadatai = data['promtermekek_regiadatai'];
				promtermekek_lista = data['promtermekek_lista'];
				// console.log(promtermekek_lista);
				if (($scope.promtermekek[szam] == null) && ($scope.promtermekek_regiadatai[szam] == null) ) {
					document.getElementById('id'+szam).innerHTML = promtermekek_lista[0];
					document.getElementById('ar'+szam).innerHTML = promtermekek_lista[2];
					document.getElementById('pid'+szam).innerHTML = promtermekek_lista[4];
				}
				else {
					$scope.promtermekek[szam][0] = promtermekek_lista[0];
					$scope.promtermekek_regiadatai[szam][2] = promtermekek_lista[2];
					$scope.promtermekek_regiadatai[szam][4] = promtermekek_lista[4];
				}
			});
		};
		
		$scope.termekError = false;
		
		$scope.vizsgalTermekek = function(data) {
			termek1 = data['nev0'];
			termek2 = data['nev1'];
			termek3 = data['nev2'];
			
			if (termek1 == null) 
				termek1 = "1";
			if (termek2 == null) 
				termek2 = "2";
			if (termek3 == null) 
				termek3 = "3";		
			
			if ((termek1 == termek2) || (termek1 == termek3) || (termek2 == termek3)) {
				document.getElementById('termek_ismetlodes').style.opacity = 1;
				return "Hiba!";
			}
			else {
				document.getElementById('termek_ismetlodes').style.opacity = 0;
				$scope.promtermekMent(data);
			}
		};
		
		$scope.vizsgalKitoltes = function(szam) {
			if (szam == 0) {
				nev = angular.copy($scope.tableform.nev0.$viewValue);
				ujar = angular.copy($scope.tableform.ar0.$viewValue);
				kdatum = angular.copy($scope.tableform.kezdeti_d0.$viewValue);
				vdatum = angular.copy($scope.tableform.vegso_d0.$viewValue);		
			}
			if (szam == 1) {
				nev = angular.copy($scope.tableform.nev1.$viewValue);
				ujar = angular.copy($scope.tableform.ar1.$viewValue);
				kdatum = angular.copy($scope.tableform.kezdeti_d1.$viewValue);
				vdatum = angular.copy($scope.tableform.vegso_d1.$viewValue);
			}
			if (szam == 2) {
				nev = angular.copy($scope.tableform.nev2.$viewValue);
				ujar = angular.copy($scope.tableform.ar2.$viewValue);
				kdatum = angular.copy($scope.tableform.kezdeti_d2.$viewValue);
				vdatum = angular.copy($scope.tableform.vegso_d2.$viewValue);
			}
			if (((nev == null) || (ujar == null) || (kdatum == null) || (vdatum == null)) && (!((nev == null) && (ujar == null) && (kdatum == null) && (vdatum == null)))) {
				return "A termék neve, új ára és a dátumok kitöltése is kötelező!";	
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
		
		$scope.vizsgalkezdetiDatum = function(data) {
			// lekerem az aktualis datumot, mert a promocio maximum a mai nappal kezdodhet
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
				dd='0'+dd
			} 
			if(mm<10) {
				mm='0'+mm
			} 
			today = yyyy+'-'+mm+'-'+dd;
			//console.log(today);
			
			if (data < today)
				return "A promóció leghamarabb ma kezdődhet!";
		};
		
		$scope.vizsgalUjAr = function(data,szam) {
			// console.log(data);  // promocios ar 
			// console.log(szam);
			regiar = parseInt(document.getElementById('ar'+szam).innerHTML);
			// console.log(regiar);
			if (regiar <= data)
				return "A promóciós ár kisebb kell legyen, mint a régi ár!";
		};
		
		// promocios termekek mentese
		$scope.promtermekMent = function(data) {
			$http.post('/promtermekekmodositas/', data)
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				showMyAlert('Sikeres feltöltés.');
			});
			$scope.termekekPromBetolt();
		};
		
		// promocios termekek torlese
		$scope.torol = function(szam) {
			termekid = parseInt(document.getElementById('id'+szam).innerHTML);
			$http.post('/promtermektorol/', {'id':termekid})
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				if ($scope.success == true)
					showMyAlert('Sikeres törlés.');
				else 
					showMyAlert('Hiba a törlés közben.');	
			});
			$scope.termekekPromBetolt();
		}
		
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
		.error(function(data, status, headers, config) {
			showMyAlert('Hiba történt a módosítás során.');
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




