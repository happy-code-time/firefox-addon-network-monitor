import * as React from 'react';

import getTranslations from '../../../Translations';

class NoDataBlockedItems extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div className="NoDataBlockedItems">
                <img alt="image" src='https://chat-manager.j.pl/public/images/road-block-icon.png' />
                <h1 className="h1-title">
                    {
                        translations.NoDataBlockedItems
                    }
                </h1>
            </div>
        );
    }
};

export default NoDataBlockedItems;