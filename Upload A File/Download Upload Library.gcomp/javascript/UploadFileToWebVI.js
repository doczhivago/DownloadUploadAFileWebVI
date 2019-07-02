// Use the built-in browser dialog box to select and then open file.
//
// This example creates a function literal, and adds
// the function as a property of the Window object.
// The functions are defined within an anonymous function ( (function(){}()); )
// as a closure to prevent polluting the global namespace with our variables.
// If 'window.' is removed from 'window.OpenFileWebVI' then the function
// is no longer accessible from the WebVI. This is because it is only in the scope of
// this anonymous function, and not the global scope of the browser.
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window

	var fileText ="";
	var fileRead = false;	
	var inputElementName = "myFile"; 

(function () {
    // Use strict prevents silent and common JavaScript errors.
    'use strict';		
	
	window.OpenFileWebVI = function () {
		var inputButton = document.getElementById(inputElementName);
		 inputButton.click();
		 inputButton.onchange = function (){
			window.LoadFile();
		};
	}	
	
	window.LoadFile = function () {
		var myFile = document.getElementById(inputElementName).files[0];
		var reader = new FileReader();
		
		reader.addEventListener('load', function (e) {
		  fileRead = false;
		  fileText = e.target.result;
		});
		
		reader.readAsBinaryString(myFile);
		reader.onload = function(e){
			fileRead = true;
		};
	}
	
	window.CheckIfDone = function (){
		return fileRead;
	}
	
	window.ReadText = function (){
		fileRead = false;
		return fileText;
	}
	
}());

