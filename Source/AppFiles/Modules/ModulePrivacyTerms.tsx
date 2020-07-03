import * as React from 'react';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import getPrivacyTerms_de from './privacyterms/de';

import getPrivacyTerms_en from './privacyterms/en';

import getPrivacyTerms_pl from './privacyterms/pl';

interface ModulePrivacyTermsProps {

    translations: {
        [ key: string ]: any
    };

    remoteHost: string;
    currentUserHash: string;
    currentUser: string;
}

class ModulePrivacyTerms extends React.Component<ModulePrivacyTermsProps> {

    public translations: {
        [ key: string ]: any
    };

    public state: {
        [ key: string ]: any
    };

    public remoteHost?: string;
    public currentUser?: string;
    public currentUserHash?: string;

    constructor (props) {
        super(props);

        this.state={
            language: localStorage.getItem('applanguage') ? localStorage.getItem('applanguage') : 'en'
        };

        this.translations=props.translations;
        this.remoteHost=process.env.REMOTE_HOST;
        this.currentUser=getCurrentLoggedInUser(true);
        this.currentUserHash=getCurrentLoggedInUser();
    }

    currentYear(){
        const date = new Date();
        const year = date.getFullYear();
        let value = '2020';

        if(2020 !== year){
            value = `2020 - ${year}`;
        }

        return value;
    }

    render(): JSX.Element {
        return (
            <div className="PrivacyTerms flex flex-column">
                {
                    'de'==this.state.language && getPrivacyTerms_de()
                }
                {
                    'pl'==this.state.language && getPrivacyTerms_pl()
                }
                {
                    'pl' !== this.state.language && 'de' !== this.state.language && getPrivacyTerms_en()
                }
            </div>
        );
    }
}

export default ModulePrivacyTerms;
