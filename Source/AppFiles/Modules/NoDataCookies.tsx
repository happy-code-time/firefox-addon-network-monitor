import * as React from 'react';

import getTranslations from '../../../Translations';

import customKey from '../Functions/customKey';

class NoDataCookies extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoDataCookies">
                <img alt="image" src='https://chat-manager.j.pl/public/images/32420-cookie-icon.png' />
                <p className="h1-title ff-title text-center">
                {
                    translations.cookiesNoData
                }
                </p>
            </div>
        );
    }
};

export default NoDataCookies;