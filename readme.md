=== Wicker Wings DabKrabe - Before After Image Comparison Block ===
Contributors:      dab
Author:            Wataru Kanzaki
Author URL:        https://wickerwings.jp/
Donate link:       https://paypal.me/wickerwings
Tags:              image, photo, before after, compare
Requires at least: 6.1
Requires PHP:      7.4
Tested up to:      6.5.2
Stable tag:        1.0.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Compare Images with slidebar.

== Description ==

You can easily create a block that allows visitors to compare and view two images using a slide bar. You can view it in fullscreen and see a larger image for comparison.

[See Demos](https://wickerwings.jp/)

= Feature =

* Image display size can be specified
* Changing the slider movement direction vertically and horizontally
* Edit border style
* Edit slidebar color
* Fill in the captions
* Fill in the description
* Fullscreen display

= Notes =

* Editing slidebar color is not supported on WordPress 6.1
* If the browser does not support fullscreen, the image will be displayed in the full window. At that time, a fixed menu specific to the WordPress theme may be displayed.

== Usage ==

- Choose the left and right images from the image select buttons.
- You can change preview mode and edit mode from the icon on the editing toolbar.
- Some styles while editing are only applied in the preview mode.

== How to build ==

1. % npm install
2. % npm run build
3. % npm run plugin-zip

== Installation ==

1. Upload the folder 'dabkrabe' to your plugin directory, or upload the plugin zip file through the WordPress plugins screen, upload from.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Is it responsive? =

Sure, it is responsive.

= Is it able to be fullscreen? =

Yes. Check "Enable Fullscreen" in the toolsbar.
When you enter preview mode on the editing screen or display the public page, an icon to change fullscreen will be displayed. Tap or click the icon to change fullscreen.

In some environments, the window is displayed to fill the entire window to simulate a full screen.
Menus that depend on the Wordpress Theme may be displayed.

= What do the blocks look like if I disable or uninstall the plugin? =

Display images, captions and descriptions side by side, like "Media & Text".
Some settings are not saved in the HTML code.

**Note** If you convert it to HTML code, you will not be able to edit it again with the visual editor.

== Changelog ==

= 1.0 =
* Release

== Upgrade Notice ==
