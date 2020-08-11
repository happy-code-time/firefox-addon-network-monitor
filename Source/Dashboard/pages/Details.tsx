import React from 'react';

import * as FileSaver from 'file-saver';

import JSZip from 'jszip';

import JSZipUtils from 'jszip-utils';

import axios from 'axios';

import NoDataRequests from '../../AppFiles/Modules/NoDataRequests';

import ModuleFullScreenLoadingMin from '../../AppFiles/Modules/ModuleFullScreenLoadingMin';

import FullScreenList from '../../AppFiles/Modules/FullScreenList';

import SelectWrapperBlock from '../../AppFiles/Modules/SelectWrapperBlock';

import InputAnimation from '../../AppFiles/Modules/InputAnimation';

import customKey from '../../AppFiles/Functions/customKey';

import addToStore from '../../Store/addToStore';

import getAllTabs from '../../AppFiles/Functions/tabs/getAllTabs';

import copyToClipBoard from '../../AppFiles/Functions/copyToClipboard';

import extractTabId from '../../AppFiles/Functions/extractTabId';

import { addonPrefixDashboard } from '../../AppFiles/Functions/addonPrefix';

import isEquivalent from '../../AppFiles/Functions/checkObjectsAreEqual';

import getTranslations from '../../../Translations';

class Details extends React.Component {
    public props: {
        [key: string]: any;
    };

    public state: {
        [key: string]: any;
    };

    public translations: {
        [key: string]: any;
    };

    public intervaller: any;

    public currentUser: string;

    public currentUserHash: string;

    public getDataInterval: any;

    constructor(props) {
        super(props);
        this.getAllTabs = this.getAllTabs.bind(this);
        this.getDataFromTab = this.getDataFromTab.bind(this);
        this.getActiveTabsTitle = this.getActiveTabsTitle.bind(this);
        this.callback = this.callback.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.getPagerJsx = this.getPagerJsx.bind(this);
        this.setType = this.setType.bind(this);
        this.setItemsPerSite = this.setItemsPerSite.bind(this);
        this.filterData = this.filterData.bind(this);
        this.downloadAllUrlsZipFile = this.downloadAllUrlsZipFile.bind(this);
        this.downloadSingleUrlAsZipFile = this.downloadSingleUrlAsZipFile.bind(this);
        this.packFiles = this.packFiles.bind(this);

        this.state = {
            showLoading: false,
            /**
             * tabs
             */
            tabs: [],
            tabsUrls: [],
            tabsJsx: [],
            activeTabId: null,
            /**
             * data
             */
            data: {},
            /**
             * images
             */
            items: [],
            itemsWithType: [],
            itemsToRenderJsx: [],
            filteredTypes: 'all',
            availableTypes: [],
            currentImagesAndType: [],
            /**
             * pager
             */
            itemsPerSite: 10,
            currentPage: 0,
            displayFullscreenlist: false,
            displayFullscreenlistFilter: false,
            appName: 'NetworkMonitor',
            url: '',
            method: '',
            filteredData: [],
            filteredDataAll: [],
            filter: '',
            filteredForZipFile: [],
            displayIntervalOptions: false,
            intervalTime: '',
            network: [],
            excludeFromDownload: []
        }

        this.translations = getTranslations();
    }

    componentDidMount() {
        clearInterval(this.intervaller);
        const extractedUrl = extractTabId(window.location.href);

        if (extractedUrl && !isNaN(parseInt(extractedUrl))) {
            const activeTabId = parseInt(extractedUrl);

            this.setState({
                activeTabId
            }, () => {
                this.getAllTabs();

                setTimeout(async () => {
                    const network = await this.getDataContentScript();

                    this.setState({
                        network
                    });

                    this.getDataFromTab(activeTabId, true);

                    this.intervaller = setInterval(async () => {
                        const currentTabs = this.state.tabs;

                        if (currentTabs && currentTabs.length) {
                            const tabsData = await getAllTabs().then(data => data);
                            const { tabs } = tabsData;

                            if (!isEquivalent(tabs, currentTabs)) {
                                this.getAllTabs(false);
                            }
                        }
                    }, 5000);
                }, 800);
            });
        }
        else {
            window.location.href = addonPrefixDashboard();
        }
    }

