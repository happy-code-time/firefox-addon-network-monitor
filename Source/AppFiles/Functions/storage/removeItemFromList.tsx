import getItem from './getItem';

import setItemToLocalStorage from './setItemToLocalStorage';

import setItem from './setItem';

import setItemRemote from './setItemRemote';

import getTranslations from '../../../../Translations';

const removeItemFromList= async (storageName: string, value: string) => {
    const translations:any = getTranslations();
    let currentList= await getItem(storageName);
    currentList = currentList ? currentList : [];

    if (!value) {
        return {
            error: true,
            message: translations.infoIncorrectValue,
            data: currentList,
        }
    }

    if (null==currentList) {
        return {
            error: true,
            message: translations.infoArrayIs0,
            data: currentList
        }
    }

    currentList=currentList.filter(entry => entry!==value);
    setItemToLocalStorage(storageName, currentList);
    await setItem(storageName, currentList);
    await setItemRemote(storageName, value, 'remove');

    return {
        error: false,
        message: translations.infoItemRemoved,
        data: currentList
    };
}
export default removeItemFromList;