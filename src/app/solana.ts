import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

/**
 * The Solana RPC endpoint to use. 
 * Can be overridden via environment variable SOLANA_RPC_ENDPOINT.
 */
export const SOLANA_RPC_ENDPOINT = process.env.SOLANA_RPC_ENDPOINT || DEFAULT_RPC;

/**
 * The global Connection object used to interact with the Solana blockchain.
 */
const connection = new Connection(SOLANA_RPC_ENDPOINT);


/**
 * Fetches the native SOL balance for a given address.
 * @param address The Solana public key in string format.
 * @returns The balance in SOL (not lamports).
 */
export async function getSolBalance(address: string) {
    try {
        const balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    } catch (e) {
        console.error("Failed to fetch SOL balance:", e);
        return 0;
    }
}

/**
 * Fetches the USDC token balance for a given address.
 * Only works on Mainnet-beta where the defined USDC_MINT exists.
 * @param address The Solana public key in string format.
 * @returns The UI-friendly amount of USDC tokens.
 */
export async function getUSDCBalance(address: string) {
    try {
        const owner = new PublicKey(address);
        const accounts = await connection.getParsedTokenAccountsByOwner(owner, {
            programId: TOKEN_PROGRAM_ID
        });

        const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

        const usdc = accounts.value.find(
            acc => acc.account.data.parsed.info.mint === USDC_MINT
        );

        if (!usdc) return 0;

        return usdc.account.data.parsed.info.tokenAmount.uiAmount;
    } catch (e) {
        console.error("Failed to fetch USDC balance:", e);
        return 0;
    }
}

/**
 * Sends SOL from one account to another.
 * @param fromKeypair The Keypair object for the sender's account.
 * @param toAddress The recipient's Solana public key in string format.
 * @param amount The amount of SOL to send.
 * @returns The transaction signature string.
 */
export async function sendSol(fromKeypair: any, toAddress: string, amount: number) {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: new PublicKey(toAddress),
            lamports: amount * LAMPORTS_PER_SOL,
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    return signature;
}
