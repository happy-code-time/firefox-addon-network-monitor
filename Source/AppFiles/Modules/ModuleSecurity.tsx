import * as React from 'react';

import { Link } from 'react-router-dom';

import customKey from '../Functions/customKey';

import getSecurityList from '../Functions/getSecurityList';

class ModuleSecurity extends React.Component {

    render() {        
        const list = getSecurityList();

        return (
            <div className="Security">
                {
                    list.map( (listObject, index) => {
                        const boxStyle = {
                            backgroundImage: `url(https://chat-manager.j.pl/public/images/${listObject.img})`
                        };

                        return (
                            <Link key={customKey()} className={`single-box single-box-${index}`} to={`${listObject.link}`}>
                                <h1 className="h1-title">
                                    {
                                        listObject.translated
                                    }
                                </h1>
                                <div className="image" style={boxStyle}></div>
                            </Link>
                        )
                    })   
                }
            </div>
        );
    }
}

export default ModuleSecurity;