# Graph DSL JSON Schemas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schemas for four graph DSL formats designed for efficient graph representation and validation.

このリポジトリには、4種類のグラフDSL形式に対するJSON Schemaが含まれています。

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

### 5. ENGIグラフDSL Schema (`engi/engi-graph-schema.json`)
- **形式**: `node, edge, incidence` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `node`: ノード集合
  - `edge`: エッジ集合
  - `incidence`: インシデンスリスト（ノードとエッジの接続を定義）

## 使用方法

### 検証スクリプト
```bash
npm install
npm run validate          # 全スキーマ検証
```

### スキーマの特徴

#### VE形式の例
```json
{
  "node": [
    { "id": 0, "part": 0 },
    { "id": 1, "part": 1 },
    { "id": 2, "part": 1 },
    { "id": 3 }
  ],
  "edge": [
    { "id": 0, "attrs": { "spring": { "k": 20, "rest": 30 }, "weight": 1 } },
    { "id": 1, "attrs": { "weight": 2 } },
    { "id": 2, "attrs": { "type": "hyper", "weight": 1 } }
  ],
  "incidence": [
    { "node": 0, "edge": 0 },
    { "node": 1, "edge": 0 },
    { "node": 1, "edge": 1 },
    { "node": 2, "edge": 1 },
    { "node": 0, "edge": 2 },
    { "node": 2, "edge": 2 },
    { "node": 3, "edge": 2 }
  ],
  "meta": {
    "schema": 1,
    "directed": false,
    "units": { "pos": "world", "radius": "px" }
  }
}
```

## 設計原則

### 共通原則
- **IDは整数連番**: 配列は昇順（カノニカル順）
- **自由文ラベルは別オブジェクト**: `labels: { "0":"A", ... }` で分離
- **既定値は補正しない**: 破ればエラー（再現性担保）
- **拡張性**: `additionalProperties: true` で柔軟な属性追加を許可

## 相互変換

### 二部グラフ → 汎用グラフ
二部グラフ形式はローダで機械的に汎用形式へ変換可能:
- `u.id -> v[id].part=0`
- `w.id -> v[id].part=1`
- `i:{u,w} -> e:{ends:[u,w]}`

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
