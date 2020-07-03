import Encryption from '../Cryption/encryption';

const X = process.env.X;

const decryptValue = (value) => {
  const encryption = new Encryption();
  return encryption.decrypt(value, X);
};

export default decryptValue;
