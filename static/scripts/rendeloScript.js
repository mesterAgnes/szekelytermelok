function showORhide(obj){	
	$("div.termekReszletek").remove();	
	$("body").prepend("<div class='termekReszletek'><div style='position:absolute;top:5px;right:5px'><img class='miniImg' src='./kepek/closeW2.png' width=30 onclick='$(\".termekReszletek\").remove()' /></div><div class='leftArr'><img src='./kepek/left.png' width=30 height=50  onclick='$(\".termekReszletek div.termekReszletekInner div.termekReszletekInnerKep\").css(\"background-image\",\"url(/)\")' /></div><div class='rightArr'><img src='./kepek/right.png' width=30 height=50 onclick='$(\".termekReszletek div.termekReszletekInner div.termekReszletekInnerKep\").css(\"background-image\",\"url(/)\")' /></div><div class='termekReszletekInner'><div class='termekReszletekInnerKep' style='background-image:url(\"./termekek/sajt_1.jpg\")'></div><div style='float:left;margin-left:10px'><div class='termekReszletekInnerKosarba'><input type='number' class='kosarba' min='1' name='darab[id]' value='1'><button type='submit' onclick='' class='kosarba'>KOSÁRBA</button></div><div class='termekReszletekInnerTablazat'><table class='termekAdat'><tr><th>Típus:</th><td>Sajt</td></tr><tr><th>Márka:</th>				<td>Trappista</td></tr><tr><th>Termelo:</th><td>Garmed kft.</td></tr><tr>					<th>Ár:</th><td>15 RON</td></tr><tr><th>Kód:</th><td>passz</td></tr></table></div><div class='termekReszletekInnerSzoveg'>Szoveg</div></div><div style='clear:both'></div></div></div>");
}

function getIndexByValue(value, array) {	 
    for	(var i = 0, len = array.length; i < len; i++) 
		if(array[i] === value)
			return i;
	return -1;
}

function getIndexById(id, array) {	// dictionary-ket tartalmazo tomb eseten
	for (var i = 0, len = array.length; i < len; i++) 
		if(array[i].id == id)
			return i;
	return null;
}

function mergeArrays(a, b) {
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai][0] < b[bi][0]) {
                result.push(a[ai]);
                ai++;
            } 
			else if (a[ai][0] > b[bi][0]) {
                result.push(b[bi]);
                bi++;
            } 
			else {
                result.push(a[ai]);
                result.push(b[bi]);
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}

// a result tommben visszateriti a halmazza alakitott array nevu tombot (kikuszoboli a tobbszor megjeleno tagokat)
function unique( array ) {
    var hash = {}, result = [];
    for ( var i = 0, len = array.length; i < len; ++i ) {
        if ( !hash.hasOwnProperty(array[i]) ) { //it works with objects! in FF, at least
            hash[ array[i] ] = true;
            result.push( array[i] );
        }
    }
    return result;
}


function setWhetherProm(array, val){
	for	(i = 0; i < array.length; i++) 
		array[i].push(val);
	return;
}