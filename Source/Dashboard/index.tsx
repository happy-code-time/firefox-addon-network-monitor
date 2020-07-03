import React, { Component } from 'react';

import { HashRouter, Switch, Route } from 'react-router-dom';

import ReactDOM from 'react-dom';

import ModuleFullScreenLoading from '../AppFiles/Modules/ModuleFullScreenLoading';

import ModuleSideBar from '../AppFiles/Modules/SideBar';

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import Tabs from './pages/Tabs';

import WebsiteContainer from '../AppFiles/Modules/Modules/WebsiteContainer';

import Menu from '../AppFiles/Modules/Menu';

import ModulePopupBoxLinks from '../AppFiles/Modules/ModulePopupBoxLinks';

import ModuleLanguages from '../AppFiles/Modules/ModuleLanguages';

import getTranslations from '../../Translations/index';

import { addonRoot, addonPrefixDashboard } from '../AppFiles/Functions/addonPrefix';

import { appNameShort, version } from '../AppFiles/Globals';

import '../Sass/dashboard/index.scss';

class App extends Component {
  public Redirection: {
    [key: string]: any;
  };

  public state: {
    [key: string]: any;
  };

  public translations: {
    [key: string]: any;
  };

  public globalMessagesIntervaller: any;

  public env?: string;

  public remoteHost?: string;

  public currentUser?: string;

  public currentUserHash?: string;

  public nodeSideBar: Node;

  public isRegular: boolean;

  public isResponsive: boolean;

  public redirectAfterLogin: string;

  constructor(props: {}) {
    super(props);

    this.state = {
      messagesApp: [],
    };

    this.translations = getTranslations();
  }

  render() {
    const { animationLoading } = this.state;

    return (
      <div className="Main block">
        {
          animationLoading &&
          <ModuleFullScreenLoading />
        }
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={720}
          sidebarMaxifiedAt={1024}
          displayMinifyMaxifyIcon={true}
          moduleSidebar={
            <ModuleSideBar
              image={<img alt="image" src={`${addonRoot()}logo/logo-64.png`} />}
              textLong={appNameShort}
              textShort={`v${version}`}
              moduleMenu={
                <Menu
                  reactRouter={false}
                  childrenPaddingX={18}
                  data={
                    [
                      {
                        attributes: {
                          title: this.translations.menu_title_home,
                        },
                        text: this.translations.menu_text_home,
                        icon: <i className='fas fa-user' />,
                        href: `${addonPrefixDashboard()}#/`,
                      }
                    ]
                  }
                />
              }
            />
          }
          headerData={
            <span>
              <ModulePopupBoxLinks
                location='dashboard'
                icon={<i className='fas fa-external-link-alt' />}
                titleBox={this.translations.links}

                masterLink={`${addonPrefixDashboard()}#/`}
                masterIcon={<i className='fas fa-angle-right' />}
                masterText={this.translations.popup_title_dashboard}
                masterAttributes={
                  {
                    'target': '_blank',
                    'onClick': () => { setTimeout(() => { window.close() }, 100) }
                  }
                }

                data={
                  [
                    {
                      href: 'https://addons.mozilla.org/de/firefox/addon/network-moon-traffic/',
                      icon: <i className='fab fa-firefox-browser' />,
                      text: 'Firefox Hub',
                      attributes: {
                        'target': '_blank'
                      }
                    }
                  ]
                }
              />
              <ModuleLanguages />
            </span>
          }
          contentData={
            <HashRouter>
              <Switch>
                <Route exact path="/" component={Tabs} />
              </Switch>
            </HashRouter>
          }
        />
        <GlobalMessages
          messageKey='messagesApp'
          timer={2000}
          codeMapping={{
            '-2': {
              title: this.translations.notLoggedIn,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            },
            '-1': {
              title: this.translations.error,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            },
            0: {
              title: <i className="fas fa-thumbs-up mr-2" />,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            },
            1: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
            2: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
            3: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));