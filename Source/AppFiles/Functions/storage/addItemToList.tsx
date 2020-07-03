import getItem from './getItem';

import setItemToLocalStorage from './setItemToLocalStorage';

import setItem from './setItem';

import setItemRemote from './setItemRemote';

import getTranslations from '../../../../Translations';

const addItemToList = async (storageName: string, value: string) => {
    const translations:any = getTranslations();
    let currentList = await getItem(storageName);
    currentList = currentList ? currentList : [];

    if (!value) {
        return {
            error: true,
            message: translations.infoIncorrectValue,
            data: currentList,
        }
    } 

    /**
     * Current list not empty
     */
    if (currentList && currentList.length) {
        if(currentList.includes(value)){
            return {
                error: true,
                message: translations.infoItemInList,
                data: currentList,
            };
        }
    } 

    /**
     * Add item to list
     */
    currentList.unshift(value);
    setItemToLocalStorage(storageName, currentList);
    await setItem(storageName, currentList);
    await setItemRemote(storageName, value, 'add');
    
    return {
        error: false,
        message: translations.infoItemAdded,
        data: currentList,
    }
}
export default addItemToList;