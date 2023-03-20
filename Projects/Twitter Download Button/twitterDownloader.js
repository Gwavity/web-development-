// ==UserScript==
// @name         Twitter Video Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to tweets with videos that brings you to the download page for that video.
// @author       Gwavity
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var windowURL = window.location.href;
    var downloadURL;

    const bearer = ""//Place your Twitter bearer TOKEN in here.
    const Http = new XMLHttpRequest();

    function createDownload()
    {
        var grouped = document.querySelectorAll('[role="group"]')[1];
        var shareButton = grouped.children[3];
        var downloadButton = shareButton.cloneNode(true);
        var downloadSVG = downloadButton.getElementsByTagName("svg")[0];

        downloadSVG.innerHTML = "<g><path d=\"M 12 2.59 L 17.7 8.29 L 16.29 9.71 L 13 6.41 L 13 16 L 11 16 L 11 6.41 L 7.7 9.71 L 6.29 8.29\" transform=\"matrix(-1, 0, 0, -1, 23.990002, 18.59)\"></path><path d=\"m12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z\"></path></g>"
        grouped.appendChild(downloadButton);
        downloadSVG.addEventListener("mouseover", addColor, false);
        downloadSVG.addEventListener("mouseout", removeColor, false);
        downloadSVG.addEventListener("click", getClick, false);

        var defaultSVG = downloadSVG.getAttribute("style");
        function addColor()
        {
            downloadSVG.setAttribute("style", "filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%);")
        }

        function removeColor()
        {
            downloadSVG.setAttribute("style", defaultSVG)
        }

        function getClick()
        {
            window.open(downloadURL);
        }

        console.log("Created Download button.");
    }

    function main()
    {

        if (windowURL.includes("status") && !windowURL.includes("analytics"))
        {
            const tweetID = windowURL.substring(windowURL.length, windowURL.search("status/") + 7);
            const url = `https://api.twitter.com/2/tweets?ids=${tweetID}&expansions=attachments.media_keys&media.fields=variants`;

            Http.open("GET", url);
            Http.setRequestHeader("Authorization", `Bearer ${bearer}`);
            Http.send();

            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4)
                {
                    var response = Http.response;

                    if(response.includes("bit_rate"))
                    {
                        //console.log(response);
                        var bitRate = response.substring(response.search("bit_rate"), response.length);
                        //console.log(bitRate);
                        var tempURL = bitRate.substring(bitRate.search("url"), bitRate.length);
                        downloadURL = tempURL.substring(6, tempURL.search("}")-1);
                        createDownload();
                    }
                }
            }
        } else {
            console.log("Go to a tweet with a video.");
        }
    }

    setInterval(checkURL,500);
    function checkURL()
    {
        if (window.location != windowURL)
        {
            windowURL = window.location.href;
            main();
        }
        return;
    }
})();
