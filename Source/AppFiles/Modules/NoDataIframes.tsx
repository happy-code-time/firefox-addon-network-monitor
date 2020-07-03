import * as React from 'react';

import getTranslations from '../../../Translations';

import customKey from '../Functions/customKey';

class NoDataIframes extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoDataIframes">
                <img alt="image" src='https://chat-manager.j.pl/public/images/seo-browser-window-icon.png' />
                <p className="h1-title ff-title text-center">
                {
                    translations.iframesNoData
                }
                </p>
            </div>
        );
    }
};

export default NoDataIframes;