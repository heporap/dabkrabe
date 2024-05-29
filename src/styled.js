/**
 * Default color values
 */
export const DEFAULT_SEP_COLOR = '#000';
export const DEFAULT_SEP_BORDER = '#fff';
export const DEFAULT_NIB_COLOR = '#fff';

export const DEFAULT_COLORPALETTE_COLORS = [
	{ name: 'white', color: '#fff' },
	{ name: 'lightgray', color: '#aaa' },
	{ name: 'gray', color: '#888' },
	{ name: 'darkgray', color: '#666' },
	{ name: 'black', color: '#000' },
	{ name: '18% gray', color: '#777' },
	{ name: 'brown', color: '#8F6152' },
	{ name: 'light brown', color: '#EBC5BB' },
	{ name: 'sky blue', color: '#83B3DC' },
	{ name: 'light blue', color: '#97EAF3' },
	{ name: 'pale green', color: '#C6EB79' },
	{ name: 'yellow', color: '#FFE958' },
	{ name: 'pink', color: '#FE6D84' },
	{ name: 'white-t', color: '#ffffff88' },
	{ name: 'black-t', color: '#00000088' },
];

/**
 * create style object of margin-left and margin-right params from alignment
 * @param {string} alignment
 * @return {Object} must have marginLeft and marginRight props.
 */
export function alignToStyle( alignment ) {
	if ( ! alignment ) {
		return {};
	}

	const left = alignment === 'center' || alignment === 'right' ? 'auto' : '0',
		right = alignment === 'center' || alignment === 'left' ? 'auto' : '0';
	return {
		marginLeft: left,
		marginRight: right,
	};
}

/**
 * toolbar icon
 * @param {string} alignment left, center, right
 * @return {string} icon name
 */
export function setAlignmentIcon( alignment ) {
	return alignment ? 'align-' + alignment : 'align-none';
}
