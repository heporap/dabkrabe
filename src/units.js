/**
 * units of HTMLElement width and height
 */
export const DabKrabeUnits = [
	{
		a11yLabel: 'Pixels (px)',
		label: 'px',
		step: 1,
		value: 'px',
	},
	{
		label: '%',
		step: 0.1,
		value: '%',
		max: 100,
	},
	{
		label: 'em',
		step: 0.01,
		value: 'em',
	},
	{
		a11yLabel: 'Relational em (rem)',
		label: 'rem',
		step: 0.01,
		value: 'rem',
	},
	{
		a11yLabel: 'View Width (vw)',
		label: 'vw',
		step: 0.1,
		value: 'vw',
	},
];

/**
 * align points of digits of num to target
 * @param { number } num
 * @param { string } target
 * @return {number} the digits point
 */
export function alignDigits( num, target ) {
	const pth = target.split( '.' );
	if ( pth.length === 1 ) {
		num = Math.floor( num );
	} else {
		const kh = 10 ** pth[ 1 ].length;
		num = Math.floor( num * kh ) / kh;
	}
	return num;
}
