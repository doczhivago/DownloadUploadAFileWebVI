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
// http://jsfiddle.net/VBJ9h/319/
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window
(function () {
	// Use strict prevents silent and common JavaScript errors.
	'use strict';

	var waitForClickAndRedirectCancellable = function (elementToIntercept, elementToTarget) {
		var cancel;
		var occurred = new Promise(function (resolve) {
			var handler = function () {
				elementToIntercept.removeEventListener('click', handler);
				elementToTarget.click();
				resolve();
			};
			cancel = function () {
				elementToIntercept.removeEventListener('click', handler);
				resolve();
			};
			elementToIntercept.addEventListener('click', handler);
		});
		return {
			occurred,
			cancel
		};
	}

	var waitForChange = function (input) {
		return new Promise(function (resolve) {
			var handler = function () {
				input.removeEventListener('change', handler);
				resolve();
			};
			input.addEventListener('change', handler);
		});
	}

	var fileSelected = async function (element, input) {
		var click = waitForClickAndRedirectCancellable(element, input);
		var change = waitForChange(input); // Note, intentionally avoid await

		// User must attempt to select a file first
		await click.occurred;

		do {
			// Create observer for retry click
			click = waitForClickAndRedirectCancellable(element, input); // Note, intentionally avoid await
			// Wait for retry click or value change
			await Promise.race([change, click.occurred]);
			// Clear pending retry click if the user changed the value
			click.cancel();
		} while (input.files.length === 0);
	}

	var readFile = async function (file) {
		var fileUrl = URL.createObjectURL(file);
		try {
			var response = await fetch(fileUrl);
			var text = await response.text();
			return text;
		} finally {
			URL.revokeObjectURL(fileUrl);
		}
	}

	// OpenFileWebVI lets you pass any selector that targets a single element
	// We find the element, wait for it to be clicked, and then forward that click to a hidden file input to trigger a file dialog
	// Unfortunately, we cannot tell if the user clicks cancel on the dialog.
	// To workaround we listen for two different events:
	// 1. "change" if a user did select a file
	// 2. another "click" event because the user clicked cancel (can't observe) and then tried to select a file again
	window.OpenFileWebVI = async function (selector) {
		var elements = this.document.querySelectorAll(selector);
		if (elements.length !== 1) {
			throw new Error(`Expected 1 element with selector: ${selector}, instead found: ${elements.length}`);
		}
		var element = elements[0];
		var input = document.createElement('input');
		input.style.display = 'none';
		input.type = 'file';

		document.body.appendChild(input);
		try {
			await fileSelected(element, input);
			var files = input.files;
			if (files.length !== 1) {
				throw new Error(`Expected 1 file to be selected, instead found: ${files.length}`);
			}
			var file = files[0];
			var text = await readFile(file);
			return text;
		} finally {
			document.body.removeChild(input);
		}
	}
}());
