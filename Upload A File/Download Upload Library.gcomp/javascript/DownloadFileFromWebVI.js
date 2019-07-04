// Get a filename and JSON Array from LabVIEW, convert to CSV format and
// download in default Download location. 
//
// This example creates a function literal, and adds
// the function as a property of the Window object.
// The functions are defined within an anonymous function ( (function(){}()); )
// as a closure to prevent polluting the global namespace with our variables.
// If 'window.' is removed from 'window.OpenFileWebVI' then the function
// is no longer accessible from the WebVI. This is because it is only in the scope of
// this anonymous function, and not the global scope of the browser.

(function () {
	// Use strict prevents silent and common JavaScript errors.
	'use strict';

	//https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
	//var csv is the CSV file with headers
	// Not currently used by JSLI.
	window.ConvertCSVtoJSONArray = function (csv) {
		var lines = csv.split("\n");
		var result = [];
		var headers = lines[0].split(",");

		for (var i = 1; i < lines.length; i++) {
			var obj = {};
			var currentline = lines[i].split(",");
			for (var j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}
			result.push(obj);
		}
		//return result; //JavaScript object
		return JSON.stringify(result); //JSON
	}

	window.DownloadFileFromWebVI = function (filename, filetext) {

		var csvOption = 'data:text/csv;charset=utf-8,';
		var textOption = 'data:text/plain;charset=utf-8,';
		var formatOption = csvOption;

		var fileTextToArray = JSON.parse(filetext);
		let csvContent = formatOption
			+ fileTextToArray.map(e => e.join(",")).join("\n");
		var encodedUri = encodeURI(csvContent);

		var element = document.createElement('a');
		element.setAttribute('href', encodedUri);
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element); // Required for FF
		element.click();
		document.body.removeChild(element);
	}
}());

