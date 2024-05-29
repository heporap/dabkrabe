import jQuery from 'jquery';

/* eslint-disable no-console */
class DabKrabe {
	$container;
	$control;
	$image;
	$sep;
	flgOndrag = false;
	startpos = [];
	lastpos = [];
	options = {
		vertical: false,
	};

	/**
	 *
	 * @param {string} container
	 * @param {string} imageClassName
	 * @param {string} controlClassName
	 */
	constructor( container, imageClassName, controlClassName ) {
		container.dataset.dabkrabeInitialized = 1;

		const $container = jQuery( container );

		if ( $container.length === 0 ) {
			throw new Error( 'Container element not found' );
		}

		const $control = $container.find( '.' + controlClassName );
		if ( $control.length === 0 ) {
			throw new Error( 'Control element not found. Searched className: ' + controlClassName );
		}

		const $images = $container.find( '.' + imageClassName );
		if ( $images.length < 2 ) {
			throw new Error( 'Need 2 images. Searched className: ' + imageClassName );
		}

		this.fnMove = this.onmousemove.bind( this );
		$control.on( 'mousemove', this.fnMove );
		this.fnTouchMove = this.ontouchmove.bind( this );
		$control.on( 'touchmove', this.fnTouchMove );

		//this.fnEnter = jQuery.proxy( this.onmouseenter, this );
		//$control.on( 'mouseenter', this.fnEnter );
		this.fnLeave = this.onmouseleave.bind( this );
		$control.on( 'mouseleave', this.fnLeave );

		this.fnMdown = this.onmousedown.bind( this );
		$control.on( 'mousedown', this.fnMdown );
		this.fnMup = this.onmouseup.bind( this );
		$control.on( 'mouseup', this.fnMup );

		this.fnClick = this.onclick.bind( this );
		$control.on( 'click', this.fnClick );
		this.fnTouchStart = this.ontouchstart.bind( this );
		$control.on( 'touchstart', this.fnTouchStart );
		this.fnTouchEnd = this.ontouchend.bind( this );
		$control.on( 'touchend', this.fnTouchEnd );

		//const $view = $container.find( '.dabkrabe-view' );

		this.$container = $container;
		this.initOptions();
		this.initModedrag();

		this.$control = $control;
		this.$image = $images.last();
		this.controlClassName = controlClassName;

		const $controlItems = this.$control.children();
		this.$sep = $controlItems.slice( 0, 3 );

		const $viewbox = $container.children( 'div' ),
			boxAspectRatio = $viewbox.css( 'aspect-ratio' ),
			$imagebox = this.$image.parent();

		if (
			! boxAspectRatio && (
				(
					$container.attr( 'style' ) && 
					$container.attr( 'style' ).indexOf( 'height' ) === -1
				) ||
				$imagebox.hasClass( 'contain' ) ||
				$imagebox.hasClass( 'fill' )
			)
		) {
			const img = this.$image[ 0 ];
			if ( img.naturalWidth && img.naturalHeight ) {
				const aspectRatio = img.naturalWidth / img.naturalHeight;
				$viewbox.css( 'aspect-ratio', '' + aspectRatio );
			} else {
				this.$image.on( 'load', ( event ) => {
					const aspectRatio = img.naturalWidth / img.naturalHeight;
					$viewbox.css( 'aspect-ratio', '' + aspectRatio );
				} );
			}
		}
	}

	/**
	 * Class destructor.
	 */
	destroy() {
		delete this.$container[ 0 ].dataset.dabkrabeInitialized;

		this.$control.off( 'mousemove', this.fnMove );
		this.$control.off( 'touchmove', this.fnMove );
		//this.$control.off( 'mouseenter', this.fnEnter );
		this.$control.off( 'mouseleave', this.fnLeave );
		this.$control.off( 'click', this.fnClick );
		this.$control.off( 'mousedown', this.fnMdown );
		this.$control.off( 'mouseup', this.fnMup );
		this.$control.off( 'touchmove', this.fnTouchMove );
		this.$control.off( 'touchend', this.fnTouchEnd );
		this.$control.off( 'touchstart', this.fnTouchStart );

		this.resetSeparator();
		this.$image =
			this.$sep =
			this.$container =
			this.$control =
			this.fnMove =
			this.fnMup =
			this.fnMdown =
			this.fnClick =
			this.fnLeave = null;
		delete this;
	}

