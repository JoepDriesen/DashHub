define( [ 'jquery', 'storage', 'bootstrap', 'gridstack' ], function( $, storage ) {
    
    $( function() {
        
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
        
        storage( 'dashhub' )
            .then( function( db ) {
            
                var coll_plugins = db.getCollection( 'plugins' );
            
                var render_plugins = function() {
                    
                    coll_plugins.find().then( plugins => {

                        $( '#plugin-container' ).on( 'change', function( event, items ) {

                            // For each items that has been moved or resized
                            $.each( items, function( i, item ) {

                                var plugin = plugins[item.el.data( 'plugin-index' )];

                                if ( plugin.x == item.x && plugin.y == item.y && plugin.width == item.width && plugin.height == item.height )
                                    return

                                plugin.x = item.x;
                                plugin.y = item.y;
                                plugin.width = item.width;
                                plugin.height = item.height;

                                if ( plugin.initialized )
                                    return coll_plugins.update( plugin );
                                plugin.initialized = true;

                            } );

                        } );

                        return $( '#dashhub-loader' ).fadeOut( 500, function() {

                            var $pp = $( '#plugin-panel' );

                            $.each( plugins, function( i, plugin ) {

                                var $panel = $pp.clone();
                                $panel.hide().removeClass( 'collapse' );
                                $panel.data( 'plugin-index', i );

                                grid.addWidget( $panel, plugin.x ? plugin.x : 0, plugin.y ? plugin.y : 100, plugin.width ? plugin.width : 3, plugin.height ? plugin.height : 2 )

                                $panel.fadeIn();

                            } );

                        } );

                    } ).catch( function( reason ) {

                        console.log( reason );

                        return $( '#dashhub-loader' ).fadeOut( 500, function() {
                            $( '#dashhub-error' ).clone().find( '.text' ).text( "Failed to load database. Are your GitHub credentials correct?" ).parent().insertAfter( $( '#dashhub-error' ) ).fadeIn();
                        } );

                    } );
                    
                };
            
                var add_plugin = function() {

                    $( '#dashhub-modal .modal-title' ).text( "Add a new Plugin to your DashHub" );

                    $body = $( '#dashhub-modal .modal-body' );
                    $body.empty();
                    $body.append( $( '<div class="form-horizontal"><div class="form-group"><label for="plugin-repository" class="col-lg-4 control-label">Plugin Repository URL</label><div class="col-lg-8"><input class="form-control" id="plugin-repository" type="text" placeholder="repository"></div></div></div>' ) );

                    $footer = $( '#dashhub-modal .modal-footer' );
                    $footer.empty();
                    $footer.append( $( '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button></div><button id="plugin-submit" type="button" class="btn btn-primary">Add Plugin</button></div>' ) );

                    $( '#dashhub-modal' ).modal( 'show' );

                    $( '#dashhub-modal #plugin-submit' ).one( 'click', function() {

                        plugins.insert( {
                            repository_url: $( '#plugin-repository' ).val(),

                        } ).then( function() {
                            $( '#dashhub-modal' ).modal( 'hide' );

                            render_plugins();
                        } ).catch( function() {
                            return $( '#dashhub-error' ).clone().find( '.text' ).text( "Can't add plugins without connection to Github." ).parent().insertAfter( $( '#dashhub-error' ) ).fadeIn();
                        } );


                        $( '#dashhub-modal' ).modal( 'hide' );

                    } );

                };
            
                render_plugins();           

            } )
            .catch( function( reason ) {

                console.log( reason );

                return $( '#dashhub-loader' ).fadeOut( 500, function() {
                    $( '#dashhub-error' ).clone().find( '.text' ).text( "Something went wrong: " + reason ).parent().insertAfter( $( '#dashhub-error' ) ).fadeIn();
                } );

            } );
        
    } );
    /**
        

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
    
    return function() {
        
        
    }
    
    $( function() {

        

        $( '#btn-add-plugin' ).click( add_plugin );
        
    } );**/
    
} );