/**
 * @author takahiro / http://github.com/takahirox
 */

THREE.FBXLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.FBXLoader.prototype = {

    constructor: THREE.FBXLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        const loader = new THREE.FileLoader( this.manager );
        loader.setResponseType( 'arraybuffer' );
        loader.load( url, buffer => {

            try {

                onLoad( this.parse( buffer, url ) );

            } catch ( e ) {

                if ( onError ) {

                    onError( e );

                } else {

                    console.error( e );

                }

                this.manager.itemError( url );

            }

        }, onProgress, onError );

    },

    parse: function ( buffer, url ) {
        // FBX parsing logic goes here...
        console.warn( 'FBXLoader: parse() is not fully implemented in this snippet.' );
        return new THREE.Group(); // Placeholder
    }

};
