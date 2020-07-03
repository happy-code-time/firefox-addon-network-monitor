import * as React from 'react';

import Redirection from '../Functions/redirect/Redirection';

import ModuleDeleteAccountBox from './ModuleDeleteAccountBox';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import decryptValue from '../Functions/decryptValue';

import encryptValue from '../Functions/encryptValue';

import getDataAxios from '../Functions/getDataAxios';

import getLanguageIndex from '../Functions/language/getLanguageIndex';

import setLanguage from '../Functions/language/setLanguage';

import addToStore from '../../Store/addToStore';

import mapping from '../Functions/checkFileExtension/mapping';

import FullScreenList from './FullScreenList';

import countries from '../Functions/Country';

import possibleLanguagesLongIncludes from '../Functions/language/possibleLanguagesLongIncludes';

import LoadingAnimation from './LoadingAnimation';

import removeAuthentication from '../Functions/removeAuthentication';

class ModuleAccount extends React.Component {

    public props: {
        [key: string]: any;
    };

    public state: {
        [key: string]: any;
    };

    public translations: {
        [key: string]: any;
    };

    public Redirection: {
        [key: string]: any
    };

    public remoteHost: string;
    public currentUser: string;
    public currentUserHash: string;
    public inputNode: any;

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.logoutCallback = this.logoutCallback.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.cancelDeleteAccount = this.cancelDeleteAccount.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.getUsersData = this.getUsersData.bind(this);
        this.save = this.save.bind(this);
        this.setValue_country = this.setValue_country.bind(this);
        this.setValue_language = this.setValue_language.bind(this);
        this.deleteAccountCallback = this.deleteAccountCallback.bind(this);
        this.showFullScreenListCountries = this.showFullScreenListCountries.bind(this);
        this.showFullScreenListLanguages = this.showFullScreenListLanguages.bind(this);

        /**
         * Password
         */
        this.setValue_password = this.setValue_password.bind(this);

        this.state = {
            remoteHost: this.props.remoteHost,
            currentUser: this.props.currentUser,
            currentUserHash: this.props.currentUserHash,
            parentContext: this.props.parentContext,
            startAccountDeletionProcess: false,
            errorMessages: '',
            successMessages: '',
            userData: {
                id: null,
                email: '',
                firstname: '',
                lastname: '',
                password: '',
                language: '',
                avatar: 'https://chat-manager.j.pl/public/images/contact-icon.png'
            },
            avatar: 'https://chat-manager.j.pl/public/images/contact-icon.png',
            language: '',
            languageIndex: '',
            animationLoading: false,
            errorMessageFile: '',
            setValue_languageClicked: false,
            setValue_countryClicked: false,
            /**
             * Password
             */
            passwordField: 'password',
            passwordIcon: 'far fa-eye',
            plainValue_password: '',
            classNames_password: 'single-box',
        }

