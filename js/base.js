$( function() {
    
    var storage,
        plugins;
    
    // Add slideDown animation to Bootstrap dropdown when expanding.
    $('.dropdown').on('show.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });

    // Add slideUp animation to Bootstrap dropdown when collapsing.
    $('.dropdown').on('hide.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
    });
    
    $( '#plugin-container' ).gridstack( {
    } );
    var grid = $( '#plugin-container' ).data( 'gridstack' );
    
    $( '#plugin-container' ).on( 'change', function( event, items ) {
        
        // For each items that has been moved or resized
        $.each( items, function( i, item ) {
            
            var plugin = plugins[item.el.data( 'plugin-index' )];
            
            if ( plugin.json.x == item.x && plugin.json.y == item.y && plugin.json.width == item.width && plugin.json.height == item.height )
                return
                
            /*console.log(item.el.data( 'plugin-index' ))
            console.log( item );
            console.log( plugin );*/
            
            plugin.json.x = item.x;
            plugin.json.y = item.y;
            plugin.json.width = item.width;
            plugin.json.height = item.height;
            
            if ( plugin.initialized )
                return storage.saveObject( plugin.json, ['plugin'], plugin.id );
            plugin.initialized = true;
            
        } );
        
    } );
    
    $( '#btn-reset-credentials' ).click( function() {
        localStorage.removeItem( 'github_username' );
        localStorage.removeItem( 'github_password' );
        localStorage.removeItem( 'github_repository' );
        localStorage.removeItem( 'encryption_passphrase' );
        location.reload();
    } );
    
    var add_plugin = function() {
        
        if ( storage === undefined )
            return $( '#dashhub-error' ).clone().find( '.text' ).text( "Can't add plugins without connection to Github." ).parent().insertAfter( $( '#dashhub-error' ) ).fadeIn();
        
        $( '#dashhub-modal .modal-title' ).text( "Add a new Plugin to your DashHub" );

        $body = $( '#dashhub-modal .modal-body' );
        $body.empty();
        $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="plugin-repository" class="col-lg-4 control-label">Plugin Repository URL</label><div class="col-lg-8"><input class="form-control" id="plugin-repository" type="text" placeholder="repository"></div></div></div>' ) );

        $footer = $( '#dashhub-modal .modal-footer' );
        $footer.empty();
        $footer.append( $( '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button></div><button id="plugin-submit" type="button" class="btn btn-primary">Add Plugin</button></div>' ) );

        $( '#dashhub-modal' ).modal( 'show' );

        $( '#dashhub-modal #plugin-submit' ).one( 'click', function() {

            $.when( storage.saveObject( {
                repository_url: $( '#plugin-repository' ).val(),

            },  ['plugin'] ) ).then( function() {
                $( '#dashhub-modal' ).modal( 'hide' );

                location.reload();
            } ).fail( function() {
                console.log( 'Failed to save plugin' );
            } );
            

            $( '#dashhub-modal' ).modal( 'hide' );

        } );
        
    };
    
    $( '#btn-add-plugin' ).click( add_plugin );
    
    var github_credentials = function( cb ) {
    
        // Check if github credentials are known
        var github_username = localStorage.getItem( 'github_username' );
        var github_password = localStorage.getItem( 'github_password' );
        var github_repository = localStorage.getItem( 'github_repository' );
        var encryption_passphrase = localStorage.getItem( 'encryption_passphrase' );

        if ( github_username !== null && github_password !== null && github_repository !== null && encryption_passphrase !== null )
            return cb( github_username, github_password, github_repository, encryption_passphrase );

        $( '#dashhub-modal .modal-title' ).text( "Specify Database Credentials" );

        $body = $( '#dashhub-modal .modal-body' );
        $body.empty();
        $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-username" class="col-lg-4 control-label">GitHub Username</label><div class="col-lg-8"><input class="form-control" id="github-username" type="text" placeholder="Username"></div></div></div>' ) );
        $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-password" class="col-lg-4 control-label">GitHub Password</label><div class="col-lg-8"><input class="form-control" id="github-password" type="password" placeholder="Password"></div></div></div>' ) );
        $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="github-repository" class="col-lg-4 control-label">GitHub Repository URL</label><div class="col-lg-8"><input class="form-control" id="github-repository" type="text" placeholder="Repository"></div></div></div>' ) );
        $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="encryption-passphrase" class="col-lg-4 control-label">Encryption Passphrase</label><div class="col-lg-8"><input class="form-control" id="encryption-passphrase" type="password" placeholder="Passphrase"></div></div></div>' ) );

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
                return cb( github_username, github_password, github_repository, encryption_passphrase );
            } );

            $( '#dashhub-modal' ).modal( 'hide' );

        } );

    };
    
    github_credentials( function( username, password, repository_url, passphrase ) {
        
        try {
            
            storage = githubEncryptedStorage( {
                app_name: 'dashhub',

                github_username: username,
                github_password: password,
                github_repo: repository_url,

                encryption_passphrase: passphrase,
            } );
            
        } catch ( e ) {
            
            console.log( e );
            
            return $( '#dashhub-loader' ).fadeOut( 500, function() {
                $( '#dashhub-error' ).clone().find( '.text' ).text( "No plugins were loaded." ).parent().insertAfter( $( '#dashhub-error' ) ).fadeIn();
            } );
            
        }
        
        $.when( storage.objects( ['plugin'] ) ).then( function( loaded_plugins ) {
            
            plugins = loaded_plugins;
            
            if ( plugins.length <= 0 )
                return $( '#dashhub-loader' ).fadeOut( 500, function() {
                    $( '#dashhub-warning' ).clone().find( '.text' ).text( "No plugins were loaded." ).parent().insertAfter( $( '#dashhub-warning' ) ).fadeIn();
                } );
               
            return $( '#dashhub-loader' ).fadeOut( 500, function() {
                
                var $pp = $( '#plugin-panel' );

                $.each( plugins, function( n, plugin ) {

                    var $panel = $pp.clone();
                    $panel.hide().removeClass( 'collapse' );
                    $panel.data( 'plugin-index', n );
                    
                    $.getScript( plugin.json.repository_url );
                    
                    grid.addWidget( $panel, plugin.json.x ? plugin.json.x : 0, plugin.json.y ? plugin.json.y : 100, plugin.json.width ? plugin.json.width : 3, plugin.json.height ? plugin.json.height : 2 )
                    
                    $panel.fadeIn();

                } );
                
            } );
            
        } );
        
    } );
    
} );

