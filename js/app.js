/* Boot: set the active page, apply theme, connect to Supabase, load data */
S.tab=PAGE;
applyPalette();
sb=supabase.createClient(CFG.url.trim().replace(/\/rest\/v1\/?$/,'').replace(/\/+$/,''),CFG.key.trim());
load().catch(function(e){if(!ready)$('#view').innerHTML='<section class="card"><h2>Could not load your data</h2><p class="mu">Check your Supabase URL and key, and that migration.sql has been run.</p><p style="margin-top:12px">Error: '+esc((e&&e.message)||e)+'</p></section>'});