    componentWillUnmount() {
        clearInterval(this.getDataInterval);
    }

    /**
     * Get all tabs as intervaller 
     * and append new tabs
     * if tabs has changed
     */
    getAllTabs(isRegularClickEvent: boolean = true) {
        this.setState({
            showLoading: isRegularClickEvent
        }, () => {

            setTimeout(async () => {
                const tabsData = await getAllTabs().then(data => data);
                const { data, tabs } = tabsData;

                this.setState({
                    data,
                    tabs,
                    showLoading: false,
                }, () => {

                    /**
                     * Get tabid from url
                     */
                    let queryString: any = window.location.hash;

                    if (queryString) {
                        queryString = queryString.split('?tabid=');

                        if (queryString && queryString[1]) {
                            const id = queryString[1];

                            if (id && NaN !== (parseInt(id)) && isRegularClickEvent) {
                                this.getDataFromTab(parseInt(id), true);
                            }
                        }
                    }
                });

            }, 300);
        });
    }

    /**
     * Get only domain name
     * @param {string} url
     */
    getOnlyDomainName(url) {

        if (url) {
            return url.split('/')[2];
        }

        return '';
    }

    getDataFromTab(id: number, resetFilter: boolean = false) {
        let { itemsPerSite, currentPage, items, itemsWithType } = this.state;
        
        this.setState({
            showLoading: true,
            display: false,
            url: '',
            method: '',
        }, () => {
            let { data, filteredTypes } = this.state;

            /**
             * Getl all images from scratch
             */
            if (resetFilter) {
                filteredTypes = 'all';
                itemsPerSite = 10;
                currentPage = 0;
                items = [];
                itemsWithType = [];

                if (undefined !== data && undefined !== data[`${id}`]) {
                    data = data[`${id}`];
                }

                this.setState({
                    showLoading: true,
                    itemsPerSite,
                    currentPage,
                    filteredTypes,
                }, async () => {
                    /**
                     * Calculate all src without src inside the images
                     */
                    const difference = [];
                    const availableTypes = [
                        {
                            text: 'All',
                            value: 'all',
                        }
                    ];

                    /**
                     * Merge images from content script
                     * with images from requests
                     * and avoid dupplicates
                     */
                    for (let x = 0; x <= data.length - 1; x++) {

                        let { url, type } = data[x];

                        itemsWithType.push({
                            url,
                            type,
                            method: data[x].method,
                            requestData: data[x]
                        });
                    }

                    for (let x = 0; x <= itemsWithType.length - 1; x++) {
                        const type = itemsWithType[x].type;

                        if ('' !== type && undefined !== type) {
                            availableTypes.push(
                                {
                                    'text': type,
                                    'value': type
                                }
                            );
                        }

                        if (undefined !== type && '' !== type) {
                            if ('all' == filteredTypes) {
                                difference.push({
                                    url: itemsWithType[x].url,
                                    type,
                                    method: itemsWithType[x].method,
                                    requestData: itemsWithType[x].requestData
                                });
                            }
                            else {
                                if (type === filteredTypes) {
                                    difference.push({
                                        url: items[x].url,
                                        type,
                                        method: itemsWithType[x].method,
                                        requestData: itemsWithType[x].requestData
                                    });
                                }
                            }
                        }
                    }

                    this.setState({
                        activeTabId: id,
                        items: difference,
                        itemsWithType,
                        availableTypes,
                        filteredTypes,
                        itemsPerSite
                    }, this.callback);
                });
            }

            /**
             * Get all images by filter
             */
            else {
                const difference = [];

                this.setState({
                    showLoading: true,
                    itemsPerSite,
                    currentPage,
                    filteredTypes,
                }, () => {

                    for (let x = 0; x <= itemsWithType.length - 1; x++) {

                        const type = itemsWithType[x].type;

                        if (undefined !== type && '' !== type) {
                            if ('all' == filteredTypes) {

                                difference.push({
                                    url: itemsWithType[x].url,
                                    type,
                                    method: itemsWithType[x].method,
                                    requestData: itemsWithType[x].requestData
                                });
                            }
                            else {
                                if (type === filteredTypes) {

                                    difference.push({
                                        url: itemsWithType[x].url,
                                        type,
                                        method: itemsWithType[x].method,
                                        requestData: itemsWithType[x].requestData
                                    });
                                }
                            }
                        }
                    }

                    this.setState({
                        activeTabId: id,
                        items: difference,
                        filteredTypes
                    }, this.callback);
                })
            }
        });
    }

