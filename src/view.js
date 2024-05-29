/**
 * the front-end on posts/pages that contain this block.
 *
 */
import jQuery from 'jquery';
import DabKrabe from './dabkrabe';

let dabkrabes;

jQuery( dabkrabeInit );
jQuery( document ).on( 'unload', dabkrabeDestroy );

/**
 * Initialize the DabKrabe instances and apply to Element.
 */
function dabkrabeInit() {
	const dabs = [];
	jQuery( '.dabkrabe-view:not( .dabkrabe-view__edit )' ).each(
		( index, item ) => {
			if ( item.dataset.dabkrabeInitialized ) {
				return;
			}
			const dab = new DabKrabe(
				item,
				'dabkrabe-compimage',
				'dabkrabe-control'
			);
			dabs.push( dab );
		}
	);
	if ( dabkrabes ) {
		dabkrabes.push( ...dabs );
	} else {
		dabkrabes = dabs;
	}
}

/**
 * Delete all of the DabKrabe instances.
 * Called when window unloaded.
 */
function dabkrabeDestroy() {
	dabkrabes.forEach( ( item ) => item.destroy() );
	dabkrabes = null;
}
