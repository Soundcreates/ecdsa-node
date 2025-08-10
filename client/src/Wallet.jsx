import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const newAddress = toHex(secp256k1.getPublicKey(privateKey))
    setAddress(newAddress);
    if (privateKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${newAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Enter your private key" value={privateKey} onChange={onChange} type="password"></input>
      </label>

      <div>
        Wallet Address: {address ? address.slice(0, 10) + "..." : "No address generated yet"}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
