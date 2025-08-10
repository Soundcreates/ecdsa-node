const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

//importing crypto packages
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();

console.log("Private key received: ", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log("Public key received: ", toHex(publicKey));

app.use(cors());
app.use(express.json());

const balances = {
  "03e7ae7bf1e3ec4e2ef6ac095623406b95ecb9ee010291f656d7487d535e8591f7": 100,
  "0221b6dc8f43869ff7fc8f83a2e37f8d79f3224b60efe9cc461993fdaf02a786af": 50,
  "039b6ed3316bca42774f64e08519928aa185c8b14ac1f36695707ddb06a8f6d85f": 75,
};

app.get("/balance/:newAddress", (req, res) => {
  const { newAddress } = req.params;
  const balance = balances[newAddress] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO- get a signature from the client-side application
  // recover the public address from the signature
  const { signature, message, publicKey, amount, recipient } = req.body;

  const msgBytes = utf8ToBytes(message);
  const signBytes = hexToBytes(signature);
  const pubBytes = hexToBytes(publicKey);
  console.log(signature, message, publicKey, amount, recipient);

  const isValid = secp25k1.verify(signBytes, msgBytes, pubBytes);

  if (!isValid)
    return res.status(400).send({ message: "Invalid signature!" });

  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipent] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
