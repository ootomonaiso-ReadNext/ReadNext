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

  .left-image-right-text {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  .left-image-right-text img {
    max-width: 45%;
    height: auto;
  }
  .left-image-right-text .text-content {
    max-width: 50%;
    padding-left: 2rem;
  }

---
<!-- class: title-slide -->
# ReadNext
## 蔵書管理用Webサービスの紹介

### https://ootomonaiso-readnext.github.io/ReadNext/
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
- GitHub・Git
- VSCode

いずれも無料で利用できる範囲で構築

---
<!-- class: content-slide -->
# システム構成
![w:20em](sys.png)

---
<!-- class: content-slide -->
# Reactの利点
- バックエンドから独立してサーバーレスで動作する
- 仮想DOMで必要な部分だけ更新するシングルページアプリケーション
- JavaScript・TypeScriptで書ける

---
<!-- class: content-slide -->
# このサイトの寿命
- GitHub保存容量が約5GBを超え
- Firebaseの読み取り回数5万越え
- Firebaseの書き込み・削除回数2万超え
- 2040年11月26日になった瞬間

---
<!-- class: content-slide -->
# ログイン方法
## Firebaseに搭載されているログイン関連実装を利用
- Node.jsにあるFirebaseの拡張機能の関数で実装
- Googleアカウントの場合はGoogleOAuth
- 他のメールアドレスは認証メールによる確認を経てアカウント作成

---
<!-- class: content-slide -->
# OAuthとは
- 認可リクエストを送る
- GoogleやGitHubなどのOAuthプロバイダーにアクセス
- 認証されたら認可コードを返す
- 認可コードからアクセストークンを取りに行く
## データ漏洩リスクは低い

---
<!-- class: content-slide -->
# 書籍の検索
- GoogleBooksAPIは認証不要で戻り値がJsonのため採用
- 一度APIを利用し取得したデータはデータベースに登録
- サムネイル画像はGoogleBooksのリンクを設定

## APIアクセス制限のためにアクセス回数を減らす
## 画像保存を無くしてサーバー容量の削減

---
<!-- class: content-slide -->
# 蔵書関連
- usersテーブルに蔵書を登録するコレクションが存在
- booksテーブルの本IDを蔵書のキーとして保存
- 蔵書の呼び出し時、usersの蔵書を取得後booksに問い合わせ
- 蔵書追加日と状態を保存

---
<!-- class: content-slide -->
# CI/CDの実装
- GitHub Actionsの実行内容と実行フラグを管理するコンフィグ

![w:20em](yamu1.png)

---
<!-- class: content-slide -->
# CI/CDコード解説
- build-and-deployはビルドとデプロイを行う命令
- 実行環境はubuntuの最終環境を利用
![w:20em](yamu2.png)

---
![w:20em](yamu3.png)

---
<!-- class: content-slide -->
# 認証認可システム
<section class="left-image-right-text">
  <img src="app1.png" alt="画像">
  <div class="text-content">
    <ul>
      <li>認証状態が必要かどうかを宣言</li>
      <li>ProtectedRouteタグで認証必要部分を囲う</li>
    </ul>
  </div>
</section>

---
# 認証認可システム -アカウント制御
<section class="left-image-right-text">
  <img src="app2.png" alt="画像">
  <div class="text-content">
    <ul>
      <li>このアプリケーションにアクセスしたら実行されるコード</li>
      <li>認証情報を読み取り、</br>どこへリダイレクトするか判定</li>
      <li>認証情報はAuthContextで取得</li>
    </ul>
  </div>
</section>

---
<!-- class: content-slide -->
# ユーザーデータ
- Firebaseの認証情報にプロバイダとUIDと共に保存
- UIDをもとにユーザーごとドキュメント生成
- 内部にユーザーデータや蔵書データを保存

---
<!-- class: content-slide -->
# Userテーブルの構造

---
<!-- class: content-slide -->
# 