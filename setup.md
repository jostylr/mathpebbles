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

[../sapper/src/routes/${fname.slice(0,-2)+'svelte'}](# "save:")


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


### Fano Plane

This is a svelte plugin for constructing a seven-symboled Fano Plane. 

