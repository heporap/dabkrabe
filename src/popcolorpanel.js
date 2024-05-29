/**
 * block wrapper element.
 */

// * Retrieves the translation of text.
import { __ } from '@wordpress/i18n';

import {
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	Button,
	ColorPalette,
	ColorIndicator,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

// * External dependencies
import { useState } from 'react';
import styled from '@emotion/styled';
import { DEFAULT_COLORPALETTE_COLORS } from './styled';

/**
 * Extended Components
 */
const ToolsPanelSingleItem = styled( ToolsPanelItem )`
	grid-column: 1;
`;

/**
 *
 * @param {*} props
 * @return {Element} HTML Element
 */
export function PopColorpalette( props ) {
	const [ color, setColor ] = useState( props.color );
	const themeColors = wp.data
		.select( 'core/block-editor' )
		.getSettings().colors;
	const colors = [
		{
			name: __( 'Theme', 'dabkrabe' ),
			colors: themeColors,
		},
		{
			name: __( 'Default', 'dabkrabe' ),
			colors: DEFAULT_COLORPALETTE_COLORS,
		},
	];
	return (
		<ToolsPanelSingleItem
			hasValue={ () => !! color }
			label={ props.header }
			isShownByDefault={ false }
		>
			<Dropdown
				className="dabkrabe__dropdown"
				contentClassName="dabkrabe__content"
				headerTitle={ props.header }
				popoverProps={ {
					placement: 'bottom', //'middle right left', //left side of ToolsPanel
					offset: '32',
				} }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button variant="secondary" onClick={ onToggle } aria-expanded={ isOpen } >
						<ColorIndicator colorValue={ props.color } className="dabkrabe-colorindicator"/>
						{ props.header }
					</Button>
				) }
				renderContent={ () => (
					<DropdownContentWrapper
						paddingSize="medium"
					>
						<ColorPalette
							colors={ colors }
							value={ color }
							enableAlpha={ props.enableAlpha || false }
							onChange={ ( value ) => {
								setColor( value );
								props.onChange( value );
							} }
						/>
					</DropdownContentWrapper>
				) }
			/>
		</ToolsPanelSingleItem>
	);
}
