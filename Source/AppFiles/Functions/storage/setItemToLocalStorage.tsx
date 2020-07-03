/**
 * Set item to the local storage
 * @param {string} name 
 * @param {any} value 
 */
const setItemToLocalStorage=(name, value) => {
    try {
        localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
        localStorage.setItem(name, JSON.stringify(value));
    }
};

export default setItemToLocalStorage;