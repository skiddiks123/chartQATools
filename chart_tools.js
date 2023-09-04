// ==UserScript==
// @name         TradingView Custom Menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a custom menu to TradingView chart page
// @author       You
// @match        */chart/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function userSettings() {
        var settings = {};
        TVSettings.keys().forEach(function(key) {
            settings[key] = TVSettings.getValue(key);
        });
        console.log(settings);
    };

    function layoutJSON() {
        var url = document.URL;
        url = url.replace('chart', 'json');
        fetch(url)
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    };

    // Function to create the toggle button for log level
    function createToggleButton() {
        const button = document.createElement('button');
        const logLevel = localStorage.getItem('tv.logger.loglevel');

        if (logLevel === '3') {
            button.innerText = 'Lon';
        } else if (logLevel === '5') {
            button.innerText = 'Loff';
        }

        button.style.display = 'block';
        button.style.backgroundColor = '#2A66DD';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.marginTop = '5px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            const logLevel = localStorage.getItem('tv.logger.loglevel');
            if (logLevel === '3') {
                lon(true);
                button.innerText = 'Loff';
            } else if (logLevel === '5') {
                loff();
                button.innerText = 'Lon';
            }
        });

        return button;
    }

    // Function to create a button
    function createButton(text, callback) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.display = 'block'; // Make sure the button takes up the full width and displays as a block-level element
        button.style.backgroundColor = '#2A66DD';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.marginTop = '5px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', callback);
        return button;
    }

    // Create the menu container
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '20px';
    menuContainer.style.right = '20px';
    menuContainer.style.zIndex = '9999';
    menuContainer.style.backgroundColor = '#1C2733';
    menuContainer.style.border = '1px solid #2E4052';
    menuContainer.style.borderRadius = '4px';
    menuContainer.style.padding = '10px';
    menuContainer.style.color = '#fff';
    menuContainer.style.display = 'none'; // Initially hidden

    // Create a title for the menu
    const menuTitle = document.createElement('h4');
    menuTitle.innerText = 'QA Menu';
    menuTitle.style.marginTop = '0';
    menuTitle.style.marginBottom = '10px';
    menuContainer.appendChild(menuTitle);

    // Add the toggle button to the menu
    menuContainer.appendChild(createToggleButton());

    // Add buttons to the menu
    menuContainer.appendChild(createButton('Layout JSON', layoutJSON));
    menuContainer.appendChild(createButton('User settings', userSettings));
    menuContainer.appendChild(createButton('Sample Button 5', function() { alert('Sample Button 5 Clicked'); }));

    // Append the menu to the page body
    document.body.appendChild(menuContainer);

    // Add a keydown event listener to toggle menu visibility
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.code === 'KeyQ') {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        }
    });
})();
