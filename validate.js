const Ajv = require('ajv');
const fs = require('fs');

const ajv = new Ajv({ allErrors: true });

// Load schemas
const generalSchema = JSON.parse(fs.readFileSync('general-graph-schema.json', 'utf8'));
const bipartiteSchema = JSON.parse(fs.readFileSync('bipartite-graph-schema.json', 'utf8'));
const quantumSchema = JSON.parse(fs.readFileSync('quantum-graph-schema.json', 'utf8'));
const musubiSchema = JSON.parse(fs.readFileSync('musubi-graph-schema.json', 'utf8'));

// Compile validators
const validateGeneral = ajv.compile(generalSchema);
const validateBipartite = ajv.compile(bipartiteSchema);
const validateQuantum = ajv.compile(quantumSchema);
const validateMusubi = ajv.compile(musubiSchema);

// Test data
const generalTestData = JSON.parse(fs.readFileSync('test-general-sample.json', 'utf8'));
const bipartiteTestData = JSON.parse(fs.readFileSync('test-bipartite-sample.json', 'utf8'));
const quantumTestData = JSON.parse(fs.readFileSync('test-quantum-sample.json', 'utf8'));
const musubiTestData = JSON.parse(fs.readFileSync('test-musubi-sample.json', 'utf8'));

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

console.log('\n3. Quantum Graph Schema (V, E, i, ρ format):');
const quantumValid = validateQuantum(quantumTestData);
if (quantumValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateQuantum.errors);
}

console.log('\n4. Musubi Graph Schema (F, E, eps, ties format):');
const musubiValid = validateMusubi(musubiTestData);
if (musubiValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateMusubi.errors);
}

console.log('\n=== Validation Complete ===');
