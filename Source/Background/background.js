/**
 * Geet item from the local storage
 * @param {string} item
 */
const getItem = item => {
  try {
    return JSON.parse(localStorage.getItem(item));
  }
  catch (e) {
    return null;
  }
};

/**
 * Set item to the local storage
 * @param {string} name
 * @param {any} value
 */
const setItemToLocalStorage = (name, value) => {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch (error) { 
    localStorage.clear();
    localStorage.setItem(name, JSON.stringify(value));
  }
};

/**
 * Get users current active tab
 */
const getTab = () => {
  //@ts-ignore
  return browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then(function (data) {
      return data;
    })
    .catch(function (error) {
      return false;
    });
};

/**
 * Tabs callbacks
 */
const onCreated = tab => {
  return true;
};

const onError = error => {
  return false;
};

const addToStatistic = (key) => {
  const DATE = new Date();
  const year = DATE.getFullYear();
  const month = (DATE.getMonth() + 1) >= 10 ? (DATE.getMonth() + 1) : '0' + (DATE.getMonth() + 1);
  const day = DATE.getDate() >= 10 ? DATE.getDate() : '0' + DATE.getDate()
  const generatedDay = `${year}-${month}-${day}`;

  let statistic = getItem('statistic');

  if (null == statistic) {
    statistic = {};
  }

  if (undefined == statistic[generatedDay]) {
    statistic = {};
    statistic[generatedDay] = {};
  }

  if (undefined == statistic[generatedDay][key]) {
    statistic[generatedDay][key] = 1;
  }
  else {
    statistic[generatedDay][key] += 1;
  }

  setItemToLocalStorage('statistic', statistic);
};

/**
 * Get only domain name
 * @param {string} url
 */
const getOnlyDomainName = url => {
  if (url) {
    return url.split('/')[2];
  }
  return '';
};

const setAndGetHistory = () => {
  let requestHistory = getItem('requestHistory');

  if (null == requestHistory) {
    setItemToLocalStorage('requestHistory', {});
    requestHistory = {};
  }

  return requestHistory;
};

/**
 * Request listener
 */
const checkRequest = request => {
  let { tabId } = request;
  let requestHistory = setAndGetHistory();
  tabId = parseInt(tabId);

  if (undefined == requestHistory[tabId]) {
    requestHistory[tabId] = [];
  }
  requestHistory[tabId].unshift(request);

  if (150 < requestHistory[tabId].length) {
    requestHistory[tabId].pop();
  }

  setItemToLocalStorage('requestHistory', requestHistory);
};

// @ts-ignore
browser.webRequest.onBeforeRequest.addListener(
  checkRequest,
  {
    urls: ['<all_urls>'],
  },
  ['requestBody']
);

/**
 * Background message listener
 */
//@ts-ignore
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { tab } = sender;

  switch (request.action) {
    case 'get-all-tabs': {
      (async () => {
        //@ts-ignore
        const allTabs = await browser.tabs.query({}).then(data => data).catch(error => []);
        return sendResponse({
          data: setAndGetHistory(),
          allTabs
        });
      })();
      break;
    }
    case 'get-active-tab': {
      getTab()
        .then(activeTab => {
          return sendResponse(activeTab[0]);
        })
        .catch(e => {
          return sendResponse(-1);
        });
      break;
    }
    case 'check-addons-availablitity': {
      getTab()
        .then(activeTab => {
          const { id } = activeTab[0];

          //@ts-ignore
          browser.tabs
            .sendMessage(id, {
              action: 'check-addons-availablitity',
            })
            .then(() => {
              return sendResponse(true);
            })
            .catch(() => {
              return sendResponse(false);
            });
        })
        .catch(() => {
          return sendResponse(false);
        });
      break;
    }
    case 'get-requests': {
      return sendResponse(setAndGetHistory());
      break;
    }
    case 'reset-data' : {
        const { id } = tab;
        const requestHistory = setAndGetHistory();
        requestHistory[id] = [];
        setItemToLocalStorage('requestHistory', requestHistory);
        return sendResponse(true);
    }
    case 'get-requests-tab': {
      const { tabId } = request;
      const data = setAndGetHistory();
      const requestHistory = data[tabId] ? data[tabId] : [];
      return sendResponse(requestHistory);
      break;
    }
    default:
      {
        return sendResponse(null);
      }
      return true;
  }

  return true;
});