/**
 * @param {string} name 
 * @param {any} value 
 */
const setItem=(name: string, value: any) => {
    // @ts-ignore
    return browser.runtime.sendMessage({
        action: 'set-list',
        list: name,
        value
    })
    .then( response => true )
    .catch( error => false);
};

export default setItem;