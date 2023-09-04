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

    // Function to create the toggle button with options
    function createToggleButton(options) {
        const button = document.createElement('button');
        const conditionValue = localStorage.getItem(options.conditionKey);

        // Set initial button text
        button.innerText = conditionValue === options.conditionValue ? options.text1 : options.text2;

        // button styles
        button.style.display = 'block';
        button.style.backgroundColor = '#2A66DD';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.marginTop = '5px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            const conditionValue = localStorage.getItem(options.conditionKey);

            if (conditionValue === options.conditionValue1) {
                options.action1();
                button.innerText = options.text2;
            } else {
                options.action2();
                button.innerText = options.text1
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

    // Add the log toggle button
    const logToggleButton = createToggleButton({
        conditionKey: 'tv.logger.loglevel',
        conditionValue1: '3',
        conditionValue2: '5',
        text1: 'Lon',
        text2: 'Loff',
        action1: function() { lon(true) },
        action2: function() { loff() },
    });

    menuContainer.appendChild(logToggleButton);

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
