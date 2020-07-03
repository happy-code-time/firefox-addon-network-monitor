import * as React from 'react';

import getTranslations from '../../../Translations';

import { addonRoot } from '../Functions/addonPrefix';

class ModuleHome extends React.Component
{
    render(){
        const translation = getTranslations();

        return (
            <div className="Home">
                <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                <ul>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_1
                        }
                    </li>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_2
                        }
                    </li>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_3
                        }
                    </li>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_4
                        }
                    </li>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_5
                        }
                    </li>
                    <li>
                        <i className='fas fa-shield-alt icon-security'/>
                        {
                            translation.home_security_6
                        }
                    </li>
                </ul>
            </div>
        );
    }
};

export default ModuleHome;