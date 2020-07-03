import * as React from 'react';

import getTranslations from '../../../Translations';

import { addonRoot } from '../Functions/addonPrefix';

class ModuleLoading extends React.Component 
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div className="NoData">
                <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                <h1 className="h1-title">
                {
                    translations.loading
                }
                </h1>
            </div>
        );
    }
};

export default ModuleLoading;