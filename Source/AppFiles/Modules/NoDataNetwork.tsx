import * as React from 'react';

import customKey from '../Functions/customKey';

import { addonRoot } from '../Functions/addonPrefix';

import getTranslations from '../../../Translations';

class NoDataNetwork extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoData">
                <img src={`${addonRoot()}/logo/logo-128.png`}/>
                <h1 className="h1-title">
                {
                    translations.imagesNoData
                }
                </h1>
            </div>
        );
    }
};

export default NoDataNetwork;