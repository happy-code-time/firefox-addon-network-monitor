import * as React from 'react';

import copyToClipBoard from '../Functions/copyToClipboard';

import * as FileSaver from 'file-saver';

import customKey from '../Functions/customKey';

import LoadingAnimation from './LoadingAnimation';

interface ModuleSecuritySettingsProps {
    
    translations: { 
        [key: string]: any;
    }

    remoteHost: string;
};

class ModuleSecuritySettings extends React.Component<ModuleSecuritySettingsProps> {

    public translations: {
        [ key: string ]: any
    };

    public state: {
        [ key: string ]: any
    };

    public Redirection: {
        [ key: string ]: any;
    };

    public storageName: string;
    public intervalGetSettings: any;

    constructor (props) {
        super(props);
        this.saveToFileJson = this.saveToFileJson.bind(this);
        this.setDataToStorage = this.setDataToStorage.bind(this);
        this.setNewValue = this.setNewValue.bind(this);
        this.changeBooleanValue = this.changeBooleanValue.bind(this);
        this.closeMessages = this.closeMessages.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.setMessageCopyToClipBoard = this.setMessageCopyToClipBoard.bind(this);
        this.getUserSettings = this.getUserSettings.bind(this);

        this.translations = props.translations;

        this.state = {
            replacer: '',
            maximumOfDangerWords: '',
            securityIsOn: '',
            makeSearchInSourceCode: '',
            mutationCheck: '',
            scanTextOnWebsite: '',
            ignoreTagScript: '',
            ignoreTagLink: '',
            ignoreTagMeta: '',
            ignoreTagStyle: '',
            limitlessScan: '',
            deleteCookies: '',
            booleanStorageMapping: [
                {
                    storageName: 'limitlessScan',
                    text: this.translations.limitlessScan
                },
                {
                    storageName: 'deleteCookies',
                    text: this.translations.deleteCookies
                },
                {
                    storageName: 'securityIsOn',
                    text: this.translations.securityIsOn
                },
                {
                    storageName: 'scanTextOnWebsite',
                    text: this.translations.scanTextOnWebsite
                },
                {
                    storageName: 'makeSearchInSourceCode',
                    text: this.translations.makeSearchInSourceCode
                },
                {
                    storageName: 'mutationCheck',
                    text: this.translations.mutationCheck
                },
                {
                    storageName: 'ignoreTagScript',
                    text: this.translations.ignoreTagScript
                },
                {
                    storageName: 'ignoreTagLink',
                    text: this.translations.ignoreTagLink
                },
                {
                    storageName: 'ignoreTagMeta',
                    text: this.translations.ignoreTagMeta
                },
                {
                    storageName: 'ignoreTagStyle',
                    text: this.translations.ignoreTagStyle
                },
            ],
            jsonData: {},
            errorMessage: '',
            successMessage: '',
            animationLoading: false,
            rawJsonData: {}
        };
    }

    componentDidMount() {
        this.getUserSettings(true);
        clearInterval(this.intervalGetSettings);

        this.intervalGetSettings = setInterval( () => {
            this.getUserSettings();
        },5000);
    }

    componentWillUnmount(){
        clearInterval(this.intervalGetSettings);
    }

    getUserSettings(animationLoading:boolean = false){
        this.setState({
            animationLoading: animationLoading ? true : false 
        }, () => {
            // @ts-ignore
            browser.runtime.sendMessage({
                action: 'get-user-settings-dashboard',
            })
                .then(response => {
                    this.setDataToStorage(response);
                })
                .catch(error => {
                    this.setState({
                        animationLoading: false
                    });
                })
        });
    }

