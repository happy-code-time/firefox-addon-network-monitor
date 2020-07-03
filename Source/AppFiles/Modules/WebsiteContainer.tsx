import * as React from 'react';

import ModuleLogin from './ModuleLogin';

import getTranslations from '../../../Translations/index';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import Redirection from '../Functions/redirect/Redirection';

interface WebsiteContainerProps {
    contentData?: string | any;
    loginRequired: boolean;
    redirectAfterLogin?: string;
}

class WebsiteContainer extends React.Component<WebsiteContainerProps> {

    public Redirection: {
        [key: string]: any
    };

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
    public nodeSideBar: Node;
    public isRegular: boolean;
    public isResponsive: boolean;
    public redirectAfterLogin: string;
    public loginCheckInterval: any;

    constructor(props: WebsiteContainerProps) {
        super(props);
        this.callbackLogout = this.callbackLogout.bind(this);

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
            redirectAfterLogin: this.props.redirectAfterLogin ? this.props.redirectAfterLogin : ''
        };

        this.translations = getTranslations();
        this.env = process.env.ENV;
        this.remoteHost = process.env.REMOTE_HOST;
        this.currentUser = getCurrentLoggedInUser(true);
        this.currentUserHash = getCurrentLoggedInUser();
        this.Redirection = new Redirection();
    }

    callbackLogout() {
        this.currentUser = null;
        this.currentUserHash = null;
        this.Redirection.setRedirect('');
        window.location.reload();
    }

    render(): JSX.Element {
        return (
            <div className="ContentBody">
                {
                    true == this.state.loginRequired && null == this.currentUser &&
                    <ModuleLogin
                        location='dashboard'
                        translations={this.translations}
                        remoteHost={this.remoteHost}
                        currentUser={this.currentUser}
                        currentUserHash={this.currentUserHash}
                        parentContext={this}
                    />
                }
                {
                    true == this.state.loginRequired && null !== this.currentUser && this.state.contentData
                }
                {
                    false == this.state.loginRequired && this.state.contentData
                }
            </div>
        );
    }
}

export default WebsiteContainer;
