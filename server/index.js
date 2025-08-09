const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

//importing crypto packages
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key: ', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log("Public key: ", toHex(publicKey));

app.use(cors());
app.use(express.json());

const balances = {
  "02b0e0d61b2972a6d3a515448b9641a1709048e5b7f177fcebc014e7975513396e": 100,
  "0221b6dc8f43869ff7fc8f83a2e37f8d79f3224b60efe9cc461993fdaf02a786af": 50,
  "039b6ed3316bca42774f64e08519928aa185c8b14ac1f36695707ddb06a8f6d85f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
