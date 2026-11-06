import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { HDNodeWallet, Mnemonic } from "ethers";

/**
 * Generates a random 12-word mnemonic seed phrase using bip39.
 * @returns A string containing the 12-word mnemonic.
 */
export function generateMnemonic() {
    return bip39.generateMnemonic();
}

/**
 * Derives a Solana wallet from a given mnemonic and account index.
 * Uses the standard Solana derivation path: m/44'/501'/{index}'/0'
 * @param mnemonic The 12-word seed phrase.
 * @param index The account index (0, 1, 2...).
 * @returns An object containing the public key, secret key, and the original keypair.
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
 * Derives an Ethereum wallet from a given mnemonic and account index.
 * Uses the standard Ethereum derivation path: m/44'/60'/0'/0/{index}
 * @param mnemonic The 12-word seed phrase.
 * @param index The account index (0, 1, 2...).
 * @returns An object containing the address and private key.
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
