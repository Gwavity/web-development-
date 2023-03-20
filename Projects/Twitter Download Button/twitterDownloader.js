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

        downloadSVG.innerHTML = "<g><path d=\"M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723   c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742   c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193   C15.092,18.979,14.62,18.426,14.62,18.426z\"></path></g>"
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
            const tweetID = windowURL.substring(windowURL.length,windowURL.search("status/") + 7);
            const url = `https://api.twitter.com/2/tweets?ids=${tweetID}&expansions=attachments.media_keys&media.fields=variants`;

            Http.open("GET", url);
            Http.setRequestHeader("Authorization",`Bearer ${bearer}`);
            Http.send();

            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4)
                {
                    var response = Http.response;

                    if(response.includes("bit_rate"))
                    {
                        //console.log(response);
                        var bitRate = response.substring(response.search("bit_rate"),response.length);
                        //console.log(bitRate);
                        var tempURL = bitRate.substring(bitRate.search("url"),bitRate.length);
                        downloadURL = tempURL.substring(6,tempURL.search("}")-1);
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
