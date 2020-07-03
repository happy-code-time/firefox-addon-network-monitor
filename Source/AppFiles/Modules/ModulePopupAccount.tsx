import * as React from 'react';

import Redirection from '../Functions/redirect/Redirection';

import decryptValue from '../Functions/decryptValue';

import getDataAxios from '../Functions/getDataAxios';

import encryptValue from '../Functions/encryptValue';

import { addonPrefixDashboard } from '../Functions/addonPrefix';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import customKey from '../Functions/customKey';

class ModulePopupAccount extends React.Component {

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

  public nodeData: Node;

  public remoteHost: string;

  public routeGetData: string;

  public currentUserHash: string;

  public oldHref: string;

  public odHrefInterval: any;

  constructor(props) {
    super(props);
    this.fadePopupBoxOut = this.fadePopupBoxOut.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.togglePopupBox = this.togglePopupBox.bind(this);
    this.getUserDataJsx = this.getUserDataJsx.bind(this);

    this.state = {
      displayBox: false,
      displayBoxClassNames: 'popup-box',
      currentData: {
        firstname: '',
        lastname: '',
      },
      titleBox: this.props.titleBox,
      linkLink: this.props.linkLink,
      openAllDataLink: this.props.openAllDataLink,
      titleNoData: this.props.titleNoData,
      icon: this.props.icon,
      location: this.props.location,
      titlelogin: this.props.titlelogin,
      currentUser: this.props.currentUser,
      currentUserHash: this.props.currentUserHash,
    };

    this.remoteHost = props.remoteHost;
    this.routeGetData = props.routeGetData;
    this.currentUserHash = getCurrentLoggedInUser();
    this.translations = props.translations;
    this.Redirection = new Redirection();
  }

  componentDidMount() {
    this.oldHref = window.location.href;
    document.addEventListener('mousedown', this.handleMouseDown);

    if (this.currentUserHash) {
      getDataAxios('get', `${this.remoteHost}?key=${encryptValue(this.routeGetData)}&user=${this.currentUserHash}`)
        .then((response: any) => {
          /**
           * Check if response has data
           */
          if (response && response.data) {
            const encryptedData = response.data;

            try {
              /**
               * Decrypt data and from string back to array|object
               */
              const decryptedData = decryptValue(encryptedData);

              if (!decryptedData.length) {
                return;
              }

              const plainData = JSON.parse(decryptedData);

              if (typeof [] === typeof plainData && Object.keys(plainData).length) {
                this.setState({ currentData: plainData });
              }
            } catch (error) {

            }
          }
        })
        .catch((error: ErrorEvent) => {

        });
    }
  }

  componentWillUnmount(){
    clearInterval(this.odHrefInterval);
  }

  /**
   * Hide data div
   * while user not inside it
   * @param {any} e
   */
  handleMouseDown(e: React.MouseEvent | any) {
    if (this.nodeData && !this.nodeData.contains(e.target)) {
      this.fadePopupBoxOut();
    }

    this.checkLocation();
  }

  checkLocation(){
    clearInterval(this.odHrefInterval);
    let count = 10;
    this.odHrefInterval = setInterval( () => {

      if(this.oldHref !== window.location.href || 0 > count){
        this.oldHref = window.location.href;
        clearInterval(this.odHrefInterval);

        this.setState({
          displayBox: false,
          displayBoxClassNames: 'popup-box',
        });
      }
    }, 50);
  }

  togglePopupBox() {
    if (!this.state.displayBox) {
      return this.setState({
        displayBox: !this.state.displayBox,
      });
    }

    this.fadePopupBoxOut();
  }

  fadePopupBoxOut() {
    const { displayBoxClassNames } = this.state;

    this.setState(
      {
        displayBoxClassNames: `${displayBoxClassNames} fade-out`,
      },
      () => {
        setTimeout(() => {
          this.setState({
            displayBox: false,
            displayBoxClassNames: 'popup-box',
          });
        }, 200);
      }
    );
  }

  getUserDataJsx() {
    const { firstname, lastname } = this.state.currentData;

    if (firstname && firstname.length && lastname && lastname.length) {
      return (
        <span>
          {'dashboard' == this.state.location && 
            (
              <ul key={customKey()}>
                <li key={customKey()} className='single-data-li-account'>
                  <a
                    className="popup-box-button"
                    href={`${addonPrefixDashboard()}#/logout`}
                  >
                    <i className="fas fa-fingerprint" />

                    {
                      this.translations.accountLogout
                    }
                  </a>
                </li>
              </ul>
            )
          }
          {'dashboard' == this.state.location && (
            <a
              className="popup-box-all"
              href={`${addonPrefixDashboard()}#/${this.state.openAllDataLink}`}
            >
              {
                this.state.linkLink
              }
              <i className="fas fa-angle-right" />
            </a>
          )}
          {'popup' == this.state.location && (
            <a
              className="popup-box-all"
              target='_blank'
              href={`${addonPrefixDashboard()}#/${this.state.openAllDataLink}`}
              onClick={ (e) => { setTimeout( () => { window.close();}, 200)}}
            >
              {
                this.state.linkLink
              }
              <i className="fas fa-angle-right" />
            </a>
          )}
        </span>
      );
    }

    return (
      <span>
        <ul className="no-data-ul">
          <li>{this.state.titleNoData}</li>
        </ul>
        {'dashboard' == this.state.location && (
          <a
            className="popup-box-all"
            href={`${addonPrefixDashboard()}#/login`}
            onClick={this.fadePopupBoxOut}
          >
            {
              this.state.titlelogin
            }
            <i className="fas fa-angle-right" />
          </a>
        )}
        {'popup' == this.state.location && (
          <a
            className="popup-box-all"
            target='_blank'
            href={`${addonPrefixDashboard()}#/login`}
            onClick={ (e) => { setTimeout( () => { window.close();}, 200)}}
          >
            {
              this.state.titlelogin
            }
            <i className="fas fa-angle-right" />
          </a>
        )}
      </span>
    );
  }

  openLinkInNewTab(url: string, closeWindow: boolean = false) {
    // @ts-ignore
    browser.runtime.sendMessage({
      action: 'open-link-in-new-tab',
      url,
    });
    this.fadePopupBoxOut();

    if (closeWindow) {
      window.close();
    }
  }

  render() {
    return (
      <span ref={node => (this.nodeData = node)} className="relative popup-box-main">
        <i onClick={e => this.togglePopupBox()} className={`${this.props.icon} popup-box-icon`}></i>
        {this.state.displayBox && (
          <div className={this.state.displayBoxClassNames}>
            <h1>
              <i className={`${this.props.icon}`} />
              {this.state.titleBox}
            </h1>
            <div className="popup-box-list flex flex-column">
              {
                this.getUserDataJsx()
              }
            </div>
          </div>
        )}
      </span>
    );
  }
}

export default ModulePopupAccount;
