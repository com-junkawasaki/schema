# Graph DSL JSON Schemas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schemas for four graph DSL formats designed for efficient graph representation and validation.

このリポジトリには、5種類のグラフDSL形式に対するJSON Schemaが含まれています。

## スキーマ一覧

### 1. VEグラフDSL Schema (`ve/ve-schema.json`)
- **形式**: `v, e, e.ends` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `v`: 頂点集合（`part` で多部を表現可能）
  - `e`: エッジ集合（`ends` に端点列を直持ち）
  - ハイパーエッジ（3つ以上の端点）に対応
  - 拡張属性（`attrs`）でばね、重みなどを表現

### 2. VEIグラフDSL Schema (`vei/vei-schema.json`)
- **形式**: `v, e, i` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `v`: 頂点集合
  - `e`: エッジ集合
  - `i`: インシデンスリスト（頂点とエッジの接続を定義）
  - `ends` の冗長性を排除

### 3. 二部グラフDSL Schema (`uwi/bipartite-graph-schema.json`)
- **形式**: `u, w, i` を使用
- **対象**: 二部グラフ専用（糖衣構文）
- **特徴**:
  - `u`: 左側頂点集合
  - `w`: 右側頂点集合
  - `i`: インシデンスリスト（U-W間の接続）
  - LLMに優しい短いキー名

### 4. 量子グラフDSL Schema (`spin/quantum-graph-schema.json`)
- **形式**: `V, E, i, ρ` を使用
- **対象**: 量子スピンネットワーク（QG: Quantum Graph）
- **特徴**:
  - `V`: 体積量子頂点（リンクによって定義されるノード）
  - `E`: 面積・接続性を決めるリンク（エッジ）
  - `i`: インシデデンス/インデックス写像
  - `ρ`: 密度/状態パラメータ
  - SU(2)ラベル付（スピン量子数）
  - プロセス代数構造 `(E,≤,#)` でイベント・通信・同期を表現

### 5. 結びグラフDSL Schema (`musubi/musubi-graph-schema.json`)
- **形式**: `F, E, eps, ties` を使用
- **対象**: 結び正規形（musubi-model: 結びを一次、点を二次として導出）
- **特徴**:
  - `F`: フラグ集合（半辺・一次要素）
  - `E`: エッジ識別集合
  - `eps`: インシデンス関数 ε: F→E（どのフラグがどのエッジに属すか）
  - `ties`: 同値関係生成元（同じ場で結ばれるフラグ群）
  - **ノードは導出**: N = F/∼（同値類）
  - **関手的構成**: 射・合成が圏論的に美しく定義
  - 検証律：非退化・局所有限・閉包性

## 使用方法

### 検証スクリプト
```bash
npm install
npm run validate          # 全スキーマ検証
npm run validate-musubi   # musubiモデル専用検証（導出付き）
```

### スキーマの特徴

#### VE形式の例
```json
{
  "v": [
    { "id": 0, "part": 0 },
    { "id": 1, "part": 1 },
    { "id": 2, "part": 1 },
    { "id": 3 }
  ],
  "e": [
    { "id": 0, "ends": [0, 1], "attrs": { "spring": { "k": 20, "rest": 30 }, "weight": 1 } },
    { "id": 1, "ends": [1, 2], "attrs": { "weight": 2 } },
    { "id": 2, "ends": [0, 2, 3], "attrs": { "type": "hyper", "weight": 1 } }
  ],
  "meta": {
    "schema": 1,
    "directed": false,
    "units": { "pos": "world", "radius": "px" }
  }
}
```

#### VEI形式の例
```json
{
  "v": [
    { "id": 0, "part": 0 },
    { "id": 1, "part": 1 },
    { "id": 2, "part": 1 },
    { "id": 3 }
  ],
  "e": [
    { "id": 0, "attrs": { "spring": { "k": 20, "rest": 30 }, "weight": 1 } },
    { "id": 1, "attrs": { "weight": 2 } },
    { "id": 2, "attrs": { "type": "hyper", "weight": 1 } }
  ],
  "i": [
    { "v": 0, "e": 0 },
    { "v": 1, "e": 0 },
    { "v": 1, "e": 1 },
    { "v": 2, "e": 1 },
    { "v": 0, "e": 2 },
    { "v": 2, "e": 2 },
    { "v": 3, "e": 2 }
  ],
  "meta": {
    "schema": 1,
    "directed": false,
    "units": { "pos": "world", "radius": "px" }
  }
}
```

#### 二部グラフ形式の例
```json
{
  "u": [
    { "id": 0 },
    { "id": 1 }
  ],
  "w": [
    { "id": 0 },
    { "id": 1 },
    { "id": 2 }
  ],
  "i": [
    { "u": 0, "w": 1, "spring": { "k": 20, "rest": 30 }, "weight": 1 },
    { "u": 1, "w": 2, "weight": 2 }
  ],
  "meta": {
    "schema": 1,
    "directed": false
  }
}
```