    resetAll() {
        const booleansTrue = [
            'securityIsOn',
            'makeSearchInSourceCode',
            'mutationCheck',
            'scanTextOnWebsite',
            'deleteCookies'
        ];
        const booleansFalse = [
            'ignoreTagScript',
            'ignoreTagLink',
            'ignoreTagMeta',
            'ignoreTagStyle',
            'limitlessScan'
        ];

        booleansTrue.map(storageName => {
            // all false values will be change in the background script
            // to true so have to pass false here
            this.changeBooleanValue(false, storageName, true);
        });

        booleansFalse.map(storageName => {
            // all true values will be change in the background script
            // to false so have to pass true here
            this.changeBooleanValue(true, storageName, true);
        });

        this.setNewValue('#', 'replacer', true);
        this.setNewValue(1, 'maximumOfDangerWords', true);

        this.setState({ 
            successMessage: 'Default configuration has been restored',
            errorMessage: ''
        });
    }

    closeMessages() {
        this.setState({ messages: [] });
    }

    setDataToStorage(backgroundStorage) {

        const {
            replacer,
            maximumOfDangerWords,
            securityIsOn,
            makeSearchInSourceCode,
            mutationCheck,
            scanTextOnWebsite,
            ignoreTagScript,
            ignoreTagLink,
            ignoreTagMeta,
            ignoreTagStyle,
            limitlessScan,
            deleteCookies
        } = backgroundStorage;

        const settings = {
            replacer,
            maximumOfDangerWords,
            securityIsOn,
            makeSearchInSourceCode,
            mutationCheck,
            scanTextOnWebsite,
            ignoreTagScript,
            ignoreTagLink,
            ignoreTagMeta,
            ignoreTagStyle,
            limitlessScan,
            deleteCookies
        };

        const jsonData = JSON.stringify(settings);
        const rawJsonData = settings;

        this.setState({
            settings, // to export it
            jsonData, // export jsonData
            replacer,
            maximumOfDangerWords,
            securityIsOn,
            makeSearchInSourceCode,
            mutationCheck,
            scanTextOnWebsite,
            ignoreTagScript,
            ignoreTagLink,
            ignoreTagMeta,
            ignoreTagStyle,
            limitlessScan,
            animationLoading: false,
            rawJsonData,
            deleteCookies
        });
    }

