import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';
export const SOLANA_RPC_ENDPOINT = process.env.SOLANA_RPC_ENDPOINT || DEFAULT_RPC;
const connection = new Connection(SOLANA_RPC_ENDPOINT);


export async function getSolBalance(address: string) {
    try {
        const balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    } catch (e) {
        console.error("Failed to fetch SOL balance:", e);
        return 0;
    }
}

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
