import Encryption from '../Cryption/encryption';

const X = process.env.X;

const encryptValue = (value) => {
  const encryption = new Encryption();
  return encryption.encrypt(value, X);
};

export default encryptValue;
