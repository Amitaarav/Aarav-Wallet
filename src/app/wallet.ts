import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { HDNodeWallet, Mnemonic } from "ethers";

/**
 * Method to generate 12 words mnemonic from bip39
 */
export function generateMnemonic() {
    return bip39.generateMnemonic();
}

/**
 * Derive a Solana wallet from a mnemonic and index
 * Path: m/44'/501'/{index}'/0'
 */
export function deriveSolanaWallet(mnemonic: string, index: number) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;

    const { key } = derivePath(path, seed.toString("hex"));
    const keypair = Keypair.fromSeed(key);

    return {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: bs58.encode(keypair.secretKey),
        keypair: keypair,
        index
    };
}

/**
 * Derive an Ethereum wallet from a mnemonic and index
 * Path: m/44'/60'/0'/0/{index}
 */
export function deriveEthereumWallet(mnemonic: string, index: number) {
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(mnemonic), path);

    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        index
    };
}
