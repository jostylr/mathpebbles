This processes manifest.txt to produce the 399 files whose headings it lists. 

The file is formatted as 

    -BOOKNAME. Symbol
    -   CHAPTERNAME. Symbol
    -       SECTIONNAME

And so on. 

We want to build a navigation from this, several Fano planes, and the literate
program files for each of these, appropriately setup to build .svelte files. 


## Parser

This is a script that will parse out manifest.txt and will produce the
necessary modifications. 

[../init.js](# "save:")

    const fs = require('fs');

    const txt = fs.readFileSync('manifest.txt', {encoding:'utf8'});

    // added filter to get rid of a spurious blank line at end
    const lines = txt.split('\n').filter(line => line);

    const prepped = lines.map( (line) => {
         _"parse line"
    })

    
    const nav = prepped.reduce( (nav, arr) => {
        _"make nav data"
    }, []);

    {
        const navFile = _"make nav file"; 
        fs.writeFileSync('sapper/src/components/navData.js', navFile);
    }


    let litprorunner = [];
    let generate = true;
    let count = 0;
    if (generate) {
        let levels = [];
        prepped.forEach( (arr) => {
            let [heading, c, l, s] = arr;
            levels.length = l;
            levels[l] = heading;
            let fname = levels.
                map( el => el.toLowerCase().replace(/ /g, '-').trim()).
                join('\_')+'.md';
            let old = '';
            try {
                old = fs.readFileSync('src/pages/'+fname, {encoding:'utf8'});
            } catch (e) {
                //console.log(e);
                old = '';
            }
            let generated = '';
            let top = ''; 
            let file = '';
            _"make litpro file"
            fs.writeFileSync('src/pages/'+fname, file, {encoding:'utf8'});
            litprorunner.push(`[${fname}](${'pages/'+fname} "load:")`);
            count += 1;
        });
        fs.writeFileSync('pagerunner.md', litprorunner.join('\n'));
    }
    
    console.log("done. Saved "+ count + " pages");



### Parse line

The first character is the status (- nothing, t text,  v video/text, p pebble/text, ~ in general draft state, actual digit, version, = past version 9) . Then there may be indentation indicating the level. There could be a period; that signals the end of the heading and the start of a latex symbol for the fano plane. 

    let ret = [];
    const [full, first, ws, heading, symbol] = line.match( /^(.)(\s*)([^.]+)\.*\s*(.*)$/) ?? [];
    if (!heading) {
        console.error("error in parsing line. no heading", line, first, ws,
        heading, symbol);
        throw 'heading';
    }
    let cls;
    _":assign class"
    let level
    _":assign level"

    return [heading, cls, level, symbol];


[assign class]() 

The classes are based on the symbol. 

    switch (first) {
    case '-' : 
        cls = 'empty';
    break;
    case 't' : 
        cls = 'text';
    break;

    case 'v' : 
        cls = 'video';
    break;
    case 'p' : 
        cls = 'pebble';
    break;
    case '~' : 
        cls = 'draft';
    break;
    case '=' :
        cls = 'done';
    break;
    default: 
        cls = first;
    break;
    }


[assign level]()

If the whitespace is 0, then level 0, if 3 then level 1, if 7 then level 2, if
anything else error

    switch (ws) {
    case '' : 
        level = 0;
    break;
    case '   ' : 
        level = 1;
    break;
    case '       ' : 
        level = 2;
    break;
    default:
        console.error("unrecognized number of spaces in leading line",
        ws.length);
    break;
    }


### Make Nav Data

We have parsed the lines into prepped. Each line is now an array of [heading,
class, nav level, and possible a symbol]. For us nav levels do not exceed 2.
All levels of 0 and 1 have children levels (7 each). So this converts the
prepped into an object with keys h, c, l, and s, respectively to the data, but
for levels 0 and 1, we create an array of the descendants and put that in key
d. 

We do this by a reduce maneuver where the top component is an array that
contains the top level 0. The last item in that array is the current one. If
we are at deeper levels, we descend through the descendant arrays. 

We ignore class empty for now since that is the majority. This should be
switched when most are done. 

    let nobj = { h : arr[0] };
    if (arr[1] !== 'empty') {
        c = arr[1];
    }
    if (arr[3]) {
        nobj.s = arr[3];
    }
    let level = arr[2];
    if (level === 0) {
        nobj.d = [];
        nav.push(nobj);
        return nav;
    }
    let current = nav[nav.length-1].d;
    if (level === 1) {
        nobj.d = [];
        current.push(nobj);
        return nav;
    }
    current = current[current.length-1].d;
    current.push(nobj);
    return nav;


### Make Nav File

This takes in a prepared nav object and constructs the appropriate text for
exporting in a js file. It also include the slugify function which converts a
header into the href form we want. Included here for consistency (very small
function). 


```
`export let navData = ${JSON.stringify(nav)};

export function slugify (txt='') {
    return txt.toLowerCase().replace(/ /g, '-');
}
`
```

### Make litpro file

This assembles the litpro file. We need to cut the generated content and then
add in the new content. 

    if (old) {
        top = old.split('# GENERATED')[0];
    } else {
        top = `_":top"`.replace(/\n {12}/g, '\n');
    }

    generated = `_":gen"`.replace(/\n {8}/g, '\n');

    file = top + '\n' + generated;

[gen]()

```
# GENERATED

## Svelte

    <script>
        import Nav from '../components/Nav.svelte';
        const actual = [${levels.map(el => '"'  + el + '"').join(',')}];

        \_"script"
    
    </script>

    <style>
        \_"style"
    </style>

    <Nav {actual} />

    \_"html"

[../fullsapper/src/routes/${fname.slice(0,-2)+'svelte'}](# "save:")


```

[top]()

```
# ${heading}

## HTML

The video youube should go in the middle; cut and paste. 

    \_"intro | md"

    

    \_"pebble"


### Intro


### Pebble



## Script


## Style


```


### Nav

This handles the nav as a whole. It depends on nav item and the data in the
item. 
    
    


<script>
  import NavItem from './NavItem.svelte';
  export let actual = [''];

  const base = [
      ['Arithmetic', [
        [ 'Counting', 
          [ 'Number as Matching',
          'Pebbles of Various Sizes']
        ],
        ['Addition', 
          ['Single Digit',
            'Many Digit'
          ]
        ] ]
      ],
    ['Algebra', [ 
      ['Lines', [
        'Steps',
        'Slopes'
      ] ],
      ['Quadratic', [
        'Notions of Quadratics'
      ] ]
    ] ]
      ];
  let clicked = actual;

  let book, chapter, section;
  $: [book, chapter, section] = clicked;
  const books = base.map( (arr) => arr[0]);
  

  let chapters, sections;
  $: if (book) {
    let basechapters = base.find( (arr) =>  arr[0] === book)[1];
    chapters = basechapters.map( arr => arr[0]);
    if (chapter) {
      sections = basechapters.find( (arr) => arr[0] === chapter )[1];
    } else {
      sections = null;
    }
  } else {
    chapters = null;
    sections = null;
  }

  const select = function (evt) {
     clicked = evt.detail;
  };

</script>

<style>

  ul {
    disply:flex;
    list-style: none;
  }

  .book li {
    background-color:red;
  }

</style>



<nav>
  <ul class="book">
    {#each books as ebook}
      <NavItem layers={[ebook]} {actual} on:sel={select} />
    {/each}
	</ul>
    {#if chapters}
  <ul>
      {#each chapters as echapter}
        <NavItem layers={[book, echapter]} {actual} on:sel={select} />
      {/each}
	</ul>
      {#if sections}
  <ul>
        {#each sections as esection}
          <NavItem layers={[book, chapter, esection]} {actual} on:sel={select} />
        {/each}
	</ul>
      {/if}
    {/if} 
</nav>

### NavItem

This is where we create the actual nav items. For books or chapters, clicking
on them should create/replace the next layer below. For sections, the final
layer should be just a button to the page. 
    
    _"| svelte _":script", _":style", _":html" "

[components/NavItem.svelte](# "save:")

[html]()



[script]()

<script>
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let layers = [];
  export let actual = [];

  let name, href, current, section;
  $: [name, href] = slugify(layers);
  $: current = checkCurrent(layers);
  $: section = (layers.length === 3) ? 'section' : undefined; 


  function slugify (args) {
    let slugs = args.map( txt => 
      txt.toLowerCase().replace(/ /g, '-')
    );
    console.log('slugs', slugs);
    return [ 
      args[args.length-1],
    slugs.join('_')
    ]
  };

  function checkCurrent (args) {
    return (args.every( (el, i) => el === actual[i]));
  };

  function makeSelection () {
    console.log('link clicked', layers);
    dispatch('sel', layers);
  }


</script>

<style>

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: inline-block;
	}

  li {
    display: inline-block;
    background-color: paleturquoise;
    padding: 0 0.5rem;
    margin: 0 1em;
    border-radius: 2em;
  }

  li.section { 
    background-color: red;
  }

</style>

{#if section}
  <li class="section" aria-current="{current ? 'page' : undefined}"><a {href}>{name}</a></li>
{:else}
<li aria-current="{current ? 'page' : undefined}"><span on:click={makeSelection}>{name}</span><a  {href} >&#8594;</a></li>
{/if}


## Katex


    <script>

    import {onMount} from 'svelte'

    export let str = '';
    export let block = false;
    let mathel;

    let katex = {render:() => {}};

    $: str = str.
        replace(/\!\@/g, '\\').
        replace(/\&\#36\;/g, '\\$');
    $: console.log("katex:", str);
    $: katex.render(str, mathel, {displayMode:block, throwOnError:false});


    onMount( () => {
        if (!window.katex) {
            window.addEventListener('DOMContentLoaded', (event) => {
                katex =  window.katex;
                katex.render(str, mathel, {displayMode:block, throwOnError:false});
            });
        } else {
            katex =  window.katex;
            katex.render(str, mathel, {displayMode:block, throwOnError:false});
        }
    });

    
    </script>
     
    <span bind:this={mathel}></span>


[../sapper/src/components/Katex.svelte](# "save:")

## JXG

A couple of helpful bits:  https://www.intmath.com/cg3/jsxgraph-coding-summary.php


This creates a simple board for JSXGraph. To use, have something like `<Jxg
{options} id="..." {f} width, height optional />  The function f is how we
get to the board. It should be something like `let a; const f = (b) => a=b;`. 


    <script>

    import {onMount} from 'svelte'

    export let options = {};
    export let id;
    export let f;
    export let width = '500px';
    export let height = '500px';
    
    options = { 
        showCopyright:false,
        showNavigation:false,
        axis: true,
        ...options};
    
    onMount( () => {
        if (!window.JXG) {
            window.addEventListener('DOMContentLoaded', (event) => {
                let b = window.JXG.JSXGraph.initBoard(id, options);
                f(b); // sends b to the parent 
            });
        } else {
            let b = window.JXG.JSXGraph.initBoard(id, options);
            f(b); // sends b to the parent 
        }
    });

    </script>

    <div {id} style="{`width:${width}; height:${height}`}"></div>



[../sapper/src/components/Jxg.svelte](# "save:")


## Layout


    <script>

    </script>

    <style>
       /* main {
            position: relative;
            max-width: 56em;
            background-color: white;
            padding: 2em;
            margin: 0 auto;
            box-sizing: border-box;
        }*/
    </style>

    <slot></slot>

[../sapper/src/routes/\_layout.svelte](# "save:")
[../fullsapper/src/routes/\_layout.svelte](# "save:")


##  Template html


    <!doctype html>
    <html lang='en'>
    <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width,initial-scale=1.0'>
        <meta name='theme-color' content='#333333'>

Katex  global: katex

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js" integrity="sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4" crossorigin="anonymous"></script>
JSXGraph  global: JXG
        
        <script type="text/javascript" charset="UTF-8" defer
         src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.1.0/jsxgraphcore.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.1.0/jsxgraph.css" />


        %sapper.base%

        <link rel='stylesheet' href='global.css'>
        <link rel='manifest' href='manifest.json' crossorigin='use-credentials'>
        <link rel='icon' type='image/png' href='favicon.png'>

        <!-- Sapper generates a <style> tag containing critical CSS
             for the current page. CSS for the rest of the app is
             lazily loaded when it precaches secondary pages -->
        %sapper.styles%

        <!-- This contains the contents of the <svelte:head> component, if
             the current page has one -->
        %sapper.head%
    </head>
    <body>
        <!-- The application will be rendered inside this element,
             because `src/client.js` references it -->
        <div id='sapper'>%sapper.html%</div>

        <!-- Sapper creates a <script> tag containing `src/client.js`
             and anything else it needs to hydrate the app and
             initialise the router -->
        %sapper.scripts%
    </body>
    </html>

[../sapper/src/template.html](# "save:")





## Single

Sapper seems to take about 30s to compile the whole site and a single file
change seems to trigger a recompile or something (20 s). So we have two sapper
folders, one (fullsapper) is the full for export and checking out the whole, and a second one (sapper) which contains more the single files. This little script compiles the litpro for a single file and then copies it from the full to the single sapper. 


    #! /bin/bash
    
    set -e

    literate-programming "src/pages/$1.md"

    cp "fullsapper/src/routes/$1.svelte" "sapper/src/routes/$1.svelte"


[../single](# "save:")


## Sync Sap

This does a sync from the sapper to the full-sapper src directory. The idea is
that the sapper directory is our working directory to test it all out. Then
full sapper is where we build the full site (production version, if you will). 

    #! /bin/bash

    rsync -av sapper/src/ fullsapper/src/

[../sync-sap](# "save:")


## Fano Page 

This is the page that allows us to select the Fanos (eventually).


    <script>
        import FanoController from '../components/FanoController.svelte'
    </script>

    <FanoController which='' level=7 />


[../sapper/src/routes/fano.svelte](# "save:")


### Fano Controller

This is a page just for Fano. 

    <script>
        import Fano from './Fano.svelte'
        import { navData, slugify } from '../components/navData.js'

        export let which = '';
        let slugwhich;
        $:slugwhich = slugify(which);
        export let level = 7;

        let symbols;

        _":make fano object"

        $: symbols.length = level;

        _":extract"

    </script>

    
    <Fano {symbols} />


[../sapper/src/components/FanoController.svelte](# "save:")

[make fano object]()


    $: if (which) {
        let arr = navData.find( (el) => el.h === which);
        symbols = extract(arr);
    } else {
        symbols = extract(arr);
    }

[extract]() 

    function extract (arr) {
        return arr.map( el => {
            let href = slugify(el.h); 
            if (which) {
                href = slugwhich + '\_' + href; 
            } 
            return {href, symbol: el.s, title: el.h}; 
        });
    }

### Fano Plane

This is a svelte component for constructing a seven-symboled Fano Plane. It
expects an array with seven symbols. 

    <script>
        import FanoEl from './FanoEl.svelte';
    
        export let symbols;

        export let centers = [
            [50,500], 
            [300, 500], 
            [175, 283.5], 
            [425, 283.5],
            [550, 500],
            [300, 67],
            [300, 355.6]
        ];
    </script>


    <svg width="600" height="600" id="svg2">
        <circle cx="300" cy="355.66243" r="144.33756" fill="none" stroke="black" stroke-width="2"/>
        <polygon fill="none" stroke="black" stroke-width="2" points="50,500 550,500 300,66.98729"/>
        <line x1="50" y1="500" x2="425" y2="283.49364" stroke="black" stroke-width="2"/>
        <line x1="550" y1="500" x2="175" y2="283.49364" stroke="black" stroke-width="2"/>
        <line x1="300" y1="500" x2="300" y2="66.98729" stroke="black" stroke-width="2"/>
    
        {#each symbols as {href, symbol, title}, ind (href) }
            <FanoEl {href} {symbol} {title} tr={centers[ind]} />
        {/each}
    </svg> 

[../sapper/src/components/Fano.svelte](# "save:")


[junk]()


        <circle cx="550" cy="500" r="20" fill="black" stroke="none"/>
        <circle cx="300" cy="66.98729" r="20" fill="black" stroke="none"/>
        <circle cx="300" cy="355.66243" r="20" fill="black" stroke="none"/>
        <circle cx="300" cy="500" r="20" fill="black" stroke="none"/>
        <circle cx="175" cy="283.49364" r="20" fill="black" stroke="none"/>
        <circle cx="425" cy="283.49364" r="20" fill="black" stroke="none"/>
      

### Fano Circle

This is a component for a fano circle element. It expects an href and a symbol
for Katex. It should be short. 

    <script>
        import Katex from './Katex.svelte';

        export let href;
        export let tr;
        export let symbol;

        export let rx = 20;
        export let ry = 20;
        export let cx = 0;
        export let cy = 0;
        export let x = -17;
        export let y = -10;
        export let height = 20;
        export let width = 35;
        export let stroke = "black";
        export let strokewidth = "1px";
        export let fill = "white";


    </script>

    <style>
        div  {
            text-align:center;
        }
    </style>

    <g transform="{`translate(${tr[0]}, ${tr[1]})`}" {stroke} stroke-width={strokewidth}>
        <ellipse {cx} {cy} {rx} {ry} {fill}></ellipse>
        <a {href} title="Arithmetic" >
            <foreignObject {height} {y} {width} {x}>
                <div><Katex str={symbol} /> </div>
            </foreignObject>
        </a>
    </g>

    
[../sapper/src/components/FanoEl.svelte](# "save:")
    

