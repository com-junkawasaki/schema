# Graph DSL JSON Schemas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schemas for two graph DSL formats designed for efficient graph representation and validation.

このリポジトリには、2種類のグラフDSL形式に対するJSON Schemaが含まれています。

## スキーマ一覧

### 1. 汎用グラフDSL Schema (`general-graph-schema.json`)
- **形式**: `v, e, ends` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `v`: 頂点集合（`part` で多部を表現可能）
  - `e`: エッジ集合（`ends` に端点列を直持ち）
  - ハイパーエッジ（3つ以上の端点）に対応
  - 拡張属性（`attrs`）でばね、重みなどを表現

### 2. 二部グラフDSL Schema (`bipartite-graph-schema.json`)
- **形式**: `u, w, i` を使用
- **対象**: 二部グラフ専用（糖衣構文）
- **特徴**:
  - `u`: 左側頂点集合
  - `w`: 右側頂点集合
  - `i`: インシデンスリスト（U-W間の接続）
  - LLMに優しい短いキー名

## 使用方法

### 検証スクリプト
```bash
npm install
npm run validate
```

### スキーマの特徴

#### 汎用形式の例
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

## 設計原則

- **IDは整数連番**: 配列は昇順（カノニカル順）
- **自由文ラベルは別オブジェクト**: `labels: { "0":"A", ... }` で分離
- **既定値は補正しない**: 破ればエラー（再現性担保）
- **拡張性**: `additionalProperties: true` で柔軟な属性追加を許可

## 相互変換

二部グラフ形式はローダで機械的に汎用形式へ変換可能:
- `u.id -> v[id].part=0`
- `w.id -> v[id].part=1`
- `i:{u,w} -> e:{ends:[u,w]}`

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
