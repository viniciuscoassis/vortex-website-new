// lib/google-sheets-public.ts

interface GoogleSheetsData {
  table: {
    cols: Array<{ label: string }>
    rows: Array<{ c: Array<{ v: any } | null> }>
  }
}

interface Explorer {
  TokenId: number
  Species: string
  Hat: string
  Weapon: string
  Background: string
  Outfit: string
  User: string
  BlockNumber: number
  Status: string
  imageCID: string
  uriCID: string
  ImageIPFS: string
  TraitIPFS: string
  Name: string
  Description: string
  Metadata: string
}

export async function getPublicSheetData(): Promise<Explorer[]> {
  const SHEET_ID = '1eO7RDVU4OCK7AHEao3bxW-KSRvAPl_n0bn9GFrvPLjU'
  const SHEET_NAME = 'explorers'
  
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`
  
  try {
    const response = await fetch(url)
    const text = await response.text()
    
    // Remove the "google.visualization.Query.setResponse(" wrapper
    const jsonText = text.substring(47).slice(0, -2)
    const data: GoogleSheetsData = JSON.parse(jsonText)
    
    return transformGoogleSheetsData(data)
  } catch (error) {
    console.error('Failed to fetch public sheet:', error)
    throw error
  }
}

function transformGoogleSheetsData(data: GoogleSheetsData): Explorer[] {
  if (!data.table || !data.table.cols || !data.table.rows) {
    throw new Error('Invalid Google Sheets data format')
  }

  const columns = data.table.cols.map(col => col.label)
  const rows = data.table.rows

  return rows
    .filter(row => row.c && row.c.length > 0 && row.c[0]?.v) // Filter out empty rows
    .map(row => {
      const explorer: any = {}
      
      columns.forEach((colName, index) => {
        const cellValue = row.c[index]?.v
        if (cellValue !== undefined && cellValue !== null) {
          explorer[colName] = cellValue
        }
      })
      
      return explorer as Explorer
    })
    .filter(explorer => explorer.TokenId && explorer.Species) // Only return valid explorers
}

// Test function for Node.js
async function testGoogleSheets() {
  try {
    console.log('🔍 Fetching explorers from Google Sheets...')
    const explorers = await getPublicSheetData()
    
    console.log(`✅ Successfully fetched ${explorers.length} explorers`)
    console.log('\n📊 Sample explorers:')
    
    // Show first 3 explorers
    explorers.slice(0, 3).forEach((explorer, index) => {
      console.log(`\n--- Explorer ${index + 1} ---`)
      console.log(`Token ID: ${explorer.TokenId}`)
      console.log(`Name: ${explorer.Name}`)
      console.log(`Species: ${explorer.Species}`)
      console.log(`Hat: ${explorer.Hat}`)
      console.log(`Weapon: ${explorer.Weapon}`)
      console.log(`Background: ${explorer.Background}`)
      console.log(`Outfit: ${explorer.Outfit}`)
      console.log(`Status: ${explorer.Status}`)
    })
    
    // Show some statistics
    const speciesCount = new Map<string, number>()
    const hatCount = new Map<string, number>()
    const weaponCount = new Map<string, number>()
    
    explorers.forEach(explorer => {
      speciesCount.set(explorer.Species, (speciesCount.get(explorer.Species) || 0) + 1)
      hatCount.set(explorer.Hat, (hatCount.get(explorer.Hat) || 0) + 1)
      weaponCount.set(explorer.Weapon, (weaponCount.get(explorer.Weapon) || 0) + 1)
    })
    
    console.log('\n📈 Trait Statistics:')
    console.log(`Total explorers: ${explorers.length}`)
    console.log(`Unique species: ${speciesCount.size}`)
    console.log(`Unique hats: ${hatCount.size}`)
    console.log(`Unique weapons: ${weaponCount.size}`)
    
    // Show most common traits
    console.log('\n🏆 Most common species:')
    Array.from(speciesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([species, count]) => {
        const percentage = ((count / explorers.length) * 100).toFixed(1)
        console.log(`  ${species.split(' – ')[0]}: ${count} (${percentage}%)`)
      })
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets:', error)
  }
}

// Export for testing
export { testGoogleSheets }

// If running directly with Node.js, run the test
if (typeof require !== 'undefined' && require.main === module) {
  testGoogleSheets()
}