    saveToFileJson(event) {
        event.persist();
        event.target.classList.add('copied-remove');

        setTimeout(() => {
            event.target.classList.remove('copied');
            event.target.classList.remove('copied-remove');

            if (this.state.rawJsonData) {
                try {
                    var blob = new Blob([JSON.stringify(this.state.rawJsonData)], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `WVV_SETTINGS_${customKey()}.json`);
                } catch (error) {
                    var blob = new Blob([`Error while creating Blob file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `WVV_SETTINGS_${customKey()}.json`);
                }
            }
        }, 300);
    }

    setNewValue(value, storageName, reset = false) {
        let settings = this.state.settings;
        let jsonData = this.state.jsonData;
        let rawJsonData = {};
        let errorMessage = '';
        let successMessage = '';

        // @ts-ignore
        browser.runtime.sendMessage({
            action: 'set-replacer-of-danger-words',
            storageName,
            value
        }).then((response) => {
            settings[storageName] = response;
            jsonData = settings;
            rawJsonData = settings;
            successMessage = `Setted new value to: ${response}`;

            this.setState({
                settings,
                [storageName]: response,
                successMessage: reset ? '' : successMessage,
                errorMessage: '',
                jsonData: JSON.stringify(jsonData),
                rawJsonData
            });

        }).catch(error => {
            errorMessage = `Error while setting new value with browser message: ${error ? error : 'No message available'}`;

            this.setState({
                errorMessage: reset ? '' : errorMessage,
                successMessage: '',
                jsonData: JSON.stringify(jsonData),
            });
        })
    }

    changeBooleanValue(keyValue, storageName, reset = false) {
        let settings = this.state.settings;
        let jsonData = this.state.jsonData;
        let rawJsonData = {};
        let errorMessage = '';
        let successMessage = '';

        // @ts-ignore
        browser.runtime.sendMessage({
            action: 'change-settings-boolean-dashboard',
            storageName,
            value: keyValue
        }).then((response) => {
            settings[storageName] = response;
            jsonData = settings;
            rawJsonData = settings;
            successMessage = `${response ? 'Activated selected feature' : 'Deactivated selected feature'}`;

            this.setState({
                settings,
                [storageName]: response,
                successMessage: reset ? '' : successMessage,
                errorMessage: '',
                jsonData: JSON.stringify(jsonData),
                rawJsonData
            });
        }).catch(error => {
            errorMessage = `Error while setting new value with browser message: ${error ? error : 'No message available'}`;

            this.setState({
                errorMessage: reset ? '' : errorMessage,
                successMessage: '',
            });
        })
    }

    setMessageCopyToClipBoard(){
        this.setState({
            successMessage: this.translations.copiedToClipBoard,
            errorMessage: ''
        })
    }

    render() {
        return (
            <div className="SecuritySettings">
                {
                    this.state.animationLoading&&
                    <LoadingAnimation/>
                }
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
                            <i className="far fa-thumbs-up"></i>
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
                <div className="right d-block">
                    <span>
                        <h1 className="main-title-home">
                        {
                            this.translations.dashbord_menu_4
                        }    
                        </h1>
                        <div className="actions-header">
                            <span className="actions">
                                <i 
                                    title={this.translations.restoreDefaultValue}
                                    onClick={(e) => { this.resetAll() }} 
                                    className="fas fa-broom button-action"
                                ></i>
                                {
                                    document.queryCommandSupported&&
                                    <i
                                        title={this.translations.action_title_copyToClipboard}
                                        className="fas fa-clipboard button-action clipboard"
                                        onClick={ (e) => {
                                            copyToClipBoard(e, this.state.jsonData, document.documentElement.scrollTop);
                                            this.setMessageCopyToClipBoard()
                                        }}
                                    ></i>
                                }
                                <i 
                                    onClick={(e) => { this.saveToFileJson(e) }} 
                                    className="fas fa-file-signature button-action json"></i>
                            </span>
                        </div>
                        <div className="settings">
                            <div className="single-content-settings">
                                <div key={customKey()} className="single-setting">
                                    <ul className="ul-description">
                                        <li>
                                            <input 
                                                type="text" 
                                                defaultValue={this.state['replacer']} 
                                                onChange={(e) => this.setNewValue(e.target.value, 'replacer')} 
                                            />
                                        </li>
                                        <li>
                                        {
                                            this.translations.replacer
                                        }
                                        </li>
                                    </ul>
                                    <ul className="ul-description">
                                        <li>
                                            <input 
                                                type="number" 
                                                defaultValue={this.state['maximumOfDangerWords']} 
                                                min="1"
                                                max="1000" 
                                                onChange={(e) => this.setNewValue(e.target.value, 'maximumOfDangerWords')} 
                                            />
                                        </li>
                                        <li>
                                        {
                                            this.translations.maximumOfDangerWords
                                        }
                                        </li>
                                    </ul>
                                    {
                                        this.state.booleanStorageMapping.map(object => {

                                            if (this.state[object.storageName]) {
                                                return (
                                                    <ul key={customKey()} className="ul-description">
                                                        <li>
                                                            <label className="switch">
                                                                <input type="checkbox" checked={this.state[object.storageName]} onChange={(e) => this.changeBooleanValue(this.state[object.storageName], object.storageName)} />
                                                                <span className="switch-slider round"></span>
                                                            </label>
                                                        </li>
                                                        <li>
                                                        {
                                                            object.text
                                                        }
                                                        </li>
                                                    </ul>
                                                )
                                            } else {
                                                return (
                                                    <ul key={customKey()} className="ul-description">
                                                        <li>
                                                            <label className="switch">
                                                                <input type="checkbox" checked={this.state[object.storageName]} onChange={(e) => this.changeBooleanValue(this.state[object.storageName], object.storageName)} />
                                                                <span className="switch-slider switch-slider-not-checked round"></span>
                                                            </label>
                                                        </li>
                                                        <li>
                                                        {
                                                            object.text
                                                        }
                                                        </li>
                                                    </ul>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </span>
                    <form style={{
                        display: 'none !important',
                        opacity: 0,
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        overflow: 'hidden'
                    }}>
                        <textarea
                            id="copy-to-clipboard"
                            value=''
                            readOnly={true}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default ModuleSecuritySettings;