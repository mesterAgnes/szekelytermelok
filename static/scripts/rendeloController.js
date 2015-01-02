var megrendeloApp = angular.module('megrendeloApp', []); 


megrendeloApp.controller('termekekController', [              
    '$scope', '$http', '$window',                       
	function termekekController($scope, $http, $window) {
	
		$scope.nev = localStorage.getItem('Nev');
		$scope.termelo = localStorage.getItem('Termelo');

		// minden termek adata:	
		$scope.termekadatok = {};		// osszes termek altalanos adata
		$scope.termekIDk = [];			// osszes termek IDja
		$scope.termekadat = {};			// a termekReszletek divben megjelenitett termek adatai 
		$scope.aktualisTermekIndex = new Number(); // a termekReszletek divben megjelenitett termek IDja
		
		// a promocios termekek adatai:
		$scope.termekadatokPr = {};			// osszes promocios termek altalanos adata
		$scope.termekIDkPr = [];			// osszes termek IDja
		$scope.termekadatPr = {};			// a termekReszletek divben megjelenitett termek adatai 
		$scope.aktualisTermekIndexPr = new Number(); 	// a termekReszletek divben megjelenitett termek IDja
		
		$scope.navigationOptionSelected = 'kezdolap';	// Kezdolap van alapertelmezetten megjelenitve
		jQuery( "button#kezdolap" ).attr("id","selected");
		
		$scope.kosar = {};
		
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

		// minden termek altalanos adatainak lekerese:
		$scope.termekekBetoltes = function() {
		
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
		
	// promocios termek adatainak lekerdezese es kiiratasa:	
		$scope.showTermekReszlet_prom = function(id) {
			$http.post('/egypromtermek/', id)
			.success(function(data, status, headers, config) {
				$scope.termekadatPr = data['termek'];
				
				console.log($scope.termekadatPr);
				
				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadatPr[0][3]+"')");
				$( '#mertekegyseg' ).html( "   " + $scope.termekadatPr[0][9] );
				$( '#termekNev' ).html( $scope.termekadatPr[0][0] );
				
				// a tablazat adatai:
				$( '#termekKategoriaTd' ).html( $scope.termekadatPr[0][8] );
				$( '#termekTermeloTd' ).html( $scope.termekadatPr[0][6] );
				$( '#termekMinMennyTd' ).html( $scope.termekadatPr[0][4] + " " + $scope.termekadatPr[0][9] );
				$( '#termekLeirasID' ).html( "<span style='font-weight:800;margin-right:20px;'>&#8226;</span>" + $scope.termekadatPr[0][1] );
				
				$("tr#arTr").first().html("<th>Régi ár: </th><td>"+$scope.termekadatPr[0][2] + " " + $scope.termekadatPr[0][7]+"</td>");
				
				if ( $( "tr#ujarTr" ).length )
					$("tr#ujarTr").first().html("<th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadatPr[0][10]+" "+$scope.termekadatPr[0][7]+"</td>");				
				else
					$("tr#arTr").after("<tr id='ujarTr'><th id='ujAr'>Promóciós ár: </th><td id='ujAr'>"+$scope.termekadatPr[0][10]+" "+$scope.termekadatPr[0][7]+"</td></tr>");
				
				if($scope.termekadatPr[0][5] == "0")
					$( '#termekKeszletMennyTd' ).html( "Nincs készleten." );
				else if($scope.termekadatPr[0][5] < $scope.termekadatPr[0][4])
					$( '#termekKeszletMennyTd' ).html( "Nincs elegendő mennyiség készleten." );
				else
					$( '#termekKeszletMennyTd' ).html( $scope.termekadatPr[0][5] + " " + $scope.termekadatPr[0][9] );
			});	
		}
		
	// altalanos, nem promocios termek adatainak lekerdezese es kiiratasa:
		$scope.showTermekReszlet_alt = function(id) {
			$http.post('/egytermek/', id)
			.success(function(data, status, headers, config) {
				$scope.termekadat = data['termek'];
		
				$( '#termekReszletek' ).show(300);
				$( '#termekReszletekInnerKep' ).css('background-image', "url('img/termekek/"+$scope.termekadat[0][3]+"')");
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
				else if($scope.termekadat[0][5] < $scope.termekadat[0][4])
					$( '#termekKeszletMennyTd' ).html( "Nincs elegendő mennyiség készleten." );
				else
					$( '#termekKeszletMennyTd' ).html( $scope.termekadat[0][5] + " " + $scope.termekadat[0][9] );	
			});	
		}
		
	// egy termek reszletes, sajatos adatainak megjelenitese:
		$scope.showTermekReszlet = function(id, opcio) {
			
			if(opcio === "prom"){    // biztosan egy promocios termek megjelenitese
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
		
		$scope.showTermekReszletImgClick = function(id) {
			$scope.aktualisTermekIndex = getIndexByValue( id, $scope.termekIDk );  // beallitjuk az aktualis termeknek megfelelo indexet, ami a termekIDk tombben levo pozicio
			$scope.showTermekReszlet(id, "alt");
		}

		
		$scope.showPrevTermek = function(option) {
			
			if(option === 'alt') {	// az osszes termekek tombjen haladunk vegig
				if(parseInt($scope.aktualisTermekIndex) == 0)	
					$scope.aktualisTermekIndex = $scope.termekIDk.length - 1;	
				else
					$scope.aktualisTermekIndex = $scope.aktualisTermekIndex - 1;	
				// megjelenitjuk az adatokat:
				$scope.showTermekReszlet( $scope.termekIDk[$scope.aktualisTermekIndex] , option );
			}	
			else {	 // a promocios termekek tombjen haladunk vegig
				if(parseInt($scope.aktualisTermekIndexPr) == 0)	
					$scope.aktualisTermekIndexPr = $scope.termekIDkPr.length - 1;	
				else
					$scope.aktualisTermekIndexPr = $scope.aktualisTermekIndexPr - 1;	
				// megjelenitjuk az adatokat:
				$scope.showTermekReszlet( $scope.termekIDkPr[$scope.aktualisTermekIndexPr] , option );
			}
		}	
		
		$scope.showNextTermek = function(option) {
			console.log("nexttermek");
			if(option === 'alt') {	// az osszes termekek tombjen haladunk vegig
				if(parseInt($scope.aktualisTermekIndex) === $scope.termekIDk.length - 1)	
					$scope.aktualisTermekIndex = 0;	
				else
					$scope.aktualisTermekIndex = $scope.aktualisTermekIndex + 1;	
				// megjelenitjuk az adatokat:
				$scope.showTermekReszlet( $scope.termekIDk[$scope.aktualisTermekIndex] , option );
			}	
			else {	// a promocios termekek tombjen haladunk vegig
				if(parseInt($scope.aktualisTermekIndexPr) === $scope.termekIDkPr.length - 1)	
					$scope.aktualisTermekIndexPr = 0;	
				else
					$scope.aktualisTermekIndexPr = $scope.aktualisTermekIndexPr + 1;	
				// megjelenitjuk az adatokat:
				$scope.showTermekReszlet( $scope.termekIDkPr[$scope.aktualisTermekIndexPr] , option );
			}
		}

		
		// a promocios termekek altalanos adatainak lekerese:
		$scope.termekekBetoltesPr = function() {
			$http.post('/mindenpromtermek/', {})
			.success(function(data, status, headers, config) {
				$scope.termekadatokPr = data['termekek'];
				
				console.log($scope.termekadatokPr);
				
				if($scope.termekadatokPr.length == 0){
					$scope.navigationStrip2_Clicked('nincspromtermek');
				}
				else {
					// termekek IDjainak lementese a termekIDkPr tombbe:
					for	(i = 0; i < $scope.termekadatokPr.length; i++) {
						$scope.termekIDkPr[i] = $scope.termekadatokPr[i][0];
					}
					
					$scope.navigationStrip2_Clicked('promtermekek');
				}
			});
		}
		
		// a rendelesek altalanos adatainak lekerese:
		$scope.rendeleseimBetoltes = function() {
			$http.post('/rendeleseim/', {})
			.success(function(data, status, headers, config) {
				$scope.rendeleseim = data['rendeleseim'];
				$scope.datumok = data['datumok']
				$scope.termeknevek = data['termeknevek'];
				$scope.rendelesek = [];
				$scope.dates = [];
				for	(i = 0; i < $scope.rendeleseim.length; i++) {
					$scope.dates[i]="";
				}
				for	(i = 0; i < $scope.rendeleseim.length; i++) {
					if (i==0) {
						for (j=3;j<13;j++) { 
							$scope.dates[i]+=$scope.datumok[j];
						}
					} else 
						if (i==1){
							for (j=19;j<29;j++) { 
								$scope.dates[i]+=$scope.datumok[j];
							}
						} else {
							for (j=i*13+i*6-3;j<i*13+i*6+7;j++) { 
								$scope.dates[i]+=$scope.datumok[j];
							}
						}
				}
				
				for	(i = 0; i < $scope.rendeleseim.length; i++) {
					$scope.rendelesek[i] = {
						'0' : $scope.termeknevek[i],
						'1' : $scope.rendeleseim[i][1],
						'2' : $scope.rendeleseim[i][2],
						'3' : $scope.dates[i],
						'4' : $scope.rendeleseim[i][0]
 					}
				}
				
					
				if($scope.rendeleseim.length == 0 || $scope.datumok.length == 0 || $scope.termeknevek.length == 0){
					$scope.navigationStrip2_Clicked('nincsrendeles');
				}else {
					$scope.navigationStrip2_Clicked('rendeleseim');
				}
			});
		}
		
		$scope.showPromTermekReszletImgClick = function(id) {
			$scope.aktualisTermekIndexPr = getIndexByValue( id, $scope.termekIDkPr );  // beallitjuk az aktualis termeknek megfelelo indexet, ami a termekIDk tombben levo pozicio
			$scope.showTermekReszlet(id, "prom");
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


