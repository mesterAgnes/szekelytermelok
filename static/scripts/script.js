document.getElementById("footer01").innerHTML =
"<p>&copy;  " + new Date().getFullYear() + " Székely termelők</p>";

( function($) {
	$.setPenznem = function() {	

		if ( $("#penznem1").val().length!=0)
			$("#penznem2").val() = $("#penznem1").val();
		}	
})(jQuery)

