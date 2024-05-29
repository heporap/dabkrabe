/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	BlockControls,
	InnerBlocks,
	useInnerBlocksProps,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	PanelBody,
	ToolbarButton,
	ToolbarGroup,
	ToggleControl,
	SelectControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * External dependencies
 */
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { PopColorpalette as PopColorpanel } from './popcolorpanel';
import MediaSelect from './mediaselect';
import DabKrabe from './dabkrabe';
import {
	DabKrabeIconToolMode as icoMode,
	DabKrabeIconCaptions as icoCaptions,
	DabKrabeIconNib as icoNib,
} from './icons';
import { DabKrabeUnits as units, alignDigits } from './units';
import { AspectRatioList as aspectRatioList } from './aspectratio';
import {
	alignToStyle,
	setAlignmentIcon,
	DEFAULT_SEP_COLOR,
	DEFAULT_SEP_BORDER,
	DEFAULT_NIB_COLOR,
} from './styled';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Extended Components
 */
const ToolsPanelTwinItem = styled( ToolsPanelItem )`
	grid-column: span 1;
`;
const ToolsPanelSingleItem = styled( ToolsPanelItem )`
	grid-column: span 2;
`;
const PanelDescription = styled.div`
	grid-column: span 2;
`;

/* eslint-disable no-console */

/**
 * initialize DabKrabe for the preview mode
 * @param {Element} element the element to create DabKrabe instance
 */
