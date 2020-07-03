import setItem from './setItem';

import setItemToLocalStorage from './setItemToLocalStorage';

const emptyStorage = async (storageName: string, value: string|[]) => {
    setItemToLocalStorage(storageName, value);
    await setItem(storageName, value);
    return true;
}
export default emptyStorage;