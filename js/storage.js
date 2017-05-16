define( [ 'jquery', 'ges', 'aes', 'pbkdf2', 'bootstrap' ], function( $ ) {
    
    var storage = {};
    
    $( function() {
        
        $( '#btn-reset-credentials' ).click( function() {
            localStorage.removeItem( 'github_username' );
            localStorage.removeItem( 'github_password' );
            localStorage.removeItem( 'github_repository' );
            localStorage.removeItem( 'encryption_passphrase' );
            location.reload();
        } );
        
    } );
    
    var get_storage = function( storage_name, username, password, repository, passphrase ) {
        
        return $.githubEncryptedStorage( username, password, {
            repository_name: repository,
            db_name: storage_name,
            decrypt: function( cypher_text ) {

                var key128Bits = CryptoJS.PBKDF2( passphrase, CryptoJS.enc.Hex.parse( storage_name ), { keySize: 128/32 } );
                var decrypted = CryptoJS.AES.decrypt( cypher_text, key128Bits, { iv: CryptoJS.enc.Hex.parse( storage_name ) } );

                return decrypted.toString(CryptoJS.enc.Utf8);

            },
            encrypt: function( cleartext ) {

                var key128Bits = CryptoJS.PBKDF2( passphrase, CryptoJS.enc.Hex.parse( storage_name ), { keySize: 128/32 } );
                var encrypted = CryptoJS.AES.encrypt( cleartext, key128Bits, { iv: CryptoJS.enc.Hex.parse( storage_name ) } );

                return encrypted.toString();

            },
        } );
        
    };
    
    return function( storage_name ) {
        
        return new Promise( function( resolve, reject ) {
            
            $( function() {
                
                // Check if github credentials are known
                var github_username = localStorage.getItem( 'github_username' );
                var github_password = localStorage.getItem( 'github_password' );
                var github_repository = localStorage.getItem( 'github_repository' );
                var encryption_passphrase = localStorage.getItem( 'encryption_passphrase' );

                if ( github_username !== null && github_password !== null && github_repository !== null && encryption_passphrase !== null )
                    return resolve( get_storage( storage_name, github_username, github_password, github_repository, encryption_passphrase ) );

                var $body = $( '#dashhub-modal .modal-body' );
                $body.empty();
                $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-username" class="col-lg-4 control-label">GitHub Username</label><div class="col-lg-8"><input class="form-control" id="github-username" type="text" placeholder="Username" value="' + github_username ? github_username : "" + '></div></div></div>' ) );
                $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-password" class="col-lg-4 control-label">GitHub Password</label><div class="col-lg-8"><input class="form-control" id="github-password" type="password" placeholder="Password" value="' + github_password ? github_password : "" + '></div></div></div>' ) );
                $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-repository" class="col-lg-4 control-label">GitHub Repository URL</label><div class="col-lg-8"><input class="form-control" id="github-repository" type="text" placeholder="Repository" value="' + github_repository ? github_repository : "" + '></div></div></div>' ) );
                $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="encryption-passphrase" class="col-lg-4 control-label">Encryption Passphrase</label><div class="col-lg-8"><input class="form-control" id="encryption-passphrase" type="password" placeholder="Passphrase" value="' + encryption_passphrase ? encryption_passphrase : "" + '></div></div></div>' ) );

                $footer = $( '#dashhub-modal .modal-footer' );
                $footer.empty();
                $footer.append( $( '<button type="button" class="btn btn-primary">Submit</button></div>' ) );

                $( '#dashhub-modal' ).modal( {
                    backdrop: 'static',
                    keyboard: false,
                } );

                $( '#dashhub-modal button' ).one( 'click', function() {

                    github_username = $( '#dashhub-modal #github-username' ).val();
                    localStorage.setItem( 'github_username', github_username );

                    github_password = $( '#dashhub-modal #github-password' ).val();
                    localStorage.setItem( 'github_password', github_password );

                    github_repository = $( '#dashhub-modal #github-repository' ).val();
                    localStorage.setItem( 'github_repository', github_repository );

                    encryption_passphrase = $( '#dashhub-modal #encryption-passphrase' ).val();
                    localStorage.setItem( 'encryption_passphrase', encryption_passphrase );

                    $( '#dashhub-modal' ).one( 'hidden.bs.modal', function() {
                        return resolve( get_storage( storage_name, github_username, github_password, github_repository, encryption_passphrase ) );
                    } );

                    $( '#dashhub-modal' ).modal( 'hide' );

                } );

            } );
            
        } );
        
    };
    
} );