function dabkrabeInitEdit( element ) {
	if ( element.dataset.dabkrabeInitialized ) {
		return null;
	}
	const c = new DabKrabe( element, 'dabkrabe-compimage', 'dabkrabe-control' );
	return c;
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param { Object } attributes What is decrareted in block.json.
 * @param { Function } setAttributes Set values to attributes and re-render.
 * @return { Element } Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		mediaURL1,
		mediaID1,
		mediaURL2,
		mediaID2,
		sepColor = DEFAULT_SEP_COLOR,
		sepBorder = DEFAULT_SEP_BORDER,
		nibColor = DEFAULT_NIB_COLOR,
		vertical,
		descFlex,
		fullscreen = { enabled: false, lightbox: false },
		captions = [ false, '', '' ],
		width,
		height,
		aspectRatio,
		alignment,
		objectfit = 'contain',
	} = attributes;

	const borderProps = useBorderProps( attributes );

	const blockProps = useBlockProps( {
		className: 'dabkrabe',
	} );

	const blockRef = useRef( null );

	const [ innerBlockClassName, setInnerBlockClassName ] = useState(
		descFlex
			? 'dabkrabe-description dabkrabe-description__flex'
			: 'dabkrabe-description'
	);
	const innerBlocksProps = useInnerBlocksProps( {
		className: innerBlockClassName,
	} );

	const [ verticalClassName, setVerticalClassName ] = useState(
		vertical ? 'dabkrabe__vertical' : ''
	);
	const [ viewClassNames, setViewClassNames ] = useState( {
		view: 'dabkrabe-view__edit',
		compimages: 'dabkrabe-compimages__edit',
		images: 'dabkrabe-images__edit',
		control: 'dabkrabe-control__edit',
		sep: 'dabkrabe-sep__edit',
		nib: 'dabkrabe-nib__edit',
		mediabutton: 'dabkrabe-mediabutton__edit',
		captions: 'dabkrabe-captions__edit',
	} );
	const [ editMode, setEditMode ] = useState( true );

	/**
	 * changePreviewMode
	 */
	const isEditMode = () => {
		return editMode;
	};

	/**
	 * toggle edit / preview mode.
	 * @param {Element} target the element to create DabKrabe instance
	 */
	const toggleEditMode = ( target ) => {
		if ( ! mediaID1 || ! mediaID2 ) {
			return false;
		} else if ( isEditMode() ) {
			changePreviewMode( target );
		} else {
			changeEditMode( target );
		}
		return true;
	};

	/**
	 * change the block to preview mode
	 * @param {Element} target the element to create DabKrabe instance
	 */
	const changePreviewMode = ( target ) => {
		if ( target.dabkrabe ) {
			return;
		}
		const obj = { ...viewClassNames };
		const tmp = {};
		for ( const key in obj ) {
			tmp[ key ] = '';
		}
		setViewClassNames( tmp );
		setEditMode( false );
	};

	/**
	 * change the block to edit mode
	 * @param {Element} target the element to create DabKrabe instance
	 */
	const changeEditMode = ( target ) => {
		const obj = { ...viewClassNames };
		const tmp = {};
		for ( const key in obj ) {
			tmp[ key ] = 'dabkrabe-' + key + '__edit';
		}
		setViewClassNames( tmp );
		setEditMode( true );
	};

	/**
	 * edit mode changeボタンを押したかどうか
	 */
	const [ editModePressed, setEditModePressed ] = useState( false );

	/**
	 * document load完了後にmedia1、media2が登録されていたらプレビューモードにする
	 */
	useEffect( () => {
		if ( ! editModePressed && mediaID1 && mediaID2 ) {
			changePreviewMode( blockRef.current );
		}
		//return () => { changeEditMode( blockRef.current ) } //clean up when unmount
	}, [ mediaID1, mediaID2 ] );

	/**
	 * プレビューモード変更を完了したらDabKrabeを初期化する
	 */
	useEffect( () => {
		if ( ! isEditMode() ) {
			if ( blockRef?.current?.dabkrabe ) {
				blockRef.current.dabkrabe.resetSeparator().initOptions();
			} else {
				const target = blockRef.current;
				target.dabkrabe = dabkrabeInitEdit( target );
			}
		} else if ( blockRef.current.dabkrabe ) {
			blockRef.current.dabkrabe.destroy();
			blockRef.current.dabkrabe = null;
		}

	}, [ editMode, vertical ] );

	/**
	 * reset all dimension params
	 * called by toolbar dropdown menu
	 */
	const resetDimension = () => {
		setAttributes( {
			aspectRatio: '',
			height: undefined,
			width: undefined,
		} );
		setViewStyle( {
			...alignToStyle( 'none' ),
			width: undefined,
			height: undefined,
		} );
	};

	// toolbar alignment icon
	const [ currentAlignmentIcon, setCurrentAlignmentIcon ] = useState(
		setAlignmentIcon( alignment )
	);
	// applied height or not
	const [ disabledHeight, setDisabledHeight ] = useState( false );
	// <div.view> element style
	const [ viewStyle, setViewStyle ] = useState( {
		...alignToStyle( alignment ),
		width,
		height,
	} );

	/**
	 * <div.view> Elementのスタイルがあるか
	 * viewStyleはReact useStateの変数のため、プロパティのイテレーターなし
	 * @return { boolean } if the view has a specified style
	 */
	const hasViewStyle = () => {
		return (
			!! viewStyle.alignment || !! viewStyle.width || !! viewStyle.height
		);
	};

	/**
	 * change inspecter dimension control
	 * @param { string } value the new value
	 * @param { string } key initial letter of w ( width ), h ( height ), a ( aspect ratio ), s ( space of alignment )
	 */
	const setDimensionAttributes = ( value, key ) => {
		let newWidth = key === 'w' ? value : width,
			newHeight = key === 'h' ? value : height;
		const newAspectRatio = key === 'a' ? Number( value ) : aspectRatio,
			newAlignment = key === 's' ? value : alignment;
		//アスペクト比が入っている場合は、width、heightを調整する
		if ( key === 'a' ) {
			if ( newWidth ) {
				newHeight = '';
			} else if ( newHeight ) {
				newWidth = '';
			}
		}
		//width, heightにアルファベットなどの、数字以外が入力される可能性がある
		if ( !! newAspectRatio ) {
			//aspectRatioに従ってwidthとheightを計算する
			if ( key === 'h' && newHeight ) {
				const tmph = newHeight.match( /([\d\.]+)([a-zA-Z%]+)/ );
				if ( tmph ) {
					newWidth = Number( tmph[ 1 ] ) * newAspectRatio;
					newWidth = alignDigits( newWidth, tmph[ 1 ] ) + tmph[ 2 ];
				} else {
					newWidth = newHeight;
				}
			} else if ( ( key === 'w' || key === 'a' ) && newWidth ) {
				const tmpw = newWidth.match( /([\d\.]+)([a-zA-Z%]+)/ );
				if ( tmpw ) {
					newHeight = Number( tmpw[ 1 ] ) / newAspectRatio;
					newHeight = alignDigits( newHeight, tmpw[ 1 ] ) + tmpw[ 2 ];
				} else {
					newHeight = newWidth;
				}
			}
		} else {
			//aspectRatioが入っていない場合
			if ( key === 'h' && newHeight ) {
				const tmph = newHeight.match( /([\d\.]+)([a-zA-Z%]+)/ );
				if ( tmph ) {
					newWidth =
						newWidth === undefined || newWidth === ''
							? ''
							: newWidth.replace( /[ \D% ]+/, tmph[ 2 ] );
				}
			} else if ( key === 'w' && newWidth ) {
				const tmpw = newWidth.match( /([\d\.]+)([a-zA-Z%]+)/ );
				if ( tmpw ) {
					newHeight =
						newHeight === undefined || newHeight === ''
							? ''
							: newHeight.replace( /[ \D% ]+/, tmpw[ 2 ] );
				}
			}
		}
		setViewStyle( {
			...alignToStyle( newAlignment ),
			width: newWidth,
			height: newHeight,
		} );

		setAttributes( {
			width: newWidth,
			height: newHeight,
			aspectRatio: newAspectRatio,
			alignment: newAlignment,
		} );

		if ( ! isEditMode() ) {
			blockRef.current.dabkrabe.resetSeparator();
		}
	};

	/**
	 * セパレーターの色を初期化
	 */
	const resetSeparator = () => {
		setAttributes( {
			sepColor: DEFAULT_SEP_COLOR,
			sepBorder: DEFAULT_SEP_BORDER,
			nibColor: DEFAULT_NIB_COLOR,
		} );
	};

	// captionを表示するかフラグ管理
	const [ hasCaptions, setHasCaptions ] = useState(
		captions ? captions[ 0 ] : false
	);
	/**
	 * captionの表示切り替えtoggleスイッチ
	 */
	const toggleCaption = () => {
		const newCaptions = {
			...captions,
			0: ! captions[ 0 ],
		};
		setAttributes( { captions: newCaptions } );
		setHasCaptions( ! hasCaptions );
	};
	/**
	 * save captions
	 * @param { string } value caption text
	 * @param { number } pos before-after
	 */
	const saveCaptions = ( value, pos ) => {
		const newCaptions = { ...captions };
		newCaptions[ pos ] = value;

		setAttributes( {
			captions: newCaptions,
		} );
	};

	/**
	 * export html
	 */
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Options', 'dabkrabe' ) }>
					<ToggleControl
						label={ __( 'Vertical mode', 'dabkrabe' ) }
						checked={ !! vertical }
						onChange={ () => {
							setAttributes( { vertical: ! vertical } );
							setVerticalClassName( () => {
								return ! vertical ? 'dabkrabe__vertical' : '';
							} );
						} }
					/>
					<ToggleControl
						label={ __( 'Enable Fullscreen', 'dabkrabe' ) }
						checked={ fullscreen.enabled }
						onChange={ ( value ) => {
							setAttributes( {
								fullscreen: {
									...fullscreen,
									enabled: value,
								},
							} );
						} }
					/>
					<ToggleControl
						label={ __( 'Column Display', 'dabkrabe' ) }
						checked={ !! descFlex }
						onChange={ () => {
							setAttributes( { descFlex: ! descFlex } );
							setInnerBlockClassName( () => {
								return ! descFlex
									? 'dabkrabe-description__flex'
									: 'dabkrabe-description';
							} );
						} }
					/>
				</PanelBody>
				<ToolsPanel
					label={ __( 'Dimensions' ) }
					resetAll={ resetDimension }
				>
					<PanelDescription>
						{ __( 'This section effects on preview mode.', 'dabkrabe' ) }<br />
						{ __( 'When "%" is selected, only width can be changed, and height number is ignored.', 'dabkrabe' ) }
					</PanelDescription>
					<ToolsPanelTwinItem
						hasValue={ () => !! width }
						label={ __( 'Width' ) }
						onDeselect={ () => {
							setDimensionAttributes( undefined, 'w' );
						} }
						isShownByDefault
					>
						<UnitControl
							label={ __( 'Width' ) }
							onChange={ ( value ) => {
								setDimensionAttributes( value, 'w' );
							} }
							onUnitChange={ ( value ) => {
								setDisabledHeight( value === '%' );
							} }
							value={ width }
							units={ units }
							min="0"
						/>
					</ToolsPanelTwinItem>
					<ToolsPanelTwinItem
						hasValue={ () => !! height }
						label={ __( 'Height' ) }
						onDeselect={ () => {
							setDimensionAttributes( undefined, 'h' );
						} }
						isShownByDefault
					>
						<UnitControl
							label={ __( 'Height' ) }
							onChange={ ( value ) => {
								setDimensionAttributes( value, 'h' );
							} }
							onUnitChange={ ( value ) => {
								setDisabledHeight( value === '%' );
							} }
							value={ height }
							units={ units }
							min="0"
							disabled={ disabledHeight }
						/>
					</ToolsPanelTwinItem>
					<ToolsPanelSingleItem
						hasValue={ () => false }
						label={ __( 'Expand', 'dabkrabe' ) }
						onDeselect={ () => {
							setAttributes( { objectfit: 'contain' } );
						} }
						isShownByDefault
					>
						<ToggleGroupControl
							label={ __( 'Expand', 'dabkrabe' ) }
							value={ objectfit }
							isBlock
							onChange={ ( value ) => {
								setAttributes( { objectfit: value } );
							} }
						>
							<ToggleGroupControlOption
								value="cover"
								label={ __( 'cover', 'dabkrabe' ) }
							/>
							<ToggleGroupControlOption
								value="fill"
								label={ __( 'fill', 'dabkrabe' ) }
							/>
							<ToggleGroupControlOption
								value="contain"
								label={ __( 'contain', 'dabkrabe' ) }
							/>
						</ToggleGroupControl>
					</ToolsPanelSingleItem>
					<ToolsPanelSingleItem
						hasValue={ () => !! aspectRatio }
						label={ __( 'Aspect Ratio', 'dabkrabe' ) }
						onDeselect={ () => {
							setDimensionAttributes( '', 'a' );
						} }
						isShownByDefault
					>
						<SelectControl
							label={ __( 'Aspect Ratio', 'dabkrabe' ) }
							value={ aspectRatio }
							onChange={ ( value ) => {
								setDimensionAttributes( value, 'a' );
							} }
							options={ aspectRatioList }
						/>
					</ToolsPanelSingleItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="styles">
				<ToolsPanel
					label={ __( 'Separator Color', 'dabkrabe' ) }
					resetAll={ resetSeparator }
				>
					<PopColorpanel
						header={ __( 'Separator Color', 'dabkrabe' ) }
						color={ sepColor }
						enableAlpha="true"
						useClear={ DEFAULT_SEP_COLOR }
						onChange={ ( value ) => {
							setAttributes( {
								sepColor: value || DEFAULT_SEP_COLOR,
							} );
						} }
					/>
					<PopColorpanel
						header={ __( 'Separator Border Color', 'dabkrabe' ) }
						color={ sepBorder }
						enableAlpha="true"
						useClear={ DEFAULT_SEP_BORDER }
						onChange={ ( value ) => {
							setAttributes( {
								sepBorder: value || DEFAULT_SEP_BORDER,
							} );
						} }
					/>
					<PopColorpanel
						header={ __( 'Separator Nib Color', 'dabkrabe' ) }
						color={ nibColor }
						enableAlpha="true"
						useColor={ DEFAULT_NIB_COLOR }
						onChange={ ( value ) => {
							setAttributes( {
								nibColor: value || DEFAULT_NIB_COLOR,
							} );
						} }
					/>
				</ToolsPanel>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ icoMode }
						label="Preview or Edit"
						onClick={ () => {
							setEditModePressed(
								toggleEditMode( blockRef.current )
							);
						} }
					/>
				</ToolbarGroup>
				<ToolbarGroup
					controls={ [
						{
							icon: 'align-none',
							isActive: currentAlignmentIcon === 'align-none',
							title: 'Align none',
							value: 'none',
							onClick: () => {
								setDimensionAttributes( 'none', 's' );
								setCurrentAlignmentIcon(
									setAlignmentIcon( 'none' )
								);
							},
						},
						{
							icon: 'align-left',
							isActive: currentAlignmentIcon === 'align-left',
							title: 'Align left',
							value: 'left',
							onClick: () => {
								setDimensionAttributes( 'left', 's' );
								setCurrentAlignmentIcon(
									setAlignmentIcon( 'left' )
								);
							},
						},
						{
							icon: 'align-center',
							isActive: currentAlignmentIcon === 'align-center',
							title: 'Align center',
							value: 'center',
							onClick: () => {
								setDimensionAttributes( 'center', 's' );
								setCurrentAlignmentIcon(
									setAlignmentIcon( 'center' )
								);
							},
						},
						{
							icon: 'align-right',
							isActive: currentAlignmentIcon === 'align-right',
							title: 'Align right',
							value: 'right',
							onClick: () => {
								setDimensionAttributes( 'right', 's' );
								setCurrentAlignmentIcon(
									setAlignmentIcon( 'right' )
								);
							},
						},
					] }
					icon={ currentAlignmentIcon }
					title="Image Alignment"
					isCollapsed
				/>
				<ToolbarGroup>
					<ToolbarButton
						icon={ icoCaptions }
						label="Add Captions"
						onClick={ () => {
							toggleCaption();
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...blockProps } style={ { ...borderProps.style } }>
				<div
					ref={ blockRef }
					className={
						'dabkrabe-view ' +
						viewClassNames.view +
						' ' +
						verticalClassName
					}
					style={
						( isEditMode() || ! hasViewStyle() )
							? null
							: { ...viewStyle }
					}
					data-dabkrabe-keys="vertical"
					data-dabkrabe-options-vertical={ vertical ? '1' : '' }
				>
					<div
						className="dabkrabe-view-box"
						style={
							isEditMode() ? null : { aspectRatio }
						}
					>
						<div
							className={ 'dabkrabe-compimages ' + ( ( ! mediaID1 ^ ! mediaID2 ) ? 'dabkrabe-compimages__oneimage' : '' ) + ' ' + viewClassNames.compimages + ' ' + objectfit + ' ' + verticalClassName }
						>
							<MediaSelect
								mediaURL={ mediaURL1 }
								mediaID={ mediaID1 }
								onSelect={ ( media ) => {
									setAttributes( {
										mediaURL1: media.url,
										mediaID1: parseInt( media.id, 10 ),
									} );
								} }
								className="dabkrabe-compimage__1"
								showButton={ isEditMode() }
							/>
							<MediaSelect
								mediaURL={ mediaURL2 }
								mediaID={ mediaID2 }
								onSelect={ ( media ) => {
									setAttributes( {
										mediaURL2: media.url,
										mediaID2: parseInt( media.id, 10 ),
									} );
								} }
								className="dabkrabe-compimage__2"
								showButton={ isEditMode() }
							/>
						</div>
						{ hasCaptions && (
							<div
								className={
									'dabkrabe-captions ' +
									viewClassNames.captions +
									' ' +
									verticalClassName
								}
							>
								<div className="dabkrabe-caption dabkrabe-caption__before">
									<RichText
										tagName="p"
										className="dabkrabe-caption1"
										placeholder={ __(
											'Before Text',
											'dabkrabe'
										) }
										value={ captions[ 1 ] }
										allowedFormats={ [
											'core/bold',
											'core/italic',
										] }
										onChange={ ( value ) => {
											saveCaptions( value, 1 );
										} }
									/>
								</div>
								<div className="dabkrabe-caption dabkrabe-caption__after">
									<RichText
										tagName="p"
										className="dabkrabe-caption2"
										placeholder={ __(
											'After Text',
											'dabkrabe'
										) }
										value={ captions[ 2 ] }
										allowedFormats={ [
											'core/bold',
											'core/italic',
										] }
										onChange={ ( value ) => {
											saveCaptions( value, 2 );
										} }
									/>
								</div>
							</div>
						) }
						<div
							className={
								'dabkrabe-control ' +
								viewClassNames.control +
								' ' +
								verticalClassName
							}
							style={ {
								display: mediaID1 && mediaID2 ? '' : 'none',
							} }
						>
							<div
								className={
									'dabkrabe-sep ' + viewClassNames.sep
								}
								style={ {
									backgroundColor: sepColor,
									borderColor: sepBorder,
								} }
							></div>
							<div
								className={
									'dabkrabe-sep ' + viewClassNames.sep
								}
								style={ {
									backgroundColor: sepColor,
									borderColor: sepBorder,
								} }
							></div>
							<div
								className={
									'dabkrabe-nib ' + viewClassNames.nib
								}
								style={ { stroke: nibColor } }
							>
								{ icoNib( nibColor ) }
							</div>
							<div className="dabkrabe-pop">
								{ fullscreen?.enabled && (
									<div className="dabkrabe-fullscreen"></div>
								) }
							</div>
						</div>
					</div>
				</div>
				<div { ...innerBlocksProps }>
					<InnerBlocks allowedBlocks={ [ 'core/paragraph' ] } />
				</div>
			</div>
		</>
	);
}
/* eslint-enable no-console */
