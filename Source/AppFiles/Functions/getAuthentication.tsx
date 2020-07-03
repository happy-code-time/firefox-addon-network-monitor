import Encryption from '../Cryption/encryption';

import emailValidator from './validators/emailValidator';

const X = process.env.X;

const getAuthentication = (name: string, decrypt = false) => {
  const encrypted = localStorage.getItem(name);
  const encryption = new Encryption();

  if (decrypt && encrypted !== null) {

    if(!emailValidator(encryption.decrypt(encrypted, X))){
      return null;
    }
    
    return encryption.decrypt(encrypted, X);
  }

  return encrypted;
};

export default getAuthentication;