#### 量子グラフ形式の例
```json
{
  "V": [
    {
      "id": 0,
      "volume": 1.0,
      "su2_label": { "j": 0.5, "m": 0.5 }
    },
    {
      "id": 1,
      "volume": 1.5,
      "su2_label": { "j": 1.0, "m": 0.0 }
    }
  ],
  "E": [
    {
      "id": 0,
      "ends": [0, 1],
      "area": 4.0,
      "su2_label": { "j": 0.5, "m": 0.0 },
      "connectivity": 1.0
    }
  ],
  "i": [
    { "vertex_id": 0, "edge_id": 0, "incidence": 1 },
    { "vertex_id": 1, "edge_id": 0, "incidence": -1 }
  ],
  "ρ": {
    "value": 0.75,
    "type": "energy"
  },
  "process_algebra": {
    "events": [
      {
        "id": "evt_0",
        "timestamp": 0.0,
        "type": "communication",
        "payload": { "message": "spin_flip", "target": 1 }
      }
    ],
    "ordering": [],
    "communication_channels": [
      {
        "id": "chan_01",
        "type": "synchronous",
        "capacity": 0,
        "participants": ["evt_0"]
      }
    ]
  },
  "meta": {
    "schema": 1,
    "quantum_type": "spin_network",
    "topology": "loop",
    "units": {
      "area": "ℏ",
      "volume": "ℏ²",
      "spin": "ℏ/2"
    }
  }
}
```

#### 結びグラフ形式の例
```json
{
  "F": 12,
  "E": 5,
  "eps": [0,0,1,1,1,2,2,3,3,4,4,4],
  "ties": [
    [0,5],
    [1,7],
    [2,3],
    [9,10]
  ],
  "w": [
    {"e": 0, "val": 1.0, "type": "spring", "k": 20.0, "rest": 30.0},
    {"e": 1, "val": 2.0, "type": "weight"}
  ],
  "meta": {
    "schema": 1,
    "oriented": false,
    "name": "musubi_triangle",
    "semiring": "R",
    "description": "Triangle with derived nodes from equivalence classes"
  }
}
```

## 設計原則

### 共通原則
- **IDは整数連番**: 配列は昇順（カノニカル順）
- **自由文ラベルは別オブジェクト**: `labels: { "0":"A", ... }` で分離
- **既定値は補正しない**: 破ればエラー（再現性担保）
- **拡張性**: `additionalProperties: true` で柔軟な属性追加を許可

### Musubiモデル特有原則
- **結びを一次、点を二次**: 関係（ties/eps）を保存し、点を導出（N = F/∼）
- **関手的構成**: 射・合成が圏論的に自然変換として振る舞う
- **検証律**: 非退化・局所有限・同値閉包性を厳格に検証（loud fail）
- **正規形JSON**: 短キー・反復・順序規約でLLMに最適化
- **導出主義**: 隣接・座標・幾何は全て結びから導出（キャッシュ禁止）

## 相互変換

### 二部グラフ → 汎用グラフ
二部グラフ形式はローダで機械的に汎用形式へ変換可能:
- `u.id -> v[id].part=0`
- `w.id -> v[id].part=1`
- `i:{u,w} -> e:{ends:[u,w]}`

### Musubiモデル導出アルゴリズム
結び正規形からノード・隣接・幾何を導出:
1. **Union-Find**: `ties`から同値関係 ∼ を閉包
2. **商集合**: N = F/∼（代表配列 `rep[f]`）
3. **インシデンス**: ι(e) = {rep[f] | ε(f)=e}
4. **隣接行列**: A = Σ_{e} Σ_{i,j⊂ι(e)} w_e (e_i e_j^T + e_j e_i^T)
5. **ラプラシアン**: L = Σ_e w_e b_e b_e^T（境界行列 b_e）
6. **幾何**: 座標・距離はエネルギー最小化で決定論的導出

### 圏論的射
射 h: ℳ→ℳ' は:
- h_F: F→F', h_E: E→E'（関数）
- ε' ∘ h_F = h_E ∘ ε（自然性）
- f∼g ⇒ h_F(f)∼' h_F(g)（同値保存）
- N(h) は関手的（商の普遍性）

## Musubiモデルの理論的背景

### 「結びを一次、点を二次」の思想
- **一次要素**: フラグ(F)・エッジ(E)・同値関係(∼)・インシデンス(ε)
- **二次要素**: ノード(N=F/∼)・隣接(A)・ラプラシアン(L)・幾何(X)
- **導出主義**: 全ての構造を関係から決定論的に導出

### 公理的基礎
[
\mathcal{M}=(F,E,\varepsilon,\sim)
]
が結び正規形であるための条件:
1. F,E は有限集合
2. ε: F→E は全射
3. ∼⊆F×F は同値関係
4. 非退化: ∀e∈E, |ι(e)|≥1
5. 局所有限: ∀[f]∈N, #{e|[f]∈ι(e)}<∞

### 関手的構成
- **対象**: 結び正規形 ℳ
- **射**: h=(h_F,h_E) で ε'∘h_F = h_E∘ε かつ ∼保存
- **関手**: N(-), ι(-), A(-), L(-) は全て関手的

### エネルギー基盤動力学
エネルギー E は**必ず結びを経由**:
- ばね: Σ_e Σ_{i,j⊂ι(e)} k_e(|x_i-x_j|-ℓ_e)²
- 反発: 密度/代表点依存 BH(ι,x)
- 積分: semi-implicit Euler + softening + damping + seed

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
