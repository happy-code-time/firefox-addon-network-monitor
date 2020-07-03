import getDataAxios from '../getDataAxios';

import encryptValue from '../encryptValue';

import getCurrentLoggedInUser from '../getCurrentLoggedInUser';

import addToStore from '../../../Store/addToStore';

import getTranslations from '../../../../Translations/index';

import decryptValue from '../decryptValue';

const setItemRemote = (listname: string, value: any, action: string) => {
    const translations = getTranslations();
    const remoteHost=process.env.REMOTE_HOST;
    const currentUserHash=getCurrentLoggedInUser();

    if('empty'  == action){
        value = '';
    }

    const params = new URLSearchParams();
    params.append('listname', encryptValue(listname));
    params.append('value', encryptValue(value));
    params.append('action', encryptValue(action));

    if(!currentUserHash){
        return false;
    }
    
    return getDataAxios(
        'post',
        `${remoteHost}?key=${encryptValue('listaction')}&user=${currentUserHash}`,
        params
    )
    .then( (response: any) => {
        if(response && '' !== response.data){
            try{
                response = JSON.parse(decryptValue(response.data));
    
                if(response !== true){
                    addToStore(`${translations.globalProcessError}` , 2);
                    return false;
                }
                else{
                    return true;
                }
            } catch(e){
                addToStore(`${translations.globalProcessError}` , 2);
                return false;
            }
        }
        else{
            addToStore(`${translations.globalProcessError}` , 2);
            return false;
        }
    })
    .catch( e => {
        addToStore(`${translations.globalProcessError}` , 1);
        return false;
    });
};

export default setItemRemote;