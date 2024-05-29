/**
 * block wrapper element.
 */

// * Retrieves the translation of text.
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { MediaUpload } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function MediaSelect( props ) {
	return (
		<MediaUpload
			onSelect={ ( media ) => {
				props.onSelect( media );
			} }
			allowdTypes="image"
			value={ props.mediaID }
			render={ ( { open } ) => (
				<>
					{ ! props.mediaID ? (
						<></>
					) : (
						<img
							src={ props.mediaURL }
							alt={ __( 'image to compare', 'dabkrabe' ) }
							className={
								'dabkrabe-compimage dabkrabe-compimage__edit ' +
								props.className
							}
						/>
					) }

					{ props.showButton ? (
						<Button
							className={
								( props.mediaID ? 'image-button' : 'button-large' ) +
								' button dabkrabe-mediabutton dabkrabe-mediabutton__edit'
							}
							variant={ props.mediaID ? 'secondary' : 'primary' }
							onClick={ open }
						>
							{ ! props.mediaID ? (
								__( 'Select Image', 'dabkrabe' )
							) : (
								__( 'Edit Image', 'dabkrabe' )
							) }
						</Button>
					) : (
						<></>
					) }
				</>
			) }
		/>
	);
}
