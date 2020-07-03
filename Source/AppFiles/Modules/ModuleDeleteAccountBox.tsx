import * as React from 'react';

import checkUserPassword from '../Functions/checkUserPassword';

import deleteAccount from '../Functions/deleteAccount';

import InputAnimation from './InputAnimation';

import encryptValue from '../Functions/encryptValue';

class ModuleDeleteAccountBox extends React.Component {

    public translations: {
        [ key: string ]: any;
    };

    public props: {
        [ key: string ]: any;
    };

    public state: {
        [ key: string ]: any;
    };

    public remoteHost: string;

    constructor (props: {}) {
        super(props);
        this.cancelDeleteAccount=this.cancelDeleteAccount.bind(this);
        this.deleteAccount=this.deleteAccount.bind(this);
        this.confimAccountDeletion=this.confimAccountDeletion.bind(this);
        this.callbackPassword=this.callbackPassword.bind(this);

        this.state={
            parentContext: this.props.parentContext,
            deleteAccountClassNames: 'DeleteAccount',
            boxClassNamesPassword: 'single-box',
            valuePassword: '',
            plainPassword: '',
            errorMessages: '',
            currentUserHash: this.props.currentUserHash
        }

        this.remoteHost = process.env.REMOTE_HOST;
        this.translations=this.props.translations;
    }

    /**
     * Delete user Account
     */
    deleteAccount() {
        this.setState({
            deleteAccountClassNames: 'DeleteAccount'
        })
    }

    /**
     * Cancel = Delete user Account
     */
    cancelDeleteAccount() {
        this.setState({
            deleteAccountClassNames: 'DeleteAccount animationBack'
        }, () => {
            setTimeout(() => {
                this.state.parentContext.cancelDeleteAccount();
            }, 350);
        })
    }

    /**
     * Input callback action
     */
    callbackPassword(plain) {
        this.setState({
            valuePassword: encryptValue(plain),
            plainPassword: plain
        });
    }

    /**
     * Delete account after user confirmation
     */
    async confimAccountDeletion() {
        const { currentUserHash, valuePassword, plainPassword }=this.state;

        if (valuePassword&&valuePassword.length&&plainPassword&&plainPassword.length) {
            const passwordCheck=await checkUserPassword(currentUserHash, valuePassword, this.remoteHost);

            if (true===passwordCheck) {
                this.setState({
                    errorMessages: ''
                }, async () => {
                    const action=await deleteAccount(currentUserHash, valuePassword, this.remoteHost);

                    if (null===action) {
                        this.setState({
                            errorMessages: this.translations.globalProcessError
                        });
                    }

                    if (false===action) {
                        this.setState({
                            errorMessages: this.translations.globalNetworkError
                        });
                    }

                    if ('user_no_exsists'==action) {
                        this.setState({
                            errorMessages: this.translations.globalUserDoesNotExsists
                        });
                    }

                    if (true==action) {
                        this.state.parentContext.deleteAccountCallback();
                    }
                })
            }

            if (false===passwordCheck) {
                this.setState({
                    errorMessages: this.translations.deleteAccountErrorMessageWrongPassword
                });
            }

            if (null===passwordCheck) {
                this.setState({
                    errorMessages: this.translations.globalNetworkError
                });
            }

            if ('user_no_exsists'==passwordCheck) {
                this.setState({
                    errorMessages: this.translations.globalUserDoesNotExsists
                });
            }
        }
        else {
            this.setState({
                errorMessages: this.translations.deleteAccountErrorMessageEmptyFields
            })
        }
    }

    render() {
        return (
            <div className={ this.state.deleteAccountClassNames }>
                <div className="box">
                    <div className="head">
                        <i className="fas fa-times close" onClick={ this.cancelDeleteAccount }></i>
                        <p>
                            {
                                this.translations.deleteAccountTitle
                            }
                        </p>
                    </div>
                    <div className="content">
                        <p>
                            {
                                this.translations.deleteAccountText
                            }
                        </p>
                        <InputAnimation
                            placeholder={ this.translations.deleteAccountPasswordConfirmation }
                            type="password"
                            inputProps={ {
                                autoComplete: "password"
                            } }
                            callback={ this.callbackPassword }
                            onEnter={ this.confimAccountDeletion }
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
                        <span className="buttons-group-delete-account flex flex-space-around">
                            <div className="button ff-roboto button-delete" onClick={ this.confimAccountDeletion }>
                                {
                                    this.translations.deleteAccountYes
                                }
                            </div>
                            <div className="button ff-roboto button-logout" onClick={ this.cancelDeleteAccount }>
                                {
                                    this.translations.deleteAccountNo
                                }
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModuleDeleteAccountBox;