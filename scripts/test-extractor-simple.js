/**
 * Simple extractor service test
 * Run with: node scripts/test-extractor-simple.js
 */

const fetch = require('node-fetch');

async function testExtractor() {
  const extractorUrl = process.env.EXTRACTOR_API_URL || 'https://promopack-extractor.powellmatt.com';
  const extractorKey = process.env.EXTRACTOR_API_KEY || 'test-api-key';

  console.log('🔍 Testing Extractor Service');
  console.log('━'.repeat(60));
  console.log(`URL: ${extractorUrl}`);
  console.log(`API Key: ${extractorKey ? '✓ Set (' + extractorKey.substring(0, 4) + '...)' : '✗ Not set'}`);
  console.log('━'.repeat(60));
  console.log();

  // Test 1: Health check
  console.log('📋 Test 1: Health Check');
  console.log('─'.repeat(60));
  try {
    console.log(`Calling: GET ${extractorUrl}/health`);
    const startTime = Date.now();
    
    const healthResponse = await fetch(`${extractorUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    const elapsed = Date.now() - startTime;
    const healthBody = await healthResponse.text();
    
    console.log(`Status: ${healthResponse.status} ${healthResponse.statusText}`);
    console.log(`Time: ${elapsed}ms`);
    console.log(`Response: ${healthBody}`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Health check PASSED');
    } else {
      console.log('❌ Health check FAILED');
      console.log(`   Expected: 200, Got: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Health check FAILED with error:`);
    console.log(`   ${error.message}`);
    if (error.code) {
      console.log(`   Error code: ${error.code}`);
    }
  }
  console.log();

  // Test 2: Extract claims with authentication
  console.log('📋 Test 2: Extract Claims Endpoint (with auth)');
  console.log('─'.repeat(60));
  
  try {
    console.log(`Calling: POST ${extractorUrl}/extract-claims`);
    console.log(`Headers: Authorization: Bearer ${extractorKey.substring(0, 4)}...`);
    console.log(`Body: { document_url: "test", prompt_version: "v4_regulatory" }`);
    
    const startTime = Date.now();
    
    const response = await fetch(`${extractorUrl}/extract-claims`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${extractorKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        document_url: 'https://example.com/test.pdf',
        prompt_version: 'v4_regulatory',
      }),
      timeout: 30000, // 30 second timeout
    });

    const elapsed = Date.now() - startTime;
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Time: ${elapsed}ms`);
    
    const responseText = await response.text();
    
    if (response.ok) {
      console.log('✅ Extract endpoint responded successfully');
      try {
        const data = JSON.parse(responseText);
        console.log(`   Response has 'claims' array: ${Array.isArray(data.claims) ? 'Yes' : 'No'}`);
        console.log(`   Claims count: ${data.claims?.length || 0}`);
        if (data.metadata) {
          console.log(`   Metadata present: Yes`);
        }
      } catch (e) {
        console.log(`   Response (first 200 chars): ${responseText.substring(0, 200)}`);
      }
    } else {
      console.log('❌ Extract endpoint FAILED');
      console.log(`   Response (first 500 chars): ${responseText.substring(0, 500)}`);
      
      if (response.status === 401 || response.status === 403) {
        console.log('   💡 This looks like an authentication issue - check EXTRACTOR_API_KEY');
      } else if (response.status === 502) {
        console.log('   💡 502 Bad Gateway - backend service may be down or unreachable');
      } else if (response.status === 503) {
        console.log('   💡 503 Service Unavailable - service may be overloaded');
      } else if (response.status === 404) {
        console.log('   💡 404 Not Found - check the endpoint URL');
      }
    }
  } catch (error) {
    console.log(`❌ Extract endpoint FAILED with error:`);
    console.log(`   ${error.message}`);
    if (error.code) {
      console.log(`   Error code: ${error.code}`);
    }
  }
  console.log();

  // Summary
  console.log('━'.repeat(60));
  console.log('📊 Summary');
  console.log('━'.repeat(60));
  console.log();
  console.log('If both tests fail with 502, the service might be:');
  console.log('  • Behind a reverse proxy that can\'t reach the backend');
  console.log('  • In the process of restarting');
  console.log('  • Not properly configured to accept external connections');
  console.log();
  console.log('Next steps:');
  console.log('  1. Check the extractor service logs for errors');
  console.log('  2. Verify the reverse proxy/load balancer configuration');
  console.log('  3. Test from the server directly (not through proxy)');
  console.log('  4. Check firewall rules if applicable');
}

// Load environment variables from .env file
require('dotenv').config();

// Run tests
testExtractor().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
