// ==UserScript==
// @name         YTShareAntiTrack
// @namespace    https://github.com/Xenorio/YTShareAntiTrack
// @updateURL    https://github.com/Xenorio/YTShareAntiTrack/raw/main/YTShareAntiTrack.user.js
// @version      1.1.0
// @license      AGPLv3
// @description  Remove any tracking parameters from the YouTube share feature
// @author       xenorio
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// ==/UserScript==

// Copyright (C) 2023 Marcus Huber (xenorio) <dev@xenorio.xyz>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function () {

	// How fast we should check for element changes (ms)
	const updateInterval = 50

	// Parameters which are allowed to stay in the URL
	const allowedParams = [
		"t" // start time
	]

	// Identifiers for all elements to target
	const elementIdentifiers = {
		id: [
			'share-url' // Input field on desktop
		],
		class: [
			'unified-share-url-input' // Input field on mobile
		]
	}

	// Element has been found, update URL
	function handleTargetElement(targetElement) {

		// Set up a copy of the current URL to work on
		let url = new URL(targetElement.value)
		let params = url.searchParams

		// Remove all parameters that are not allowed
		for (let param of params.keys()) {
			if (!allowedParams.includes(param)) {
				params.delete(param)
			}
		}

		url.search = params

		let newValue = url.toString()

		// Abort if everything is already correct
		if (targetElement.value == newValue) return;

		console.log('[YTShareAntiTrack] Changing share url from ' + targetElement.value + ' to ' + newValue)

		// Update element
		targetElement.value = newValue
	}

	// Repeatedly look for the element, and if it's there, change it
	setInterval(() => {

		// Gather all elements which should be modified based on their ID
		for (let identifier of elementIdentifiers.id) {
			const element = document.getElementById(identifier)
			if (element) {
				handleTargetElement(element)
			}
		}

		// Gather all elements which should be modified based on their class
		for (let identifier of elementIdentifiers.class) {
			const elements = document.getElementsByClassName(identifier)
			if(elements){
				for(let element of elements) {
					handleTargetElement(element)
				}
			}
		}

	}, updateInterval)

})();