// ==UserScript==
// @name         Chart QA Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tools for chart QA
// @author       dulashenko
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

    function allStudies() {
        var scripts = {};
        var charts = TradingViewApi._chartWidgetCollection.state().charts;

        for (var i = 0; i < charts.length; i++) {
            var panes = charts[i].panes;
            var chartsCount = `Chart_${i + 1}`;
            scripts[chartsCount] = [];
            for (var n = 0; n < panes.length; n++) {
                var sources = panes[n].sources;
                for (var k = 0; k < sources.length; k++) {
                    var src = sources[k];
                    if (/study/i.test(src.type)) {
                        var data = { description: src.metaInfo.description, scriptIdPart: src.metaInfo.scriptIdPart, fullId: src.metaInfo.fullId, meta: src.metaInfo };
                        scripts[chartsCount].push(data);
                    };
                };
            };
        };

        console.log(scripts);
    };

    function displayFeatureToggles() {
        const featureTogglesList = document.createElement('ul');
        featureTogglesList.style.listStyleType = 'none';
        featureTogglesList.style.marginTop = '10px';
        featureTogglesList.style.fontSize = '0.8rem';
        featureTogglesList.style.color = '#a0a0a0';

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.includes('forcefeaturetoggle')) {
                const cleanedKey = key.replace('forcefeaturetoggle.', '');
                const value = localStorage.getItem(key);

                const listItem = document.createElement('li');
                listItem.innerText = `${cleanedKey}: ${value}`;
                featureTogglesList.appendChild(listItem);
            }
        }

        const listTitle = document.createElement('h3');
        listTitle.innerText = 'Featuretoggle overrides';
        listTitle.style.marginTop = '20px';
        listTitle.style.color = '#a0a0a0';

        menuContainer.appendChild(listTitle);
        menuContainer.appendChild(featureTogglesList);
    }

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

    const menuHeader = document.createElement('div');
    menuHeader.style.display = 'flex';
    menuHeader.style.flexDirection = 'row';
    menuHeader.style.justifyContent = 'space-between';

    const menuTitle = document.createElement('span');
    menuTitle.innerText = 'QA Menu';

    const closeButton = document.createElement('span');
    closeButton.innerText = '✖';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = 'auto';
    closeButton.style.fontSize = '15px';

    closeButton.addEventListener('click', function() {
        menuContainer.style.display = 'none';
        localStorage.setItem('QAMenuVisibility', 'none');
    });

    menuHeader.appendChild(menuTitle);
    menuHeader.appendChild(closeButton);
    menuContainer.appendChild(menuHeader);

    document.body.appendChild(menuContainer);

    // Get menu visibility from local storage
    const menuVisibility = localStorage.getItem('QAMenuVisibility');
    menuContainer.style.display = menuVisibility === 'block' ? 'block' : 'none';

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
    menuContainer.appendChild(createButton('All studies', allStudies));

    // Append the menu to the page body
    document.body.appendChild(menuContainer);

    // Add a keydown event listener to toggle menu visibility
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.code === 'KeyQ') {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
                localStorage.setItem('QAMenuVisibility', 'block')
            } else {
                menuContainer.style.display = 'none';
                localStorage.setItem('QAMenuVisibility', 'none');
            }
        }
    });

    displayFeatureToggles();
})();
