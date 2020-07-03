import * as React from 'react';

import { Link } from 'react-router-dom';

import ModuleDeleteAccountBox from './ModuleDeleteAccountBox';

import Redirection from '../Functions/redirect/Redirection';

import InputAnimation from './InputAnimation';

import ModuleFullScreenLoading from './ModuleFullScreenLoading';

import { appName } from '../Globals/index';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import logUserIn from '../Functions/logUserIn';

import decryptValue from '../Functions/decryptValue';

import setAuthentication from '../Functions/setAuthentication';

import encryptValue from '../Functions/encryptValue';

import setLanguage from '../Functions/language/setLanguage';

import emailValidator from '../Functions/validators/emailValidator';

import addToStore from '../../Store/addToStore';

import { addonRoot } from '../Functions/addonPrefix';

import removeAuthentication from '../Functions/removeAuthentication';

class ModuleLogin extends React.Component {

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
    public currentUser: string;
    public currentUserHash: string;

    constructor (props) {
        super(props);
        this.loginCallback=this.loginCallback.bind(this);
        this.login=this.login.bind(this);
        this.logout=this.logout.bind(this);
        this.logoutCallback=this.logoutCallback.bind(this);
        this.cancelDeleteAccount=this.cancelDeleteAccount.bind(this);
        this.deleteAccount=this.deleteAccount.bind(this);
        this.callbackUsername=this.callbackUsername.bind(this);
        this.callbackPassword=this.callbackPassword.bind(this);
        this.deleteAccountCallback=this.deleteAccountCallback.bind(this);

        this.state={
            parentContext: this.props.parentContext,
            boxClassNamesUsername: 'single-box',
            boxClassNamesPassword: 'single-box',
            plainUsername: '',
            plainPassword: '',
            errorMessages: '',
            startAccountDeletionProcess: false,
            deleteAccountClassNames: 'DeleteAccount',
            resetPasswort: false,
            animationLoading: false
        }

        this.translations=props.translations;
        this.remoteHost=props.remoteHost;
        this.currentUser=getCurrentLoggedInUser(true);
        this.currentUserHash=getCurrentLoggedInUser();
        this.Redirection=new Redirection();
    }

    /**
     * Sign in action
     */
    callbackUsername(plainUsername) {
        this.setState({
            plainUsername: plainUsername
        });
    }

    /**
     * Sign in action
     */
    callbackPassword(plainPassword) {
        this.setState({
            plainPassword: plainPassword
        });
    }

    login() {
        const { plainUsername, plainPassword }=this.state;

        if (!plainUsername||!plainUsername.length||!plainPassword||!plainPassword.length) {
            return this.setState({
                errorMessages: this.translations.errorMessageLoginEmptyFields
            });
        }

        if(!emailValidator(plainUsername)){
            return this.setState({
                errorMessages: this.translations.globalInvalidEmailsAdress
            });
        }

        if (plainUsername&&plainUsername.length&&plainPassword&&plainPassword.length) {
            return this.loginCallback();
        }
        else {
            this.setState({
                errorMessages: this.translations.errorMessageLoginEmptyFields
            })
        }
    }

    /**
     * Login main action
     */
    loginCallback() {
        this.setState({
            animationLoading: true
        }, async () => {
            const { plainUsername, plainPassword }=this.state;
            const valueUsername = encryptValue(plainUsername);
            const valuePassword = encryptValue(plainPassword);
    
            const response: any =await logUserIn(valueUsername, valuePassword, 'post', this.remoteHost).then(response => response ).catch(error => { 
                addToStore(`${this.translations.globalNetworkError}` ,1);
                return this.setState({
                    animationLoading: false
                }); 
            });
    
    
            if (response&&response.data && '' !== response.data) {
                const encryptedData=response.data;
    
                try {
                    /**
                     * Decrypt data and from string back to array|object
                     */
                    const decryptedData=decryptValue(encryptedData);
                    const plainData=JSON.parse(decryptedData);
    
                    if (typeof [] === typeof plainData && 2 === plainData.length && true === plainData[0]) {
    
                        setAuthentication('authentication', valueUsername);
                        this.currentUser=getCurrentLoggedInUser(true);
                        this.currentUserHash=getCurrentLoggedInUser();
                        setLanguage(plainData[1]);
                        window.location.reload();
                    }
    
                    else if ('user_no_exsists'==plainData) {
                        this.setState({
                            errorMessages: this.translations.globalUserDoesNotExsists,
                            resetPasswort: false,
                            animationLoading: false
                        })
                    }
    
                    else {
                        this.setState({
                            errorMessages: this.translations.errorMessageLoginInvalidCredentials,
                            resetPasswort: true,
                            animationLoading: false
                        })
                    }
    
                } catch (error) {
                    this.setState({
                        errorMessages: this.translations.globalProcessError,
                        resetPasswort: false,
                        animationLoading: false
                    });
                    addToStore(`${this.translations.globalProcessError}` ,3);
                }
            }
            else {
                this.setState({
                    errorMessages: this.translations.globalNetworkError,
                    resetPasswort: false,
                    animationLoading: false
                });
                addToStore(`${this.translations.globalNetworkError}` ,1);
            }
        });
    }

