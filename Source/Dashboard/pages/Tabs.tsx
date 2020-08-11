import React from 'react';

import { Link } from 'react-router-dom';

import NoDataTabsLoading from '../../AppFiles/Modules/NoDataTabsLoading';

import NoDataTabs from '../../AppFiles/Modules/NoDataTabs';

import ModuleFullScreenLoadingMin from '../../AppFiles/Modules/ModuleFullScreenLoadingMin';

import customKey from '../../AppFiles/Functions/customKey';

import getAllTabs from '../../AppFiles/Functions/tabs/getAllTabs';

import isEquivalent from '../../AppFiles/Functions/checkObjectsAreEqual';

import getTranslations from '../../../Translations';

class Tabs extends React.Component {

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
            loadingTabsDone: false,
            currentImagesAndType: [],
            /**
             * pager
             */
            itemsPerSite: 10,
            currentPage: 0,
            displayFullscreenlist: false,
            displayFullscreenlistFilter: false,
            appName: 'NetworkMonitor_DavidJanitzek',
            url: '',
            method: '',
            filteredData: [],
            filteredDataAll: [],
            filter: '',
            filteredForZipFile: [],
            displayIntervalOptions: false,
            intervalTime: ''
        }

        this.translations = getTranslations();
    }

    componentDidMount() {
        clearInterval(this.intervaller);
        this.getAllTabs();

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

            }, 800);
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
            currentTabId: id
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
                    });
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
                    });
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

    render() {
        const { showLoading, tabs, loadingTabsDone } = this.state;

        if (showLoading) {
            return (
                <div className="RequestsCode flex">
                    <ModuleFullScreenLoadingMin />
                </div>
            );
        }

        return (
            <div className="RequestsCode">
                <h1 className="ff-title h1 text-center">
                    {
                        this.translations.current_tabs_title
                    }
                </h1>
                <div className="tabs">
                    {
                        tabs.map(tab => {
                            const { url, id } = tab;

                            return (
                                <div
                                    key={customKey()}
                                    className="single-tab"
                                    title={url}
                                >
                                    <Link to={`details?tab=${id}`}>
                                        <h2 className="ff-title h1 text-center">
                                            {
                                                this.getOnlyDomainName(url)
                                            }
                                        </h2>
                                        <p className="tabs-url">
                                            {
                                                url
                                            }
                                        </p>
                                        <div className="iframe-disabler">
                                            <div className="iframe-holder">
                                                <img alt='icon' src="../../../../logo/logo-128.png" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })
                    }
                    {
                        0 == tabs.length && false === loadingTabsDone &&
                        <NoDataTabsLoading />
                    }
                    {
                        0 == tabs.length && true === loadingTabsDone &&
                        <NoDataTabs />
                    }
                </div>
            </div>
        );
    }
};

export default Tabs;