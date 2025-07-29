import { NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sonic } from 'viem/chains';

// This should be in your .env file
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY!;

export async function POST(req: Request) {
  try {
    const { traitsJson } = await req.json();

    if (!traitsJson) {
      return NextResponse.json({ error: 'Traits JSON is required' }, { status: 400 });
    }

    // Create wallet client with the signer's private key
    const account = privateKeyToAccount(`0x${SIGNER_PRIVATE_KEY}`);
    const client = createWalletClient({
      account,
      chain: sonic,
      transport: http()
    });

    // Sign the traits JSON
    const signature = await client.signMessage({
      message: traitsJson
    });

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error signing traits:', error);
    return NextResponse.json({ error: 'Failed to sign traits' }, { status: 500 });
  }
} 