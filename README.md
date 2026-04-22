# SIGC Golf Attendants — Netlify デプロイ手順

## フォルダ構成
```
sigc-site/
├── index.html          ← メインページ
├── attendants.json     ← キャディーデータ
├── netlify.toml        ← Netlify設定
└── photos/
    ├── 200.jpg
    ├── 201.jpg
    └── ... (120枚)
```

## Netlifyへのデプロイ（3ステップ）

### ① Netlifyアカウント作成
https://app.netlify.com にアクセスして無料アカウントを作成

### ② ドラッグ＆ドロップでデプロイ
1. https://app.netlify.com/drop を開く
2. このフォルダ（`sigc-site`）をまるごとドラッグ＆ドロップ
3. 数秒でURLが発行されます！

### ③ （任意）カスタムドメイン設定
Netlifyのダッシュボードから独自ドメインを設定できます。

---

## 管理者パスワード変更

`index.html` の先頭付近にある以下の行を変更してください：

```javascript
const ADMIN_PASSWORD = 'sigc2026'   // ← ここを変更
```

変更後は再度Netlifyにドラッグ＆ドロップしてください。

---

## 機能一覧
- 🔍 名前・番号で検索
- 📂 ステータスでフィルター（アクティブ / ON LEAVE / COMING SOON）
- 🔒 管理者ログイン（パスワード: `sigc2026`）
- ✏️ ブラウザでON LEAVE / COMING SOONを変更（ローカル保存）
