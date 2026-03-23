import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const mnemonic = generateMnemonic()
const seed = mnemonicToSeed(mnemonic);

console.log("Genearted Mnemonic: ", mnemonic);
// console.log("Seed from genearated Mnemonic: ", mnemonicToSeed(mnemonic));

for(let i = 0; i < seed.length; i++){
    // derivation path
    const path = `m/44'/501'/${i}'/0'`; // derived path
    console.log("Path", path);
    const derivedSeed = derivePath(path);
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log(secret)
    console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}

console.log("Randome key pair:", nacl.sign.keyPair());
/**
    {
       publicKey: ...,  // Uint8Array with 32-byte public key
       secretKey: ...   // Uint8Array with 64-byte secret key
    }
 */

/**
 * 1. Generate mnemonic - generateMnemonic()
 * 2. Generate seed from mnemonic - mnemonicToSeed(mnemonic)
 * 3. Path (m/44'/501'/1'/0')
 * 4. 
 */


