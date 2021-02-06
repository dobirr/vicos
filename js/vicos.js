/*!
 * Revealing Module Pattern Boilerplate
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var vicos = (function () {

	'use strict';

	//
	// Variables
	//

	var api = {};


	//
	// Methods
	//

	/**
	 * A private method
	 */
	var somePrivateMethod = function () {
		// Code goes here...
	};

	/**
	 * A public method
	 */
	api.doSomething = function () {
		somePrivateMethod();
		// Code goes here...
	};

	/**
	 * Another public method
	 */
	api.init = function (options) {
		// Code goes here...
	};


	//
	// Return the Public APIs
	//

	return api;

})();

console.log(vicos)