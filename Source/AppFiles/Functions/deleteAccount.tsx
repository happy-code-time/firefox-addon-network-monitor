import getDataAxios from "./getDataAxios";

import decryptValue from './decryptValue';

import encryptValue from './encryptValue';

import addToStore from '../../Store/addToStore';

import getTranslations from '../../../Translations/index';

const deleteAccount = async (hashedUser, hashedPassword, host) => {
    const route = `${host}?key=${encryptValue('deleteAccount')}&user=${hashedUser}&password=${hashedPassword}`;
    const translations = getTranslations();

    return getDataAxios( 'get', route)
    .then( response => {
        if(response && response.data){
            const encryptedData=response.data;
    
            try {
                /**
                 * Decrypt data and from string back to array|object
                 */
                const decryptedData=decryptValue(encryptedData);
                const plainData=JSON.parse(decryptedData);
                
                if (true===plainData) {
                    return true;
                }
                
                if('user_no_exsists' == plainData){
                    return 'user_no_exsists';
                }
    
                if(null == plainData){
                    return null;
                }
    
                if(false == plainData){
                    return false;
                }
    
            } catch (error) {
                addToStore(`${translations.globalProcessError} ${translations.code}` ,2);
                return null;
            }
        }
        else{
            return null;
        }
    })
    .catch( (error) => {
        addToStore(`${translations.globalNetworkError} ${translations.code}` ,1);
        return null;
    })
}

export default deleteAccount;
