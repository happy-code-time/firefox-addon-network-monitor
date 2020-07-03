import * as React from 'react';

const EN={
  requestsNoData: 'No requests available',
  requestsPopupTitle: 'Requests on current website',
  popup_text: 'View requests',
  action_title_copyToClipboard_single: 'Copy value to clipboard',
  export_link_to_txt_file: 'Export URL adres to TXT file',
  export_all_to_txt_file: 'Export all requested URL`s to TXT file',
  export_all_to_txt_file_data: 'Export all requests with details to TXT file',
  global_export_options: 'Global export options',
  global_requests: 'All requests',
  popup_title_dashboard: 'Dashboard',
  links: 'Links',
  /**
   * Requests download 
   */
  imagesNoData: 'No valid requests found',
  imagesNoDataFavourites: 'No saved requests found',
  imagesLoadingTabs: 'Loading active tabs...',
  current_tabs_title: 'Current tabs',
  filter: 'Filters',
  type: 'Type',
  filter_all: 'All',
  itemsPerSite: 'Per site',
  itemsPerSiteSuffix: 'requests',
  page: 'Page',
  of: 'of', 
  images: 'requests',
  current_favourites_images: 'Currently saved requests',
  open_in_new_tab: 'Open in new tab',
  download: 'Get Source code',
  downloadSmall: 'download',
  delete_all: 'Delete all',
  tabsNoData: 'No valid tabs available',
  imagesLoadingData: 'Loading requests...',
  urlFilter: 'URL filter...',
  download_all_as_txt: 'Download all requested urls as .json file with header informations',
  download_as_zip: 'Download all requests response (original files) as .zip file based on current filters',
  download_as_zip_single: 'Download single request response into .zip file',
  request: 'Request',
  response: 'Response',
  msg_8: 'Export response data to .json file',
  msg_8a: 'export response data with headers to .json file',
  intervalTxt: 'Interval of the refresh cycle',
  intervalInSeconds: 'interval in seconds',

  notLoggedInStatisticMessage: 'You are working locally. Login to persist the statistic otherwise the statistic cannot be done backwards.',
  today_blocked: 'Current day statistic of blocked elements',
  menu_text_statistic: 'Statistic',
  menu_text_requests:'Requests',
  addon_not_available: 'This website are not supporting extensions',
  NoDataBlockedItems: 'No blocked data',
  NoDataBlockedItemsToday: 'No blocked data from today available',
  home_chat: 'Chat with friends - without tracking',
  home_messages: 'Send messages - without tracking',
  home_security: 'Keep yourself secure in the internet - block trackers',
  home_images: 'Images download - without tracking',
  /** 
   * Left menu
   */
  menu_text_export: 'Export',
  menu_title_export: 'Navigate to the export area',
  menu_text_import: 'Import',
  menu_title_import: 'Navigate to the import area',
  messages_main: 'Messages',
  menu_text_messages: 'Messages',
  menu_title_messages: 'Navigate to the messages area',
  menu_text_notifications: 'Notifications',
  menu_title_notifications: 'Navigate to the notifications area',
  menu_text_favourites: 'Friends',
  menu_title_favourites: 'Navigate to the friends area',
  menu_text_add_favourites: 'Search',
  menu_title_add_favourites: 'Navigate to the friends search area',
  chat_main: 'Chat',
  menu_text_chat: 'Chat',
  menu_title_chat: 'Navigate to the chat area',
  menu_text_security: 'Security',
  menu_text_security_main: 'List',
  menu_title_security: 'Navigate to the security area',
  menu_text_security_settings: 'Settings',
  menu_title_security_settings: 'Navigate to the security settings area',
  menu_text_cookies: 'Cookies',
  menu_title_cookies: 'Navigate to the cookies area',
  menu_text_home: 'Home',
  menu_title_home: 'Navigate to the homepage area',
  menu_text_iframes: 'Iframes',
  menu_title_iframes: 'Navigate to the iframes area',
  menu_text_security_examples: 'Examples',
  menu_title_security_examples: 'Navigate to the security examples area',
  menu_title_download_images: 'Navigate to the images download area',
  menu_text_images: 'Images',
  menu_text_images_favourites: 'Saved images',
  menu_title_images_favourites: 'Navigate to the saved images area',
  /** 
   * Notifications popup
   */
  notifications: 'Notifications',
  view_all_notifications: 'All Notifications',
  no_notifications: 'No notifications',
  /** 
   * Messages popup
   */
  messages: 'Messages',
  view_all_messages: 'All Messages',
  no_messages: 'No messages',
  /**
   * Account popup
   */
  account: 'Account',
  view_all_account: 'Account Settings',
  no_data: 'No informations available',
  no_data_available: 'No data available',
  accountSettings: 'Settings',
  accountLogout: 'Logout',
  accountPrivacyTerms: 'Privacy terms',
  /**
   * LOGIN
   */
  titlelogin: 'Sign in',
  titleUsername: 'E-mail',
  titlePassword: 'Password',
  signInButton: 'Sign in',
  loginMainTitle: 'Sign in',
  loginMainTitleSuffix: 'Login',
  registrationButton: 'Create account',
  errorMessageLoginEmptyFields: 'E-mail and Password are required',
  errorMessageLoginInvalidCredentials: 'Invalid credentials',
  currentLoggedInAs: 'Current logged in as user',
  fortgotPassword: 'Forgot password ?',
  /**
   * LOGOUT
   */
  logoutButton: 'Logout',
  /**
   * REGISTRATION
   */
  backToLogin: 'Back to login',
  registrationMainTitleSuffix: 'Registration',
  registrationButtonRegister: 'Sign up',
  titleFirstName: 'Firstname',
  titleLastName: 'Lastname',
  errorMessageUserAlreadyExsists: 'This E-mail Address already registred',
  errorMessageRegistrationEmptyFields: 'All fields are required',
  errorMessageRegistrationCheckbox: 'Unable to continue without consent to the storage of personal data',
  deleteAccount: 'Delete account',
  acceptSavingDataTitle: 'I agree to the privacy policy',
  /**
   * DELETE ACCOUNT
   */
  deleteAccountTitle: 'Confirm account deletion',
  deleteAccountText: 'Do you really want to delete your account ?',
  deleteAccountNo: 'No way !',
  deleteAccountYes: 'Yes',
  deleteAccountPasswordConfirmation: 'Password confirmation',
  deleteAccountErrorMessageEmptyFields: 'Password are required',
  deleteAccountErrorMessageWrongPassword: 'Wrong password',
  /** 
   * GLOBAL ERROR MESSEAGES
   */
  globalNetworkError: 'Network error.',
  globalProcessError: 'Process error.',
  globalUserDoesNotExsists: 'User Account does not exsists',
  globalInvalidEmailsAdress: 'Invalid email address format',
  globalErrormessagePrefix: 'An error occured which causes the application to not work properly.',
  globalErrormessageCloseButton: 'Dismiss',
  globalErrormessageLearnMoreButton: 'Learn more',
  globalInvalidCountry: 'Invalid country',
  globalInvalidLanguage: 'Invalid language',
  globalErrorCodeTitle: 'Error code',
  globalErrorCode_1: 'Network error. When a network error occured this mean an "ajax" request failed. Check your network connection or that because the remote service currently not available.',
  globalErrorCode_2: 'App process error. It means that the ajax requests response provided an invalid structure for the application.',
  globalErrorCode_3: 'Response other then expected. Its mean the requested value of the current applications context are invalid.',
  code: 'Code',
  listNotSynchronizedUserNotLoggedIn: 'You are working locally. Login to synchronize your list.',
  notLoggedIn: 'Not logged in information',
  listSynchronized_one: 'Synchronized',
  /**
   * LOGIN REQUIRED
   */
  loginRequired: 'Please login to perform this action',
  /**
   * Messages
   */
  messagesNewMessage: 'New message',
  messagesInbox: 'Inbox',
  messagesOutbox: 'Sent',
  messagesImportant: 'Important',
  messagesTrash: 'Trash',
  messagesDrafts: 'Drafts',
  messageToText: 'To',
  messageDetailsBoxFrom: 'From',
  messageDetailsBoxFromEmail: '',
  messageDetailsBoxTo: 'To',
  messageDetailsBoxDate: 'Date',
  messageDetailsBoxTitle: 'Subject',
  messagesNewMessageEmptyField: 'Please type in an email address',
  messagesNewMessageNoResults: 'No users found',
  messagesNewMessageCurrentUserAllreadyChoosed: 'Current user allready choosen',
  messagesNewMessagePlaceholdersearchInput: 'Email recipients',
  messagesNewMessageTitle: 'New',
  messagesNewMessageMessagesTitle: 'Message title',
  messagesNewMessageMessagesText: 'Text',
  messagesNewMessageSend: 'Send',
  messagesNewMessageReipientDoesNotExsists: 'One of the given recipients, does not exists',
  errorMessageNewMessagePleaseSearchForRecipient: 'Please add a recipient from your favourites or use the search button',
  messages_area: 'Welcome to the messages area',
  messages_area_1: 'Write messages from every place you are',
  messages_area_2: 'Auto Saving messages as draft',
  messages_area_3: 'Single attachment up to 5MB',
  messages_list: 'No messages in list',
  /**
   * Account settings
   */
  userSettings: 'Account settings',
  userSettings_password: 'Password',
  userSettings_firstname: 'Firstname',
  userSettings_lastname: 'Lastname',
  userSettings_language: 'Language',
  saveUserDataButton: 'Save',
  errorMessageUserUpdateEmptyFields: 'Empty fields are not allowed',
  errorMessageUserUpdateError: 'Error while updating user data',
  successUpdate: 'Profile has been updated',
  /**
   * Popup - Cookies popup page
   */
  titleDeleteCookie: 'Delete single cookie',
  cookie_msg_1: 'Domain:',
  cookie_msg_2: 'Name:',
  cookie_msg_3: 'Value:',
  cookie_msg_4: 'Delete all cookies. It is possible that you will be logged out from the current website.',
  cookiesNoData: 'No cookies available',
  /**
   * Password reset
   */
  passwordResetMainTitleSuffix: 'Password reset',
  passwordResetButton: 'Reset',
  followTheMailInstructions: 'An mail has been send to the given address',
  /**
   * Favourites
   */
  favouritesNoData: 'To add a new favourite please navigate to the "Favourites search" page',
  favouritesTitleCurrentFavourites: 'Your current favourites',
  favouritesTitleSearchForUsers: 'User search',
  favouritesSince: 'Friendship period',
  favouritesRemoveFriend: 'Cancel friendship',
  favouritesRemoveFriendTooltip: 'Cancel friendship with',
  favouritesAddFriend: 'Start friendship',
  favouritesAddFriendTooltip: 'Start friendship with',
  favouritesRemoveFriendResponseSuccess: 'Friendship canceled for',
  favouritesRemoveFriendResponseError: 'Error while canceling friendship with',
  favouritesAddFriendResponseSuccess: 'Friendship started with',
  favouritesAddFriendResponseError: 'Error while starting friendship with',
  favouritesNoResultsSuggestions: 'No users found',
  favouritesEmptyField: 'Searchfield cannot be empty',
  favouritesAllreadyFriends: 'Friendship already exists with',
  /**
   * Chat
   */
  chatNoDataFavourites: 'No favourites found. To start chatting, please add an user from the "Search" page.',
  chatNoDataLoading: 'Loading favourites list...',
  chatNoFavouritesUserSelected: 'Please choose an user from your favourites list and start chatting.',
  chatNoDataInsideChat: 'No history found for selected user.',
  chatInputPlaceholder: 'Message...',
  chatToggleInputFieldType: 'Change input type from single line to multiline and vice versa',
  chatUploadFileTitle: 'Send files to your friend',
  chatUploadFile: 'Send files',
  chatSendFilesTo: 'Send selected files to your friend',
  chatSendFilesToButton: 'Send files',
  no_history_available: 'Currently no chat history',
  view_all_chat: 'Open Chat',
  popup_not_readed_title: 'Chat - new messages',
  popup_no_new_messages: 'No new chat messages',
  chat_file: 'Send a file',
  chatLoadingData: 'Loading conversation...',

  // user account
  avatarErrorFileType: 'Unrecognized file type',
  avatarErrorFileSize: 'File size exceeds limit of 5MB for avatar',
  avatarErrorFileTypeSupport: 'Only jpg, png and gif file types are allowed',

  /**
   * Blacklist overview
   */
  blacklistedElementsWords: 'Blacklist Words',
  blacklistedElementsDomians: 'Blacklist Domains',
  blacklistedElementsUrlsIncludes: 'Blacklist Urls includes',
  blacklistedElementsTrackers: 'Blacklist Trackers',
  blacklistedElementsCookies: 'Blacklist Cookies',
  blacklistedElementsClass: 'Block HTML by class',
  blacklistedElementsId: 'Block HTML by id',
  blacklistedElementsHref: 'Block HTML by href',
  menuBlacklistedElementsClass: 'Block by class',
  menuBlacklistedElementsId: 'Block by id',
  menuBlacklistedElementsHref: 'Block by href',
  blacklistedElementsIframes: 'Blacklist Iframes',
  blacklistedElementsIframesSources: 'Blacklist Iframe Sources',
  copiedToClipBoard: 'Copied to clipboard',
  action_title_copyToClipboard: 'Copy list to clipboard',
  action_title_exportToFile: 'Export list to JSON field',
  action_title_deleteList: 'Empty list globally',
  action_title_delete_single: 'Remove entry',
  forThisFunctionLogin: 'To perform this action, please login',
  emptyListDone: 'List has been emptied',
  restoreDefaultValue: 'Restore list to its default value',
  whitelistedElementsDomains: 'Whitelist Domains',

  /**
   * Security settings
   */
  securityIsOn: 'This extension is ON or OFF.',
  scanTextOnWebsite: 'If you turn this option OFF, then all words are NOT scanned. The Blacklist: Words, Attributes, Attributes Words are ignored.',
  makeSearchInSourceCode: 'Scan words in the source code of a given HTML element (innerHTML) or only in the text of HTML elements (innerText).',
  mutationCheck: 'Check websites HTML elements after the page was loaded (DOM Mutations listener - grabbing all elements changed by Javascript libraries).',
  ignoreTagStyle: 'Ignore the code inside the "Style" tags (<style> tag) while scanning process based on blacklist words.',
  ignoreTagScript: 'Ignore the code inside the "SCRIPT" tags (<script> tag) while scanning process based on blacklist words.',
  ignoreTagLink: 'Ignore the code inside the "Link" tags (<link> tag) while scanning process based on blacklist words.',
  ignoreTagMeta: 'Ignore the code inside the "Meta" tags (<meta> tag) while scanning process based on blacklist words.',
  replacer: 'Replace each single danger words character with this entry. The danger words comes from your customized "Blacklist Words".',
  maximumOfDangerWords: 'After this value is reached - count based on blacklists: words, Block HTML by class, Block HTML by id and Block HTML by href (each blocked element causes the count to rise +1), the website will be blocked. Minimum value is 1, maximum value is 300.',
  limitlessScan: 'Ignore the maximum count of all blocked elements. Blocked elements are counted based on this blacklists: "Blocked Content", "Blacklist Words", "Block by class", "Block by id" and "Block by href". The website will not be blocked (ignore the value above). If you activate this function, the security content can slow down the performance of your browser.',
  deleteCookies: 'Autodelete all cookies based on the blacklist Cookies on each website ? Cookies are delete if you open or close an tab an while browsing each 5 seconds.',

  /**
   * Popup - home
   */
  popupMainTitle: 'Security statistic',
  popup_blocked_trackers: 'Blocked trackers',
  popup_blocked_cookies: 'Blocked cookies',
  popup_blocked_words: 'Blocked words',
  popup_blocked_requests: 'Blocked requests',
  popup_blocked_iframes: 'Blocked iframes',
  popup_blocked_dom: 'Blocked by id, href, class',
  popup_blocked_websites: 'Blocked websites',


  /**
   * Popup - Iframes page
   */
  titleDeleteIframe: 'Delete single iframe',
  iframe_msg_1: 'Source:',
  iframe_msg_2: 'Id:',
  iframe_msg_3: 'className:',
  iframesNoData: 'No iframes available',

  /**
   * Popup - security
   */
  popup_add_blacklistedElementsTrackers: 'Add current domain to the blacklist trackers. All tries to access this domain will be blocked.',
  popup_remove_blacklistedElementsTrackers: 'Remove current domain from the blacklist trackers.',
  popup_add_blacklistedElementsDomians: 'Add current domain to the blacklist domains. All tries to access this domain or services from this domain will be blocked.',
  popup_remove_blacklistedElementsDomians: 'Remove current domain from the blacklist domains.',
  popup_add_blacklistedElementsCookies: 'Add current domain to the blacklist cookies. All cookies will be removed on website load then each 5 seconds.',
  popup_remove_blacklistedElementsCookies: 'Remove current domain from the blacklist cookies.',
  popup_add_blacklistedElementsIframes: 'Add current domain to blacklist iframes.',
  popup_remove_blacklistedElementsIframes: 'Remove current domain from the blacklist iframes.',
  popup_add_blacklistedElementsIframesSources: 'Add current listed url to blacklist Iframes Sources.',
  popup_remove_blacklistedElementsIframesSources: 'Remove current listed url from the blacklist Iframes Sources.',
  popup_add_whitelistedElementsDomains: 'Add current domain to the whitelist domains and allow everything (no request are blocked, no blacklist words check, no cookie deletion and no auto iframe deletion).',
  popup_remove_whitelistedElementsDomains: 'Remove current domain from the whitelist domains.',

  popup_add_blacklistedElementsTrackers_popup: 'Add current entry to the blacklist trackers. All tries to access this domain will be blocked.',
  popup_remove_blacklistedElementsTrackers_popup: 'Remove current entry from the blacklist trackers.',
  popup_add_blacklistedElementsDomians_popup: 'Add current entry to the blacklist domains. All tries to access this domain or services from this domain will be blocked.',
  popup_remove_blacklistedElementsDomians_popup: 'Remove current entry from the blacklist domains.',
  popup_add_blacklistedElementsCookies_popup: 'Add current entry to the blacklist cookies. All cookies will be removed on website load then each 5 seconds.',
  popup_remove_blacklistedElementsCookies_popup: 'Remove current entry from the blacklist cookies.',
  popup_add_blacklistedElementsIframes_popup: 'Add current entry to blacklist iframes.',
  popup_remove_blacklistedElementsIframes_popup: 'Remove current entry from the blacklist iframes.',
  popup_add_blacklistedElementsIframesSources_popup: 'Add current entry to blacklist Iframes Sources.',
  popup_remove_blacklistedElementsIframesSources_popup: 'Remove current entry from the blacklist Iframes Sources.',
  popup_add_whitelistedElementsDomains_popup: 'Add current entry to the whitelist domains and allow everything (no request are blocked, no blacklist words check, no cookie deletion and no auto iframe deletion).',
  popup_remove_whitelistedElementsDomains_popup: 'Remove current entry from the whitelist domains.',

  popup_reload_target: 'Reload website',

  /**
   * Security examples
   */
  blacklistedElementsCookies_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          You can add here an cookie name or an domain name which should be deleted on each website.
          Default this list has 640 entries with predefined cookie names or domain names
          that using cookies for tracking purposes and there are automatically deleted by the security content.
        </p>
        <ul>
          <li>
            Example of list entry: <span className="colored-example-element">GPS</span>. If you visit the website: https://www.youtube.com, then the cookie with the name <span className="colored-example-element">GPS</span> are deleted
          </li>
          <li>
            Example of list entry: <span className="colored-example-element">www.7search.com</span>. If you visit the website: https://www.7search.com, then <span className="colored-example-element">all cookies</span> from this website are deleted
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsDomians_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          This is an domain name based blacklist.
          All domains from this list are blocked while visiting there websites.
        </p>
        <ul>
          <li>
            Example of list entry: <span className="colored-example-element">ytimg.com</span> and if yout try to access the website <span className="colored-example-element">https://ytimg.com</span> then the website are blocked
          </li>
          <li>
            Example of list entry: <span className="colored-example-element">github.com</span> and if yout try to access the website <span className="colored-example-element">https://github.com</span> then the website are blocked
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsUrlsIncludes_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          This is an domain name and part of url based blacklist.
          All domains from this list and all matched entries from the websites url are blocked if an match was found.
        </p>
        <ul>
          <li>
            Example of list entry: <span className="colored-example-element">package</span>. If you visit the website: https://www.npmjs.com/<span className="colored-example-element">package</span>/gulp-babel then the website are blocked
          </li>
          <li>
            Example of list entry: <span className="colored-example-element">test</span>. If you visit the website: https://www.google.com/search?q=<span className="colored-example-element">test</span>, then the website are blocked
          </li>
          <li>  
            Example of list entry: <span className="colored-example-element">q</span>. If you visit the website: https://www.google.com/search?<span className="colored-example-element">q</span>=test, then the website are blocked        
          </li>
          <li>  
            Example of list entry: <span className="colored-example-element">hub.com</span>. If you visit the website: https://www.git<span className="colored-example-element">hub.com</span>, then the website are blocked       
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsIframes_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          If you visit an website an the websites domain name are inside this list then all iframes are removed.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">gazeta.pl</span> - if you visit the website: https://www.gazeta.pl then all iframes on the website https://<span className="colored-example-element">gazeta.pl</span> are removed
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsIframesSources_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          If you visit an website an the website includes iframes and this iframes attribute "src" (source) includes one of an entry from this list, then the arget iframe will be removed.
        </p>
        <ul>
          <li>   
          Example of list entry: <span className="colored-example-element">https://dmp.theadex.com/r/</span>. If you visit the website: https://www.gazeta.pl and if the website ncludes iframes and the iframes "src" (source) includes an entry from this list <span className="colored-example-element">https://dmp.theadex.com/r/</span>230/1121/?c=4225222955758066709, then this iframe are removed from the website
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsTrackers_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          If you visit a website, and the website has implemented other (third party)
          services or tracking services and the domain name match with an domain name from this list
          or the whole url path match with an entry from this list then
          the request will be blocked.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">cdn.mouseflow.com</span>. If an website will connect to an external service and the domain name contains: https://<span className="colored-example-element">cdn.mouseflow.com</span> then the request are blocked
          </li>
          <li>  
            Example of list entry: <span className="colored-example-element">rsrc.php/v3/y4/r/-PAXP-deijE.gif</span>. If an website will connect to an external service and the url request contains: https://static.xx.fbcdn.net/<span className="colored-example-element">rsrc.php/v3/y4/r/-PAXP-deijE.gif</span> then the request are blocked
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsWords_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          The security content will find each word from this blacklist and each word will be replace by the "replacer" defined in the "settings" section.
          If the security content has found an danger word, from the "Blacklist: Words" in any HTML tag,
          then the HTML tags attributes are scanned. If any attribute name from this list does not matches with entrys from the "Blacklist: attributes", then
          the security content will find each word, inside the attributes value, from this list and replace each character with the replacer
          defined in the "settings section.
        </p>
        <ul>
          <li>  
            For example, if the word <span className="colored-example-element">guns</span> are in this blacklist, then if you visit a website, then this word will be replaced
            <br />
            Example input: "we have <span className="colored-example-element">guns</span> in ..."
            <br />
            Example output: "we have <span className="colored-example-element">####</span> in ..."
          </li>
          <li>  
            For example, if the word <span className="colored-example-element">seven</span> are in this blacklist, then if you visit a website, then this will be replaced
            <br />
            Example input: "<span className="colored-example-element">seven</span> years old ..."
            <br />
            Example output: "<span className="colored-example-element">#####</span> years old ..."
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsClass_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          Blocking DOM Elements (tags) based on its attribute: class.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">font-bold</span>. When you visit an website and a single tag has the attributes class an the class value includes this text: "font-bold", example: { '<span class="font-bold"> Text </span>' }, then this tag (DOM element) will be removed from the current visited website
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsHref_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          Blocking "A" tag Elements based on its attribute: href.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">redirect?</span>. When you visit an website and a single tag { '<a>' } has the attributes href an the href`s value includes this text: "redirect?", example: { '<a href="https://xv345bhFD.com/redirect?client=http://example.com">link</a>' }, then this tag (DOM element) will be removed from the current visited website
          </li>
        </ul>
      </div>
    </span>
  ),
  blacklistedElementsId_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          Blocking DOM Elements (tags) based on its attribute: id.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">extern-logo</span>. When you visit an website and a single tag has the attributes id an the id value includes this text: "extern-logo", example: { '<img id="extern-logo"/>' }, then this tag (DOM element) will be removed from the current visited website
          </li>
        </ul>
      </div>
    </span>
  ),
  whitelistedElementsDomains_html: (
    <span className="box-content">
      <div className="box-content--div">
        <p className="element-p">
          Make nothing for selected domain names.
        </p>
        <ul>
          <li>  
            Example of list entry: <span className="colored-example-element">google.com</span> then the website https://www.<span className="colored-example-element">google.com</span> are allowed and no checks are made
          </li>
          <li>  
            Example of list entry: <span className="colored-example-element">npmjs.com</span> then the website https://www.<span className="colored-example-element">npmjs.com</span>/package/gulp-babel are allowed and no checks are made
          </li>
        </ul>
      </div>
    </span>
  ),
  example: 'Examples',
  /*
   * List actions 
   */
  infoItemAdded: 'Item has been added to the current list',
  infoItemRemoved: 'Item has been removed from list',
  infoArrayIs0: 'List are empty, but you want to remove an value',
  infoIncorrectValue: 'Value is incorrect',
  infoItemInList: 'Item allready in list',

  country: 'Country',
  countriesNotFoundText: 'Sorry, no countries found',
  dropText: 'Drop here',
  error: 'Error',
  searchPlaceholder: 'Search for value here...',
  search: 'Search',
  list: 'List',
  addPlaceholder: 'Add new entry...',
  addNewEntryTitle: 'Add new entry',
  no_data_list: 'No entries',
  no_data_list_search: 'No search result',
  loading: 'Loading...',
  home_security_1: 'Blocking danger and tracking cookies',
  home_security_2: 'Blocking danger and tracking requests',
  home_security_3: 'Blocking trackers',
  home_security_4: 'Blocking danger porn websites',
  home_security_5: 'Blocking custom danger words',
  home_security_6: 'Blocking custom websites HTML content',
  upload: 'Drag & Drop Protector`s json file here...',
  export: 'Export',
  exportAll: 'of global lists and settings',
  dangerCount: 'Protecting you!',
  dangerCountPrefix: 'The maximum number of danger blocked elements has been reached and is currently',
  dangerUrlPrefix: 'The current url or part of the given url are danger. Blocking by blacklist entry',
  domain: 'Domain without www. Example: react-divcreator.cba.pl',
  tag: 'Tag name. For example: div',
  languages: 'Languages'
};

export default EN;
