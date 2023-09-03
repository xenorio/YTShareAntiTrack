// ==UserScript==
// @name         YTShareAntiTrack
// @namespace    https://github.com/Xenorio/YTShareAntiTrack
// @version      0.1
// @description  Remove any tracking parameters from the YouTube share feature
// @author       xenorio
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
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

(function() {

	// ID of the share URL input element
    const targetElementId = 'share-url';

	// Parameters which are allowed to stay in the URL
	const allowedParams = [
		"t" // start time
	]

    // Element has been loaded/changed, update URL
    function handleTargetElement(targetElement) {

		let url = new URL(targetElement.value)
		let params = url.searchParams

		// Remove all parameters that are not allowed
		for(let param of params.keys()){
			if(!allowedParams.includes(param)){
				params.delete(param)
			}
		}

		url.search = params

        let newValue = url.toString()

		// Abort if everything is already correct
        if(targetElement.value == newValue) return;

        console.log('[YTShareAntiTrack] Changing share url from ' + targetElement.value + ' to ' + newValue)

		// Update element
        targetElement.value = newValue
    }

    // Await loading and changes of the input element
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const targetElement = document.getElementById(targetElementId);
                if (targetElement) {
                    setTimeout(() => {handleTargetElement(targetElement)}, 200)
                }
            }
        }
    });

    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();