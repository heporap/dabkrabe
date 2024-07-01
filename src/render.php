<?php
/**
 * Output the HTML.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package wickerwings
 */

?>
<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Border style of the block.
 */
$border_style = '';
if ( ! empty( $attributes['style'] ) ) {
	$border_getstyle = wp_style_engine_get_styles( $attributes['style'], array( 'convert_vars_to_classnames' => false ) );
	$border_style    = $border_getstyle['css'];
}

/**
 * Separator style
 */
$sep_style  = ( ! empty( $attributes['sepColor'] ) ) ? 'background-color:' . $attributes['sepColor'] . ';' : '';
$sep_style .= ( ! empty( $attributes['sepBorder'] ) ) ? 'border-color:' . $attributes['sepBorder'] . ';' : '';
$nib_color  = ( ! empty( $attributes['nibColor'] ) ) ? $attributes['nibColor'] : '#ffffff';

/**
 * Create description element from inner_blocks.
 */
$desc_classname     = '';
$desc_content       = '';
$vertical_classname = '';

$inner_blocks = $block->inner_blocks;
$item_count   = ( ! empty( $inner_blocks ) ) ? $inner_blocks->count() : 0;
if ( $item_count > 0 ) {

	$desc_content = '';

	while ( $inner_blocks->valid() ) {
		$inner_block = $inner_blocks->current();

		$paragraph = trim( $inner_block->render() );
		if ( ! str_starts_with( $paragraph, '<p></p>' ) ) {
			$desc_content .= $paragraph;
		}

		$inner_blocks->next();

	}//while

	$inner_blocks->rewind();

	// style attributes.
	$desc_classname  = ( ! empty( $attributes['descFlex'] ) ) ? ' dabkrabe-description__flex' : '';
	$desc_classname .= ( ! empty( $attributes['descAlignment'] ) ) ? ' dabkrabe-description__' . $attributes['descAlignment'] : '';

}//if

/**
 * Selected images to compare.
 */
if ( ! empty( $attributes['mediaID1'] ) && ! empty( $attributes['mediaID2'] ) ) {

	$img_srcset1 = wp_get_attachment_image_srcset( $attributes['mediaID1'], 'full' );
	$img_srcset2 = wp_get_attachment_image_srcset( $attributes['mediaID2'], 'full' );

	$img_1 = wp_get_attachment_image( $attributes['mediaID1'], 'full', $img_srcset1, array( 'class' => 'dabkrabe-compimage dabkrabe-compimage__1' ) );
	$img_2 = wp_get_attachment_image( $attributes['mediaID2'], 'full', $img_srcset2, array( 'class' => 'dabkrabe-compimage dabkrabe-compimage__2' ) );

} else {
	$img_1 = '<div class="dabkrabe-compimage dabkrabe-compimage__1"></div>';
	$img_2 = '<div class="dabkrabe-compimage dabkrabe-compimage__2"></div>';

}//if

/**
 * Vertical mode.
 */
$vertical_classname = ( ! empty( $attributes['vertical'] ) ) ? ' dabkrabe__vertical' : '';

/**
 * Object-fit style of comparison view.
 */
$objectfit_classname = ( ! empty( $attributes['objectfit'] ) ) ? ' ' . $attributes['objectfit'] : ' contain';

/**
 * Create paramators to Javascript with dataset attribute.
 */
$view_options = '';
$options_keys  = array();
if ( ! empty( $attributes['vertical'] ) ) {
	$options_keys[ 'vertical' ] = $attributes['vertical'];
}
$view_options = dabkrabe_create_data_attributes( $options_keys );

/**
 * Dimension of comparison view.
 */
$view_style = '';
if ( ! empty( $attributes['width'] ) ) {
	$view_style .= 'width:' . $attributes['width'] . ';';
}
if ( ! empty( $attributes['height'] ) ) {
	$view_style .= 'height:' . $attributes['height'] . ';';
}

/**
 * Aspect ratio of comparison view.
 * Used in fullscreen mode.
 */
