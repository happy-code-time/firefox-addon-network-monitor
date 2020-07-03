import * as React from 'react';

import * as FileSaver from 'file-saver';

import ModuleFullScreenLoading from '../../AppFiles/Modules/ModuleFullScreenLoading';

import InputAnimation from '../../AppFiles/Modules/InputAnimation';

import getTranslations from '../../../Translations/index';

import getCurrentLoggedInUser from '../../AppFiles/Functions/getCurrentLoggedInUser';

import customKey from '../../AppFiles/Functions/customKey';

import { addonRoot } from '../../AppFiles/Functions/addonPrefix';

import copyToClipBoard from '../../AppFiles/Functions/copyToClipboard';

import addToStore from '../../Store/addToStore';

interface WebsiteContainerProps {
    contentData?: string | any;
    loginRequired: boolean;
    redirectAfterLogin?: string;
}

class Requests extends React.Component<WebsiteContainerProps> {

    public translations: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    public env?: string;
    public remoteHost?: string;
    public currentUser?: string;
    public currentUserHash?: string;
    public contentNode: any;

    constructor(props: WebsiteContainerProps) {
        super(props);
        this.getDataFromContentScript = this.getDataFromContentScript.bind(this);
        this.buildRequests = this.buildRequests.bind(this);
        this.filterData = this.filterData.bind(this);

        this.translations = getTranslations();
        this.env = process.env.ENV;
        this.remoteHost = process.env.REMOTE_HOST;
        this.currentUser = getCurrentLoggedInUser(true);
        this.currentUserHash = getCurrentLoggedInUser();

        this.state = {
            minifiedSecondSideBar: true,
            isMinified: true,
            sidebarMin: true,
            contentMin: true,
            minifiedSaver: true,
            language: 'en',
            activeTab: {},
            contentData: this.props.contentData ? this.props.contentData : '',
            loginRequired: this.props.loginRequired,
            redirectAfterLogin: this.props.redirectAfterLogin ? this.props.redirectAfterLogin : '',
            /**
             * Stats
             */
            domain: '',
            tabid: -1,
            url: '',
            data: {},
            booleanStorageMappingJsx: [],
            animationLoading: false,
            requestHistory: [],
            blacklistedElementsTrackers: [],
            blacklistedElementsDomians: [],
            blacklistedElementsCookies: [],
            whitelistedElementsDomains: [],
            blacklistedElementsIframes: [],
            blacklistedElementsIframesSources: [],
            filter: '',
            dataGeneration: false,
            all: [],
            filteredData: [],
            filteredDataAll: []
        };
    }

    componentDidMount() {
        this.getDataFromContentScript();
    }

    saveToTxtFile(data) {
        try {
            var blob = new Blob([data], { type: "application/txt;charset=utf-8" });
            FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
        } catch (error) {
            var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
            FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
        }
    }

