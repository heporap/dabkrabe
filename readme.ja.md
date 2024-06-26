=== Wicker Wings DabKrabe - Before After Image Comparison Block ===
Contributors:      dab
Author:            Wataru Kanzaki
Author URL:        https://wickerwings.jp/
Donate link:       https://paypal.me/wickerwings
Tags:              image, photo, before after, compare, comparison
Requires at least: 6.1
Requires PHP:      7.4
Tested up to:      6.5.2
Stable tag:        1.0.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

スライドバーで画像を比較するボックス。

== 説明 ==

スライドバーを使用して２枚の画像を比較閲覧できるブロックを簡単に作成できます。フルスクリーン表示にして大きな画像で比較してもらうことができます。

**[デモページ](https://wickerwings.jp/)**

= 特長 =

* 画像表示サイズ指定
* スライダー移動方向の縦横の変更
* ボーダースタイル編集
* スライドバーの色を変更
* キャプション記入
* 説明文の記入
* フルスクリーン表示

= 注意点 =

* スライドバーの色を変更する機能は、**WordPress 6.1でサポートされません**。
* フルスクリーン非対応のブラウザではウインドウいっぱいに表示します。その際、WordPressテーマ固有の表示位置固定メニューが表示されることがあります。

== 使い方 ==

* 画像選択ボタンから左、右それぞれの画像を選択、またはアップロードします。
* 編集ツールバーのアイコンにて、プレビューモードと編集モードを変更できます。
* 画像の選び直しや画像キャプションの記入は編集モードで行なってください。

編集中の一部のスタイルはプレビューモードにのみ適用されます。

== ビルド手順 ==

1. % npm install
2. % npm run build
3. % npm run plugin-zip

== インストール ==

1. dabkrabeフォルダーをプラグインディレクトリにアップロード、またはWordpressプラグイン画面のプラグインアップロードフォームからzipファイルをアップロードする。
2. Wordpressプラグイン画面でプラグインを有効化する。

== Q and A ==

= レスポンシブですか？ =

はい。レスポンシブウェブデザインに対応しています。

= フルスクリーンで表示することはできますか？ =

ツールメニューの "フルスクリーン" にチェックを入れてください。
編集画面でプレビューモードにするか、公開ページを表示するとフルスクリーンにするためのアイコンが表示されますので、そのアイコンをタップ、またはクリックするとフルスクリーンになります。
フルスクリーンモードをサポートする場合は、FHD画質以上の画像を推奨します。

一部の環境ではウインドウいっぱいに表示することで、擬似的にフルスクリーンを表現しています。その際、Wordpressテーマに由来するメニューなどが表示されることがあります。

= 無効化、またはアンインストールすると、ブロックはどのように表示されますか？ =

"メディアとテキスト" のように、画像とキャプション、ディスクリプションを並べて表示します。一部の設定はHTMLコードに保存されません。
HTMLコードに変換するとビジュアルエディタで再編集できなくなります。

== Changelog ==

= 1.0 =
* Release

== Upgrade Notice ==
