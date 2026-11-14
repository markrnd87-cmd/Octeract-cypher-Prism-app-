import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASIS_ATOMS,
  BOTTOM_ZERO,
  TOP_ONES,
  computeQapCost,
  evaluateScalability,
  gf2Xor,
  hammingDistance,
  hammingWeight,
  latticeComplementNot,
  latticeJoinOr,
  latticeMeetAnd,
  isSubsetOf,
  runOcteractCypher,
  runOptimalConstellationMapping,
  shouldTriggerPivot,
} from './octeractEngine';
import { PRESET_VECTORS } from '../data/presets';

test('Intent Invariant 1: Scalability protocol halts when N > 256 and returns minimal n with 2^n >= N', () => {
  const s65 = evaluateScalability(65);
  assert.equal(s65.halted, false);
  assert.equal(s65.required_dimension_n, 8);
  assert.equal(s65.hypercube_designation, 'Octeract (8-cube)');
  assert.equal(s65.state_space_capacity, 256);

  const s256 = evaluateScalability(256);
  assert.equal(s256.halted, false);
  assert.equal(s256.required_dimension_n, 8);

  const s417 = evaluateScalability(417);
  assert.equal(s417.halted, true);
  assert.equal(s417.required_dimension_n, 9);
  assert.equal(s417.hypercube_designation, 'Enneact (9-cube)');
  assert.equal(s417.state_space_capacity, 512);

  const s600 = evaluateScalability(600);
  assert.equal(s600.halted, true);
  assert.equal(s600.required_dimension_n, 10);
  assert.equal(s600.hypercube_designation, 'Dekeract (10-cube)');
  assert.equal(s600.state_space_capacity, 1024);
});

test('Intent Invariants 2, 3, 4, 5: (F_2)^8 Structural Trinity algebraic & metric laws across all 256 states', () => {
  for (let v = 0; v <= 255; v++) {
    // Invariant 2: Abelian self-inverse & identity
    assert.equal(gf2Xor(v, v), BOTTOM_ZERO);
    assert.equal(gf2Xor(v, BOTTOM_ZERO), v);

    // Boolean lattice bounds
    assert.equal(latticeMeetAnd(v, BOTTOM_ZERO), BOTTOM_ZERO);
    assert.equal(latticeJoinOr(v, TOP_ONES), TOP_ONES);
    assert.equal(isSubsetOf(BOTTOM_ZERO, v), true);
    assert.equal(isSubsetOf(v, TOP_ONES), true);

    // Invariant 4: Antipodal oppositional pair distance == 8
    const comp = latticeComplementNot(v);
    assert.equal(hammingDistance(v, comp), 8);
  }

  // Invariant 3: Hamming distance equals w(a XOR b) and 0 <= d(a,b) <= 8
  for (let a = 0; a < 256; a += 17) {
    for (let b = 0; b < 256; b += 23) {
      const d = hammingDistance(a, b);
      assert.equal(d, hammingWeight(gf2Xor(a, b)));
      assert.ok(d >= 0 && d <= 8);
    }
  }

  // Invariant 5: Generative basis archetypes have length 8 and weight 1
  assert.equal(BASIS_ATOMS.length, 8);
  const uniqueAtoms = new Set(BASIS_ATOMS);
  assert.equal(uniqueAtoms.size, 8);
  for (const atom of BASIS_ATOMS) {
    assert.equal(hammingWeight(atom), 1);
  }
});

test('Intent Invariants 6 & 7: OCM preserves bijection and QAP cost is non-negative & permutation-invariant', () => {
  const linearA = PRESET_VECTORS[0].input;
  const ocm = runOptimalConstellationMapping(
    linearA.signs,
    linearA.similarity_matrix_q1000,
    linearA.sa_seed
  );

  // Bijection check: all N signs assigned to N distinct vertices in 0..255
  const assignedValues = Object.values(ocm.assigned_vectors);
  assert.equal(assignedValues.length, linearA.signs.length);
  const distinctVertices = new Set(assignedValues);
  assert.equal(distinctVertices.size, linearA.signs.length);
  for (const v of assignedValues) {
    assert.ok(v >= 0 && v <= 255);
  }

  // Non-negative QAP cost and optimization improvement or stability
  assert.ok(ocm.initial_qap_cost >= 0);
  assert.ok(ocm.optimized_qap_cost >= 0);
  assert.ok(ocm.optimized_qap_cost <= ocm.initial_qap_cost);

  // Permutation invariance of QAP cost
  const assignArr = [147, 81, 85];
  const sim3 = [
    [1000, 620, 580],
    [620, 1000, 890],
    [580, 890, 1000],
  ];
  const costOriginal = computeQapCost(sim3, assignArr);
  // Permute indices (0, 1, 2) -> (2, 0, 1)
  const perm = [2, 0, 1];
  const assignPerm = perm.map((p) => assignArr[p]);
  const simPerm = perm.map((r) => perm.map((c) => sim3[r][c]));
  const costPermuted = computeQapCost(simPerm, assignPerm);
  assert.equal(costOriginal, costPermuted);
});

test('Intent Invariants 8 & 9: Acceptance Vectors 01 (Linear A), 02 (Indus Halt), 03 (Phaistos Resonance)', () => {
  // Vector 01: Linear A
  const out01 = runOcteractCypher(PRESET_VECTORS[0].input);
  assert.equal(out01.scalability.halted, false);
  assert.equal(out01.inferred_script_typology, 'Syllabary');
  assert.equal(out01.recommended_pathway, 'ConstrainedLinguisticHypothesis');
  assert.ok(out01.ocm !== undefined);
  assert.ok(out01.propagated_constraints['AB_77_KA'] !== undefined);
  assert.equal(out01.model_commitment_blake3.length, 64);

  // Vector 02: Indus Scalability Halt
  const out02 = runOcteractCypher(PRESET_VECTORS[1].input);
  assert.equal(out02.scalability.halted, true);
  assert.equal(out02.scalability.required_dimension_n, 9);
  assert.equal(out02.scalability.hypercube_designation, 'Enneact (9-cube)');
  assert.equal(out02.recommended_pathway, 'ScaleToHigherDimensionalHypercube');
  assert.equal(out02.ocm, undefined);

  // Vector 03: Phaistos Disk Non-Linguistic Structural Resonance
  const out03 = runOcteractCypher(PRESET_VECTORS[2].input);
  assert.equal(shouldTriggerPivot(PRESET_VECTORS[2].input.triggers), true);
  assert.equal(out03.scalability.halted, false);
  assert.equal(out03.inferred_script_typology, 'Non-Linguistic / Structural System');
  assert.equal(out03.recommended_pathway, 'NonLinguisticStructuralResonance');
  assert.ok(out03.structural_resonance_matches.length >= 1);
  assert.equal(out03.structural_resonance_matches[0].canonical_octeract_value, 256);
});
