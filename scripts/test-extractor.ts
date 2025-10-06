/**
 * Test script for the claim extractor service
 * 
 * Usage:
 *   node --loader ts-node/esm scripts/test-extractor.ts
 * 
 * Or with environment variables:
 *   EXTRACTOR_API_URL=https://promopack-extractor.powellmatt.com EXTRACTOR_API_KEY=your-key node --loader ts-node/esm scripts/test-extractor.ts
 */

async function testExtractorService() {
  const extractorApiUrl = process.env.EXTRACTOR_API_URL || 'https://promopack-extractor.powellmatt.com'
  const extractorApiKey = process.env.EXTRACTOR_API_KEY

  console.log('🔍 Testing Extractor Service')
  console.log('━'.repeat(50))
  console.log(`URL: ${extractorApiUrl}`)
  console.log(`API Key: ${extractorApiKey ? '✓ Set' : '✗ Not set'}`)
  console.log('━'.repeat(50))
  console.log()

  // Test 1: Health check
  console.log('Test 1: Health Check')
  console.log('─'.repeat(50))
  try {
    const healthResponse = await fetch(`${extractorApiUrl}/health`)
    const healthStatus = healthResponse.status
    const healthBody = await healthResponse.text()
    
    console.log(`Status: ${healthStatus} ${healthResponse.statusText}`)
    console.log(`Response: ${healthBody}`)
    
    if (healthStatus === 200) {
      console.log('✅ Health check passed')
    } else {
      console.log('❌ Health check failed')
    }
  } catch (error) {
    console.log(`❌ Health check failed with error:`)
    console.error(error)
  }
  console.log()

  // Test 2: Extract claims endpoint (requires API key)
  if (!extractorApiKey) {
    console.log('Test 2: Extract Claims Endpoint')
    console.log('─'.repeat(50))
    console.log('⚠️  Skipped - EXTRACTOR_API_KEY not set')
    console.log('   Set EXTRACTOR_API_KEY to test the extraction endpoint')
    console.log()
    return
  }

  console.log('Test 2: Extract Claims Endpoint')
  console.log('─'.repeat(50))
  
  // Test with a sample document URL
  const testDocumentUrl = 'https://example.com/sample.pdf' // Replace with a real PDF URL if available
  
  try {
    console.log(`Calling /extract-claims with test document...`)
    console.log(`Document URL: ${testDocumentUrl}`)
    console.log()
    
    const response = await fetch(`${extractorApiUrl}/extract-claims`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${extractorApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_url: testDocumentUrl,
        prompt_version: 'v4_regulatory',
      }),
    })

    console.log(`Status: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Extraction endpoint responded successfully')
      console.log()
      console.log('Response structure:')
      console.log(`  Claims array: ${Array.isArray(data.claims) ? '✓' : '✗'}`)
      console.log(`  Claims count: ${data.claims?.length || 0}`)
      
      if (data.metadata) {
        console.log(`  Metadata: ✓`)
        console.log(`    - Model: ${data.metadata.model_version || 'N/A'}`)
        console.log(`    - Prompt: ${data.metadata.prompt_version || 'N/A'}`)
        console.log(`    - Processing time: ${data.metadata.processing_time_ms || 'N/A'}ms`)
      }
      
      if (data.claims && data.claims.length > 0) {
        console.log()
        console.log('Sample claim:')
        const sample = data.claims[0]
        console.log(`  Text: "${sample.text?.substring(0, 100)}${sample.text?.length > 100 ? '...' : ''}"`)
        console.log(`  Page: ${sample.page}`)
        console.log(`  Confidence: ${sample.confidence}`)
        console.log(`  Suggested type: ${sample.suggested_type || 'N/A'}`)
      }
    } else {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      console.log('❌ Extraction endpoint failed')
      console.log(`Response: ${errorText}`)
      
      if (response.status === 401) {
        console.log()
        console.log('⚠️  Authorization failed - check your EXTRACTOR_API_KEY')
      } else if (response.status === 404) {
        console.log()
        console.log('⚠️  Endpoint not found - verify the service is running correctly')
      } else if (response.status === 502) {
        console.log()
        console.log('⚠️  Bad Gateway - the service may be down or unreachable')
      }
    }
  } catch (error) {
    console.log(`❌ Extraction endpoint test failed with error:`)
    console.error(error)
  }
  console.log()

  // Summary
  console.log('━'.repeat(50))
  console.log('Test Summary')
  console.log('━'.repeat(50))
  console.log()
  console.log('Next steps:')
  console.log('1. Ensure EXTRACTOR_API_URL and EXTRACTOR_API_KEY are set in your .env file')
  console.log('2. Verify the service is accessible from your application server')
  console.log('3. Test with a real PDF document URL if needed')
  console.log()
  console.log('Environment variable setup:')
  console.log(`  EXTRACTOR_API_URL=${extractorApiUrl}`)
  console.log(`  EXTRACTOR_API_KEY=<your-api-key>`)
}

// Run the tests
testExtractorService().catch(console.error)
