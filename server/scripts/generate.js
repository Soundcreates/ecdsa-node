const secp = require("ethereum-cryptography/secp256k1");
const { toHex, randomPrivateKey } = require("ethereum-cryptography/utils");

const privateKey = randomPrivateKey();
console.log("Private key: ", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log("Public key: ", toHex(publicKey));