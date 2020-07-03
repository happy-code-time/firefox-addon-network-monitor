import * as React from 'react';

import getTranslations from '../../../Translations';

import customKey from '../Functions/customKey';

import { addonRoot } from '../Functions/addonPrefix';

class NoDataStatistic extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoDataCookies">
                <img alt="image" src={`${addonRoot()}logo/logo-128.png`} />
                <p className="h1-title ff-title text-center">
                {
                    translations.NoDataBlockedItemsToday
                }
                </p>
            </div>
        );
    }
};

export default NoDataStatistic;