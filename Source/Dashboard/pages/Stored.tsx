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

import copyToClipBoard from '../../AppFiles/Functions/copyToClipboard';

import getTranslations from '../../../Translations';

class Stored extends React.Component {
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
        this.callback = this.callback.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.getPagerJsx = this.getPagerJsx.bind(this);
        this.setItemsPerSite = this.setItemsPerSite.bind(this);
        this.filterData = this.filterData.bind(this);
        this.downloadAllUrlsZipFile = this.downloadAllUrlsZipFile.bind(this);
        this.downloadSingleUrlAsZipFile = this.downloadSingleUrlAsZipFile.bind(this);
        this.packFiles = this.packFiles.bind(this);
        this.getFavourites = this.getFavourites.bind(this);

        this.state = {
            showLoading: false,
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
            network: localStorage.getItem('localNetwork') ? JSON.parse(localStorage.getItem('localNetwork')) : [],
            excludeFromDownload: []
        }

        this.translations = getTranslations();
    }

    componentDidMount() {
        this.getFavourites();
    }

    getFavourites() {
        let { currentPage } = this.state;
        let itemsPerSite = this.getItemsPerSite();
        const itemsSource = localStorage.getItem('localNetwork') ? JSON.parse(localStorage.getItem('localNetwork')) : [];
        const items = [];

        this.setState({
            animationLoading: true,
        }, () => {

            this.setState({
                animationLoading: true,
                itemsPerSite,
                currentPage,
            }, () => {

                for (let x = 0; x <= itemsSource.length - 1; x++) {
                    items.push(itemsSource[x]);
                }

                this.setState({
                    items
                }, this.callback);
            })
        });
    }

    getItemsPerSite() {
        let items: any = localStorage.getItem('itemsPerSite');

        if (null === items) {
            localStorage.setItem('itemsPerSite', '10');
            items = '10';
        }

        return JSON.parse(items);
    }

    componentWillUnmount() {
        clearInterval(this.getDataInterval);
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

    callback() {
        let { currentPage, itemsPerSite, items } = this.state;
        currentPage = parseInt(currentPage);
        itemsPerSite = parseInt(itemsPerSite);

        const start = (currentPage) * itemsPerSite;
        const end = start + itemsPerSite;

        this.setState({
            itemsToRender: items.slice(start, end)
        }, this.generateFavouritesJsx);
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

    packFiles(url = null) {
        const zip = new JSZip();

        if (null == url) {
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
                    const fileName = this.getFilename(url);
                    const file: any = this.getFileAsBinary(url);
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
        let { itemsPerSite, currentPage, items, itemsToRenderJsx, excludeFromDownload } = this.state;
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
                                    `${itemsToRenderJsx.length - excludeFromDownload.length } - ${this.translations.export_all_to_txt_file}`
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
                                    `${itemsToRenderJsx.length - excludeFromDownload.length } - ${this.translations.download_as_zip}`
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

        let itemsPerSite = parseInt(object.value);

        if (typeof 1 !== typeof itemsPerSite) {
            itemsPerSite = 20;
        }

        this.setState({
            showLoading: false,
            itemsPerSite,
            currentPage: 0,
            displayFullscreenlist: false,
            displayFullscreenlistFilter: false
        });
    }

    /**
     * Main images to render
     */
    generateFavouritesJsx() {
        const { itemsToRender, filter, excludeFromDownload } = this.state;
        const itemsToRenderJsx = [];
        const filteredData = [];
        const filteredForZipFile = [];

        for (let x = 0; x <= itemsToRender.length - 1; x++) {
            let canBeAdded = false;

            if ('' !== filter && -1 !== itemsToRender[x].indexOf(filter)) {
                canBeAdded = true;
            }

            if ('' == filter) {
                canBeAdded = true;
            }

            if (canBeAdded) {
                itemsToRenderJsx.push(itemsToRender[x]);
                
                if(!excludeFromDownload.includes(itemsToRender[x])){
                    filteredData.push(itemsToRender[x]);
                    filteredForZipFile.push(itemsToRender[x]);
                }
            }
        }

        this.setState({
            itemsToRenderJsx,
            showLoading: false,
            filteredData,
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

    filterData(filter) {
        this.setState({
            filter: filter.trim()
        }, this.generateFavouritesJsx);
    }

    generateRequest(method, url) {
        const type = method.toLowerCase();

        this.setState({
            showLoading: true
        }, () => {
            try {
                axios[type](url)
                    .then((externalCode) => {
                        const { data } = externalCode;
                        const fileName = `NetworkMonitor_${customKey()}.json`;

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

    getFilename(url) {
        const names = url.split('/');
        let singleName = names[names.length - 1];

        if (232 < singleName.length) {
            singleName = singleName.substring(0, 232);
        }

        return singleName;
    }

    downloadSingleUrlAsZipFile(url) {
        const { appName } = this.state;

        this.setState({
            showLoading: true
        }, async () => {
            try {
                this.packFiles(url)
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

    toggleStored(url) {
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
        }, this.generateFavouritesJsx);
    }

    toggleExclude(url) {
        let { excludeFromDownload } = this.state;

        if (excludeFromDownload.includes(url)) {
            excludeFromDownload = excludeFromDownload.filter(i => i != url);
        }
        else {
            excludeFromDownload.push(url);
        }

        this.setState({
            excludeFromDownload
        }, this.generateFavouritesJsx);
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

    render() {
        const availableTypes = this.filterAvailableTypes();
        const { excludeFromDownload, filter, network, showLoading, itemsToRenderJsx, items, displayFullscreenlist, displayFullscreenlistFilter } = this.state;

        if (showLoading) {
            return (
                <div className="Favourites flex">
                    <ModuleFullScreenLoadingMin />
                </div>
            );
        }

        return (
            <div className="Favourites">
                <div className="tabs-active">
                    <div className="right">
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
                                        itemsToRenderJsx.map(url => {
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
                                                            onClick={() => this.toggleStored(url)}
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
                                                            onClick={(e) => this.downloadSingleUrlAsZipFile(url)} className="fas fa-arrow-down copy-to-clipboard method-headers download-as-zip">
                                                        </i>
                                                        <i
                                                            title={this.translations.msg_8a}
                                                            onClick={(e) => this.generateTxtFileWithHeaders('GET', url)} className="fab fa-readme copy-to-clipboard method-headers">
                                                        </i>

                                                        <i
                                                            title={this.translations.msg_8}
                                                            onClick={(e) => this.generateTxtFile('GET', url)} className="fa fa-receipt copy-to-clipboard method">
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
                    </div>
                </div>
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

export default Stored;