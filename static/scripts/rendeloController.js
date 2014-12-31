var megrendeloApp = angular.module('megrendeloApp', []); 


megrendeloApp.controller('termekekController', [              
    '$scope', '$http', '$window',                       
	function termekekController($scope, $http, $window) {
	
		$scope.nev = localStorage.getItem('Nev');
		$scope.termelo = localStorage.getItem('Termelo');
		
		/* // OLDAL FRISSITESE:
		$scope.termekekRefresh = function() { // a fuggveny, ami a termekek adatait frissiti:
		
			if( $scope.navigationOptionSelected == 'termekek'){
				$scope.termekekBetoltes("alt");
			}
			else if( $scope.navigationOptionSelected == 'promtermekek' ){
				$scope.termekekBetoltes("promo");
			}
		}
		// 10 percenkent frissitjuk az oldalt
		setInterval($scope.termekekRefresh(), 10*60000); // a periodus milliszekundumban van megadva => 10*60 mp = 10 perc
		*/

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
				
				console.log($scope.termekadat);
				
				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadat[0][3]+"')");
				$( "input.kosarba" ).val(1);
				$( '#mertekegyseg' ).html( "   " + $scope.termekadat[0][9] );
				$( '#termekNev' ).html( $scope.termekadat[0][0] );
				
				// a tablazat adatai:
				$( '#termekKategoriaTd' ).html( $scope.termekadat[0][8] );
				$( '#termekTermeloTd' ).html( $scope.termekadat[0][6] );
				$( '#termekMinMennyTd' ).html( $scope.termekadat[0][4] + " " + $scope.termekadat[0][9] );
				$( '#termekLeirasID' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][1] );
				
				$("tr#arTr").first().html("<th>Régi ár: </th><td>"+$scope.termekadat[0][2] + " " + $scope.termekadat[0][7]+"</td>");
				
				if ( $( "tr#ujarTr" ).length )
					$("tr#ujarTr").first().html("<th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadat[0][10]+" "+$scope.termekadat[0][7]+"</td>");				
				else
					$("tr#arTr").after("<tr id='ujarTr'><th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadat[0][10]+" "+$scope.termekadat[0][7]+"</td></tr>");
				
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
		
				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadat[0][3]+"')");
				$( "input.kosarba" ).val(1);
				$( '#mertekegyseg' ).html( "   " + $scope.termekadat[0][9] );
				$( '#termekNev' ).html( $scope.termekadat[0][0] );
				$( '#termekKategoriaTd' ).html( $scope.termekadat[0][8] );
				$( '#termekTermeloTd' ).html( $scope.termekadat[0][6] );
				$( '#termekMinMennyTd' ).html( $scope.termekadat[0][4] + " " + $scope.termekadat[0][9] );
				$( '#termekLeirasID' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadat[0][1] );
			
				$( "tr#arTr" ).first().html("<th>Ár: </th><td>"+$scope.termekadat[0][2] + " " + $scope.termekadat[0][7]+"</td>");
				if ( $( "tr#ujarTr" ).length ) {
					$( "tr#ujarTr" ).remove();
				}
				
				if($scope.termekadat[0][5] == "0") 
					$( '#termekKeszletMennyTd' ).html( "Nincs készleten." );
				else
					$( '#termekKeszletMennyTd' ).html( $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] );
				
			});	
		}
		
	// egy termek reszletes, sajatos adatainak megjelenitese:
		$scope.showTermekReszlet = function(id, opcio) {
			
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
				
				// az adatbazisban csokkentjuk a keszleten levo mennyiseget:
				$http.post('/kosarbatermek/', {id: id, nr: menny} )
				.success(function(data, status, headers, config) {
					
					// termek ( ID + rendelt mennyiseg ) lementese a $scope.kosarba:	
					var index = getIndexById(id, $scope.kosar);
					
					if( index !== null ){		// ha mar letezik, azaz mar van ebbol a termekbol a kosarban
								// a helyes mennyiseg = a mar eddig kosarba rakott mennyiseg ebbol a termekbol + a mostani, uj mennyiseg 
						$scope.kosar[index].mennyiseg = parseInt($scope.kosar[index].mennyiseg) + menny;
					}
					else { 	// ez egy uj termek:
						var termekAr = 0;
						
						if( $scope.termekadat[0][10] != 'undefined' && $scope.termekadat[0][10] != null )  // ha az aktualis termek promocios termek
							termekAr = $scope.termekadat[0][10];
						else
							termekAr = $scope.termekadat[0][2]; 
						$scope.kosar.push( { id: id, nev:$scope.termekadat[0][0], termelo:$scope.termekadat[0][6], mertekegyseg:$scope.termekadat[0][9], mennyiseg:menny, ar: termekAr, penznem: $scope.termekadat[0][7]  } );
					
					}
					console.log($scope.kosar);
					
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
		
		
		$scope.vizsgalKosar = function(){
		
			if ( typeof($scope.kosar) === 'undefined' || $scope.kosar.length == 0) {
				$scope.navigationStrip1_Clicked('ureskosar');
				return;		// ha a kosar ures, megjelenitjuk az uzenetet, es kilepunk
			}
			$scope.navigationStrip1_Clicked('kosar');
		}	
		
		
		// ------------- Kosar tartalmanak modositasa: -------------
		
		$scope.vizsgalNr = function(data, id) {
			var filter = /-/;
			if (filter.test(data)) {
				return "A beírt mennyiség nem megfelelő.";
			}
		};

		// termek torlese
		$scope.termekTorol = function(id, menny) {
			
			$http.post('/torleskosarbol/', { id:id, nr:menny })
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				
				// torles a $scope.kosarbol
				var index = getIndexById(id, $scope.kosar);
				$scope.kosar.splice(index, 1);		// "kivagjuk" az index-edik elemet
				showMyAlert('Sikeres törlés.');
				
				$scope.vizsgalKosar();		// frissitjuk a kosar tartalmat az oldalon is 
			})
			.error(function(data, status, headers, config) {
				showMyAlert('Hiba a törlés közben.');
			});
		};
		
		
		$scope.rendelesKiirasa = function() {
		
			// osszegyujtjuk a kulonbozo penznemeket:
			var penznemek = [];
			for(var i = 0, len = $scope.kosar.length; i < len; ++i){
				penznemek[i] = $scope.kosar[i].penznem;
			}
			penznemek = unique(penznemek);		// halmazza alakitjuk
			console.log(penznemek);
			// csoportositjuk az osszegeket a penznemek szerint:
			var reszosszegek = [];
			for(var i = 0, len = penznemek.length; i < len; ++i){	
				for(var j = 0, len2 = $scope.kosar.length; j < len2; ++j){	
						
					if( $scope.kosar[j].penznem == penznemek[i] ){
						if( reszosszegek.hasOwnProperty( penznemek[i] ) ){
							reszosszegek[ penznemek[i] ] = parseInt( reszosszegek[ penznemek[i] ] ) + parseInt($scope.kosar[j].ar*$scope.kosar[j].mennyiseg);
							console.log("i = "+i+", j = "+j+", penznemek[i] = "+penznemek[i]+", reszosszegek[ penznemek[i] ] = "+reszosszegek[ penznemek[i] ]);			
						}
						else{
							reszosszegek[ penznemek[i] ] = $scope.kosar[j].ar*$scope.kosar[j].mennyiseg;
							console.log("i = "+i+", j = "+j+", penznemek[i] = "+penznemek[i]+", reszosszegek[ penznemek[i] ] = "+reszosszegek[ penznemek[i] ]+", $scope.kosar[j].ar = "+$scope.kosar[j].ar);			
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
		
		// kosarban levo osszes termek megrendelese
		$scope.rendeles = function() {
		
			var kuld = {};			// ezt az asszociativ yombot fogjuk elkuldeni a szervernek
			kuld['datum'] = new Date();		// a megrendeles datuma
			kuld['termekek'] = [];			// a termekek tombje, mely asszociativ tomboket tartalmaz
			for(var i=0, len = $scope.kosar.length; i < len; i++) {		// id : mennyiseg parok
				kuld['termekek'].push( {  'id': $scope.kosar[i].id, 'mennyiseg': $scope.kosar[i].mennyiseg , 'ar': $scope.kosar[i].ar } );
			}		
			console.log(kuld);
			$http.post('/rendeles/', kuld)
			.success(function(data, status, headers, config) {
				$scope.success = data.success;
				
				$scope.kosar = {};		// kiuresitjuk a kosar tartalmat
				$scope.navigationStrip2_Clicked('sikeresRendeles');
			})
			.error(function(data, status, headers, config) {
				showMyAlert('Hiba a rendelés küldése közben.');
				$scope.vizsgalKosar();	// ujra kiiratjuk a kosar tartalmat
			});
			
		}
		
	}
]);  




megrendeloApp.directive('myNavigaton', function() {
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


