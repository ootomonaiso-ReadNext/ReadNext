---
marp: true
theme: default
style: |
  section {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f4f4;
    color: #333;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;
    box-sizing: border-box;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    margin-bottom: 1rem;
    color: #1976d2;
    border-bottom: 2px solid #1976d2;
    padding-bottom: 0.5rem;
    width: 100%;
  }
  p, li {
    font-size: 1.2rem;
    line-height: 1.6;
  }
  section.title-slide {
    text-align: center;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 255, 255);
    color: #1976d2;
  }
  .title-slide h1 {
    border-bottom: none;
    text-align: center;
    width: auto;
    color: #1976d2;
  }
  .title-slide h2 {
    font-size: 1.8rem;
    color: #1976d2;
    margin-top: 1rem;
  }
  section.content-slide {
    background-color: rgb(255, 255, 255);
  }
---

<!-- class: title-slide -->
# ReadNext
## 蔵書管理用Webサービスの紹介

---

<!-- class: content-slide -->
# ReadNextの機能

- 蔵書の登録
- 感想の投稿
- 書籍検索

---
<!-- class: content-slide -->
# 利用技術
- データベース: Firebase Firestore Database
- デプロイ先: GitHubActionsでビルドGitHubPagesにデプロイ
- 書籍情報取得: GoogleBooksAPI

いずれも無料で利用できる範囲で構築

---
<!-- class: content-slide -->
# ログイン方法
 

---

