import * as React from 'react';

import { Link } from 'react-router-dom';

import ModuleDeleteAccountBox from './ModuleDeleteAccountBox';

import Redirection from '../Functions/redirect/Redirection';

import InputAnimation from './InputAnimation';

import ModuleFullScreenLoading from './ModuleFullScreenLoading';

import { appName } from '../Globals/index';

import encryptValue from '../Functions/encryptValue';

import { addonRoot } from '../Functions/addonPrefix';

import setAuthentication from '../Functions/setAuthentication';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import registerUser from '../Functions/registerUser';

import decryptValue from '../Functions/decryptValue';

import emailValidator from '../Functions/validators/emailValidator';

import setLanguage from '../Functions/language/setLanguage';

import addToStore from '../../Store/addToStore';

import countries from '../Functions/Country';

import removeAuthentication from '../Functions/removeAuthentication';

class ModuleRegistration extends React.Component {

    public translations: {
        [ key: string ]: any;
    };

    public props: {
        [ key: string ]: any;
    };

    public state: {
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
        this.registrationCallback=this.registrationCallback.bind(this);
        this.registration=this.registration.bind(this);
        this.logout=this.logout.bind(this);
        this.logoutCallback=this.logoutCallback.bind(this);
        this.cancelDeleteAccount=this.cancelDeleteAccount.bind(this);
        this.deleteAccount=this.deleteAccount.bind(this);
        this.callbackFirstName=this.callbackFirstName.bind(this);
        this.callbackLastName=this.callbackLastName.bind(this);
        this.callbackUserName=this.callbackUserName.bind(this);
        this.callbackPassword=this.callbackPassword.bind(this);
        this.deleteAccountCallback=this.deleteAccountCallback.bind(this);
        this.changeBooleanValue=this.changeBooleanValue.bind(this);
        this.setValue_country=this.setValue_country.bind(this);

        this.state={
            parentContext: this.props.parentContext,
            boxClassNamesUsername: 'single-box',
            boxClassNamesFirstName: 'single-box',
            boxClassNamesLastName: 'single-box',
            boxClassNamesPassword: 'single-box',
            plainFirstName: '',
            plainLastName: '',
            plainUsername: '',
            plainPassword: '',
            country: '',
            errorMessages: '',
            startAccountDeletionProcess: false,
            deleteAccountClassNames: 'DeleteAccount',
            allowSavingPersonalData: false,
            animationLoading: false
        }

        this.translations= props.translations;
        this.remoteHost= props.remoteHost;
        this.currentUser=getCurrentLoggedInUser(true);
        this.currentUserHash=getCurrentLoggedInUser();
        this.Redirection=new Redirection();
    }


    /**
     * Input callback action
     */
    callbackFirstName(plain) {
        this.setState({
            plainFirstName: plain,
            errorMessages: ''
        });
    }

    /**
     * Input callback action
     */
    callbackLastName(plain) {
        this.setState({
            plainLastName: plain,
            errorMessages: ''
        });
    }

    /**
     * Input callback action
     */
    callbackUserName(plain) {

        if(!emailValidator(plain)){
            return this.setState({
                errorMessages: this.translations.globalInvalidEmailsAdress
            });
        }

        this.setState({
            plainUsername: plain,
            errorMessages: ''
        });
    }

    /**
     * Input callback action
     */
    callbackPassword(plain) {
        this.setState({
            plainPassword: plain,
            errorMessages: ''
        });
    }

    /**
     * Sign in action
     */
    registration() {
        const {
            plainFirstName,
            plainLastName,
            plainUsername,
            plainPassword,
            allowSavingPersonalData,
            country
        }=this.state;

        if(!emailValidator(plainUsername)){
            return this.setState({
                errorMessages: this.translations.globalInvalidEmailsAdress
            });
        }
        
        /**
         * If all NOT encrypted values false or null or undefined or empty
         */
        if (
            !plainFirstName||!plainFirstName.length
            ||!plainLastName||!plainLastName.length
            ||!plainUsername||!plainUsername.length
            ||!plainPassword||!plainPassword.length
            || !allowSavingPersonalData
            || !country|| !country.length
        ) {
            return this.setState({
                errorMessages: this.translations.errorMessageRegistrationEmptyFields
            });
        }

        /**
         * If all encrypted values not false, null, undefined and not empty
         */
        return this.registrationCallback();
    }

