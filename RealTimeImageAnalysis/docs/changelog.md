# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)  
This project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- `index.md` に「Changelog へのリンク」を追加 (@Isurugi, 2025-05-16)
- `design_overview.md` の非機能要件を HLD セクションへ分離 (@Isurugi, 2025-05-16)

### Added

- `ops_guide.md` に「バックアップ・リストア手順」を追加

### Fixed

- `index.md`
  - リンク遷移先をチェック (@Isurugi, 2025-05-16)
- `design_overview.md`
  - 非機能要件の TLS バージョンを 1.2+に修正 (@Isurugi, 2025-05-16)
  - UX 要件を「WCAG 2.1 AA」に変更(@Isurugi, 2025-05-16)
  - シーケンス図の矢印向きの誤りを修正
- `ci_cd_design.md`
  - 1.4 各ステップ詳細の単体テストの使用ツール／アクションを`gradle test`に変更(@Isurugi, 2025-05-16)
- `security_design.md`

  - 認証フロー図のヘッダの OAuth0 の誤記修正(@Isurugi, 2025-05-17)

## [1.0.0] – 2025-05-07

### Added

- プロジェクト設計書テンプレート一式公開