        this.translations = props.translations;
        this.remoteHost = this.state.remoteHost;
        this.currentUser = getCurrentLoggedInUser(true);
        this.currentUserHash = getCurrentLoggedInUser();
        this.Redirection = new Redirection();
    }

    componentDidMount() {
        this.getUsersData();
    }

    /**
     * Get user data
     */
    getUsersData() {
        this.setState({
            animationLoading: true
        }, async () => {
            const userData = await getDataAxios('get', `${this.remoteHost}?key=${encryptValue('userdata')}&user=${this.currentUserHash}`).then(r => r.data).catch(e => {
                addToStore(`${this.translations.globalNetworkError}`, 1);
                return [];
            });
            const decryptedData = decryptValue(userData);

            if (null !== decryptedData) {
                try {
                    const plainData = JSON.parse(decryptedData);
                    let { avatartype, avatar, id, email, firstname, lastname, password, language, country } = plainData;

                    password = decryptValue(password);

                    if ('' == avatar || null == avatar) {
                        avatar = 'https://chat-manager.j.pl/public/images/contact-icon.png';
                    }
                    else {
                        avatar = `data:image/${avatartype};base64,${avatar}`;
                    }

                    const userData = { id, email, firstname, lastname, password, language, avatar, country };

                    this.setState({
                        userData,
                        language,
                        avatar,
                        country,
                        languageIndex: getLanguageIndex(language),
                        animationLoading: false
                    });

                } catch (error) {
                    //removeAuthentication();
                    addToStore(`${this.translations.globalProcessError}`, 2);
                    this.setState({
                        animationLoading: false
                    });
                }
            }
            else {
                //removeAuthentication();
                addToStore(`${this.translations.globalProcessError}`, 2);
                this.setState({
                    animationLoading: false
                });
            }
        })
    }

    /**
     * Main logout functions
     */
    logoutCallback() {
        this.Redirection.setRedirect('');
        this.currentUser = getCurrentLoggedInUser(true);
        this.currentUserHash = getCurrentLoggedInUser();
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
        });
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
     * Show user password
     */
    showPassword() {
        const { passwordField } = this.state;

        if ('text' == passwordField) {
            return this.setState({
                passwordField: 'password',
                passwordIcon: 'far fa-eye'
            });
        }

        this.setState({
            passwordField: 'text',
            passwordIcon: 'far fa-eye-slash'
        });
    }

    /**
     * Set value on change input field
     */
    setValue_password(e: KeyboardEvent | Event | any) {
        const val = e.target.value;
        let { id, email, firstname, lastname, password, language, country } = this.state.userData;
        password = val;
        const userData = { id, email, firstname, lastname, password, language, country };

        this.setState({
            userData
        });
    }

    /**
     * Set value on change input field
     */
    setValue_firstname(e: KeyboardEvent | Event | any) {
        const val = e.target.value;
        let { id, email, firstname, lastname, password, language, country } = this.state.userData;

        firstname = val;
        firstname = firstname.replace(/[^a-zA-Z- ]/gmi, '');
        firstname = firstname.trim();

        const userData = { id, email, firstname, lastname, password, language, country };
        this.setState({
            userData
        });
    }

    /**
     * Set value on change input field
     */
    setValue_lastname(e: KeyboardEvent | Event | any) {
        const val = e.target.value;
        let { id, email, firstname, lastname, password, language, country } = this.state.userData;

        lastname = val;
        lastname = lastname.replace(/[^a-zA-Z- ]/gmi, '');
        lastname = lastname.trim();

        const userData = { id, email, firstname, lastname, password, language, country };
        this.setState({
            userData
        });
    }

    /**
     * Set value - callback languages
     */
    setValue_language(e: KeyboardEvent | Event | any, object: { value: string, text2: string }) {

        if (!object) {
            return this.setState({
                setValue_languageClicked: false
            });
        }

        if ('' == possibleLanguagesLongIncludes(object.value)) {
            return this.setState({
                errorMessages: this.translations.globalInvalidLanguage,
                setValue_languageClicked: false
            });
        }

        if (object && object.value) {
            let nodes: any = document.getElementsByClassName('Content');

            if (nodes && nodes[0]) {
                nodes[0].style.zIndex = 0;

                let { id, email, firstname, lastname, password, language, country } = this.state.userData;
                language = object.text2;
                const userData = { id, email, firstname, lastname, password, language, country };

                this.setState({
                    userData,
                    languageIndex: language,
                    setValue_languageClicked: false
                });
            }
        }
    }

    /**
     * Set value - callback countries
     */
    setValue_country(e: KeyboardEvent | Event | any, object: { value: string, text: string }) {

        if (!object) {
            return this.setState({
                setValue_countryClicked: false
            });
        }

        if (!countries.includes(object.value)) {
            return this.setState({
                errorMessages: this.translations.globalInvalidCountry,
                setValue_countryClicked: false
            });
        }

        if (object && object.value) {
            let nodes: any = document.getElementsByClassName('Content');

            if (nodes && nodes[0]) {
                nodes[0].style.zIndex = 0;

                let { id, email, firstname, lastname, password, language, country } = this.state.userData;
                country = object.text;
                const userData = { id, email, firstname, lastname, password, language, country };
        
                this.setState({
                    userData,
                    country,
                    setValue_countryClicked: false
                });
            }
        }
    }

    /**
     * Show languages list
     */
    showFullScreenListLanguages(event: React.MouseEvent | React.TouchEvent) {
        event.preventDefault();
        event.stopPropagation();

        let nodes: any = document.getElementsByClassName('Content');

        if (nodes && nodes[0]) {
          nodes[0].style.zIndex = 1;
    
            this.setState({
                setValue_languageClicked: !this.state.setValue_languageClicked,
                setValue_countryClicked: false
            });
        }
    }

    /**
     * Show countries list
     */
    showFullScreenListCountries(event: React.MouseEvent | React.TouchEvent) {
        event.preventDefault();
        event.stopPropagation();

        let nodes: any = document.getElementsByClassName('Content');

        if (nodes && nodes[0]) {
          nodes[0].style.zIndex = 1;
    
            this.setState({
                setValue_countryClicked: !this.state.setValue_countryClicked,
                setValue_languageClicked: false
            });
        }
    }
    /**
     * Update user data in DB
     */
    save() {
        let { id, email, firstname, lastname, password, language, country } = this.state.userData;

        if (!firstname || !firstname.length || !lastname || !lastname.length || !password || !password.length || !language || !language.length || !country || !country.length) {

            return this.setState({
                errorMessages: this.translations.errorMessageUserUpdateEmptyFields,
                successMessages: ''
            });
        }

        const params = new URLSearchParams();
        email = this.currentUser;
        password = encryptValue(password);
        params.append('data', encryptValue(JSON.stringify([id, email, firstname, lastname, password, language, country])));

        this.setState({
            successMessages: '',
            errorMessages: '',
            setValue_languageClicked: false,
            setValue_countryClicked: false,
        }, () => {
            getDataAxios(
                'post',
                `${this.remoteHost}?key=${encryptValue('updateuserdata')}&user=${this.currentUserHash}`,
                params
            ).then(response => {
                try {
                    let data = decryptValue(response.data);
                    data = JSON.parse(data);
                    
                    if (true === data) {
                        this.setState({
                            successMessages: this.translations.successUpdate,
                            errorMessages: ''
                        }, () => {
                            if (this.state.language !== this.state.userData.language) {
                                setLanguage(language);
                                window.location.reload();
                            }
                        });
                    }
                    else {
                        this.setState({
                            errorMessages: this.translations.errorMessageUserUpdateError,
                            successMessages: ''
                        });
                        addToStore(`${this.translations.globalProcessError}`, 3);
                    }

                } catch (error) {
                    this.setState({
                        errorMessages: this.translations.globalProcessError,
                        successMessages: ''
                    });
                    addToStore(`${this.translations.globalProcessError}`, 2);
                }
            }).catch( error => {

                this.setState({
                    errorMessages: this.translations.globalProcessError,
                    successMessages: ''
                });
                addToStore(`${this.translations.globalNetworkError}`, 1);
            });
        })
    }

    /**
     * Delete Account callback
     */
    deleteAccountCallback() {
        this.logoutCallback();
    }

    generateCountries(){
        const mapped = [];

        countries.map( text => {
            mapped.push({
                value: text,
                text
            });
        });

        return mapped;
    }

    render() {
        return (
            <div className="User flex flex-column">
                {
                    this.state.animationLoading &&
                    <LoadingAnimation />
                }
                <span>
                    <h1 className="main-title h1-title text-center">
                        {
                            this.translations.userSettings
                        }
                    </h1>
                    <p className="current-user text-center">
                        <i className="far fa-user popup-box-icon"></i>
                        {
                            this.currentUser
                        }
                    </p>
                    <h2>
                        {
                            this.translations.userSettings_firstname
                        }
                    </h2>
                    <div className="single-box single-box-account flex">
                        <input
                            className="font-input"
                            type='text'
                            value={this.state.userData.firstname}
                            onChange={(e) => this.setValue_firstname(e)}
                        />
                    </div>
                    <h2>
                        {
                            this.translations.userSettings_lastname
                        }
                    </h2>
                    <div className="single-box single-box-account flex">
                        <input
                            className="font-input"
                            type='text'
                            value={this.state.userData.lastname}
                            onChange={(e) => this.setValue_lastname(e)}
                        />
                    </div>
                    <h2>
                        {
                            this.translations.userSettings_password
                        }
                    </h2>
                    <div className="single-box single-box-account flex">
                        <input
                            className="font-input"
                            type={this.state.passwordField}
                            value={this.state.userData.password}
                            onChange={(e) => this.setValue_password(e)}
                        />
                        <i className={this.state.passwordIcon} onClick={(e) => this.showPassword()} />
                    </div>
                    <h2>
                        {
                            this.translations.userSettings_language
                        }
                    </h2>
                    <div className="select-wrapper select-account">
                        <i className="fas fa-angle-down down"></i>
                        <div
                            className="select"
                            onClick={this.showFullScreenListLanguages}
                        >
                            {
                                this.state.languageIndex
                            }
                        </div>
                    </div>
                    <FullScreenList
                        data={
                            [
                                {
                                    text: 'Deutschland',
                                    value: 'de',
                                    text2: 'Deutsch'
                                },
                                {
                                    text: 'USA',
                                    value: 'en',
                                    text2: 'English'
                                },
                                {
                                    text: 'Polska',
                                    value: 'pl',
                                    text2: 'Polski'
                                },
                            ]
                        }
                        callback={this.setValue_language}
                        display={this.state.setValue_languageClicked}
                        closeIcon="✖"
                        inputActive={true}
                        inputPlaceholder={'Deutschland, Polska ....'}
                        noDataText={this.translations.countriesNotFoundText}
                    />
                    <h2>
                        {
                            this.translations.country
                        }
                    </h2>
                    <div className="select-wrapper select-account">
                        <i className="fas fa-angle-down down"></i>
                        <div
                            className="select"
                            onClick={this.showFullScreenListCountries}
                        >
                            {
                                this.state.country
                            }
                        </div>
                    </div>
                    <FullScreenList
                        data={this.generateCountries()}
                        closeIcon={false}
                        callback={this.setValue_country}
                        display={this.state.setValue_countryClicked}
                        inputActive={true}
                        inputPlaceholder={`${this.state.country ? `${this.state.country}...` : 'Country search...'}`}
                        noDataText={this.translations.countriesNotFoundText}
                    />
                    {
                        '' !== this.state.errorMessages &&
                        <div className="error-message">
                            {
                                '' !== this.state.errorMessages &&
                                <i className="fas fa-exclamation"></i>
                            }
                            {
                                '' !== this.state.errorMessages &&
                                <span>
                                    {
                                        this.state.errorMessages
                                    }
                                </span>
                            }
                        </div>
                    }
                    {
                        '' !== this.state.successMessages &&
                        <div className="successMessages-message">
                            {
                                '' !== this.state.successMessages &&
                                <i className="far fa-thumbs-up"></i>
                            }
                            {
                                '' !== this.state.successMessages &&
                                <span>
                                    {
                                        this.state.successMessages
                                    }
                                </span>
                            }
                        </div>
                    }
                    <span className="buttons-group flex flex-space-around">
                        <div className="button ff-roboto button-delete" onClick={(e) => this.deleteAccount()}>
                            {
                                this.translations.deleteAccount
                            }
                        </div>
                        <div className="button ff-roboto button-logout" onClick={(e) => this.logout()}>
                            {
                                this.translations.logoutButton
                            }
                        </div>
                        <div className="button ff-roboto button-save" onClick={(e) => this.save()}>
                            {
                                this.translations.saveUserDataButton
                            }
                        </div>
                    </span>
                    {
                        this.state.startAccountDeletionProcess &&
                        <ModuleDeleteAccountBox
                            parentContext={this}
                            translations={this.translations}
                            remoteHost={this.state.remoteHost}
                            currentUserHash={this.currentUserHash}
                        />
                    }
                </span>
            </div>
        );
    }
}

export default ModuleAccount;