import getDataAxios from '../getDataAxios';

import getCurrentLoggedInUser from '../getCurrentLoggedInUser';

import encryptValue from '../encryptValue';

import decryptValue from '../decryptValue';

import addToStore from '../../../Store/addToStore';

import getTranslations from '../../../../Translations';

import setItemToLocalStorage from './setItemToLocalStorage';

import synchronizeListToTheDb from '../synchronizeListToTheDb';

/**
 * @param {string} name 
 */
const getItem=(name: string, displayMessage: boolean = true) => {
    const translations = getTranslations();
    let lokalList = [];

    // @ts-ignore
    return browser.runtime.sendMessage({
        action: 'get-list',
        list: name
    })
    .then( async (localStorageResponse: string[]) => {
        lokalList = localStorageResponse;

        const remoteHost=process.env.REMOTE_HOST;
        const currentUserHash=getCurrentLoggedInUser();
        localStorageResponse = (null == localStorageResponse ? [] : localStorageResponse);

        if('' == currentUserHash || null == currentUserHash){
            if(displayMessage){
                addToStore(`${translations.listNotSynchronizedUserNotLoggedIn}`, -2);
            }
            return localStorageResponse;
        }

        return await getDataAxios( 'get', `${remoteHost}?key=${encryptValue('getlist')}&user=${currentUserHash}&list=${encryptValue(name)}`)
        .then( async (response: any) => {
            if(response && '' !== response.data){
                try{
                    response = JSON.parse(decryptValue(response.data));
                    
                    if(response && typeof [] === typeof response){
                        
                        if(response.length){

                            if(displayMessage){
                                addToStore(translations.listSynchronized_one, 0);
                            }

                            response.map( e => {
                                if(!localStorageResponse.includes(e)){
                                    localStorageResponse.unshift(e);
                                }
                            });

                            setItemToLocalStorage(name, localStorageResponse);
    
                            /**
                             * If there any difference send 
                             * to the db the new list
                             */
                            await synchronizeListToTheDb(name, localStorageResponse);

                            return localStorageResponse;
                        }
                        else{
                            /**
                             * If there any difference send 
                             * to the db the new list
                             */
                            await synchronizeListToTheDb(name, localStorageResponse);
                            return localStorageResponse;
                        }
                    }
                } catch(e){
                    return localStorageResponse;         
                }
            }

            return localStorageResponse;
        })
        .catch( e => {
            return localStorageResponse;
        });
    })
    .catch( error => {
        return [];
    });
};

export default getItem;