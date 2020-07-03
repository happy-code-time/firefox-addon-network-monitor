import getDataAxios from './getDataAxios';

import encryptValue from './encryptValue';

const registerUser=async (hashedUsername: string, hashedPassword: string, hashedFirstName: string, hashedLastName: string, method: string, host: string, allowSavingPersonalData: boolean, hashedCountry: string, app: string = 'undefined') => {
    
    const params = new URLSearchParams();
    params.append('privacyTermsAccepted', encryptValue(JSON.stringify(allowSavingPersonalData)));
    params.append('lastname', hashedLastName);
    params.append('firstname', hashedFirstName);
    params.append('password', hashedPassword);
    params.append('country', hashedCountry);
    params.append('app', app);

    const route=`${host}?key=${encryptValue('registration')}&user=${hashedUsername}`;
    return getDataAxios( method, route, params);
}

export default registerUser;