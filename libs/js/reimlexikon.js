/* ############################################### */
/* ################# Reimlexikon ################# */
/* ############################################### */

$("#resultstable").hide();	

$( "#reimform" ).submit(function( event ) {
event.preventDefault();
submitform();
});

$( "#reimform select" ).change(function() {
 submitform();
});


/* ################# Formular verschicken / Daten holen ################# */

function submitform() {
var suche = $( "#suche" ).val(); 


/* Besteht eine Datenverbinung? */

var network = checkConnection();	

if (network != "none") {
	
$("#resultstable").hide();	


/* Suchfeld gefüllt? */

if (suche != "") {

	
$("#output").text("Laden!"); 

var laenge = $( "#laenge option:selected" ).val(); 
var unrein = $( "#unrein option:selected" ).val(); 
var silben = $( "#silben option:selected" ).val(); 

/* Suchefeld ist leer */

var reimurl = "https://app.reimlexikon.net/index.php?suche=" + suche + "&laenge=" + laenge + "&unrein=" + unrein + "&silben=" + silben;

cordovaHTTP.get(reimurl,function (response) {
     
output(response);

}, function(error){
	
   $("#output").text("Es ist ein Fehler aufgetreten! Bitte versuche es nochmal!");

});	
	
}

/* Suchfeld ist leer */

else {	

$("#output").text("Das Suchfeld ist leer!"); 

}

}


/* Keine Datenverbindung */

else {	

$("#output").text("Keine Datenverbindung! Das Reimlexikon braucht eine Internetverbindung zur Datenbank"); 

}

}


/* ################# Nach Daten geladen / Array aus Daten ################# */

function output(daten) {
	
var parsed = JSON.parse(daten.data);

var resultsarray = [];

for(var x in parsed){
  resultsarray.push(parsed[x]);
}	

var numbers = resultsarray[1];

if (numbers == 0) {		
$("#output").text("Kein Ergebnis"); 

}
else
{
$("#output").text(numbers + " Ergebnisse"); 	
list = resultsarray[2].split(';');
loadoutput();
}

}


/* ################# Tabelle erstellen ################# */

var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;

    
function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;    
    pageList = list.slice(begin, end);
    drawList();
    pages();
    check();
}
    
function drawList() {
    document.getElementById("list").innerHTML = "";
    for (r = 0; r < pageList.length; r++) {
        document.getElementById("list").innerHTML += pageList[r] + "<br/>";
    }
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function pages() { 
   var pages = currentPage + " / " + numberOfPages;
   $("#pages").text(pages);
}

function loadoutput() {
	 $("#resultstable").show();	
    numberOfPages = getNumberOfPages();
    loadList();
}
    
function checkConnection(state) {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return networkState;
}