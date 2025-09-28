const Ajv = require('ajv');
const fs = require('fs');

const ajv = new Ajv({ allErrors: true });

// Load schemas
const generalSchema = JSON.parse(fs.readFileSync('general-graph-schema.json', 'utf8'));
const bipartiteSchema = JSON.parse(fs.readFileSync('bipartite-graph-schema.json', 'utf8'));

// Compile validators
const validateGeneral = ajv.compile(generalSchema);
const validateBipartite = ajv.compile(bipartiteSchema);

// Test data
const generalTestData = JSON.parse(fs.readFileSync('test-general-sample.json', 'utf8'));
const bipartiteTestData = JSON.parse(fs.readFileSync('test-bipartite-sample.json', 'utf8'));

console.log('=== Graph DSL Schema Validation ===\n');

// Validate general graph schema
console.log('1. General Graph Schema (v, e, ends format):');
const generalValid = validateGeneral(generalTestData);
if (generalValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateGeneral.errors);
}

console.log('\n2. Bipartite Graph Schema (u, w, i format):');
const bipartiteValid = validateBipartite(bipartiteTestData);
if (bipartiteValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateBipartite.errors);
}

console.log('\n=== Validation Complete ===');
