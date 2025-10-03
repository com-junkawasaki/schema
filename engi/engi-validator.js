// Engi Graph Validator - 検証律の実装
// 「結びを一次、点を二次」モデルの厳格な検証

class UnionFind {
  constructor(size) {
    this.parent = Array.from({length: size}, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }
}

class EngiValidator {
  constructor(data) {
    this.data = data;
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    this.errors = [];
    this.warnings = [];

    try {
      this.validateStructure();
      this.validateEquivalenceRelation();
      this.validateIncidence();
      this.validateNonDegenerate();
      this.validateLocallyFinite();
      this.validateWeights();

      return {
        valid: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings,
        derived: this.deriveProperties()
      };
    } catch (error) {
      this.errors.push(`Validation error: ${error.message}`);
      return {
        valid: false,
        errors: this.errors,
        warnings: this.warnings,
        derived: null
      };
    }
  }

  validateStructure() {
    const { F, E, eps, ties } = this.data;

    // F, E are non-negative integers
    if (!Number.isInteger(F) || F < 0) {
      this.errors.push(`F must be non-negative integer, got ${F}`);
    }
    if (!Number.isInteger(E) || E < 0) {
      this.errors.push(`E must be non-negative integer, got ${E}`);
    }

    // eps is array of length F with values in 0..E-1
    if (!Array.isArray(eps)) {
      this.errors.push('eps must be an array');
    } else {
      if (eps.length !== F) {
        this.errors.push(`eps length (${eps.length}) must equal F (${F})`);
      }
      for (let i = 0; i < eps.length; i++) {
        const val = eps[i];
        if (!Number.isInteger(val) || val < 0 || val >= E) {
          this.errors.push(`eps[${i}] = ${val} must be in range [0, ${E-1}]`);
        }
      }
    }

    // ties is array of [f1,f2] pairs with f1 < f2
    if (!Array.isArray(ties)) {
      this.errors.push('ties must be an array');
    } else {
      for (let i = 0; i < ties.length; i++) {
        const tie = ties[i];
        if (!Array.isArray(tie) || tie.length !== 2) {
          this.errors.push(`ties[${i}] must be [f1,f2] pair`);
        } else {
          const [f1, f2] = tie;
          if (!Number.isInteger(f1) || f1 < 0 || f1 >= F) {
            this.errors.push(`ties[${i}][0] = ${f1} must be in range [0, ${F-1}]`);
          }
          if (!Number.isInteger(f2) || f2 < 0 || f2 >= F) {
            this.errors.push(`ties[${i}][1] = ${f2} must be in range [0, ${F-1}]`);
          }
          if (f1 >= f2) {
            this.errors.push(`ties[${i}] must have f1 < f2, got [${f1},${f2}]`);
          }
        }
      }
    }
  }

  validateEquivalenceRelation() {
    const { F, ties } = this.data;

    // Build equivalence relation using Union-Find
    const uf = new UnionFind(F);
    for (const [f1, f2] of ties) {
      uf.union(f1, f2);
    }

    // Check reflexivity, symmetry, transitivity (Union-Find guarantees this)
    // Additional check: all ties are consistent
    const expectedTies = new Set();
    for (let i = 0; i < F; i++) {
      for (let j = i + 1; j < F; j++) {
        if (uf.find(i) === uf.find(j)) {
          expectedTies.add(`${i}-${j}`);
        }
      }
    }

    const actualTies = new Set(ties.map(([f1, f2]) => `${f1}-${f2}`));
    const missingTies = [...expectedTies].filter(t => !actualTies.has(t));
    const extraTies = [...actualTies].filter(t => !expectedTies.has(t));

    if (missingTies.length > 0) {
      this.errors.push(`Missing ties for transitivity: ${missingTies.join(', ')}`);
    }
    if (extraTies.length > 0) {
      this.errors.push(`Extra/inconsistent ties: ${extraTies.join(', ')}`);
    }
  }

  validateIncidence() {
    const { F, E, eps } = this.data;

    // ε: F → E is a function (already checked by structure validation)
    // Check if it's surjective (each edge has at least one flag)
    const image = new Set(eps);
    if (image.size !== E) {
      const missing = [];
      for (let e = 0; e < E; e++) {
        if (!image.has(e)) missing.push(e);
      }
      this.errors.push(`ε is not surjective, missing edges: ${missing.join(', ')}`);
    }
  }