    /**
     * Main logout functions
     */
    logoutCallback() {
        this.Redirection.setRedirect('');
        this.currentUser=getCurrentLoggedInUser(true);
        this.currentUserHash=getCurrentLoggedInUser();
        removeAuthentication();
        window.location.reload();
    }

    /**
     * LogUserOut
     */
    logout() {
        this.logoutCallback();
    }

    /**
     * Delete user Account
     */
    deleteAccount() {
        this.setState({
            startAccountDeletionProcess: true,
            resetPasswort: false
        })
    }

    /**
     * Cancel = Delete user Account
     */
    cancelDeleteAccount() {
        this.setState({
            startAccountDeletionProcess: false,
            resetPasswort: false
        });
    }

    /**
     * Delete Account callback
     */
    deleteAccountCallback() {
        this.logoutCallback();
    }

    render() {
        const { animationLoading } = this.state;

        return (
            <div className="Login">
                {
                    animationLoading && <ModuleFullScreenLoading/>
                }
                <div className="logo">
                    <img alt="image" src={`${addonRoot()}/logo/logo-128.png`} />
                </div>
                {
                    null!==this.currentUser&&
                    <span>
                        <h1 className="main-title h1-title text-center">
                            { this.translations.currentLoggedInAs }
                        </h1>
                        <p className="current-user text-center">
                            <i className="far fa-user popup-box-icon"></i>
                            {
                                this.currentUser
                            }
                        </p>
                        <span className="buttons-group flex flex-space-around">
                            <div className="button ff-roboto button-delete" onClick={ this.deleteAccount }>
                                {
                                    this.translations.deleteAccount
                                }
                            </div>
                            <div className="button ff-roboto button-logout" onClick={ this.logout }>
                                {
                                    this.translations.logoutButton
                                }
                            </div>
                        </span>
                        {
                            this.state.startAccountDeletionProcess&&
                            <ModuleDeleteAccountBox
                                parentContext={ this }
                                translations={ this.translations }
                                remoteHost={ this.state.remoteHost }
                                currentUserHash={ this.currentUserHash }
                            />
                        }
                    </span>
                }
                {
                    null==this.currentUser&&
                    <span>
                        <h1 className="main-title h1-title text-center">
                            { `${appName} - ${this.translations.loginMainTitleSuffix}` }
                        </h1>
                        <InputAnimation
                            placeholder={ this.translations.titleUsername }
                            type="email"
                            inputProps={ {
                                autoComplete: "username"
                            } }
                            callback={ this.callbackUsername }
                            onEnter={ this.login }
                            parentContext={this}
                        />

                        <InputAnimation
                            placeholder={ this.translations.titlePassword }
                            type="password"
                            inputProps={ {
                                autoComplete: "password"
                            } }
                            callback={ this.callbackPassword }
                            onEnter={ this.login }
                            parentContext={this}
                        />
                        {
                            ''!==this.state.errorMessages&&
                            <div className="error-message">
                                {
                                    ''!==this.state.errorMessages&&
                                    <i className="fas fa-exclamation"></i>
                                }
                                {
                                    ''!==this.state.errorMessages&&
                                    <span>
                                        {
                                            this.state.errorMessages
                                        }
                                    </span>
                                }
                            </div>
                        }
                        {
                            this.state.resetPasswort && 
                            <div className="forgot-password">
                                <Link to='passwort-reset'>
                                    {
                                        this.translations.fortgotPassword
                                    }
                                </Link>
                            </div>
                        }
                        <div className="button ff-roboto" onClick={ this.login }>
                            {
                                this.translations.signInButton
                            }
                        </div>
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

export default ModuleLogin;