    saveToTxtFileAll() {
        let { filteredData } = this.state;

        if (filteredData.length) {
            filteredData = filteredData.join("\n\n");

            try {
                var blob = new Blob([filteredData], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
            } catch (error) {
                var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
            }
        }
        else {
            addToStore('Empty list cannot be exported to TXT file', -1);
        }
    }

    saveToTxtFileAllInfo() {
        let { filteredDataAll } = this.state;
        const stringified = [];

        if (filteredDataAll.length) {

            filteredDataAll.map(o => {
                stringified.push(JSON.stringify(o))
            });

            filteredDataAll = stringified.join("\n\n");

            try {
                var blob = new Blob([filteredDataAll], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
            } catch (error) {
                var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
                FileSaver.saveAs(blob, `NetworkMonitor_DavidJanitzek_${customKey()}.txt`);
            }
        }
        else {
            addToStore('Empty list cannot be exported to TXT file', -1);
        }
    }

    getDataFromContentScript() {
        const data: string | null = localStorage.getItem('requestHistory') ? localStorage.getItem('requestHistory') : null;

        if (data) {
            // @ts-ignore
            browser.runtime.sendMessage({
                action: 'get-active-tab'
            })
                .then((tab: { id: number, url: string }) => {
                    if (tab && undefined !== tab.id && null !== tab.id && -1 !== tab.id && -1 !== tab.url.indexOf('http')) {
                        const parsedDatadata = JSON.parse(data);

                        if (undefined !== parsedDatadata && undefined !== parsedDatadata[`${tab.id}`]) {

                            let requests = parsedDatadata[`${tab.id}`];
                            
                            this.setState({
                                all: requests,
                                requests: requests.length,
                                tabid: tab.id
                            }, this.buildRequests);
                        }
                    }
                })
                .catch(e => {

                })
        }
    }

    filterData(filter) {
        this.setState({
            filter: filter.trim()
        }, this.getDataFromContentScript);
    }

    buildRequests() {
        const booleanStorageMappingJsx = [];

        this.setState({
            booleanStorageMappingJsx
        }, () => {
            const { all, filter } = this.state;
            const filteredData = [];
            const filteredDataAll = [];

            all.map(requestObject => {
                const { url } = requestObject;

                if ('' !== filter && -1 == url.indexOf(filter)) {
                    return null;
                }

                filteredData.push(url);
                filteredDataAll.push(requestObject);

                booleanStorageMappingJsx.push(
                    <div key={customKey()} className="code-box-holder">
                        <h1>
                            {
                                url
                            }
                        </h1>
                        <ul key={customKey()} className="ul-description">
                            <li>
                                {
                                    document.queryCommandSupported &&
                                    <i
                                        className="fas fa-paste button-action clipboard"
                                        onClick={(e) => copyToClipBoard(e, url, undefined)}
                                    ></i>
                                }
                            </li>
                            <li>
                                {
                                    this.translations.action_title_copyToClipboard_single
                                }
                            </li>
                        </ul>
                        <ul key={customKey()} className="ul-description">
                            <li>
                                <i
                                    className="fas fa-subscript button-action"
                                    onClick={(e) => this.saveToTxtFile(url)}
                                ></i>
                            </li>
                            <li>
                                {
                                    this.translations.export_link_to_txt_file
                                }
                            </li>
                        </ul>
                    </div>
                );
            });

            this.setState({
                booleanStorageMappingJsx,
                filteredData,
                filteredDataAll
            }, () => {
                this.setState({
                    dataGeneration: false
                });
            });
        });
    }

    reloadTarget(event: any) {
        event.preventDefault();

        //@ts-ignore
        browser.runtime.sendMessage({
            action: 'reload-target'
        });
    }

    render(): JSX.Element {
        const { animationLoading, booleanStorageMappingJsx, filter, dataGeneration } = this.state;

        if (animationLoading) {
            return <ModuleFullScreenLoading />;
        }

        return (
            <div
                ref={(node) => this.contentNode = node}
                className="ContentBody RequestsPopup ContentStaticHeight"
            >
                <div className="count">
                    {
                        booleanStorageMappingJsx.length
                    }
                </div>
                <InputAnimation
                    placeholder='Filter...'
                    type="text"
                    currentValue={filter}
                    callback={this.filterData}
                />
                {
                    dataGeneration &&
                    <div className="NoDataAvailable">
                        <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                        <h1 className="h1-title ff-title text-center">
                            {
                                this.translations.loading
                            }
                        </h1>
                    </div>
                }
                {
                    0 === booleanStorageMappingJsx.length && !dataGeneration &&
                    <div className="NoDataAvailable">
                        <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                        <h1 className="h1-title ff-title text-center">
                            {
                                this.translations.no_data_available
                            }
                        </h1>
                    </div>
                }
                {
                    0 !== booleanStorageMappingJsx.length && !dataGeneration &&
                    <span>
                        <div key={customKey()} className="h1-box code-box-holder">
                            <h1>
                                {
                                    this.translations.global_export_options
                                }
                            </h1>
                            <ul key={customKey()} className="ul-description">
                                <li>
                                    <i
                                        className="fas fa-file-alt button-action c-green"
                                        onClick={(e) => this.saveToTxtFileAll()}
                                    ></i>
                                </li>
                                <li>
                                    {
                                        this.translations.export_all_to_txt_file
                                    }
                                </li>
                            </ul>
                            <ul key={customKey()} className="ul-description">
                                <li>
                                    <i
                                        className="fas fa-file-contract button-action c-red"
                                        onClick={(e) => this.saveToTxtFileAllInfo()}
                                    ></i>
                                </li>
                                <li>
                                    {
                                        this.translations.export_all_to_txt_file_data
                                    }
                                </li>
                            </ul>
                        </div>
                        {
                            booleanStorageMappingJsx
                        }
                    </span>
                }
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
}

export default Requests;
