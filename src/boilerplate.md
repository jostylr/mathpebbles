This is the boilerplate html. The export is this first section. 


    <!doctype html>
    <html lang='en'>
    <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width,initial-scale=1.0'>
        <meta name='theme-color' content='#333333'>
        <title> TITLE </title>
    
Shoelaces. Load this first so submodules can load while others load. Found if
katex and jsxgraph were first, then they block loading of elements. 

        <link rel="stylesheet" href="/r/shoelace/shoelace.css">
        <script type="module" src="/r/shoelace/shoelace.esm.js"></script>

        _"templates::global css:version"


        <link rel='manifest' href='manifest.json' crossorigin='use-credentials'>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="alternate icon" href="/favicon.ico">

        <style>
            .hide  {
                display:none;
            }
            /*STYLE*/
        </style>

        <!-- HEADER -->

    </head>
    <body>
    <nav>_"nav"</nav>
    <h1>TITLE</h1>
    BODY
    <script>
        _"onload"
    </script>
    </body>
    </html>

### Nav

Ideally it should look like the standard nav, but without the prev/next and
without chapter/sections, but with all of those areas invisibled out. 

    <div class="prevnext"> _"templates::next prev:empty" _"templates::make nav:plain fano"
    _"templates::next prev:empty" </div>
    <div class="drops"><sl-dropdown>
    <sl-button slot="trigger"  caret>Books</sl-button>
    <sl-button class="hide" href="/arithmetic.html">Arithmetic</sl-button>
    <sl-button class="hide" href="/algebra.html">Algebra</sl-button>
    <sl-button class="hide" href="/geometry.html">Geometry</sl-button>
    <sl-button class="hide" href="/functions.html">Functions</sl-button>
    <sl-button class="hide" href="/many-variables.html">Many Variables</sl-button>
    <sl-button class="hide" href="/probability-and-statistics.html">Probability and Statistics</sl-button>
    <sl-button class="hide" href="/practitioners.html">Practitioners</sl-button>
    </sl-dropdown>

    <sl-dropdown>
    <sl-button slot="trigger" class="empty" caret>Chapters</sl-button>

    </sl-dropdown>

    <sl-dropdown>
    <sl-button slot="trigger" class="empty" caret>Sections</sl-button>

    </sl-dropdown>

    <sl-dropdown>
    <sl-button slot="trigger"  caret>Other</sl-button>
    <sl-button class="hide" href="/about.html">About</sl-button>
    <sl-button class="hide" href="/faq.html">FAQ</sl-button>
    <sl-button class="hide" href="/resources.html">Resources</sl-button>
    <sl-button class="hide" href="/support.html">Support</sl-button>
    <sl-button class="hide" href="/settings.html">Settings</sl-button>
    <sl-button class="hide" href="/toc.html">Table of Contents</sl-button>
    <sl-button class="hide" href="/book-index.html">Index of Content</sl-button>
    </sl-dropdown>
    </div> 

## Onload

This is the script that runs on load. As far as I know, the only thing needed
is to unhide the drop down stuff. 

    _"common::dom helpers"

    document.addEventListener("DOMContentLoaded", function() {
        $$('nav  sl-button' ).forEach(el => el.classList.remove('hide'));
    });

