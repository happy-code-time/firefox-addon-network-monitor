import * as React from 'react';

import getTranslations from '../../../Translations';

import customKey from '../Functions/customKey';

class NoDataTabsLoading extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div key={customKey()} className="NoDataTabs">
                <img alt="image" src='https://chat-manager.j.pl/public/images/window-layout-icon.png' />
                <h1 className="h1-title">
                {
                    translations.imagesLoadingTabs
                }
                </h1>
            </div>
        );
    }
};

export default NoDataTabsLoading;