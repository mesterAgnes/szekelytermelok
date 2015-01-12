document.getElementById("footer1").innerHTML =
"<p>&copy;  " + new Date().getFullYear() + " Székely termelők</p>";

( function($) {
	$.setPenznem = function() {	

		if ( $("#penznem1").val().length!=0)
			$("#penznem2").val() = $("#penznem1").val();
		}	
})(jQuery)


// sajat alert es confirm boxok:
function changeImg(obj,name1,name2){
	if(obj.src.match(name1))
		obj.src="./kepek/"+name2;
	else
	if(obj.src.match(name2))
		obj.src="./kepek/"+name1;

}

function showMyAlert(string){
	var l=string.length*13;
	$("body").prepend("<div id='createdAlertDiv' style='width:"+l+"px;max-width:95%'><img id='closeImg' class='miniImg' src='../kepek/closeW2.png' height=30 onclick='$(\"div#createdAlertDiv, div#overlayForCustomBoxes\").remove()'>"+string+"</div>");
	$("body").prepend("<div id='overlayForCustomBoxes'></div>");
	$("div#overlayForCustomBoxes").fadeTo(300,0.5);
}

function executeAfterConfirmed( functionToExecute , otherArgsArray , elementId ){
	var $confirmBox=$("<div id='createdConfirmDiv' style='width:300px;max-width:95%'>");
	var $closeImg=$("<img id='closeImg' class='miniImg' src='./kepek/closeW2.png' height=30 onclick='$(\"div#createdConfirmDiv, div#overlayForCustomBoxes\").remove()'>");
	var $text=$("<span>CONFIRM?</span><br>");
	var $yButton=$("<button class='myConfirmButton' id='yesButton'>YES</button>");
	var $nButton=$("<button class='myConfirmButton' onclick='$(\"div#createdConfirmDiv, div#overlayForCustomBoxes\").remove()'>NO</button>");
	
	$yButton.on("click", function(){
		$("div#createdConfirmDiv, div#overlayForCustomBoxes").remove();	
		
		var scope = angular.element($(elementId)).scope();
		scope.$apply(function(){
			scope.functionToExecute(otherArgsArray);
		})
	});
	
	$confirmBox.append( $closeImg );
	$confirmBox.append( $text );
	$confirmBox.append( $yButton );
	$confirmBox.append( $nButton );
	
	$("body").prepend( $confirmBox );
	$("body").prepend("<div id='overlayForCustomBoxes'></div>");
	$("div#overlayForCustomBoxes").fadeTo(300,0.7);		
}

