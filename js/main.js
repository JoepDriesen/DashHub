requirejs.config( {
    
    baseUrl: 'js',
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
        
        jqueryui: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min',
        lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        gridstack: 'https://cdnjs.cloudflare.com/ajax/libs/gridstack.js/0.3.0/gridstack.all',
        
        ges: 'https://joepdriesen.github.io/jquery-github-encrypted-storage/jquery.github-encrypted-storage',
        
        aes: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes',
        pbkdf2: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/pbkdf2',
    },
    shim : {
        bootstrap: {
            dep: [ 'jquery'],
        },
        gridstack: {
            dep: [ 'jqueryui', 'lodash' ],
        },
        ges: {
            dep: [ 'jquery' ],
        },
        storage: {
            dep: [ 'ges', 'aes', 'pbkdf2', 'bootstrap' ],
        },
        dashhub: {
            dep: [ 'gridstack', 'storage' ],
        },
    },
    
} );

require( ['dashhub'] );