  validateNonDegenerate() {
    const { E, eps } = this.data;

    // For each e ∈ E, |ι(e)| ≥ 1 (already checked by surjectivity)
    // ι(e) = {rep[f] | ε(f) = e} will be computed in deriveProperties
    // For now, just check that each edge appears at least once
    const edgeCounts = {};
    for (const e of eps) {
      edgeCounts[e] = (edgeCounts[e] || 0) + 1;
    }

    for (let e = 0; e < E; e++) {
      if (!edgeCounts[e]) {
        this.errors.push(`Edge ${e} has no flags (non-degenerate condition failed)`);
      }
    }
  }

  validateLocallyFinite() {
    // This would require computing ι(e) for each equivalence class
    // For now, assume it's satisfied if structure is valid
    // In a full implementation, check that each node has finite degree
    this.warnings.push('Locally finite check: assumed satisfied');
  }

  validateWeights() {
    const { E, w } = this.data;

    if (!Array.isArray(w)) return;

    const edgeIds = new Set();
    for (const weight of w) {
      if (typeof weight !== 'object' || weight === null) {
        this.errors.push('Weight must be an object');
        continue;
      }

      const { e } = weight;
      if (!Number.isInteger(e) || e < 0 || e >= E) {
        this.errors.push(`Weight edge ${e} out of range [0, ${E-1}]`);
      }

      if (edgeIds.has(e)) {
        this.warnings.push(`Duplicate weight for edge ${e}`);
      }
      edgeIds.add(e);
    }
  }

  deriveProperties() {
    const { F, E, eps, ties } = this.data;

    // 1. Union-Find to get equivalence classes
    const uf = new UnionFind(F);
    for (const [f1, f2] of ties) {
      uf.union(f1, f2);
    }

    // Representative array: rep[f] = representative of f's class
    const rep = Array.from({length: F}, (_, i) => uf.find(i));

    // Number of nodes N = number of distinct representatives
    const nodeSet = new Set(rep);
    const N = nodeSet.size;

    // Node id mapping: nodeId[rep] = sequential node id
    const nodeId = {};
    let nextId = 0;
    for (const r of nodeSet) {
      nodeId[r] = nextId++;
    }

    // 2. Incidence ι(e) = {nodeId[rep[f]] | ε(f) = e}
    const iota = Array.from({length: E}, () => new Set());
    for (let f = 0; f < F; f++) {
      const e = eps[f];
      const node = nodeId[rep[f]];
      iota[e].add(node);
    }

    // Convert sets to arrays for JSON serialization
    const iotaArrays = iota.map(set => Array.from(set).sort((a,b) => a-b));

    // 3. Basic adjacency (simplified - full implementation would build sparse matrices)
    const adjacency = {};
    for (let e = 0; e < E; e++) {
      const nodes = iotaArrays[e];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i], n2 = nodes[j];
          const key = `${Math.min(n1,n2)}-${Math.max(n1,n2)}`;
          adjacency[key] = (adjacency[key] || 0) + 1;
        }
      }
    }

    return {
      N,
      rep,
      nodeId: Object.fromEntries(Object.entries(nodeId)),
      iota: iotaArrays,
      adjacency
    };
  }
}

// CLI usage
if (require.main === module) {
  const fs = require('fs');

  if (process.argv.length < 3) {
    console.log('Usage: node engi-validator.js <engi-file.json>');
    process.exit(1);
  }

  const filename = process.argv[2];
  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const validator = new EngiValidator(data);
    const result = validator.validate();

    console.log('=== Engi Graph Validation ===');
    console.log(`Valid: ${result.valid ? '✅' : '❌'}`);

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => console.log(`❌ ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach(warning => console.log(`⚠️  ${warning}`));
    }

    if (result.valid && result.derived) {
      console.log('\nDerived Properties:');
      console.log(`- Number of nodes (N): ${result.derived.N}`);
      console.log(`- Incidence ι(e):`, result.derived.iota);
      console.log(`- Basic adjacency:`, result.derived.adjacency);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { EngiValidator };
