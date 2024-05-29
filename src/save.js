/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
//import { __ } from '@wordpress/i18n';

import {
    InnerBlocks,
    useBlockProps,
	RichText,
} from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should be
 * combined into the final markup, which is then serialized into post_content.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param { Object } attributes What is decrareted in block.json.
 * @returns {Element} HTML code
 */
export default function save( { attributes } ) {
	const blockProps = useBlockProps.save( {
		className: 'dabkrabe',
	} );

	return (
		<div { ...blockProps }>
			<div className="dabkrabe-view">
				<div className="dabkrabe-compimages block-editor-block-list__block wp-block is-stacked-on-mobile alignnone wp-block-media-text" style="display:grid;grid:'a c' 'a e' 'b e' 'b d';grid-template-columns: 50% 1fr;grid-template-rows: 25% 1fr 25%;">
					<figure className="wp-block-media-text__media" style="grid-area:a;height:auto;max-width:100%;min-width:10%;box-sizing:border-box;flex-shrink:0;">
						<img src={ attributes.mediaURL1 } id={ "wiwi-media-" + attributes.mediaID1 } className="dabkrabe-compimage" style="width:auto;height:auto;max-width:100%;" alt={ ( attributes.captions) ? attributes.captions[ 1 ] : '' } />
					</figure>
					<RichText.Content tagName="p" className="dabkrabe-caption1" value={ ( attributes.captions) ? attributes.captions[ 1 ] : '' } style="grid-area:c;" />
					<figure className="wp-block-media-text__media" style="grid-area:b;height:auto;max-width:100%;min-width:10%;box-sizing:border-box;margin-bottom:0;flex-shrink:0;">
						<img src={ attributes.mediaURL2 } id={ "wiwi-media-" + attributes.mediaID2 } className="dabkrabe-compimage" style="width:auto;height:auto;max-width:100%;" alt={ ( attributes.captions) ? attributes.captions[ 2 ] : '' } />
					</figure>
					<RichText.Content tagName="p" className="dabkrabe-caption2" value={ ( attributes.captions ) ? attributes.captions[ 2 ] : '' } style="grid-area:d;" />
					<div className="dabkrabe-description wp-block-media-text__content" style="grid-area:e" >
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
