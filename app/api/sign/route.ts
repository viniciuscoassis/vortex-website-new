import { NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sonic } from 'viem/chains';
import { keccak256, encodePacked } from 'viem';

// This should be in your .env file
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY!;

export async function POST(req: Request) {
  try {
    const { traitsJson, userAddress } = await req.json();

    if (!traitsJson) {
      return NextResponse.json({ error: 'Traits JSON is required' }, { status: 400 });
    }

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 });
    }

    // Validate user address format
    if (!userAddress.startsWith('0x') || userAddress.length !== 42) {
      return NextResponse.json({ error: 'Invalid user address format' }, { status: 400 });
    }

    // Create the message hash exactly as the contract expects it
    // keccak256(abi.encodePacked(msg.sender, traitsJson))
    const messageHash = keccak256(encodePacked(
      ['address', 'string'],
      [userAddress as `0x${string}`, traitsJson]
    ));

    // Create wallet client with the signer's private key
    const account = privateKeyToAccount(`0x${SIGNER_PRIVATE_KEY}`);
    const client = createWalletClient({
      account,
      chain: sonic,
      transport: http()
    });

    // Sign the message hash
    const signature = await client.signMessage({
      message: { raw: messageHash }
    });

    console.log('🔐 Signature generated:', {
      userAddress,
      traitsJson,
      messageHash,
      signature
    });

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error signing traits:', error);
    return NextResponse.json({ error: 'Failed to sign traits' }, { status: 500 });
  }
} 