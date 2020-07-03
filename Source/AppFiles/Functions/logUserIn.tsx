import getDataAxios from './getDataAxios';

import encryptValue from './encryptValue';

const logUserIn=async (hashedUsername, hashedPassword, method, host) => {
    const params = new URLSearchParams();
    params.append('password', hashedPassword);

    const route=`${host}?key=${encryptValue('login')}&user=${hashedUsername}`;
    return getDataAxios( method, route, params);
}

export default logUserIn;