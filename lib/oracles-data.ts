import { promises as fs } from 'fs';
import path from 'path';
import { type Address } from 'viem';

export interface OracleMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Oracle {
  id: number;
  owner: Address;
  uri: string;
  metadata: OracleMetadata;
}

export interface OraclesData {
  oracles: Oracle[];
  totalSupply: number;
  lastUpdated: string;
}

let cachedData: OraclesData | null = null;

export async function getOraclesData(): Promise<OraclesData> {
  if (cachedData) {
    return cachedData;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'oracles.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const parsedData = JSON.parse(data) as OraclesData;
    cachedData = parsedData;
    return parsedData;
  } catch (error) {
    console.error('Error loading oracles data:', error);
    return {
      oracles: [],
      totalSupply: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

export async function getOracleById(id: number): Promise<Oracle | null> {
  const data = await getOraclesData();
  return data.oracles.find(oracle => oracle.id === id) || null;
}

export async function getOraclesByOwner(owner: Address): Promise<Oracle[]> {
  const data = await getOraclesData();
  return data.oracles.filter(oracle => oracle.owner.toLowerCase() === owner.toLowerCase());
}

export async function getRandomOracles(count: number): Promise<Oracle[]> {
  const data = await getOraclesData();
  const shuffled = [...data.oracles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 