$aspect_ratio = ( ! empty( $attributes['aspectRatio'] ) ) ? 'aspect-ratio:' . $attributes['aspectRatio'] : '';

/**
 * Alignment of comparison view.
 */
if ( ! empty( $attributes['alignment'] ) ) {
	$margin_left  = ( 'center' === $attributes['alignment'] || 'right' === $attributes['alignment'] ) ? 'auto' : '0';
	$margin_right = ( 'center' === $attributes['alignment'] || 'left' === $attributes['alignment'] ) ? 'auto' : '0';
	$view_style  .= 'margin-left:' . $margin_left . ';margin-right:' . $margin_right . ';';
}

/**
 * Captions.
 */
$captions_before = '';
$captions_after  = '';
if ( ! empty( $attributes['captions'] ) && (bool) $attributes['captions'][0] ) {
	$captions_before = '<p>' . $attributes['captions'][1] . '</p>';
	$captions_after  = '<p>' . $attributes['captions'][2] . '</p>';
}

/**
 * Supports fullscreen mode.
 */
$has_fullscreen = ( ! empty( $attributes['fullscreen'] ) && $attributes['fullscreen']['enabled'] );

?>
<div <?php echo wp_kses_post( get_block_wrapper_attributes( array( 'class' => 'dabkrabe' ) ) ); ?> style="<?php echo esc_attr( $border_style ); ?>">
	<div class="dabkrabe-view<?php echo esc_attr( $vertical_classname ); ?>" style="<?php echo esc_attr( $view_style ); ?>" data-dabkrabe-options="<?php echo esc_attr( $view_options ); ?>">
		<div class="dabkrabe-view-box" style="<?php echo esc_attr( $aspect_ratio ); ?>">
			<div class="dabkrabe-compimages<?php echo esc_attr( "{$vertical_classname}{$objectfit_classname}" ); ?>">
				<?php echo wp_kses_post( $img_1 ); ?>
				<?php echo wp_kses_post( $img_2 ); ?>
			</div>
			<div class="dabkrabe-captions<?php echo esc_attr( $vertical_classname ); ?>">
				<div class="dabkrabe-caption dabkrabe-caption__before"><?php echo wp_kses_post( $captions_before ); ?></div>
				<div class="dabkrabe-caption dabkrabe-caption__after"><?php echo wp_kses_post( $captions_after ); ?></div>
			</div>
			<div class="dabkrabe-control<?php echo esc_attr( $vertical_classname ); ?>">
				<div class="dabkrabe-sep" style="<?php echo esc_attr( $sep_style ); ?>"></div>
				<div class="dabkrabe-sep" style="<?php echo esc_attr( $sep_style ); ?>"></div>
				<div class="dabkrabe-nib"><svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
					<path
						fill="rgba(0, 0, 0, 0)"
						stroke="<?php echo esc_attr( $nib_color ); ?>"
						d="M12.00,1.00C18.08,1.00,23.00,5.92,23.00,12.00C23.00,18.08,18.08,23.00,12.00,23.00C5.92,23.00,1.00,18.08,1.00,12.00C1.00,5.92,5.92,1.00,12.00,1.00z"/>
					<path
						fill="<?php echo esc_attr( $nib_color ); ?>"
						fill-opacity="1.000"
						stroke="<?php echo esc_attr( $nib_color ); ?>"
						d="M16.00,8.00L21.00,12.00L16.00,16.00L16.00,8.00zM7.00,8.00L7.00,16.00L3.00,12.00L7.00,8.00z"/>
				</svg></div>
				<div class="dabkrabe-pop">
					<?php if ( $has_fullscreen ) : ?>
					<div class="dabkrabe-fullscreen"></div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
	<?php if ( $desc_content ) : ?>
		<div class="dabkrabe-description<?php echo esc_attr( $desc_classname ); ?>"><?php echo wp_kses_post( $desc_content ); ?></div>
	<?php endif; ?>
</div>