    getActiveTabsTitle() {
        const { tabs, activeTabId } = this.state;

        if (undefined !== tabs[activeTabId]) {
            return this.getOnlyDomainName(tabs[activeTabId].url);
        }

        return '';
    }

    callback() {
        let { currentPage, itemsPerSite, items } = this.state;
        currentPage = parseInt(currentPage);
        itemsPerSite = parseInt(itemsPerSite);

        const start = (currentPage) * itemsPerSite;
        const end = start + itemsPerSite;

        this.setState({
            itemsToRender: items.slice(start, end)
        }, this.generateImagesJsx);
    }

    /**
     * Change page - previous
     */
    prev() {
        let { currentPage } = this.state;

        if (currentPage !== 0) {
            this.setState({
                currentPage: currentPage - 1
            }, () => {
                this.callback();
            })
        }
    }

    /**
     * Change page - next
     */
    next() {
        let { itemsPerSite, currentPage, items } = this.state;
        const currentCount = items.length;

        let mainPage = currentPage;
        mainPage++;

        if (itemsPerSite * mainPage < currentCount) {
            this.setState({
                currentPage: currentPage + 1
            }, () => {
                this.callback();
            })
        }
    }

    /**
     * Display full screen list, items per site
     */
    displayFullscreenlist(listname: string) {
        this.setState({
            [listname]: !this.state[listname]
        });
    }

    downloadAllUrlsZipFile() {
        const { appName } = this.state;
        const self = this;

        this.setState({
            showLoading: true
        }, async () => {
            try {
                self.packFiles()
                    .then((zip: any) => {
                        zip.generateAsync({ type: "blob" })
                            .then(function callback(blob) {
                                self.setState({
                                    showLoading: false
                                }, () => {
                                    FileSaver.saveAs(blob, `${appName}_${customKey()}.zip`);
                                });
                            });

                    })
                    .catch(error => {
                        addToStore(`File generation error: ${error}`, -1);
                        self.setState({ showLoading: false });
                    })
            } catch (error) {
                addToStore(`File generation error: ${error}`, -1);
                self.setState({ showLoading: false });
            }
        });
    }

