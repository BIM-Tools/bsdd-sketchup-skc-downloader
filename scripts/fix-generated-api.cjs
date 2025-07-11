#!/usr/bin/env node

/**
 * Post-processing script to fix issues in generated API client code
 */

const fs = require('fs');
const path = require('path');

const DICTIONARY_API_PATH = './src/generated/api/src/apis/DictionaryApi.ts';

function fixDictionaryApi() {
  if (!fs.existsSync(DICTIONARY_API_PATH)) {
    console.log('DictionaryApi.ts not found, skipping fix');
    return;
  }

  let content = fs.readFileSync(DICTIONARY_API_PATH, 'utf8');
  let fixed = false;
  
  // Remove unused ProblemDetails import
  const originalImport = `import type {
  DictionaryClassesResponseContractV1Classes,
  DictionaryPropertiesResponseContractV1,
  DictionaryResponseContractV1,
  ProblemDetails,
} from '../models/index';`;

  const fixedImport = `import type {
  DictionaryClassesResponseContractV1Classes,
  DictionaryPropertiesResponseContractV1,
  DictionaryResponseContractV1,
} from '../models/index';`;

  if (content.includes(originalImport)) {
    content = content.replace(originalImport, fixedImport);
    console.log('✅ Fixed unused ProblemDetails import in DictionaryApi.ts');
    fixed = true;
  } else {
    console.log('ℹ️  No ProblemDetails import found to fix in DictionaryApi.ts');
  }

  // Validate method signatures
  const hasDictionaryGet = content.includes('async dictionaryGet(requestParameters: DictionaryGetRequest');
  const hasDownloadSketchup = content.includes('async dictionaryDownloadSketchup(requestParameters: DictionaryDownloadSketchupRequest');
  
  console.log(`📋 API Validation:`);
  console.log(`   - dictionaryGet method: ${hasDictionaryGet ? '✅' : '❌'}`);
  console.log(`   - dictionaryDownloadSketchup method: ${hasDownloadSketchup ? '✅' : '❌'}`);
  
  if (!hasDictionaryGet || !hasDownloadSketchup) {
    console.log('⚠️  Warning: Expected method signatures not found. This may cause build errors.');
    
    // Show actual method signatures for debugging
    const dictionaryGetMatch = content.match(/async dictionaryGet\([^)]+\)/);
    const downloadSketchupMatch = content.match(/async dictionaryDownloadSketchup\([^)]+\)/);
    
    console.log('🔍 Actual method signatures found:');
    if (dictionaryGetMatch) {
      console.log(`   - dictionaryGet: ${dictionaryGetMatch[0]}`);
    } else {
      console.log('   - dictionaryGet: NOT FOUND');
    }
    
    if (downloadSketchupMatch) {
      console.log(`   - dictionaryDownloadSketchup: ${downloadSketchupMatch[0]}`);
    } else {
      console.log('   - dictionaryDownloadSketchup: NOT FOUND');
    }
  }

  if (fixed) {
    fs.writeFileSync(DICTIONARY_API_PATH, content, 'utf8');
  }
}

// Run the fixes
console.log('🔧 Post-processing generated API client...');
fixDictionaryApi();
console.log('✅ API client post-processing complete');
