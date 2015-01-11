var megrendeloApp = angular.module('megrendeloApp', ["xeditable", "checklist-model"]); 


megrendeloApp.controller('m_profilomController', [ '$http', '$scope', '$filter', 'kozosProfil',
	function m_profilom_Controller($http, $scope, $filter, kozosProfil) {
	
	// profilom eddig kitoltott adatainak betoltese
	$scope.m_profilomBetolt = function() {
		$http.post('/m_profilombetoltes/', {})
		.success(function(data, status, headers, config) {
			$scope.profilom = data['profilom'];
		});
	};
	
	// profilom lementese
	$scope.m_profilomMentes = function(data) {
		console.log("m_profilom lementese");
		$http.post('/m_profilommodositas/', data)
		.success(function(data, status, headers, config) {
			$scope.success = data.success;
			alert('Sikeres módosítás.');
		});	
	}; 
	
	$scope.vizsgalEmail = function(data) {
		var filter = /[@][a-z]+[\.][a-z]*$/;
		if (!filter.test(data)) {
			return "A megadott e-mail cím nem megfelelo.";
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
	
		
	$scope.getRendelesProfil = function(){
		return kozosProfil.getRendelesProfilBool();
	}
	
	$scope.setRendelesProfil = function(value){
		kozosProfil.setRendelesProfilBool(value);
	}
	
}]);

megrendeloApp.controller('termekekController', [              
    '$scope', '$http', '$window', 'kozosProfil',                      
	function termekekController($scope, $http, $window, kozosProfil) {

		$scope.nev = localStorage.getItem('Nev');
		$scope.termelo =  localStorage.getItem('Termelo');		// lekerjuk a felhasznalo termeloi statuszat(0 vagy 1), hogy tudjuk, termelokent is van-e szerepe	

		// a termekek adatai:	
		$scope.termekadatok = {};		// termekek altalanos adatai
		$scope.termekIDk = [];			// termekek IDjai
		$scope.termekadat = {};			// a termekReszletek divben megjelenitett termek adatai 
		$scope.aktualisTermekIndex = new Number(); // a termekReszletek divben megjelenitett termek IDja

		$scope.navigationOptionSelected = 'kezdolap';	// Kezdolap van alapertelmezetten megjelenitve
		jQuery( "button#kezdolap" ).attr("id","selected");
		
		$scope.navigationStrip1_Clicked = function(optionString) {
			$scope.navigationOptionSelected = optionString;
		};	
		$scope.navigationStrip2_Clicked = function(optionString) {
			$scope.navigationOptionSelected = optionString;
		};

		$scope.logout = function() {
			$window.location.href = '/logout';
		};
		$scope.termeloOldal = function() {
			$window.location.href = '/termelo';
		}
		
		// promociok aktualizalasa:
		$scope.aktualizalPromociok = function(){	// a mai datum szerint vizsgaljuk a promociokat, ha valamelyik promocio lejart, azt toroljuk
			$http.post('/aktualizalPromociok/', {})
			.success(function(data, status, headers, config) {
			});
		}
		
		$scope.aktualizalPromociok();

		// tobb termek altalanos adatainak lekerese:
		$scope.termekekBetoltes = function( opcio ) {
			
			if(opcio == "alt") {	// minden termek altalanos adatainak lekerese:
				$http.post('/mindentermek/', {})
				.success(function(data, status, headers, config) {
					$scope.termekadatok = data['termekek'];
					var promok = data['promok'];
					setWhetherProm($scope.termekadatok, false);	// beallitunk egy erteket, hogy az illeto termekek promociosak vagy sem
					setWhetherProm(promok, true);
					
					$scope.termekadatok = mergeArrays($scope.termekadatok, promok);
					promok = null;
					
					console.log($scope.termekadatok);
					
					if($scope.termekadatok.length == 0){
						$scope.navigationStrip2_Clicked('nincstermek');
					}
					else {
						// termekek IDjainak lementese a termekIDk tombbe:
						for	(i = 0; i < $scope.termekadatok.length; i++) {
							$scope.termekIDk[i] = $scope.termekadatok[i][0];
						}
						
						$scope.navigationStrip2_Clicked('termekek');
					}
				});
			}
			else {		// csak a promocios termekek altalanos adatainak lekerese:
				$http.post('/mindenpromtermek/', {})
				.success(function(data, status, headers, config) {
					$scope.termekadatok = data['termekek'];
					setWhetherProm($scope.termekadatok, true);
					
					console.log($scope.termekadatok);
					
					if($scope.termekadatok.length == 0){
						$scope.navigationStrip2_Clicked('nincspromtermek');
					}
					else {
						// termekek IDjainak lementese a termekIDk tombbe:
						for	(i = 0; i < $scope.termekadatok.length; i++) {
							$scope.termekIDk[i] = $scope.termekadatok[i][0];
						}
						
						$scope.navigationStrip2_Clicked('promtermekek');
					}
				});
			}
		}
		
		$scope.showTermekReszletImgClick = function(id, opcio) {
			$scope.aktualisTermekIndex = getIndexByValue( id, $scope.termekIDk );  // beallitjuk az aktualis termeknek megfelelo indexet, ami a termekIDk tombben levo pozicio
			$scope.showTermekReszlet(id, opcio);	// termek megjelenitese
		}
		
		
	// promocios termek adatainak lekerdezese es kiiratasa:	
		$scope.showTermekReszlet_prom = function(id) {
			$http.post('/egypromtermek/', id)
			.success(function(data, status, headers, config) {
				$scope.termekadat = data['termek'];
				
				// a kapott datumok formazasa:
				$scope.termekadat[0][11] = $scope.termekadat[0][11].slice(1, -1);
				$scope.termekadat[0][12] = $scope.termekadat[0][12].slice(1, -1);
				$scope.termekadat[0][11] = $scope.termekadat[0][11].replace(/-/g, ".");
				$scope.termekadat[0][12] = $scope.termekadat[0][12].replace(/-/g, ".");
				
				// kategoria formazasa:
				$scope.termekadat[0][8] =  $scope.termekadat[0][8].toUpperCase();
				
				console.log($scope.termekadat);
				
				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadat[0][3]+"')");
				$( "input.kosarba" ).val(1);
				$( '#mertekegyseg' ).html( "   " + $scope.termekadat[0][9] );
				$( '#termekNev' ).html( $scope.termekadat[0][0] );
				
				$( '#termekLeirasID' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][1] );
				$( '#termekKategoria' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][8] );
				
				// a tablazat adatai:
				$( '#termekTermeloTd' ).html( $scope.termekadat[0][6] );
				$( '#termekMinMennyTd' ).html( $scope.termekadat[0][4] + " " + $scope.termekadat[0][9] );
				
				$("tr#arTr").first().html("<th>Régi ár: </th><td>"+$scope.termekadat[0][2] + " " + $scope.termekadat[0][7]+"</td>");
				
				if ( $( "tr#ujarTr" ).length )
					$("tr#ujarTr").first().html("<th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadat[0][10]+" "+$scope.termekadat[0][7]+"</td>");				
				else
					$("tr#arTr").after("<tr id='ujarTr'><th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadat[0][10]+" "+$scope.termekadat[0][7]+"</td></tr>");
				
				if ( $( "tr#promDatum" ).length )
					$("tr#promDatum").first().html("<th id='promDatum'>A promóció érvényessége: </th><td id='promDatum'>"+$scope.termekadat[0][11]+" - "+$scope.termekadat[0][12]+"</td>");				
				else
					$("tr#ujarTr").after("<tr id='promDatum'><th id='promDatum'>A promóció érvényessége: </th><td id='promDatum'>"+$scope.termekadat[0][11]+" - "+$scope.termekadat[0][12]+"</td></tr>");
			
				
				if($scope.termekadat[0][5] == "0")
					$( '#termekKeszletMennyTd' ).html( "Nincs készleten." );
				else
					$( '#termekKeszletMennyTd' ).html( $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] );
			});	
		}
		
	// altalanos, nem promocios termek adatainak lekerdezese es kiiratasa:
		$scope.showTermekReszlet_alt = function(id) {
			$http.post('/egytermek/', id)
			.success(function(data, status, headers, config) {
				$scope.termekadat = data['termek'];
				
				// kategoria formazasa:
				$scope.termekadat[0][8] =  $scope.termekadat[0][8].toUpperCase();

				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadat[0][3]+"')");
				$( "input.kosarba" ).val(1);
				$( '#mertekegyseg' ).html( "   " + $scope.termekadat[0][9] );
				$( '#termekNev' ).html( $scope.termekadat[0][0] );
				$( '#termekLeirasID' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][1] );
				$( '#termekKategoria' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][8] );
				
				$( '#termekTermeloTd' ).html( $scope.termekadat[0][6] );
				$( '#termekMinMennyTd' ).html( $scope.termekadat[0][4] + " " + $scope.termekadat[0][9] );
				
				$( "tr#arTr" ).first().html("<th>Ár: </th><td>"+$scope.termekadat[0][2] + " " + $scope.termekadat[0][7]+"</td>");
				if ( $( "tr#ujarTr" ).length ) {
					$( "tr#ujarTr" ).remove();
				}
				if ( $( "tr#promDatum" ).length ) {
					$( "tr#promDatum" ).remove();
				}
				
				if($scope.termekadat[0][5] == "0") 
					$( '#termekKeszletMennyTd' ).html( "Nincs készleten." );
				else
					$( '#termekKeszletMennyTd' ).html( $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] );
				
			});	
		}
		
	// egy termek reszletes, sajatos adatainak megjelenitese:
		$scope.showTermekReszlet = function(id, opcio) {
			$("body div#overlay").remove();
			$("body").prepend("<div id='overlay'></div>");
			$("body div#overlay").fadeTo(0,0);
			//fadeTo(speedInMilliSec, opacityToReach)
			if(opcio === "promo"){    // biztosan egy promocios termek megjelenitese
				$scope.showTermekReszlet_prom(id);
			}
			else{
			// vizsgaljuk, hogy promocios termek-e
				var ind = getIndexByValue(id, $scope.termekIDk);
				if($scope.termekadatok[ind][7])	// ha a megfelelo indexu termek promocios termek
					$scope.showTermekReszlet_prom(id);
				else
					$scope.showTermekReszlet_alt(id);	
			}	
		}

		
		$scope.showPrevTermek = function(option) {	
			if(parseInt($scope.aktualisTermekIndex) == 0)	
				$scope.aktualisTermekIndex = $scope.termekIDk.length - 1;	
			else
				$scope.aktualisTermekIndex = $scope.aktualisTermekIndex - 1;	
			// megjelenitjuk az adatokat:
			$scope.showTermekReszlet( $scope.termekIDk[$scope.aktualisTermekIndex] , option );
		}	
		
		$scope.showNextTermek = function(option) {
			if(parseInt($scope.aktualisTermekIndex) == $scope.termekIDk.length - 1)	
				$scope.aktualisTermekIndex = 0;	
			else
				$scope.aktualisTermekIndex = $scope.aktualisTermekIndex + 1;	
			// megjelenitjuk az adatokat:
			$scope.showTermekReszlet( $scope.termekIDk[$scope.aktualisTermekIndex] , option );
		}
		
		
	// ------------------ Kosarba funkcio	--------------------------------
		$scope.kosar = []; 		// a kosar termekekbol allo tomb, szerkezete: kosar = [ { id: 1 , nev: 'Gyumolcs' , termelo:'Maria' , mennyiseg:'1' , mertekegyseg:'darab', ar:'5 RON' } , { ... } ]	 	
		
		$scope.kosarba = function(option) {
		
			var id = $scope.termekIDk[$scope.aktualisTermekIndex]; 	// a kosarba rakott termek IDja
							
			// vizsgaljuk, hogy aktualisak-e az adatok
			$http.post('/vizsgaltermek/', id )
			.success(function(data, status, headers, config) {
			
				var adatok = data['termek'];

				if( $scope.termekadat[0][4] == adatok[0][0] && $scope.termekadat[0][5] == adatok[0][1] )
					$scope.kosarbaValid(id);		
				else{		// ha az adatok nem aktualisak, akkor aktualizaljuk az adatokat, ujra kiiratjuk a termeket, es csak ezutan hivjuk meg a kosarbaValid fuggvenyt 
					$scope.termekadat[0][4] = adatok[0][0];
					$scope.termekadat[0][5] = adatok[0][1];
					$scope.showTermekReszlet(id, option);	
					$scope.kosarbaValid(id);
				}
				
			})
			.error(function(data, status, headers, config) {
				showMyAlert( "Hiba a kosárba való hozzáadás közben!" );
				return;
			});
		}
		
		
		$scope.kosarbaValid = function(id) {	// az mennyisegek helyesek, a mennyisegek eldontjuk, hogy kosarba kerul-e a termek vagy sem  
						
			var menny = parseInt($( "input.kosarba" ).val()); 	// a kosarba rakando mennyiseg (input-ba irt szam)
			
			if( menny == 0 )
				return;
				
			if($scope.termekadat[0][5] == 0) {
				showMyAlert( "Ebből a termékből jelenleg nincs a készleten." );
			}
			else if($scope.termekadat[0][5] < $scope.termekadat[0][4]){	// a keszleten levo mennyiseg kisebb, mint a minimalis rendelesi mennyiseg
				showMyAlert( "Ebből a termékből jelenleg nincs elegendő mennyiség készleten." );
			}
			else if( menny < $scope.termekadat[0][4]){
				showMyAlert( "Ebből a termékből a minimális rendelési mennyiség "+ $scope.termekadat[0][4] + " " + $scope.termekadat[0][9] + "." );
			}
			else if( menny > $scope.termekadat[0][5]){
				showMyAlert( "Ebből a termékből jelenleg csak " + $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] + " van készleten." );
			}
			else{
				
				// az adatbazisban csokkentjuk a keszleten levo mennyiseget, es aktualizaljuk a Kosarak tablat:
				$http.post('/kosarbatermek/', {id: id, nr: menny} )
				.success(function(data, status, headers, config) {					
					// csokkentjuk a keszleten levo mennyiseget:
					$scope.termekadat[0][5] = parseInt($scope.termekadat[0][5]) - menny;
					
					// a termekReszletek megjelenitesenel csokkentjuk a kiirt mennyiseget:
					if($scope.termekadat[0][5] == 0)
						$( '#termekKeszletMennyTd' ).html( "Nincs készleten." );
					else
						$( '#termekKeszletMennyTd' ).html( $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] );

					// visszajelzes a felhasznalonak	
					showMyAlert( "A kívánt mennyiséget hozzáadtuk a kosarához." );	
				})
				.error(function(data, status, headers, config) {
					showMyAlert( "Hiba történt a kosárba való hozzáadás közben!" );
				});	
			}	
		}
		
		
		$scope.kiirKosar = function(){
			
			$http.post('/lekerdezkosar/', {})
			.success(function(data, status, headers, config) {	
				var kosar = data['result'];
				if ( kosar != null && kosar != "undefined" && kosar == "Nincs_termek" ) {
					$scope.navigationStrip1_Clicked('ureskosar');
					return;		// ha a kosar ures, megjelenitjuk az uzenetet, es kilepunk
				}
				else {
					$scope.kosar = data['termekek'];
					var promok = data['promok'];
					$scope.kosar = mergeArrays($scope.kosar, promok);
					promok = null;
					
					$scope.navigationStrip1_Clicked('kosar');
				}
			})
			.error(function(data, status, headers, config) {
				showMyAlert( "Hiba történt a kosár megjelenítése közben!" );
			});				
		}	
		
		
		// ------------- Kosar tartalmanak modositasa: -------------

		// termek torlese
		$scope.termekTorol = function(id, menny) {
			
			$http.post('/torleskosarbol/', { id:id, nr:menny })
			.success(function(data, status, headers, config) {
				showMyAlert('Sikeres törlés.');
				$scope.kiirKosar();		// frissitjuk a kosar tartalmat az oldalon is 
			})
			.error(function(data, status, headers, config) {
				showMyAlert('Hiba a törlés közben.');
			});
		};
		
		
		$scope.rendelesKiirasa = function() {
		
			// osszegyujtjuk a kulonbozo penznemeket:
			var penznemek = [];
			for(var i = 0, len = $scope.kosar.length; i < len; ++i){
				penznemek[i] = $scope.kosar[i][6];
			}
			penznemek = unique(penznemek);		// halmazza alakitjuk
			console.log(penznemek);
			// csoportositjuk az osszegeket a penznemek szerint:
			var reszosszegek = [];
			for(var i = 0, len = penznemek.length; i < len; ++i){	
				for(var j = 0, len2 = $scope.kosar.length; j < len2; ++j){	
						
					if( $scope.kosar[j][6] == penznemek[i] ){
						if( reszosszegek.hasOwnProperty( penznemek[i] ) ){
							reszosszegek[ penznemek[i] ] = parseInt( reszosszegek[ penznemek[i] ] ) + parseInt($scope.kosar[j][5]*$scope.kosar[j][3]);
						}
						else{
							reszosszegek[ penznemek[i] ] = $scope.kosar[j][5]*$scope.kosar[j][3];		
						}
					}
				}
			}
			penznemek = null; 
			console.log(reszosszegek);
			// osszefuzzuk a reszletosszegeket egy stringbe:
			var len = Object.keys(reszosszegek).length;		// lekerem a kulcsokat, es megszamolom azok szamat
			console.log(len);
			var i = 0;
			$scope.osszegString = "";
			for(var key in reszosszegek){	
				if( i == len-1){
					$scope.osszegString += reszosszegek[key] + " " + key;
				}
				else if(i == len-2){
					$scope.osszegString += reszosszegek[key] + " " + key + " és ";
				}
				else{
					$scope.osszegString += reszosszegek[key] + " " + key + ", ";
				}
				i = i+1;
			}
			
			reszosszegek = null;
			console.log($scope.osszegString);
			
			$scope.navigationStrip1_Clicked('rendeles');
		}
		
		$scope.rendelesProfil = function() {
			kozosProfil.setRendelesProfilBool(true);
			$scope.navigationStrip2_Clicked('m_profilom');
		}
		
		// kosarban levo osszes termek megrendelese
		$scope.rendeles = function() {

			datum = new Date();
			console.log(datum);
			$http.post('/rendeles/', { datum: datum } )
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				
				$scope.kosar = {};		// kiuresitjuk a kosar tartalmat
				$scope.navigationStrip2_Clicked('sikeresRendeles');
			})
			.error(function(data, status, headers, config) {
				showMyAlert('Hiba a rendelés küldése közben.');
				$scope.kiirKosar();	// ujra kiiratjuk a kosar tartalmat
			});
		}	
		
		
		// a rendelesek altalanos adatainak lekerese:
		$scope.rendeleseimBetoltes = function() {
			$http.post('/rendeleseim/', {})
			.success(function(data, status, headers, config) {
				$scope.rendeleseim = data['rendeleseim'];
				$scope.datumok = data['datumok']
				$scope.termeknevek = data['termeknevek'];
				$scope.mertekegysegek = data['mertekegysegek']
				$scope.penznemek = data['penznemek'];
				$scope.statuszok = data['statuszok'];
				
				$scope.rendelesek = [];
				
				for	(i = 0; i < $scope.rendeleseim.length; i++) {
					$scope.rendelesek[i] = {
						'0' : $scope.termeknevek[i],
						'1' : $scope.rendeleseim[i][1],
						'2' : $scope.statuszok[i],
						'3' : $scope.datumok[i].replace("-", ".").replace("-", "."),
						'4' : $scope.rendeleseim[i][0],
						'5' : $scope.rendeleseim[i][2],
						'6' : $scope.penznemek[i],
						'7' : $scope.mertekegysegek[i],
						'8' : $scope.rendeleseim[i][2]*$scope.rendeleseim[i][1]
 					}
					console.log($scope.rendelesek[i]);
				}
				
					
				if($scope.rendeleseim.length == 0 || $scope.datumok.length == 0 || $scope.termeknevek.length == 0){
					$scope.navigationStrip2_Clicked('nincsrendeles');
				}else {
					$scope.navigationStrip2_Clicked('rendeleseim');
				}
			});
		}
	}
]);  

megrendeloApp.directive('myNavigation', function() {
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



megrendeloApp.service('kozosProfil', function () {
	var rendelesProfilBool = false;    // false = a profilt nem a rendeles soran jelenitodik meg
	return {
		getRendelesProfilBool: function () {
			return rendelesProfilBool;
		},
		setRendelesProfilBool: function(value) {
			rendelesProfilBool = value;
		}
	};
});