	/**
	 *
	 * @return {DabKrabe} self instance
	 */
	initOptions() {
		const keys = this.$container.data( 'dabkrabe-keys' );

		if ( ! keys ) {
			return;
		}
		for( const key of keys.split( ',' ) ) {
			const val =
				this.$container[ 0 ].dataset[
					'dabkrabeOptions' +
						key[ 0 ].toUpperCase() +
						key.substring( 1 )
				];
			if ( val ) {
				this.options[ key ] = val;
			} else {
				delete this.options[ key ];
			}
		}
		return this;
	}

	/**
	 * initialize drag flag with options.
	 */
	initModedrag() {
		if ( ! this.options.modedrag ) {
			this.flgOndrag = true;
		}
	}

	setMaxHeight() {
		const screenHeight = screen.availHeight;
		this.$image.parent().css( 'height', screenHeight + 'px' );
	}
	removeMaxHeight() {
		this.$image.parent().css( 'height', '' );
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 */
	onclick( event ) {
		const cList = event.originalEvent.target.classList;
		if ( cList.contains( 'dabkrabe-fullscreen' ) ) {
			this.initModedrag();
			return this.doFullscreen();
		}
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 */
	onmouseup( event ) {
		if ( this.isMousemoved() ) {
			this.flgOndrag = ! this.flgOndragLast;
		}
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 */
	onmousedown( event ) {
		this.startpos = [
			event.originalEvent.pageY,
			event.originalEvent.pageX,
		];
		this.flgOndragLast = this.flgOndrag;
		this.flgOndrag = true;

		this.onmousemove( event );
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 */
	ontouchend( event ) {
		this.flgOndrag = false;
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 */
	ontouchstart( event ) {
		const touches = event.originalEvent.touches;
		if ( touches.length > 1 ) {
			this.ontouchend( event );
			return true;
		}
		this.startpos = [ touches[ 0 ].pageY, touches[ 0 ].pageX ];
		this.flgOndrag = true;
		this.ontouchmove( event );
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 * @return {boolean} if false, event.stopPropagation() and event.preventDefault() by jQuery.
	 */
	onmousemove( event ) {
		this.lastpos = [ event.originalEvent.pageY, event.originalEvent.pageX ];
		if ( ! this.flgOndrag ) {
			return true;
		}

		if ( this.isVertical() ) {
			const boxMetrixY = this.getControlMetrixY();
			const y = event.originalEvent.pageY - boxMetrixY.top;
			this.moveSeparatorY( y );
		} else {
			const boxMetrixX = this.getControlMetrixX();
			const x = event.originalEvent.pageX - boxMetrixX.left;
			this.moveSeparatorX( x );
		}
		return false;
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 * @return {boolean} if false, event.stopPropagation() and event.preventDefault() by jQuery.
	 */
	ontouchmove( event ) {
		if ( ! this.flgOndrag ) {
			return true;
		}

		const touch = event.originalEvent.touches[ 0 ];
		this.lastpos = [ touch.pageY, touch.pageX ];

		if ( this.isVertical() ) {
			const boxMetrixY = this.getControlMetrixY();
			const boxBottom = boxMetrixY.height;
			let y = event.touches[ 0 ].pageY - boxMetrixY.top;
			y = ( y < 0 )? 0: ( boxBottom < y )? boxBottom: y;

			this.moveSeparatorY( y );
		} else {
			//Y移動量がX移動量より大きければスクロールとみなす
			if (
				! this.isFullscreen() &&
				Math.abs( this.lastpos[ 0 ] - this.startpos[ 0 ] ) > Math.abs( this.lastpos[ 1 ] - this.startpos[ 1 ] )
			) {
				return true;
			}

			const boxMetrixX = this.getControlMetrixX();
			const boxRight = boxMetrixX.width;
			let x = event.touches[ 0 ].pageX - boxMetrixX.left;
			x = ( x < 0 )? 0: ( boxRight < x )? boxRight: x;

			this.moveSeparatorX( x );
		}
		return false;
	}

	/**
	 * 
	 * @return {boolean} true if mouse or touch moved.
	 */
	isMousemoved() {
		return (
			Math.abs( this.lastpos[ 0 ] - this.startpos[ 0 ] ) < 5 &&
			Math.abs( this.lastpos[ 1 ] - this.startpos[ 1 ] ) < 5
		);
	}

	/**
	 *
	 * @param {jQuery.Event} event
	 * @return {bool} Return false, if needs event.stopPropagation() and event.preventDefault() by jQuery.
	 */
	onmouseleave( event ) {
		if ( ! this.flgOndrag ) {
			return true;
		}

		if ( this.isVertical() ) {
			const boxMetrixY = this.getControlMetrixY();
			const mouseY = event.originalEvent.pageY;
			if ( boxMetrixY.top < mouseY && mouseY < boxMetrixY.bottom ) {
				return true;
			}
			const y = boxMetrixY.bottom <= mouseY ? boxMetrixY.height : 0;
			this.moveSeparatorY( y );
		} else {
			const boxMetrixX = this.getControlMetrixX();
			const mouseX = event.originalEvent.pageX;
			if ( boxMetrixX.left < mouseX && mouseX < boxMetrixX.right ) {
				return true;
			}
			const x = boxMetrixX.right <= mouseX? boxMetrixX.width : 0;
			this.moveSeparatorX( x );
		}
		return false;
	}

	/**
	 *
	 * @return {Object} the metrix of the element
	 */
	getControlMetrixX() {
		const $control = this.$control;
		const boxLeft = $control.offset().left;
		const boxWidth = $control.outerWidth();
		const boxRight = boxLeft + boxWidth;

		return {
			left: boxLeft,
			width: boxWidth,
			right: boxRight,
		};
	}

	/**
	 *
	 * @return {Object} the metrix of the element.
	 */
	getControlMetrixY() {
		const $control = this.$control;
		const boxTop = $control.offset().top;
		const boxHeight = $control.outerHeight();
		const boxBottom = boxTop + boxHeight;

		return {
			top: boxTop,
			height: boxHeight,
			bottom: boxBottom,
		};
	}

	/**
	 *
	 * @param {number} y Y Position that the separator moves to
	 */
	moveSeparatorY( y ) {
		this.$sep.css( 'top', `${ y }px` );
		this.$image.css( 'clipPath', `inset( ${ y }px 0 0 0 )` );
	}

	/**
	 *
	 * @param {number} x X Position that the separator moves to
	 */
	moveSeparatorX( x ) {
		this.$sep.css( 'left', `${ x }px` );
		this.$image.css( 'clipPath', `inset( 0 0 0 ${ x }px )` );
	}

	/**
	 *
	 * @return {DabKrabe} Instance.
	 */
	resetSeparator() {
		this.$sep.css( { left: '', top: '' } );
		this.$image.css( 'clipPath', '' );

		this.initModedrag();
		return this;
	}

	/**
	 * is this vertical mode?
	 * @return {boolean} if is vertical mode
	 */
	isVertical() {
		return this.options.vertical;
	}

	/**
	 * Do fullscreen
	 * If browser does not support fullscreen, it changes the className for full window.
	 */
	doFullscreen() {
		if ( this.isFullscreen() ) {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			} else if ( document.mozRequestFullscreen ) {
				document.mozExitFullscreen();
			} else if ( document.webkitRequestFullscreen ) {
				document.webkitExitFullscreen();
			} else {
				this.$container.removeClass( 'dabkrabe-view__fullscreen' );
				this.$container[ 0 ].style.width = this.$container.data( 'dabkrabe-width' );
				this.$container[ 0 ].style.height = this.$container.data( 'dabkrabe-height' );
			}
		} else {
			const container = this.$container[ 0 ];
			if ( container.requestFullscreen ) {
				container.requestFullscreen();
			} else if ( container.mozRequestFullscreen ) {
				container.mozRequestFullscreen();
			} else if ( container.webkitRequestFullscreen ) {
				container.webkitRequestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
			} else {
				this.$container.addClass( 'dabkrabe-view__fullscreen' );
				this.$container.data( 'dabkrabe-width', this.$container[ 0 ].style.width );
				this.$container.css( 'width', '' );
				this.$container.data( 'dabkrabe-height', this.$container[ 0 ].style.height );
				this.$container.css( 'height', '' );
			}
		}
	}

	/**
	 * is current screen fullscreen?
	 * @return {boolean} true if the view is fullscreen mode
	 */
	isFullscreen() {
		return (
			document.fullscreenElement ||
			this.$container.hasClass( 'dabkrabe-view__fullscreen' )
		);
	}
}
/* eslint-enable no-console */

export default DabKrabe;
