# Claim Extractor Service Troubleshooting

## Overview

The claim extraction service is an external Python API that analyzes PDF documents and extracts regulatory claims. The service is called from the `extractClaims` server action in `app/actions.ts`.

## Common Issues

### 502 Bad Gateway

**Symptoms:**
```
Error: Extractor API error: 502 Bad Gateway
```

**Causes:**
- The extractor service is down or crashed
- Network connectivity issues between your app and the service
- The service is restarting

**Solutions:**
1. **Wait and retry** - The app now automatically retries 3 times with 2-second delays
2. **Check service status** - Verify the service is running at `EXTRACTOR_API_URL`
3. **Check network** - Ensure your app can reach the service URL
4. **Restart the service** - If you control the service, restart it

### 503 Service Unavailable

**Symptoms:**
```
Error: Extractor API error: 503 Service Unavailable
```

**Causes:**
- Service is overloaded with requests
- Service is temporarily unable to process requests

**Solutions:**
1. Wait a few minutes and try again
2. If persistent, scale up the service resources

### 504 Gateway Timeout

**Symptoms:**
```
Error: Extractor API error: 504 Gateway Timeout
```

**Causes:**
- Document is too large or complex
- Service is processing slowly
- Timeout is too short

**Solutions:**
1. Try with a smaller/simpler document
2. Increase the timeout in `app/actions.ts` (currently 60 seconds)
3. Optimize the extractor service for performance

## Configuration

### Environment Variables

Required environment variables in your `.env` file:

```env
EXTRACTOR_API_URL=https://your-extractor-service.com
EXTRACTOR_API_KEY=your-secret-api-key
```

### Retry Configuration

In `app/actions.ts`, you can adjust:

```typescript
const maxRetries = 3        // Number of retry attempts
const retryDelay = 2000     // Delay between retries (ms)
```

### Timeout Configuration

```typescript
signal: AbortSignal.timeout(60000), // 60 second timeout
```

## Testing the Service

### Quick Health Check

```powershell
# Test if the service is reachable
$headers = @{
    'Authorization' = "Bearer $env:EXTRACTOR_API_KEY"
    'Content-Type' = 'application/json'
}

Invoke-WebRequest -Uri "$env:EXTRACTOR_API_URL/health" -Headers $headers
```

### Test Extraction Endpoint

```powershell
$body = @{
    document_url = "https://example.com/sample.pdf"
    prompt_version = "v4_regulatory"
} | ConvertTo-Json

$headers = @{
    'Authorization' = "Bearer $env:EXTRACTOR_API_KEY"
    'Content-Type' = 'application/json'
}

Invoke-WebRequest -Uri "$env:EXTRACTOR_API_URL/extract-claims" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

## Monitoring

### Application Logs

The extractor service calls are logged with:
- Attempt number (1/3, 2/3, etc.)
- Response status codes
- Retry warnings
- Success/failure messages

Example log output:
```
Calling extractor service (attempt 1/3)...
Extractor service returned 502, retrying in 2000ms...
Calling extractor service (attempt 2/3)...
Extractor service returned 15 potential claims for review
```

### Debugging Steps

1. **Check environment variables are set:**
   ```powershell
   echo $env:EXTRACTOR_API_URL
   echo $env:EXTRACTOR_API_KEY
   ```

2. **Test service connectivity:**
   ```powershell
   curl $env:EXTRACTOR_API_URL/health
   ```

3. **Review application logs for detailed error messages**

4. **Check the extractor service logs** (if you have access)

## Service Requirements

The extractor service must:

1. Accept POST requests to `/extract-claims`
2. Require Bearer token authentication
3. Accept JSON body with:
   ```json
   {
     "document_url": "https://...",
     "prompt_version": "v4_regulatory"
   }
   ```
4. Return JSON response with:
   ```json
   {
     "claims": [
       {
         "text": "...",
         "page": 1,
         "confidence": 0.95,
         "suggested_type": "...",
         "reasoning": "...",
         "is_comparative": false,
         "contains_statistics": true,
         "citation_present": true,
         "warnings": []
       }
     ],
     "metadata": {
       "total_claims_extracted": 15,
       "high_confidence_claims": 10,
       "medium_confidence_claims": 4,
       "low_confidence_claims": 1,
       "processing_time_ms": 5432,
       "model_version": "gpt-4",
       "prompt_version": "v4_regulatory"
     }
   }
   ```

## User-Facing Error Messages

The app now provides user-friendly error messages:

- **502**: "The claim extraction service is temporarily unavailable (502 Bad Gateway). Please try again in a few minutes or contact support if the issue persists."
- **503**: "The claim extraction service is currently overloaded (503 Service Unavailable). Please try again shortly."
- **504**: "The claim extraction service timed out (504 Gateway Timeout). Your document may be too large. Please try a smaller document or contact support."

## Contact

If issues persist, check:
1. Service provider status page
2. Application logs for detailed errors
3. Network connectivity between app and service
4. Service API key validity
