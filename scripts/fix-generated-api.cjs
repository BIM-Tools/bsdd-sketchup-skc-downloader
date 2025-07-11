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
    fs.writeFileSync(DICTIONARY_API_PATH, content, 'utf8');
    console.log('✅ Fixed unused ProblemDetails import in DictionaryApi.ts');
  } else {
    console.log('ℹ️  No ProblemDetails import found to fix in DictionaryApi.ts');
  }
}

// Run the fixes
console.log('🔧 Post-processing generated API client...');
fixDictionaryApi();
console.log('✅ API client post-processing complete');
