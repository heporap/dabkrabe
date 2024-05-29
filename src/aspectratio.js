/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

const AspectRatioList = [
	{
		label: __( 'Original or Custom size', 'dabkrabe' ),
		value: '',
	},
	{
		label: __( 'Square 1:1', 'dabkrabe' ),
		value: '1',
	},
	{
		label: __( 'Standard 4:3', 'dabkrabe' ),
		value: Number( 4 / 3 ).toString(),
	},
	{
		label: __( 'Portrait 3:4', 'dabkrabe' ),
		value: Number( 3 / 4 ).toString(),
	},
	{
		label: __( 'Classic 3:2', 'dabkrabe' ),
		value: Number( 3 / 2 ).toString(),
	},
	{
		label: __( 'Classic portrait 2:3', 'dabkrabe' ),
		value: Number( 2 / 3 ).toString(),
	},
	{
		label: __( 'Wide 16:9', 'dabkrabe' ),
		value: Number( 16 / 9 ).toString(),
	},
	{
		label: __( 'Long vertical 9:16', 'dabkrabe' ),
		value: Number( 9 / 16 ).toString(),
	},
];

export { AspectRatioList };
