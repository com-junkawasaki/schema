const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true });

// Load schemas from organized folders
const veSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 've', 've-schema.json'), 'utf8'));
const veiSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'vei', 'vei-schema.json'), 'utf8'));
const bipartiteSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'uwi', 'bipartite-graph-schema.json'), 'utf8'));
const quantumSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'spin', 'quantum-graph-schema.json'), 'utf8'));
const engiSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'engi', 'engi-graph-schema.json'), 'utf8'));

// Compile validators
const validateVE = ajv.compile(veSchema);
const validateVEI = ajv.compile(veiSchema);
const validateBipartite = ajv.compile(bipartiteSchema);
const validateQuantum = ajv.compile(quantumSchema);
const validateEngi = ajv.compile(engiSchema);

// Test data
const veTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 've', 'test-ve-sample.json'), 'utf8'));
const veiTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'vei', 'test-vei-sample.json'), 'utf8'));
const bipartiteTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'uwi', 'test-bipartite-sample.json'), 'utf8'));
const quantumTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'spin', 'test-quantum-sample.json'), 'utf8'));
const engiTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'engi', 'test-engi-sample.json'), 'utf8'));

console.log('=== Graph DSL Schema Validation ===\n');

// Validate VE graph schema
console.log('1. VE Graph Schema (v, e, e.ends format):');
const veValid = validateVE(veTestData);
if (veValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateVE.errors);
}

// Validate VEI graph schema
console.log('\n2. VEI Graph Schema (v, e, i format):');
const veiValid = validateVEI(veiTestData);
if (veiValid) {
    console.log('✅ Valid');
} else {
    console.log('❌ Invalid');
    console.log('Errors:', validateVEI.errors);
}

console.log('\n3. Bipartite Graph Schema (u, w, i format):');
const bipartiteValid = validateBipartite(bipartiteTestData);
if (bipartiteValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateBipartite.errors);
}

console.log('\n4. Quantum Graph Schema (V, E, i, ρ format):');
const quantumValid = validateQuantum(quantumTestData);
if (quantumValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateQuantum.errors);
}

console.log('\n5. Engi Graph Schema (node, edge, incidence format):');
const engiValid = validateEngi(engiTestData);
if (engiValid) {
  console.log('✅ Valid');
} else {
  console.log('❌ Invalid');
  console.log('Errors:', validateEngi.errors);
}

console.log('\n=== Validation Complete ===');