    getFileAsBinary(url) {
        return new Promise((resolve) => {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if (err) {
                    resolve('');
                } else {
                    resolve(data);
                }
            });
        });
    }

    packFiles(singleObject = null) {
        const zip = new JSZip();

        if (null == singleObject) {
            return new Promise(async resolve => {

                const { filteredForZipFile } = this.state;

                if (undefined !== filteredForZipFile && filteredForZipFile.length) {

                    filteredForZipFile.map(request => {

                        try {
                            const fileName = this.getFilename(request);
                            const file: any = this.getFileAsBinary(request.url);
                            zip.file(fileName, file, { binary: true });
                        } catch (error) {
                            addToStore(error, 1);
                        }
                    });

                    return resolve(zip);

                } else {
                    addToStore('Exported zip file are empty. Please check your filters', -1);
                    return resolve(zip);
                }
            })
        }
        else {
            return new Promise(async resolve => {
                try {
                    const fileName = this.getFilename(singleObject);
                    const file: any = this.getFileAsBinary(singleObject.url);
                    zip.file(fileName, file, { binary: true });
                } catch (error) {

                }

                return resolve(zip);
            })
        }
    }

    /**
     * Get paging functionality
     */
    getPagerJsx() {
        let { itemsPerSite, currentPage, items, filteredTypes, itemsToRenderJsx, excludeFromDownload } = this.state;
        const currentCount = items.length;
        let mainPage = currentPage;
        mainPage++;

        return (
            <div className="paging">
                <span className="filters flex">
                    <div className="h1-box code-box-holder">
                        <ul className="ul-description">
                            <li>
                                <i
                                    className="fas fa-file-alt button-action c-green"
                                    onClick={(e) => this.saveToTxtFileAll()}
                                ></i>
                            </li>
                            <li>
                                {
                                    `${itemsToRenderJsx.length - excludeFromDownload.length} - ${this.translations.export_all_to_txt_file}`
                                }
                            </li>
                        </ul>
                        <ul className="ul-description">
                            <li>
                                <i
                                    className="fas fa-file-contract button-action c-red"
                                    onClick={(e) => this.saveToTxtFileAllInfo()}
                                ></i>
                            </li>
                            <li>
                                {
                                    `${itemsToRenderJsx.length - excludeFromDownload.length} - ${this.translations.export_all_to_txt_file_data}`
                                }
                            </li>
                        </ul>
                        <ul className="ul-description">
                            <li>
                                <i
                                    className="far fa-file-archive download-urls-txt-file download-as-zip"
                                    onClick={(e) => this.downloadAllUrlsZipFile()}
                                >
                                </i>
                            </li>
                            <li>
                                {
                                    `${itemsToRenderJsx.length - excludeFromDownload.length} - ${this.translations.download_as_zip}`
                                }
                            </li>
                        </ul>
                    </div>
                    <div className='code-box-holder'>
                        <h1>
                            {
                                this.translations.filter
                            }
                        </h1>
                        <SelectWrapperBlock
                            callback={(e) => this.displayFullscreenlist('displayFullscreenlistFilter')}
                            iconDown='➤'
                            iconAttributes={undefined}
                            title={`${this.translations.type}: `}
                            selectedType={filteredTypes}
                        />
                        <br />
                        <SelectWrapperBlock
                            callback={(e) => this.displayFullscreenlist('displayFullscreenlist')}
                            iconDown='➤'
                            iconAttributes={undefined}
                            title={`${this.translations.itemsPerSite}: `}
                            selectedType={JSON.stringify(itemsPerSite)}
                        />
                    </div>
                </span>
                <span className="buttons">
                    <i
                        onClick={(e) => this.prev()}
                        className={currentPage !== 0 ? 'fas fa-angle-left prev-button' : 'fas fa-angle-left prev-button deactivated'}
                    >
                    </i>
                    <i
                        onClick={(e) => this.next()}
                        className={itemsPerSite * mainPage < currentCount ? 'fas fa-angle-right next-button' : 'fas fa-angle-right next-button deactivated'}
                    >
                    </i>
                </span>
            </div>
        );
    }

    /**
     * Set filter, to filter images by its original type
     * @param e any
     */
    setType(event: React.ChangeEvent<HTMLInputElement>, object: { text: string, value: string }) {

        if (!object) {
            return this.setState({
                displayFullscreenlist: false,
                displayFullscreenlistFilter: false
            });
        }

        const { activeTabId } = this.state;

        this.setState({
            showLoading: true,
            filteredTypes: object.value,
            currentPage: 0,
            displayFullscreenlist: false,
            displayFullscreenlistFilter: false
        }, () => {
            this.getDataFromTab(activeTabId);
        });
    }

    /**
     * How many images should be displayed on a single site
     * @param e any
     */
    setItemsPerSite(event: React.ChangeEvent<HTMLInputElement>, object: { text: string, value: string }) {

        if (!object) {
            return this.setState({
                displayFullscreenlist: false,
                displayFullscreenlistFilter: false
            });
        }

        const { activeTabId } = this.state;
        let itemsPerSite = parseInt(object.value);

        if (typeof 1 !== typeof itemsPerSite) {
            itemsPerSite = 20;
        }

        this.setState({
            showLoading: true,
            itemsPerSite,
            currentPage: 0,
            displayFullscreenlist: false,
            displayFullscreenlistFilter: false
        }, () => {
            this.getDataFromTab(activeTabId);
        });
    }

    /**
     * Main images to render
     */
    generateImagesJsx() {
        const { itemsToRender, filter, excludeFromDownload } = this.state;
        const itemsToRenderJsx = [];
        const filteredData = [];
        const filteredDataAll = [];
        const filteredForZipFile = [];

        for (let x = 0; x <= itemsToRender.length - 1; x++) {
            let canBeAdded = false;

            if ('' !== filter && -1 !== itemsToRender[x].url.indexOf(filter)) {
                canBeAdded = true;
            }

            if ('' == filter) {
                canBeAdded = true;
            }

            if (canBeAdded) {
                itemsToRenderJsx.push(
                    {
                        url: itemsToRender[x].url,
                        type: itemsToRender[x].type,
                        method: itemsToRender[x].method,
                        requestData: itemsToRender[x].requestData
                    }
                );

                if(!excludeFromDownload.includes(itemsToRender[x].url)){
                    filteredData.push(itemsToRender[x].url);
                    filteredDataAll.push(itemsToRender[x].requestData);
                    filteredForZipFile.push(itemsToRender[x].requestData);
                }
            }
        }

        this.setState({
            itemsToRenderJsx,
            showLoading: false,
            filteredData,
            filteredDataAll,
            filteredForZipFile
        });
    }

    /**
     * Get filename up to 235 (+file type = ~ 240) strings length
     * max is ~ 255
     * @param src string
     */
    generateFileName(src) {
        const names = src.split('/');
        let singleName = names[names.length - 1];

        if (235 < singleName.length) {
            singleName = singleName.substring(0, 235);
        }

        return singleName;
    }

    getMaxPages() {
        const { items, itemsPerSite } = this.state;
        let maxPages: any = items.length / itemsPerSite;

        if (items.length <= itemsPerSite) {
            return parseInt(maxPages);
        }

        maxPages = Math.round(maxPages);

        if (maxPages * itemsPerSite < items.length) {
            maxPages += 1;
        }

        return maxPages;
    }

    filterAvailableTypes() {
        const { availableTypes } = this.state;
        const filtered = [];
        const temp = [];

        availableTypes.map((object: { value: any; text: string }) => {
            if (!temp.includes(object.value)) {
                temp.push(object.value);
                filtered.push(object);
            }
        });

        return filtered;
    }

    saveToTxtFile(code) {
        const { appName } = this.state;

        if ('' != code) {
            try {
                var blob = new Blob([code], { type: "application/txt;charset=utf-8" });
                return FileSaver.saveAs(blob, `${appName}_${customKey()}.txt`);
            } catch (error) {
                return addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToFileJsonRaw(code) {
        const { appName } = this.state;

        if ('' != code) {
            try {
                var blob = new Blob([code], { type: "application/txt;charset=utf-8" });
                return FileSaver.saveAs(blob, `${appName}_${customKey()}.json`);
            } catch (error) {
                return addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToTxtFileAll() {
        let { filteredData, appName } = this.state;

        if (filteredData.length) {
            filteredData = filteredData.join("\n\n");

            try {
                const blob = new Blob([filteredData], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `${appName}_${customKey()}.txt`);
            } catch (error) {
                addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Empty list cannot be exported to TXT file', -1);
        }
    }

    saveToTxtFileAllInfo() {
        let { filteredDataAll, appName } = this.state;
        const stringified = [];

        if (filteredDataAll.length) {

            filteredDataAll.map(o => {
                stringified.push(JSON.stringify(o))
            });

            filteredDataAll = stringified.join("\n\n");

            try {
                const blob = new Blob([filteredDataAll], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `${appName}_${customKey()}.txt`);
            } catch (error) {
                addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Empty list cannot be exported to TXT file', -1);
        }
    }

    filterData(filter) {
        this.setState({
            filter: filter.trim()
        }, this.generateImagesJsx);
    }

    generateRequest(method, url) {
        const messages = [];
        const type = method.toLowerCase();

        this.setState({
            showLoading: true
        }, () => {
            try {
                axios[type](url)
                    .then((externalCode) => {
                        const { data } = externalCode;
                        const fileName = `X_NETWORK_MOON_REQUESTS_RESPONSE_${customKey()}.json`;

                        const toSave = {
                            requestMethod: type,
                            requestedUrl: url,
                            responseData: data
                        };

                        this.setState({
                            txtData: JSON.stringify(data),
                            clipboardData: JSON.stringify(data),
                            showLoading: false
                        }, () => {
                            try {
                                const blob = new Blob([JSON.stringify(toSave)], { type: "text/plain" });
                                FileSaver.saveAs(blob, fileName);
                                this.setState({
                                    showLoading: false
                                });
                            }

                            catch (error) {
                                addToStore(`Error while creating Blob file. Error message: ${error}.`, -1);
                                this.setState({ showLoading: false });
                            }
                        })
                    })
                    .catch((error) => {
                        addToStore(`Request and export error: ${error}`, -1);
                        this.setState({ showLoading: false });
                    })
            } catch (error) {
                addToStore(`Request and export error: ${error}`, -1);
                this.setState({ showLoading: false });
            }
        })
    }

    generateTxtFile(method, url) {
        this.generateRequest(method, url);
    }

    generateTxtFileWithHeaders(method, url) {
        const { appName } = this.state;
        const messages = [];
        const type = method.toLowerCase();

        this.setState({
            showLoading: true
        }, () => {
            try {
                axios[type](url)
                    .then((externalCode) => {
                        const fileName = `${appName}_${customKey()}.json`;
                        const { headers, data } = externalCode;

                        const toSave = {
                            requestMethod: type,
                            requestedUrl: url,
                            responseHeaders: headers,
                            responseData: data
                        };

                        try {
                            const blob = new Blob([JSON.stringify(toSave)], { type: "text/plain" });
                            FileSaver.saveAs(blob, fileName);

                            this.setState({
                                showLoading: false
                            });
                        }

                        catch (error) {
                            addToStore(`Error while creating Blob file. Error message: ${error}.`, -1);
                            this.setState({ showLoading: false });
                        }
                    })
                    .catch((error) => {
                        addToStore(`Request or export error: ${error}`, -1);
                        this.setState({ showLoading: false });
                    })
            } catch (error) {
                addToStore(`Request or export error: ${error}`, -1);
                this.setState({ showLoading: false });
            }
        })
    }

    getFilename(requestObj) {
        const names = requestObj.url.split('/');
        let singleName = names[names.length - 1];

        if (232 < singleName.length) {
            singleName = singleName.substring(0, 232);
        }

        if (requestObj.type) {
            singleName = `(${requestObj.type})${singleName}`;
        }

        return singleName;
    }

    downloadSingleUrlAsZipFile(singleObject) {
        const { appName } = this.state;

        this.setState({
            showLoading: true
        }, async () => {
            try {
                this.packFiles(singleObject)
                    .then((zip: any) => {
                        zip.generateAsync({ type: "blob" })
                            .then(function callback(blob) {
                                FileSaver.saveAs(blob, `${appName}_${customKey()}.zip`);
                            });

                        this.setState({ showLoading: false });
                    })
            } catch (error) {
                addToStore(`File generation error: ${error}`, 1);
                this.setState({ showLoading: false });
            }
        });
    }

    async getDataIntervalRequests(activeTabId) {
        const tabsData = await getAllTabs().then(data => data);
        const { data, tabs } = tabsData;

        this.setState({
            data
        }, () => {
            this.getDataFromTab(activeTabId, false);
        });
    }

    toggleStored(object) {
        const { url, activeTabId } = object;
        let { network } = this.state;

        if (!network) {
            network = [];
        }

        if (network.includes(url)) {
            network = network.filter(i => i != url);
            //@ts-ignore
            browser.runtime.sendMessage({ action: 'remove-network-local-store', url });
        }
        else {
            network.push(url);
            //@ts-ignore
            browser.runtime.sendMessage({ action: 'set-network-local-store', url });
        }

        this.setState({
            network
        }, () => {
            this.getDataFromTab(activeTabId, false);
        });
    }

    /**
     * Get all network from content script
     */
    async getDataContentScript() {
        // @ts-ignore
        return await browser.runtime.sendMessage({
            action: 'get-all-network-from-local-store',
        }).then(response => {

            if (!response) {
                return [];
            }

            return response;
        })
            .catch(() => {
                return {
                    network: [],
                };
            });
    }

    toggleExclude(url) {
        let { excludeFromDownload, activeTabId } = this.state;

        if (excludeFromDownload.includes(url)) {
            excludeFromDownload = excludeFromDownload.filter(i => i != url);
        }
        else {
            excludeFromDownload.push(url);
        }

        this.setState({
            excludeFromDownload
        }, () => {
            this.getDataFromTab(activeTabId, false);
        });
    }

    render() {
        const availableTypes = this.filterAvailableTypes();
        const { excludeFromDownload, filter, network, activeTabId, showLoading, tabs, itemsToRenderJsx, items, displayFullscreenlist, displayFullscreenlistFilter, display } = this.state;

        if (showLoading) {
            return (
                <div className="RequestsCode flex">
                    <ModuleFullScreenLoadingMin />
                </div>
            );
        }

        return (
            <div className="RequestsCode">
                {
                    null !== activeTabId &&
                    <div className="tabs-active flex">
                        <div className="left">
                            <ul>
                                {
                                    tabs.map(tab => {
                                        const { url, id } = tab;

                                        return (
                                            <li
                                                key={customKey()}
                                                className="tab"
                                                onClick={(e) => this.getDataFromTab(id, true)}
                                            >
                                                <h2
                                                    title={url}
                                                    className="ff-title h1"
                                                >
                                                    {
                                                        this.getOnlyDomainName(url)
                                                    }
                                                </h2>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className="right">
                            {
                                !display &&
                                <span>
                                    {
                                        this.getPagerJsx()
                                    }
                                    {
                                        undefined !== items && 0 !== items.length && 0 !== this.getMaxPages() && 0 !== itemsToRenderJsx.length &&
                                        <h1 className="ff-title h1-sites text-center">
                                            {`${this.translations.page} ${this.state.currentPage + 1} ${this.translations.of} ${this.getMaxPages()}`}
                                        </h1>
                                    }
                                    {
                                        0 !== items.length && 0 !== itemsToRenderJsx.length &&
                                        <h1 className="ff-title h1-sites text-center">
                                            {`${items.length} ${this.translations.images}`}
                                        </h1>
                                    }
                                    <div className='input-animation'>
                                        <div className='count'>
                                            {
                                                itemsToRenderJsx.length
                                            }
                                        </div>
                                        <InputAnimation
                                            placeholder={this.translations.urlFilter}
                                            type="text"
                                            currentValue={filter}
                                            callback={this.filterData}
                                        />
                                    </div>
                                    {
                                        0 == itemsToRenderJsx.length &&
                                        <NoDataRequests />
                                    }
                                    {
                                        0 !== itemsToRenderJsx.length &&
                                        <span>
                                            {
                                                itemsToRenderJsx.map(object => {
                                                    const { url, method } = object;
                                                    const stored = network.includes(url);
                                                    const excluded = excludeFromDownload.includes(url);

                                                    return (
                                                        <div
                                                            key={customKey()}
                                                            className="single-request-box"
                                                            title={url}
                                                        >
                                                            {
                                                                excluded &&
                                                                <div className="excluded"></div>
                                                            }
                                                            <div className='content'>
                                                                <i
                                                                    className={`${stored ? 'fas fa-star stored' : 'far fa-star store'}`}
                                                                    title={`${stored ? this.translations.removeFromFavourites : this.translations.saveToFavourites}`}
                                                                    onClick={() => this.toggleStored(object)}
                                                                />
                                                                <i
                                                                    className={`${excluded ? 'fas fa-undo excluded-url' : 'fas fa-trash excluded-url'}`}
                                                                    title={`${excluded ? this.translations.restoreExclude : this.translations.exclude}`}
                                                                    onClick={() => this.toggleExclude(url)}
                                                                />
                                                                <div className="text">
                                                                    {
                                                                        url
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="export-options">
                                                                <i
                                                                    title={this.translations.download_as_zip_single}
                                                                    onClick={(e) => this.downloadSingleUrlAsZipFile(object)} className="fas fa-arrow-down copy-to-clipboard method-headers download-as-zip">
                                                                </i>
                                                                <i
                                                                    title={this.translations.msg_8a}
                                                                    onClick={(e) => this.generateTxtFileWithHeaders(method, url)} className="fab fa-readme copy-to-clipboard method-headers">
                                                                </i>

                                                                <i
                                                                    title={this.translations.msg_8}
                                                                    onClick={(e) => this.generateTxtFile(method, url)} className="fa fa-receipt copy-to-clipboard method">
                                                                </i>
                                                                {
                                                                    document.queryCommandSupported &&
                                                                    <i
                                                                        title={this.translations.action_title_copyToClipboard_single}
                                                                        className="fas fa-clipboard copy-to-clipboard list"
                                                                        onClick={(e) => copyToClipBoard(e, url, undefined)}
                                                                    >
                                                                    </i>
                                                                }
                                                                <a
                                                                    target='_blank'
                                                                    href={url}
                                                                    className="fas fa-external-link-square-alt external-link"
                                                                    title={this.translations.open_in_new_tab}
                                                                ></a>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </span>
                                    }
                                </span>
                            }
                        </div>
                    </div>
                }
                <FullScreenList
                    data={availableTypes}
                    closeIcon="✖"
                    callback={this.setType}
                    display={displayFullscreenlistFilter}
                    inputActive={true}
                    inputPlaceholder={'Filter....'}
                    noDataText=' 🤯 '
                />
                <FullScreenList
                    data={
                        [
                            {
                                text: `1 ${this.translations.itemsPerSiteSuffix}`,
                                value: 1
                            },
                            {
                                text: `2 ${this.translations.itemsPerSiteSuffix}`,
                                value: 2
                            },
                            {
                                text: `3 ${this.translations.itemsPerSiteSuffix}`,
                                value: 3
                            },
                            {
                                text: `4 ${this.translations.itemsPerSiteSuffix}`,
                                value: 4
                            },
                            {
                                text: `5 ${this.translations.itemsPerSiteSuffix}`,
                                value: 5
                            },
                            {
                                text: `10 ${this.translations.itemsPerSiteSuffix}`,
                                value: 10
                            },
                            {
                                text: `20 ${this.translations.itemsPerSiteSuffix}`,
                                value: 20
                            },
                            {
                                text: `30 ${this.translations.itemsPerSiteSuffix}`,
                                value: 30
                            },
                            {
                                text: `40 ${this.translations.itemsPerSiteSuffix}`,
                                value: 40
                            },
                            {
                                text: `50 ${this.translations.itemsPerSiteSuffix}`,
                                value: 50
                            },
                            {
                                text: `60 ${this.translations.itemsPerSiteSuffix}`,
                                value: 60
                            },
                            {
                                text: `70 ${this.translations.itemsPerSiteSuffix}`,
                                value: 70
                            },
                            {
                                text: `80 ${this.translations.itemsPerSiteSuffix}`,
                                value: 80
                            },
                            {
                                text: `90 ${this.translations.itemsPerSiteSuffix}`,
                                value: 90
                            },
                            {
                                text: `100 ${this.translations.itemsPerSiteSuffix}`,
                                value: 100
                            },
                            {
                                text: `110 ${this.translations.itemsPerSiteSuffix}`,
                                value: 110
                            },
                            {
                                text: `120 ${this.translations.itemsPerSiteSuffix}`,
                                value: 120
                            },
                            {
                                text: `130 ${this.translations.itemsPerSiteSuffix}`,
                                value: 130
                            },
                            {
                                text: `140 ${this.translations.itemsPerSiteSuffix}`,
                                value: 140
                            },
                            {
                                text: `150 ${this.translations.itemsPerSiteSuffix}`,
                                value: 150
                            }
                        ]
                    }
                    closeIcon="✖"
                    callback={this.setItemsPerSite}
                    display={displayFullscreenlist}
                    inputActive={true}
                    inputPlaceholder={'10, 20, 30....'}
                    noDataText=' 🤯 '
                />
                <form style={{
                    display: 'none !important',
                    opacity: 0,
                    position: 'fixed',
                    width: 0,
                    height: 0,
                    overflow: 'hidden'
                }}>
                    <textarea
                        id="copy-to-clipboard"
                        value=''
                        readOnly={true}
                        style={{
                            display: 'none !important',
                            opacity: 0,
                            position: 'fixed',
                            width: 0,
                            height: 0,
                            overflow: 'hidden'
                        }}
                    />
                </form>
            </div>
        );
    }
};

export default Details;