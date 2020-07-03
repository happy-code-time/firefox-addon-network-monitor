import * as React from 'react';

import { Link } from 'react-router-dom';

import { addonRoot } from '../Functions/addonPrefix';

interface ModuleLoginRequiredProps {
    location: string;
    translations: {
        [key: string]: any
    }
};

class ModuleLoginRequired extends React.Component<ModuleLoginRequiredProps> {
    
    public state : {
        [key: string]: any
    };

    public translations : {
        [key: string]: any
    };

    constructor(props: ModuleLoginRequiredProps){
        super(props);

        this.state = {
            location: this.props.location
        };

        this.translations = props.translations;
    }

    render() {
        return (
            <div className="LoginRequired">

            {
                'dashboard' == this.state.location &&
                <span>
                    <div className="logo">
                        <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                    </div>
                    <h1 className="h1-title text-center py-2">
                        {
                            this.translations.loginRequired
                        }
                    </h1>
                    <Link to='/login' className="button ff-roboto">
                        {
                            this.translations.titlelogin
                        }
                    </Link>
                    <Link to='/registration' className="button button-link ff-roboto">
                        {
                            this.translations.registrationButton
                        }
                    </Link>
                </span>
            }
            </div>
        );
    }
}

export default ModuleLoginRequired;