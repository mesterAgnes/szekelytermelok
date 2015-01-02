document.getElementById("footer01").innerHTML =
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
	var div= document.createElement("div");
		div.setAttribute("id", "createdAlertDiv")
	//
	/**/
	var l=string.length*13;
		//alert(l);
		div.style.width=l+"px";
		div.style.minWidth=l+"px";
		div.style.maxWidth=l+"px";		
	//*/
	var text= document.createTextNode(string);
		div.appendChild(text);
	var img= document.createElement("img");
		img.setAttribute("id","closeImg");
		img.setAttribute("src","kepek/close.png");
		img.setAttribute("height","30");
		img.setAttribute("onmouseover","changeImg(this,'close.png','close2.png')");
		img.setAttribute("onmouseout","changeImg(this,'close.png','close2.png')");		
		//img.setAttribute("onclick","document.getElementById('createdAlertDiv').remove();document.getElementById('overlay').remove();document.location.href='"+url+"'");		
		img.setAttribute("onclick","document.getElementById('createdAlertDiv').remove();document.getElementById('overlay').remove()");		
		div.appendChild(img);		
		
	var currentDiv = document.getElementById("container"); 
	document.body.insertBefore(div,currentDiv); 
		
	var overlay=document.createElement("div");
		overlay.setAttribute("id", "overlay");
		document.body.insertBefore(overlay, document.body.firstChild);		
		$("div#overlay").fadeTo(300,0.5);						
}

