import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'oracles-collection.json')
    const data = await fs.readFile(dataPath, 'utf-8')
    const parsedData = JSON.parse(data)
    
    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Error loading oracles:', error)
    return NextResponse.json(
      { error: 'Failed to load oracles' },
      { status: 500 }
    )
  }
} 