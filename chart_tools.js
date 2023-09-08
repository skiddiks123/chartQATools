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

    const STYLES = {
        menuContainer: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#1C2733',
            border: '1px solid #2E4052',
            borderRadius: '4px',
            padding: '10px',
            color: '#fff',
            display: 'none' // Initially hidden
        },
        menuHeader: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: '#a0a0a0',
            marginBottom: '20px',
        },
        closeButton: {
            cursor: 'pointer',
            marginLeft: 'auto',
            fontSize: '10px'
        },
        button: {
            display: 'block',
            backgroundColor: '#2A66DD',
            color: '#fff',
            border: 'none',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        featureTogglesList: {
            listStyleType: 'none',
            marginTop: '10px',
            fontSize: '12px',
            color: '#a0a0a0',
        },
        listTitle: {
            marginTop: '20px',
            color: '#a0a0a0',
            fontSize: '15px'
        }
    };

    const TV_INPUT_STYLES = {
        backgroundColor: '#2A2E37',
        marginTop: '20px',
        border: '1px solid #3A3E4A',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '14px',
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    };

    const CONTAINER_STYLES = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const BUTTON_STYLES = {
        backgroundColor: '#2A66DD',
        marginTop: '10px',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.3s ease',
    };

    const BUTTON_HOVER_STYLES = {
        backgroundColor: '#1E4D8D',
    };

    const AUTOCOMPLETE_STYLES = {
        backgroundColor: '#1C2733',
        border: '1px solid #2E4052',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        color: '#a0a0a0',
        width: '100%',
        position: 'absolute',
        zIndex: '1000',
        marginTop: '5px',
        position: 'absolute',
        top: '100%', // under input
        left: '0',
    };

    const ITEM_STYLES = {
        padding: '8px',
        borderBottom: '1px solid #2E4052',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const ITEM_HOVER_STYLES = {
        backgroundColor: '#2A66DD',
        color: '#fff'
    };


    function applyStyles(element, styleObject) {
        for (const [key, value] of Object.entries(styleObject)) {
            element.style[key] = value;
        }
    }


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
        applyStyles(featureTogglesList, STYLES.featureTogglesList);

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
        applyStyles(listTitle, STYLES.listTitle);

        menuContainer.appendChild(listTitle);
        menuContainer.appendChild(featureTogglesList);
    }

    // Function to create the toggle button with options
    function createToggleButton(options) {
        const button = document.createElement('button');
        const conditionValue = localStorage.getItem(options.conditionKey);

        // Set initial button text
        button.innerText = conditionValue === String(options.conditionValue1) ? options.text1 : options.text2;

        // button styles
        applyStyles(button, STYLES.button);

        button.addEventListener('click', function() {
            const conditionValue = localStorage.getItem(options.conditionKey);

            if (conditionValue === String(options.conditionValue1)) {
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
        applyStyles(button, STYLES.button);
        button.addEventListener('click', callback);
        return button;
    }

    // Create the menu container
    const menuContainer = document.createElement('div');
    applyStyles(menuContainer, STYLES.menuContainer);

    const menuHeader = document.createElement('div');
    applyStyles(menuHeader, STYLES.menuHeader);

    const menuTitle = document.createElement('span');
    menuTitle.innerText = 'QA Menu';

    const closeButton = document.createElement('span');
    closeButton.innerText = '✖';
    applyStyles(closeButton, STYLES.closeButton);

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

    const inputWrapper = document.createElement('div');
    inputWrapper.style.position = 'relative';
    menuContainer.appendChild(inputWrapper);

    const inputButtonContainer = document.createElement('div');
    applyStyles(inputButtonContainer, CONTAINER_STYLES);

    // Добавляем инпут
    const featureToggleInput = document.createElement('input');
    featureToggleInput.placeholder = 'Enter featuretoggle name...';

    featureToggleInput.addEventListener('focus', function() {
        this.style.borderColor = '#2A66DD'; // TradingView blue on focus
    });

    featureToggleInput.addEventListener('blur', function() {
        this.style.borderColor = TV_INPUT_STYLES.border.split(' ')[2]; // Reset to default border color
    });

    applyStyles(featureToggleInput, TV_INPUT_STYLES);

    // Autocompletion
    const autoCompleteBox = document.createElement('div');
    applyStyles(autoCompleteBox, AUTOCOMPLETE_STYLES);
    autoCompleteBox.style.display = 'none';  // initially hidden

    featureToggleInput.addEventListener('input', function() {
        const value = featureToggleInput.value.trim();
        autoCompleteBox.innerHTML = '';
        autoCompleteBox.style.display = 'none';

        if (value) {
            const suggestions = Object.keys(featureToggleState).filter(toggle => toggle.includes(value));

            if (suggestions.length) {
                suggestions.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.innerText = suggestion;
                    applyStyles(item, ITEM_STYLES);

                    item.addEventListener('mouseover', function() {
                        applyStyles(item, ITEM_HOVER_STYLES);
                    });

                    item.addEventListener('mouseout', function() {
                        item.style.backgroundColor = ITEM_STYLES.backgroundColor || 'transparent';
                        item.style.color = ITEM_STYLES.color || '#a0a0a0';
                    });

                    item.addEventListener('click', function() {
                        featureToggleInput.value = suggestion;
                        autoCompleteBox.style.display = 'none';
                    });

                    autoCompleteBox.appendChild(item);
                });
                autoCompleteBox.style.display = 'block';
            }
        }
    });

    const featureToggleButton = document.createElement('button');
    featureToggleButton.innerText = "Set";
    applyStyles(featureToggleButton, BUTTON_STYLES);

    featureToggleButton.addEventListener('mouseover', function() {
        applyStyles(featureToggleButton, BUTTON_HOVER_STYLES);
    });

    featureToggleButton.addEventListener('mouseout', function() {
        featureToggleButton.style.backgroundColor = BUTTON_STYLES.backgroundColor;
    });

    inputWrapper.appendChild(featureToggleInput);
    inputButtonContainer.appendChild(featureToggleButton);
    inputWrapper.appendChild(autoCompleteBox);

    menuContainer.appendChild(inputButtonContainer);

})();
