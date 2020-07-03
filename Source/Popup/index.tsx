import * as React from 'react';

import { HashRouter, Switch, Route } from 'react-router-dom';

import ReactDOM from 'react-dom';

import ModuleSideBar from '../AppFiles/Modules/SideBar';

import AddonNotAvailable from '../AppFiles/Modules/AddonNotAvailable';

import ModulePopupBoxLinks from '../AppFiles/Modules/ModulePopupBoxLinks';

import ModuleLanguages from '../AppFiles/Modules/ModuleLanguages';

import WebsiteContainer from '../AppFiles/Modules/Modules/WebsiteContainer';

import Menu from '../AppFiles/Modules/Menu';

import Home from './pages/Home';

import Requests from './pages/Requests';

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import getTranslations from '../../Translations';

import { addonPrefixPopup, addonRoot, addonPrefixDashboard } from '../AppFiles/Functions/addonPrefix';

import { appNameShort, version } from '../AppFiles/Globals';

import '../Sass/popup/index.scss';

class App extends React.Component {
  public Redirection: {
    [key: string]: any;
  };

  public translations: {
    [key: string]: any;
  };

  public state: {
    [key: string]: any;
  };

  public env: string;

  public remoteHost: string;

  public currentUser: string;

  public currentUserHash: string;

  public nodeSideBar: Node;

  constructor(props: {}) {
    super(props);
    this.checkAddonsAvailability = this.checkAddonsAvailability.bind(this);
    this.checkAddonsAvailability = this.checkAddonsAvailability.bind(this);
    
    this.state = {
      documentWidth: 700,
      animationLoading: false,
      addonNotAvailable: false
    };

    this.translations = getTranslations();
    this.env = process.env.ENV;
    this.remoteHost = process.env.REMOTE_HOST;
  }

  componentDidMount() {
    this.checkAddonsAvailability();
  }

  checkAddonsAvailability() {
    // @ts-ignore
    browser.runtime
      .sendMessage({
        action: 'check-addons-availablitity',
      })
      .then(response => {        
        if (!response) {
          this.setState({
            addonNotAvailable: true
          });
        }
      })
      .catch(() => {
        this.setState({
          addonNotAvailable: true
        });
      });
  }

  render() {
    const { addonNotAvailable, documentWidth } = this.state;

    return (
      <div id="app-holder" style={{ width: `${documentWidth}px` }}>
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={600}
          sidebarMaxifiedAt={650}
          displayMinifyMaxifyIcon={false}
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
                        href: `${addonPrefixPopup()}#/`,
                      },
                      {
                        text: this.translations.menu_text_requests,
                        icon: <i className='fas fa-globe-americas' />,
                        href: `${addonPrefixPopup()}#/requests`,
                      }
                    ]
                  }
                />
              }
            />
          }
          headerData={
            <div>
              <ModulePopupBoxLinks
                location='popup'
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
                      href: 'https://addons.mozilla.org/de/firefox/addon/network-monitor/',
                      icon: <i className='fab fa-firefox-browser' />,
                      text: 'Firefox Hub',
                      attributes: {
                        'target': '_blank'
                      }
                    }
                  ]
                }
              />
              <ModuleLanguages/>
            </div>
          }
          contentData={
            <span>
              {
                addonNotAvailable && <AddonNotAvailable />
              }
              {
                !addonNotAvailable && 
                <HashRouter>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/requests" component={Requests} />
                  </Switch>
                </HashRouter>
              }
            </span>
          }
        />
        <GlobalMessages
          messageKey='messagesApp'
          timer={1000}
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
             