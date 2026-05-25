# Muscle Tracker 💪

筋トレワークアウト記録アプリ。トレーニングの種目・重量・レップ数を記録し、自分のトレーニング履歴を管理できる。

## 技術スタック

### フロントエンド
- Angular 19
- TypeScript
- Angular Router / FormsModule / HttpClient

### バックエンド
- Node.js
- Express 5
- TypeScript
- TypeORM

### データベース
- PostgreSQL 16

### 認証
- bcrypt（パスワードハッシュ化）
- jsonwebtoken（JWT認証）

### 開発環境
- Docker / Docker Compose
- WSL2

## 機能一覧

### 実装済み
- ユーザー登録・ログイン（JWT認証）
- 部位マスタ管理（胸・背中・肩・腕・脚・腹）
- 種目マスタ管理（15種目 + カスタム種目追加）
- ワークアウト記録（作成・一覧・詳細・削除）
- 種目追加・削除
- セット記録（追加・編集・削除）

### 今後の予定
- PR（自己ベスト）自動検出
- 1RM推定計算
- ボリューム推移グラフ
- 履歴カレンダー表示
- AuthGuard / HttpInterceptor
- AWS デプロイ（ECS Fargate / RDS / S3 + CloudFront）

## プロジェクト構成

```
muscle-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # DB接続設定
│   │   ├── entities/       # TypeORM Entity（6テーブル）
│   │   ├── middlewares/     # 認証ミドルウェア
│   │   ├── routes/          # APIエンドポイント
│   │   └── services/       # ビジネスロジック
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       └── pages/
│   │           ├── home/             # ホーム画面
│   │           ├── login/            # ログイン画面
│   │           ├── register/         # 新規登録画面
│   │           └── workout-detail/   # ワークアウト詳細画面
│   ├── package.json
│   └── angular.json
└── docker-compose.yml
```

## API エンドポイント

### 認証
| Method | URL | 説明 |
|--------|-----|------|
| POST | /api/auth/register | ユーザー登録 |
| POST | /api/auth/login | ログイン |

### 部位マスタ
| Method | URL | 説明 |
|--------|-----|------|
| GET | /api/muscle-groups | 部位一覧取得 |

### 種目マスタ
| Method | URL | 説明 |
|--------|-----|------|
| GET | /api/exercises | 種目一覧取得 |
| GET | /api/exercises/muscle-group/:id | 部位別種目取得 |
| POST | /api/exercises | カスタム種目追加（要認証） |

### ワークアウト
| Method | URL | 説明 |
|--------|-----|------|
| POST | /api/workouts | ワークアウト作成 |
| GET | /api/workouts | 一覧取得 |
| GET | /api/workouts/:id | 詳細取得 |
| DELETE | /api/workouts/:id | ワークアウト削除 |
| POST | /api/workouts/:id/exercises | 種目追加 |
| DELETE | /api/workouts/:id/exercises/:exerciseId | 種目削除 |
| POST | /api/workouts/:id/exercises/:exerciseId/sets | セット追加 |
| PUT | /api/workouts/:id/exercises/:exerciseId/sets/:setId | セット編集 |
| DELETE | /api/workouts/:id/exercises/:exerciseId/sets/:setId | セット削除 |

## ER図

```
users (1) ─── (N) workouts (1) ─── (N) workout_exercises (1) ─── (N) workout_sets
                                              │
                                              └── (N:1) exercises (N:1) ─── muscle_groups
```

## セットアップ

### 前提条件
- Docker Desktop
- Node.js v20+
- WSL2（Windows）

### 起動手順

```bash
# リポジトリをクローン
git clone https://github.com/t-kouchi599/muscle-tracker.git
cd muscle-tracker

# Docker起動（PostgreSQL + Express API）
docker compose up -d

# フロントエンド起動
cd frontend
npm install
npx ng serve
```

- フロントエンド: http://localhost:4200
- API: http://localhost:3000
- PostgreSQL: localhost:5433
