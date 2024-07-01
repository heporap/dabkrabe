<?php
/**
 * Plugin Name:    DabKrabe
 * Description:    Images comparison block with slidebar.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:        1.0.2
 * Author:         Wicker Wings
 * Author URI:     https://wickersings.jp/
 * License:        GPL-2.0-or-later
 * License URI:    https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:    dabkrabe
 *
 * @package        wickerwings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function dabkrabe_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'dabkrabe_block_init' );

/**
 * Registers the project textdomain.
 * `dirname( plugin_basename( __FILE__ ) )` must be used for the project directory to $path.
 */
function dabkrabe_load_textdomain() {
	$text_domain = 'dabkrabe';
	load_plugin_textdomain( $text_domain, false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'dabkrabe_load_textdomain' );

/**
 * Registers assets directory and files.
 * $handle is specified by WordPress.
 * $handle = {$namespace}-{$textdomain}-{target_file_name}-script
 * `plugin_dir_path( __FILE__)` must be used for the project directory to $path
 */
function dabkrabe_editor_assets() {
	$handle      = 'wickerwings-dabkrabe-editor-script';
	$text_domain = 'dabkrabe';
	$path        = plugin_dir_path( __FILE__ ) . 'languages';

	// >= WordPress 5.0
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( $handle, $text_domain, $path );

	}
}
add_action( 'enqueue_block_editor_assets', 'dabkrabe_editor_assets' );

/**
 * Registers the js related files.
 */
function dabkrabe_print_scripts() {
	if ( ! is_admin() ) {
		wp_enqueue_script( 'jquery' );
	}
}
add_action( 'wp_print_scripts', 'dabkrabe_print_scripts' );

/**
 * Utilities
 *
 * @param string $key id of optional paramater.
 * @param string $val value of optional paramater.
 */
function dabkrabe_create_data_attributes( $keys ) {
	$result = '';
	foreach( $keys as $key => $val ){
		$result .= esc_attr( trim( $key ) ) . '=' . esc_attr( $val ) . ';';
	}

	return $result;
}
