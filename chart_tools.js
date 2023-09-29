// ==UserScript==
// @name         Chart QA Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tools for chart QA
// @author       dulashenko
// @match        */chart/*
// @grant        none
// ==/UserScript==

(function () {
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
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 0',
        }
    };

    const TV_INPUT_STYLES = {
        backgroundColor: '#2A2E37',
        marginTop: '10px',
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
        top: '100%',
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

    const TOGGLE_STYLES = {
        width: '30px',
        height: '10px',
        borderRadius: '15px',
        display: 'inline-block',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'gray',
        transition: 'background-color 0.2s',
    };

    const TOGGLE_THUMB_STYLES = {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: 'white',
        position: 'absolute',
        top: '-2px',
        left: '1px',
        transition: 'left 0.2s',
    };

    const TOGGLE_ON_STYLES = {
        backgroundColor: '#4CAF50',
    };

    const TOGGLE_THUMB_ON_STYLES = {
        left: '15px',
    };

    const TOGGLE_AND_DELETE_CONTAINER_STYLES = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginLeft: '20px',
    };


    function resaveSetting(key, isDeletion) {
        if (isDeletion) {
            var deletionSetting = {};
            deletionSetting[key] = null;
            $.post('/savesettings/', { delta: JSON.stringify(deletionSetting) });
            return;
        }

        var settings = {};
        settings[key] = TVSettings.getValue(key);
        $.post('/savesettings/', { delta: JSON.stringify(settings) });
    }



    function removeStyles(element, styleObject) {
        for (const key in styleObject) {
            element.style[key] = '';
        }
    }

    function applyStyles(element, styleObject) {
        for (const [key, value] of Object.entries(styleObject)) {
            element.style[key] = value;
        }
    }

    function userSettings() {
        var settings = {};
        TVSettings.keys().forEach(function (key) {
            settings[key] = TVSettings.getValue(key);
        });
        console.log(settings);
    };

    function getUserSettings() {
        var settings = {};
        TVSettings.keys().forEach(function (key) {
            settings[key] = TVSettings.getValue(key);
        });
        return settings;
    };

    function initializeUserOverrides() {
        const userSettings = getUserSettings();
        for (const key in userSettings) {
            if (key.startsWith('forcefeaturetoggle.')) {
                addUserOverride(key);
            }
        }
    }

    function layoutJSON() {
        var url = document.URL;
        url = url.replace('chart', 'json');
        fetch(url)
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    };

    function allStudies() {
        const charts = TradingViewApi._chartWidgetCollection.state().charts;
        const scripts = charts.map((chart, chartIndex) => {
            const studies = chart.panes.flatMap(pane => {
                return pane.sources.filter(source => /study/i.test(source.type)).map(source => ({
                    description: source.metaInfo.description,
                    scriptIdPart: source.metaInfo.scriptIdPart,
                    fullId: source.metaInfo.fullId,
                    meta: source.metaInfo
                }));
            });

            return {
                [`Chart_${chartIndex + 1}`]: studies
            };
        }).reduce((acc, curr) => Object.assign(acc, curr), {});

        console.log(scripts);
    };

    function executeMigration() {
        // ... (paste the entire provided code here) ...
        const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        function randomHash(length) {
            let res = '';
            for (let i = 0; i < length; ++i) {
                const index = Math.floor(Math.random() * alphabet.length);
                res += alphabet[index];
            }

            return res;
        }

        function log(message, level) {
            console.log(`[${new Date().toISOString()}] [${level}]\t${message}`);
        }

        function logInfo(message) {
            log(message, 'INFO');
        }

        function logTrace(message) {
            log(message, 'TRACE');
        }

        async function retLayoutJSON() {
            var url = document.URL;
            url = url.replace('chart', 'json');
            try {
                let response = await fetch(url);
                let data = await response.text();
                return data;
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        function downloadStringAsFile(filename, content) {
            const blob = new Blob([content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        logTrace(`Processing...`);

        (async function () {
            const data = JSON.parse(await retLayoutJSON());

            logTrace('Processing groups...');

            data.content.charts.forEach(chart => {
                const id = chart.chartId;
                const storageData = data.charts_storage_data[id] ?? {};
                const sources = storageData.sources ?? {};
                const groups = storageData.drawing_groups ?? {};
                logTrace(`processing groups on chart ${id}`);
                Object.values(groups).forEach(group => {
                    logTrace(`Processing group ${group.id} on chart ${id}`);
                    const linesInGroup = Object.values(sources).filter(line => line.groupId === group.id);
                    const syncedLinesInGroups = linesInGroup.filter(line => !!line.state.linkKey);
                    const notSyncedLinesInGroups = linesInGroup.filter(line => !line.state.linkKey);
                    const smallerList = syncedLinesInGroups.length < notSyncedLinesInGroups.length ? syncedLinesInGroups : notSyncedLinesInGroups;
                    smallerList.forEach(line => {
                        logInfo(`Excluding line ${line.id} from group ${line.groupId}`);
                        delete line.groupId;
                    });
                });

            });

            const firstChartId = data.content.charts[0].chartId;

            const chartIds = data.content.charts.slice(1).map(chart => chart.chartId);

            const firstChartLineTools = data.charts_storage_data[firstChartId]?.sources ?? {};

            logTrace(`Totally sources on the first chart: ${Object.keys(firstChartLineTools).length}`);

            const linesToMigrate = Object.values(firstChartLineTools)
                .filter(line => !!line.state.linkKey && line.state.sharingMode === undefined);

            logTrace(`Lines to migrate to _shared: ${linesToMigrate.length}`);

            let sharedState;
            let invalidated = false;

            if (linesToMigrate.length) {
                sharedState = data.charts_storage_data['_shared'] = data.charts_storage_data['_shared'] ?? {};
                sharedState.sources = sharedState.sources ?? {};
                sharedState.drawing_groups = sharedState.drawing_groups ?? {};

                const firstChartGroups = data.charts_storage_data[firstChartId].drawing_groups ?? {};

                linesToMigrate.forEach(line => {
                    line.state.sharingMode = 1;
                    delete data.charts_storage_data[firstChartId].sources[line.id];
                    // keep old value in shared if exists
                    sharedState.sources[line.id] = sharedState.sources[line.id] ?? line;

                    logInfo(`Move ${line.id} from chart ${firstChartId} to _shared`);

                    // now check if we have to migrate group
                    if (line.groupId) {
                        const group = firstChartGroups[line.groupId];
                        delete firstChartGroups[line.groupId];
                        if (!sharedState.drawing_groups[line.groupId]) {
                            sharedState.drawing_groups[line.groupId] = group;
                            logInfo(`Move group ${line.groupId} from chart ${firstChartId} to _shared`);
                        }
                    }
                    invalidated = true;
                });
            }

            // process unlinking

            // map shared lines by linkkey
            const sharedByLinkKey = new Map(Object.values(sharedState?.sources ?? {}).map(line => [line.state.linkKey, line]));

            chartIds
                .map(id => {
                    const res = data.charts_storage_data[id] ?? {};
                    return { id: id, chart: res };
                })
                .forEach(pair => {
                    const chart = pair.chart;
                    const linesWithLinkKeyWithoutSharing = Object.values(chart.sources ?? {}).filter(line => !!line.state.linkKey && line.state.sharingMode === undefined);
                    logTrace(`Got ${linesWithLinkKeyWithoutSharing.length} targets for migrations on chart ${pair.id}`);
                    sharedState = sharedState ?? {};

                    linesWithLinkKeyWithoutSharing.forEach(line => {
                        logTrace(`Processing line ${line.id} with key ${line.state.linkKey}`);
                        invalidated = true;
                        if (sharedByLinkKey.has(line.state.linkKey)) {
                            logInfo(`Remove ${line.id} from chart ${pair.id}`);
                            delete chart.sources[line.id];
                        } else {
                            const newId = randomHash(8);
                            logInfo(`Unsync ${line.id} on chart ${pair.id} with new id ${newId}`);
                            line.state.sharingMode = 0;
                            delete line.state.linkKey;
                            delete chart.sources[line.id];
                            line.id = newId;
                            chart.sources[newId] = line;
                        }
                    });

                    //remove all empty groups
                    const allUsedGroups = new Set(Object.values(chart.sources ?? {}).filter(line => line.groupId).map(line => line.groupId));
                    const allGroups = Object.keys(chart.drawing_groups ?? {});
                    allGroups.filter(groupId => !allUsedGroups.has(groupId)).forEach((groupId) => {
                        logInfo(`Remove empty group ${groupId} from chart ${pair.id}`);
                        delete chart.drawing_groups[groupId];
                    });

                    // reassign id for all the groups
                    allUsedGroups.forEach(groupId => {
                        const newId = randomHash(8);
                        logInfo(`Change group id from ${groupId} to ${newId} on chart ${pair.id}`);
                        const group = chart.drawing_groups[groupId];
                        group.id = newId;
                        delete chart.drawing_groups[groupId];
                        chart.drawing_groups[newId] = group;

                        // move all the line tools
                        Object.values(chart.sources ?? {})
                            .filter(line => line.groupId === groupId)
                            .forEach(line => line.groupId = newId);
                    });
                });

            if (!invalidated) {
                logTrace('No linetols have been migrated');
                return;
            }


            if (sharedState) {
                data.charts_storage_data._shared = sharedState;
            }

            const migrated = JSON.stringify(data.charts_storage_data, null, '\t');

            downloadStringAsFile('migrated_data.json', migrated);

            logTrace(`Migration is done`);



        })();
    }


    const createContainer = () => {
        const menuContainer = document.createElement('div');
        applyStyles(menuContainer, STYLES.menuContainer);

        const menuHeader = document.createElement('div');
        applyStyles(menuHeader, STYLES.menuHeader);

        const menuTitle = document.createElement('span');
        menuTitle.textContent = 'QA Menu';

        const closeButton = document.createElement('span');
        closeButton.textContent = '✖';
        applyStyles(closeButton, STYLES.closeButton);

        closeButton.addEventListener('click', () => {
            menuContainer.style.display = 'none';
            localStorage.setItem('QAMenuVisibility', 'none');
        });

        menuHeader.append(menuTitle, closeButton);
        menuContainer.appendChild(menuHeader);
        document.body.appendChild(menuContainer);

        return menuContainer;
    };


    const menuContainer = createContainer();

    const featureTogglesList = document.createElement('ul');
    applyStyles(featureTogglesList, STYLES.featureTogglesList);

    const addFeatureToggle = (key) => {
        const cleanedKey = key.replace('forcefeaturetoggle.', '');
        const value = localStorage.getItem(key) === "true";

        const listItem = document.createElement('li');
        applyStyles(listItem, STYLES.listItem);

        const label = document.createElement('span');
        label.textContent = `${cleanedKey}: `;
        listItem.appendChild(label);

        featureTogglesList.appendChild(listItem);

        const toggleAndDeleteContainer = document.createElement('div');
        applyStyles(toggleAndDeleteContainer, TOGGLE_AND_DELETE_CONTAINER_STYLES);

        const toggleContainer = document.createElement('div');
        applyStyles(toggleContainer, TOGGLE_STYLES);
        const toggleThumb = document.createElement('div');
        applyStyles(toggleThumb, TOGGLE_THUMB_STYLES);

        if (value) {
            applyStyles(toggleContainer, TOGGLE_ON_STYLES);
            applyStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
        }

        toggleContainer.appendChild(toggleThumb);

        toggleContainer.addEventListener('click', () => {
            const currentValue = localStorage.getItem(key) === "true";
            localStorage.setItem(key, String(!currentValue));

            if (currentValue) {
                removeStyles(toggleContainer, TOGGLE_ON_STYLES);
                removeStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
            } else {
                applyStyles(toggleContainer, TOGGLE_ON_STYLES);
                applyStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
            }
        });

        const deleteButton = document.createElement('span');
        deleteButton.textContent = '✖';
        applyStyles(deleteButton, STYLES.closeButton);

        deleteButton.addEventListener('click', () => {
            featureTogglesList.removeChild(listItem);
            localStorage.removeItem(key);
        });

        toggleAndDeleteContainer.append(toggleContainer, deleteButton);
        listItem.appendChild(toggleAndDeleteContainer);
    };


    const listTitle = document.createElement('h3');
    listTitle.innerText = 'Local storage overrides';
    applyStyles(listTitle, STYLES.listTitle);

    menuContainer.appendChild(listTitle);
    menuContainer.appendChild(featureTogglesList);

    const userOverridesTitle = document.createElement('h3');
    userOverridesTitle.innerText = 'User overrides';
    applyStyles(userOverridesTitle, STYLES.listTitle);

    const userOverridesList = document.createElement('ul');
    applyStyles(userOverridesList, STYLES.featureTogglesList);

    menuContainer.appendChild(userOverridesTitle);
    menuContainer.appendChild(userOverridesList);



    const createToggleButton = ({ conditionKey, conditionValue1, text1, text2, action1, action2 }) => {
        const button = document.createElement('button');
        const conditionValue = localStorage.getItem(conditionKey);

        button.textContent = conditionValue === String(conditionValue1) ? text1 : text2;
        applyStyles(button, STYLES.button);

        button.addEventListener('click', () => {
            const currentConditionValue = localStorage.getItem(conditionKey);

            if (currentConditionValue === String(conditionValue1)) {
                action1();
                button.textContent = text2;
            } else {
                action2();
                button.textContent = text1;
            }
        });

        return button;
    };




    function initializeFeatureToggles() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('forcefeaturetoggle')) {
                addFeatureToggle(key);
            }
        }
    }

    const addUserOverride = (key) => {
        const cleanedKey = key.replace('forcefeaturetoggle.', '');
        const value = TVSettings.getValue(key) === "true";

        const listItem = document.createElement('li');
        applyStyles(listItem, STYLES.listItem);

        const label = document.createElement('span');
        label.textContent = `${cleanedKey}: `;
        listItem.appendChild(label);

        userOverridesList.appendChild(listItem);

        const toggleAndDeleteContainer = document.createElement('div');
        applyStyles(toggleAndDeleteContainer, TOGGLE_AND_DELETE_CONTAINER_STYLES);

        const toggleContainer = document.createElement('div');
        applyStyles(toggleContainer, TOGGLE_STYLES);
        const toggleThumb = document.createElement('div');
        applyStyles(toggleThumb, TOGGLE_THUMB_STYLES);

        if (value) {
            applyStyles(toggleContainer, TOGGLE_ON_STYLES);
            applyStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
        }

        toggleContainer.appendChild(toggleThumb);

        toggleContainer.addEventListener('click', () => {
            const currentValue = TVSettings.getValue(key) === "true";
            TVSettings.setValue(key, String(!currentValue));
            resaveSetting(key);

            if (currentValue) {
                removeStyles(toggleContainer, TOGGLE_ON_STYLES);
                removeStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
            } else {
                applyStyles(toggleContainer, TOGGLE_ON_STYLES);
                applyStyles(toggleThumb, TOGGLE_THUMB_ON_STYLES);
            }
        });

        const deleteButton = document.createElement('span');
        deleteButton.textContent = '✖';
        applyStyles(deleteButton, STYLES.closeButton);

        deleteButton.addEventListener('click', () => {
            userOverridesList.removeChild(listItem);
            TVSettings.remove(key);
            resaveSetting(key, true);
        });

        toggleAndDeleteContainer.append(toggleContainer, deleteButton);
        listItem.appendChild(toggleAndDeleteContainer);
    };

    function createButton(text, callback) {
        const button = document.createElement('button');
        button.innerText = text;
        applyStyles(button, STYLES.button);
        button.addEventListener('click', callback);
        return button;
    }

    const menuVisibility = localStorage.getItem('QAMenuVisibility');
    menuContainer.style.display = menuVisibility === 'block' ? 'block' : 'none';

    const inputWrapper = document.createElement('div');
    inputWrapper.style.position = 'relative';
    menuContainer.appendChild(inputWrapper);

    const inputButtonContainer = document.createElement('div');
    applyStyles(inputButtonContainer, CONTAINER_STYLES);

    const featureToggleInput = document.createElement('input');
    featureToggleInput.placeholder = 'Enter featuretoggle name...';

    featureToggleInput.addEventListener('focus', function () {
        this.style.borderColor = '#2A66DD';
    });

    featureToggleInput.addEventListener('blur', function () {
        this.style.borderColor = TV_INPUT_STYLES.border.split(' ')[2];
    });

    applyStyles(featureToggleInput, TV_INPUT_STYLES);

    const autoCompleteBox = document.createElement('div');
    applyStyles(autoCompleteBox, AUTOCOMPLETE_STYLES);
    autoCompleteBox.style.display = 'none';

    featureToggleInput.addEventListener('input', () => {
        const value = featureToggleInput.value.trim();
        autoCompleteBox.innerHTML = '';
        autoCompleteBox.style.display = 'none';

        if (!value) return;

        const suggestions = Object.keys(featureToggleState).filter(toggle => toggle.includes(value));

        if (!suggestions.length) return;

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.textContent = suggestion;
            applyStyles(item, ITEM_STYLES);

            item.addEventListener('mouseover', () => applyStyles(item, ITEM_HOVER_STYLES));

            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = ITEM_STYLES.backgroundColor || 'transparent';
                item.style.color = ITEM_STYLES.color || '#a0a0a0';
            });

            item.addEventListener('click', () => {
                featureToggleInput.value = suggestion;
                autoCompleteBox.style.display = 'none';
            });

            autoCompleteBox.appendChild(item);
        });

        autoCompleteBox.style.display = 'block';
    });


    const featureToggleButton = document.createElement('button');
    featureToggleButton.innerText = "Set";
    applyStyles(featureToggleButton, BUTTON_STYLES);
    featureToggleButton.style.marginBottom = '20px';

    function handleSetButtonClick() {
        const inputValue = featureToggleInput.value;
        if (inputValue) {
            const key = 'forcefeaturetoggle.' + inputValue;
            localStorage.setItem(key, 'true');
            addFeatureToggle(key);
        }
    }

    featureToggleButton.onclick = handleSetButtonClick;

    const setUserSettingsButton = document.createElement('button');
    setUserSettingsButton.innerText = "Set in user settings";
    applyStyles(setUserSettingsButton, BUTTON_STYLES);
    setUserSettingsButton.style.marginBottom = '20px';

    function handleSetUserSettingsButtonClick() {
        const inputValue = featureToggleInput.value;
        if (inputValue) {
            const key = 'forcefeaturetoggle.' + inputValue;
            TVSettings.setValue(key, 'true');
            addUserOverride(key);
            resaveSetting(key);

        }
    }

    setUserSettingsButton.onclick = handleSetUserSettingsButtonClick;

    featureToggleButton.addEventListener('mouseover', function () {
        applyStyles(featureToggleButton, BUTTON_HOVER_STYLES);
    });

    featureToggleButton.addEventListener('mouseout', function () {
        featureToggleButton.style.backgroundColor = BUTTON_STYLES.backgroundColor;
    });

    inputWrapper.appendChild(featureToggleInput);
    inputButtonContainer.appendChild(featureToggleButton);
    inputButtonContainer.appendChild(setUserSettingsButton);
    inputWrapper.appendChild(autoCompleteBox);

    menuContainer.appendChild(inputButtonContainer);

    const logToggleButton = createToggleButton({
        conditionKey: 'tv.logger.loglevel',
        conditionValue1: '3',
        conditionValue2: '5',
        text1: 'Lon',
        text2: 'Loff',
        action1: function () { lon(true) },
        action2: function () { loff() },
    });

    menuContainer.appendChild(logToggleButton);

    menuContainer.appendChild(createButton('Layout JSON', layoutJSON));
    menuContainer.appendChild(createButton('User settings', userSettings));
    menuContainer.appendChild(createButton('All studies', allStudies));
    menuContainer.appendChild(createButton('Migrate drawings', executeMigration));


    document.body.appendChild(menuContainer);

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.code === 'KeyQ') {
            const isHidden = menuContainer.style.display === 'none';
            menuContainer.style.display = isHidden ? 'block' : 'none';
            localStorage.setItem('QAMenuVisibility', isHidden ? 'block' : 'none');
        }
    });


    initializeFeatureToggles();
    initializeUserOverrides();


})();
