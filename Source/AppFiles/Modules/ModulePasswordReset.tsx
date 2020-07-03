import * as React from 'react';

import { Link } from 'react-router-dom';

import InputAnimation from './InputAnimation';

import { appName } from '../Globals/index';

import decryptValue from '../Functions/decryptValue';

import encryptValue from '../Functions/encryptValue';

import emailValidator from '../Functions/validators/emailValidator';

import addToStore from '../../Store/addToStore';

import getDataAxios from '../Functions/getDataAxios';

import { addonPrefixDashboard, addonRoot } from '../Functions/addonPrefix';

class ModulePasswordReset extends React.Component {

    public props: {
        [ key: string ]: any;
    };

    public state: {
        [ key: string ]: any;
    };

    public translations: {
        [ key: string ]: any;
    };

    public Redirection: {
        [ key: string ]: any
    };

    public remoteHost: string;

    constructor (props) {
        super(props);
        this.callbackUsername=this.callbackUsername.bind(this);
        this.sendMail=this.sendMail.bind(this);
        
        this.state={
            parentContext: this.props.parentContext,
            boxClassNamesUsername: 'single-box',
            boxClassNamesPassword: 'single-box',
            valueUsername: '',
            plainUsername: '',
            errorMessage: '',
            successMessage: '',
            startAccountDeletionProcess: false,
            deleteAccountClassNames: 'DeleteAccount'
        }

        this.translations=props.translations;
        this.remoteHost=props.remoteHost;
    }

    /**
     * Sign in action
     */
    callbackUsername(plainUsername) {
        this.setState({
            valueUsername: encryptValue(plainUsername),
            plainUsername: plainUsername
        }, () => {
            let errorMessage = '';

            if (!emailValidator(plainUsername)) {
                errorMessage = this.translations.globalInvalidEmailsAdress;
            }

            if('' !== errorMessage){
                this.setState({
                    errorMessage: ''
                });
            }
        });
    }

    /**
     * Send mail to the registred mail adress
     */
    async sendMail() {
        const { valueUsername }=this.state;

        getDataAxios('get', `${this.remoteHost}?key=${encryptValue('resetpassword')}&user=${valueUsername}&address=${encryptValue('reset')}`)
            .then((response: any) => {
                /**
                 * Check if response has data
                 */
                if (response&&response.data) {
                    const encryptedData=response.data;

                    try {
                        /**
                         * Decrypt data and from string back to array|object
                         */

                        const decryptedData=decryptValue(encryptedData);

                        if ('true' == decryptedData) {
                            this.setState({
                                successMessage: this.translations.followTheMailInstructions,
                                errorMessage: ''
                            });
                        }
                        else {
                            this.setState({
                                errorMessage: this.translations.globalProcessError,
                                successMessage: ''
                            });
                            addToStore(`${this.translations.globalProcessError}`, 3);
                        }

                    } catch (error) {
                        this.setState({
                            errorMessage: this.translations.globalProcessError,
                            successMessage: ''
                        });
                        addToStore(`${this.translations.globalProcessError}`, 2);
                    }
                }

                if('' == response.data){
                    this.setState({
                        errorMessage: this.translations.globalUserDoesNotExsists,
                        successMessage: ''
                    });
                }
            })
            .catch((error: ErrorEvent) => {
                this.setState({
                    errorMessage: this.translations.globalProcessError,
                    successMessage: ''
                });
                addToStore(`${this.translations.globalNetworkError}`, 1);
            });
    }

    render() {
        return (
            <div className="Login">
                <div className="logo">
                    <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                </div>
                <h1 className="main-title h1-title text-center">
                    { `${appName} - ${this.translations.passwordResetMainTitleSuffix}` }
                </h1>
                <InputAnimation
                    placeholder={ this.translations.titleUsername }
                    type="email"
                    inputProps={ {
                        autoComplete: "username"
                    } }
                    callback={ this.callbackUsername }
                    parentContext={ this }
                />
                {
                    ''!==this.state.errorMessage&&
                    <div className="error-message">
                        {
                            ''!==this.state.errorMessage&&
                            <i className="fas fa-exclamation"></i>
                        }
                        {
                            ''!==this.state.errorMessage&&
                            <span>
                                {
                                    this.state.errorMessage
                                }
                            </span>
                        }
                    </div>
                }
                {
                    ''!==this.state.successMessage&&
                    <div className="successMessages-message">
                        {
                            ''!==this.state.successMessage&&
                            <i className="fas fa-exclamation"></i>
                        }
                        {
                            ''!==this.state.successMessage&&
                            <span>
                                {
                                    this.state.successMessage
                                }
                            </span>
                        }
                    </div>
                }
                <div className="button ff-roboto" onClick={ this.sendMail }>
                    {
                        this.translations.passwordResetButton
                    }
                </div>
                <Link to='/login' className="button button-link ff-roboto">
                    {
                        this.translations.backToLogin
                    }
                </Link>
            </div>
        );
    }
}

export default ModulePasswordReset;