    /**
     * Login main action
     */
    registrationCallback() {
        this.setState({
            animationLoading: true
        }, async  () => {
            const { allowSavingPersonalData, plainFirstName, plainLastName, plainUsername, plainPassword, country }=this.state;
        
            const valueUsername = encryptValue(plainUsername);
            const valuePassword = encryptValue(plainPassword);
            const valueFirstName = encryptValue(plainFirstName);
            const valueLastName = encryptValue(plainLastName);
            const valueCountry = encryptValue(country);
    
            const response: any=await registerUser(valueUsername, valuePassword, valueFirstName, valueLastName, 'post', this.remoteHost, allowSavingPersonalData, valueCountry, 'protectx').then(response => response).catch(error => { 
                addToStore(`${this.translations.globalNetworkError}` ,1);
                return ''; 
            });
    
            if (response&&response.data) {
                const encryptedData=response.data;
    
                try {
                    /**
                     * Decrypt data and from string back to array|object
                     */
                    const decryptedData=decryptValue(encryptedData);
                    const plainData=JSON.parse(decryptedData);
    
                    if (true===plainData) {
                        setAuthentication('authentication', valueUsername);
                        setLanguage('en');
                        this.currentUser=getCurrentLoggedInUser(true);
                        this.currentUserHash=getCurrentLoggedInUser();
                        this.state.parentContext.callbackRegistration();
    
                        this.setState({
                            plainFirstName: '',
                            plainLastName: '',
                            plainUsername: '',
                            plainPassword: '',
                            errorMessages: '',
                            animationLoading: false
                        });
                    }
                    else if ('dupplicate'==plainData) {
                        this.setState({
                            errorMessages: this.translations.errorMessageUserAlreadyExsists,
                            animationLoading: false
                        });
                    }
                    else if('privacy_terms_error' ==plainData){
                        this.setState({
                            errorMessages: this.translations.errorMessageRegistrationCheckbox,
                            animationLoading: false
                        });
                    }
                    else if('email_address_wrong_format' ==plainData){
                        this.setState({
                            errorMessages: this.translations.globalInvalidEmailsAdress,
                            animationLoading: false
                        });
                    }
                    else {
                        this.setState({
                            errorMessages: 'General error',
                            animationLoading: false
                        });
                        addToStore(`${this.translations.globalProcessError}` ,2);
                    }
    
                } catch (error) {
                    this.setState({
                        errorMessages: 'Error',
                        animationLoading: false
                    });
                    addToStore(`${this.translations.globalProcessError}` ,3);
                }
            }
            else {
                this.setState({
                    errorMessages: 'Network error',
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
        })
    }

    /**
     * Cancel = Delete user Account
     */
    cancelDeleteAccount() {
        this.setState({
            startAccountDeletionProcess: false
        });
    }

    /**
     * Delete Account callback
     */
    deleteAccountCallback() {
        this.logoutCallback();
    }

    /**
     * Change boolean value
     */
    changeBooleanValue(){
        this.setState({
            allowSavingPersonalData: !this.state.allowSavingPersonalData
        });
    }

    /**
     * Set value on change input field
     */
    setValue_country(e: KeyboardEvent|Event|any) {
        let country=e.target.value;
        
        if(!countries.includes(country)){
            return this.setState({
                errorMessages: this.translations.globalInvalidCountry
            });
        }

        this.setState({
            country,
            errorMessages: ''
        });
    }

    render() {
        const { animationLoading } = this.state;
        return (
            <div className="Login Registration">
                {
                    animationLoading &&
                    <ModuleFullScreenLoading/>
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
                            { `${appName} - ${this.translations.registrationMainTitleSuffix}` }
                        </h1>
                        <InputAnimation
                            placeholder={ this.translations.titleFirstName }
                            type="text"
                            callback={ this.callbackFirstName }
                            onEnter={ this.registration }
                            allowOnlyAZ={true}
                        />
                        <InputAnimation
                            placeholder={ this.translations.titleLastName }
                            type="text"
                            callback={ this.callbackLastName }
                            onEnter={ this.registration }
                            allowOnlyAZ={true}
                        />
                        <InputAnimation
                            placeholder={ this.translations.titleUsername }
                            type="email"
                            inputProps={ {
                                autoComplete: "email"
                            } }
                            callback={ this.callbackUserName }
                            onEnter={ this.registration }
                        />
                        <InputAnimation
                            placeholder={ this.translations.titlePassword }
                            type="password"
                            inputProps={ {
                                autoComplete: "password"
                            } }
                            callback={ this.callbackPassword }
                            onEnter={ this.registration }
                        />
                        <div className="select-wrapper">
                            <i className="fas fa-angle-down down"></i>
                            {
                                '' == this.state.country &&
                                <p className="font-input title text">
                                    {
                                        this.translations.country
                                    }
                                </p>
                            }
                            <select 
                                defaultValue={this.state.country}
                                onChange={this.setValue_country}
                            >
                                <option></option>
                                {
                                    countries.map( country => {
                                        return <option value={country}>{ country }</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="privacy-terms-checkbox flex">
                            <label className="switch">
                                <input type="checkbox" checked={this.state.allowSavingPersonalData} onChange={(e) => this.changeBooleanValue()} />
                                <span className={`switch-slider ${this.state.allowSavingPersonalData ? '' : ' switch-slider-not-checked '} rount`}></span>
                            </label>
                            <span className="link">
                                <Link 
                                    to='privacy-terms'
                                    target='_blank'
                                    rel="noopener noreferrer"
                                >
                                    {
                                        this.translations.acceptSavingDataTitle
                                    }
                                </Link>
                            </span>
                        </div>
                        
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
                        <div className="button ff-roboto" onClick={ this.registration }>
                            {
                                this.translations.registrationButtonRegister
                            }
                        </div>
                        <Link to='/login' className="button button-link ff-roboto">
                            {
                                this.translations.backToLogin
                            }
                        </Link>
                    </span>
                }
            </div>
        );
    }
}

export default ModuleRegistration;