const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { createPublicClient, http } = require('viem');
const { sonic } = require('viem/chains');
const { oraclesABI } = require('./abi/oracles');
require('dotenv').config();

// Validate environment variables
if (!process.env.NEXT_PUBLIC_MAINNET_ORACLES_CONTRACT_ADDRESS) {
  console.error('Error: NEXT_PUBLIC_MAINNET_ORACLES_CONTRACT_ADDRESS is not set in .env file');
  process.exit(1);
}

const ORACLE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MAINNET_ORACLES_CONTRACT_ADDRESS;

async function fetchOracleMetadata(uri) {
  try {
    if (!uri) {
      return {
        name: "Unknown Oracle",
        description: "No metadata available",
        image: "/placeholder.png"
      };
    }

    const ipfsUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const response = await fetch(ipfsUrl);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const metadata = await response.json();
    
    // Ensure image is never empty
    if (!metadata.image) {
      metadata.image = "/placeholder.png";
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      name: "Unknown Oracle",
      description: "Failed to load metadata",
      image: "/placeholder.png"
    };
  }
}

async function saveOracleData(tokenId, metadata, owner) {
  try {
    // Create directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'oracles');
    await fsPromises.mkdir(dataDir, { recursive: true });

    // Save metadata to JSON file
    const metadataPath = path.join(dataDir, `${tokenId}.json`);
    await fsPromises.writeFile(
      metadataPath,
      JSON.stringify({
        id: tokenId,
        owner,
        ...metadata
      }, null, 2)
    );

    return true;
  } catch (error) {
    console.error(`Error saving data for Oracle #${tokenId}:`, error);
    return false;
  }
}

async function fetchOracles() {
  try {
    console.log('Using contract address:', ORACLE_CONTRACT_ADDRESS);
    
    // Create Viem client with proper configuration
    const client = createPublicClient({
      chain: sonic,
      transport: http(),
      batch: {
        multicall: true
      }
    });

    // First verify the contract exists and is accessible
    try {
      const code = await client.getBytecode({ address: ORACLE_CONTRACT_ADDRESS });
      if (!code || code === '0x') {
        throw new Error('No contract code found at this address');
      }
    } catch (error) {
      console.error('Error verifying contract:', error);
      process.exit(1);
    }

    // Get next token ID to mint (this will be the total supply since tokens are minted sequentially)
    const nextTokenId = await client.readContract({
      address: ORACLE_CONTRACT_ADDRESS,
      abi: oraclesABI,
      functionName: 'nextTokenIdToMint'
    });

    const totalSupply = Number(nextTokenId);
    console.log(`Found ${totalSupply} oracles`);

    // Fetch all oracles in batches to avoid rate limiting
    const BATCH_SIZE = 10;
    const oracles = [];
    
    for (let i = 0; i < totalSupply; i += BATCH_SIZE) {
      const batchEnd = Math.min(i + BATCH_SIZE, totalSupply);
      console.log(`Fetching oracles ${i} to ${batchEnd - 1}...`);
      
      const batchPromises = Array.from({ length: batchEnd - i }, async (_, index) => {
        const tokenId = i + index;
        
        try {
          // Fetch owner and URI in parallel using multicall
          const [owner, uri] = await Promise.all([
            client.readContract({
              address: ORACLE_CONTRACT_ADDRESS,
              abi: oraclesABI,
              functionName: 'ownerOf',
              args: [tokenId]
            }),
            client.readContract({
              address: ORACLE_CONTRACT_ADDRESS,
              abi: oraclesABI,
              functionName: 'tokenURI',
              args: [tokenId]
            })
          ]);

          // Fetch metadata
          const metadata = await fetchOracleMetadata(uri);
          
          // Save individual oracle data
          await saveOracleData(tokenId, metadata, owner);
          
          return {
            id: tokenId,
            owner: owner,
            uri: uri,
            metadata
          };
        } catch (error) {
          console.error(`Error fetching oracle ${tokenId}:`, error);
          return {
            id: tokenId,
            owner: '0x0000000000000000000000000000000000000000',
            uri: '',
            metadata: {
              name: `Oracle #${tokenId}`,
              description: "Failed to load oracle data",
              image: "/placeholder.png"
            }
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      oracles.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (batchEnd < totalSupply) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Save complete collection data
    const dataDir = path.join(process.cwd(), 'data');
    await fsPromises.mkdir(dataDir, { recursive: true });

    const outputPath = path.join(dataDir, 'oracles-collection.json');
    await fsPromises.writeFile(
      outputPath,
      JSON.stringify({
        oracles,
        totalSupply,
        lastUpdated: new Date().toISOString()
      }, null, 2)
    );

    console.log(`Successfully saved ${oracles.length} oracles to ${outputPath}`);
    console.log('Individual oracle data has been saved in data/oracles/');
  } catch (error) {
    console.error('Error fetching oracles:', error);
    process.exit(1);
  }
}

// Run the script
fetchOracles();