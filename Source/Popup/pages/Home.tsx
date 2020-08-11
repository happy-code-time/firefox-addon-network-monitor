import * as React from 'react';

import getTranslations from '../../../Translations';

import NoDataRequests from '../../AppFiles/Modules/NoDataRequests';

import { addonPrefixDashboard, addonRoot } from '../../AppFiles/Functions/addonPrefix';

class Home extends React.Component 
{

    public translations: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    public getDataInterval: any;

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.openDashboard = this.openDashboard.bind(this);

        this.state = {
            activeTab: {},
            requests: 0,
        };

        this.translations = getTranslations();
    }

    componentDidMount() {
        this.setIntervals();
    }

    componentWillUnmount() {
        clearInterval(this.getDataInterval);
    }

    setIntervals() {
        clearInterval(this.getDataInterval);
        this.getData();

        this.getDataInterval = setInterval(() => {
            this.getData();
        }, 3000);
    }

    getData() {
        const data: string | null = localStorage.getItem('requestHistory') ? localStorage.getItem('requestHistory') : null;

        if (data) {
            // @ts-ignore
            browser.runtime.sendMessage({
                action: 'get-active-tab'
            })
                .then( (tab: { id: number, url: string }) => {
                    if (tab && undefined !== tab.id && null !== tab.id && -1 !== tab.id && -1 !== tab.url.indexOf('http')) {
                        const parsedDatadata = JSON.parse(data);

                        if (undefined !== parsedDatadata && undefined !== parsedDatadata[`${tab.id}`]) {

                            const requests = parsedDatadata[`${tab.id}`];

                            this.setState({
                                requests: requests.length,
                                tabid: tab.id
                            });
                        }
                    }
                })
                .catch(e => {

                })
        }
    }

    openDashboard(url) {
        //@ts-ignore
        browser.tabs.create({
            url
        })
            .then(() => {
                window.close();
            })
            .catch(() => {
                window.close();
            })
    }

    render(): JSX.Element {
        const { tabid, requests } = this.state;

        return (
            <div className="ContentBody ContentStaticHeight Requests">
                {
                    0 !== requests &&
                    <span>
                        <h1 className="ff-title text-center">
                            {
                                this.translations.requestsPopupTitle
                            }
                        </h1>
                        <div className="images-count text-center">
                            {
                                requests
                            }
                        </div>
                        <a
                            className="link"
                            href={`${addonPrefixDashboard()}#/?tabid=${tabid}`}
                            onClick={(e) => this.openDashboard(`${addonPrefixDashboard()}#/details?tab=${tabid}`)}
                        >
                            {
                                this.translations.popup_text
                            }
                        </a>
                    </span>
                }
                {
                    0 == requests &&
                    <span>
                        <NoDataRequests />
                        <a
                            className="link"
                            href={`${addonPrefixDashboard()}#/`}
                            onClick={(e) => this.openDashboard(`${addonPrefixDashboard()}#/`)}
                        >
                            {
                                this.translations.popup_title_dashboard
                            }
                        </a>
                    </span>
                }
            </div>
        );
    }
}

export default Home;