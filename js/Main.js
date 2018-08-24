//var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main = {};

Main.onLoad = function() {
    // To enable the key event processing
    //document.getElementById("anchor").focus();

    // Set Default key handler function
   // widgetAPI.sendReadyEvent();
	Trace('onload!!!');
};

Main.onUnload = function() {

};

function Trace(strInput){
	 console.log(strInput);
}