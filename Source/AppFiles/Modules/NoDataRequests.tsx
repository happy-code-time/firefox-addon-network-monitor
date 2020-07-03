import * as React from 'react';

import getTranslations from '../../../Translations';

import customKey from '../Functions/customKey';

import { addonRoot } from '../Functions/addonPrefix';

class NoDataRequests extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoDataRequests">
                <img src={`${addonRoot()}/logo/logo-128.png`}/>
                <h1 className="h1-title">
                {
                    translations.requestsNoData
                }
                </h1>
            </div>
        );
    }
};

export default NoDataRequests;