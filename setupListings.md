# Listing Setup

This is to set up the listings. In particular, replacing the ## Full stuff and
below. 

We read from the manifest page


    import * as fs from 'fs/promises';

    const [txt, listings, toc] = await Promise.all([
        fs.readFile('manifest.txt', {encoding:'utf8'}),
        fs.readFile('src/listings.md', {encoding:'utf8'}),
        fs.readFile('src/other/toc.md', {encoding:'utf8'})
    ]);

    const slugify = _"slugify";

    // added filter to get rid of a spurious blank line at end
    const lines = txt.
        split('\n').
        filter(line => line).
        map( (line) => {
            _"parse line"
        });

    let book = '';
    let chapter = '';
    let newlist = [];
    let newtoc = [];
    let cur = 0; 
    newlist.push('    0 | MathPebbles | '); 
    newtoc.push('    <h3> <a href="/index.html">MathPebbles</a></h3>');
    lines.forEach( ({heading, level, symbol, cls}) => {
        let path = '';
        if (level === 2) {
            path = `${book}/${chapter}/${slugify(heading)}`;
            if (cur !== 2) {
                newtoc.push('<ol class="sections">');
            } else {
                newtoc.push('</li>');
            }
            cur = 2;
        } else if (level === 1) {
            chapter = slugify(heading);
            path = `${book}/${chapter}`; 
            if (cur === 2) {
                newtoc.push('</li>','</ol>');
            } else if (cur === 0) {
                newtoc.push('<ol class="chapters">');
            }
            cur = 1;
        } else if (level === 0) {
            if (cur === 2) {
                newtoc.push('</li>','</ol>'); //close section
                newtoc.push('</li>','</ol>'); //close chapter;
            } else if (cur == 1) { //shouldn't happen
                console.log('a book finished a chapter instead of a section', heading);
            } else if (cur === 0) { //should only happen at start
                newtoc.push('<ol class="books">');
            }
            cur = 0;
            book = slugify(heading);
            path = book;
        }
        newlist.push(`${cls}${path} | ${heading} | ${symbol || ''}`);
        newtoc.push(`<li class="progress-${cls}"><a href="${path}.html">${heading}</a>`);
    });
    let close = ['</li>','</ol>'];
    newtoc.push(...close, ...close, ...close);

    let ind = listings.indexOf('## FULL');
    let newlisting = listings.slice(0,ind) + '## FULL\n\n' + newlist.join('\n    ');

    let tocInd = toc.indexOf('## CONTENT');
    let newtochtml = toc.slice(0,tocInd) + '## CONTENT\n\n' + newtoc.join('\n    ');

    //console.log(newlisting);
    //console.log(newtochtml);

    await Promise.all([
        fs.writeFile('src/listings.md', newlisting),
        fs.writeFile('src/other/toc.md', newtochtml)
    ]);

    console.log('successfully wrote listings.md  and toc.md');

[../setupListings.mjs](# "save:")

## slugify


    (str) => {
        return str.
            trim().
            toLowerCase().
            replace(/\, /g, '--').
            replace(/ /g, '-')
    }




## Parse line

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

    return {heading, cls, level, symbol};


[assign class]() 

The classes are based on the symbol. 

    switch (first) {
    case '-' : 
        cls = '0'; //very little done
    break;
    case 't' : 
        cls = '1'; //text written, planned out
    break;

    case 'v' : 
        cls = '3'; // videos done
    break;
    case 'p' : 
        cls = '2'; //pebbles done
    break;
    case '~' : 
        cls = '4'; //most things done
    break;
    case '=' :
        cls = '5'; //reviewed and done
    break;
    default: 
        cls = first;  //could just use numbers
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




# Setup Pages

This will wipe out existing content. Do not run after the first time. Or make
a copy or something. 

    import * as fs from 'fs/promises';

    const txt = await fs.readFile('manifest.txt', {encoding:'utf8'});

    const slugify = _"slugify";

    // added filter to get rid of a spurious blank line at end
    const lines = txt.
        split('\n').
        filter(line => line).
        map( (line) => {
            _"parse line"
        });

    let book = '';
    let chapter = '';
    let pages = {
        'mathpebbles' : {heading:'MathPebbles', level:-1, symbol:'',
        slug:'mathpebbles', path:['index'], children:[]}
    };
    lines.forEach( ({heading, level, symbol}) => {
        let slug = slugify(heading);
        let path;
        if (pages.hasOwnProperty(slug) ) {
            throw `Page already defined: ${slug}, ${heading, level, symbol}`; 
        }
        if (level === 2) {
            path = [book,chapter,slug];
            pages[chapter].children.push({heading, slug, path});
            pages[slug] = {heading, level, symbol, slug, path, children:[]};
        }
        if (level === 1) {
            chapter = slug;
            path = [book,slug];
            pages[book].children.push({heading, slug, path});
            pages[slug] = {heading, level, symbol, slug, path, children:[]};
        }
        if (level === 0) {
            book = slugify(heading);
            path = [book];
            pages.mathpebbles.children.push({heading, slug, path});
            pages[slug] = {heading, level, symbol, slug, path, children:[]};
        }
    });
    
    let copy = `_"generated content"`;


    let writers =  Promise.all(Object.keys(pages).map( 
        (key)  => {
            const {heading, level, symbol, slug, path, children} = pages[key];


            let pagechild = children.map(  ({heading, slug, path}, ind) => {
                return `/${path.join('/')},  \_'${heading}'`; 
            }).join(',\n            ');

            let sections = children.map( ({heading, slug, path}, ind) => {
                return `## ${heading}\n\n` +

                `    \_"${slug}::intro"\n` +
                `\n\n[${slug}](pages/${path.join('\_')}.md "load:")`;
            }).join('\n\n');

            let pebbles = children.map( ({heading, slug, path}, ind) => {
                return `    \_"${slug}::intro:pebble"\n`;
            }).join('\n');

            let code = children.map( ({heading, slug, path}, ind) => {
                return `    \_"${slug}::intro:code"\n`;
            }).join('\n');



            if (children.length === 0) {
                let pcarr = [];
                sections = '';
                pebbles = '';
                code = '';
                for (let i = 1; i < 8; i += 1) {
                    pcarr.push( `ec('sub ${i}'), \_'sub ${i} |md '`);
                    sections += `## sub ${i}\n\n\n` + 
                        '\n\n[pebble]()\n\n\n[code]()\n\n\n';
                    pebbles += `    \_"sub ${i}:pebble"\n\n`;
                    code += `    \_"sub ${i}:code"\n\n`;
                }
                pagechild = pcarr.join(',\n            ');
            }




            let txt = copy.
                replace('HEADING', heading).
                replace('URL', path.join('/')).

The Page command takes in the pieces part and then it needs the directory url
part, title of the page, intro section and then the title and section.

                replace('PAGE',`\_"pieces | page ${
                '/'+path.join('/')}, \_'intro |md',
                ${pagechild}"`).
                replace('SECTIONS', sections).
                replace('PEBBLES', pebbles).
                replace('CODE', code);
        
            

            return fs.writeFile('src/pages/' + path.join('\_') +'.md', txt);
    }));

    await writers;

    console.log("success writing all pages!");



[../setupPages.mjs](# "save")   VERY DANGEROUS TO USE; REWRITES ALL CONTENT


### Generated content

    # HEADING

        PAGE

    [../public/URL.html](# "save:")


    ## Intro

    [pebble]()

    [code]()

    ## Pieces

        !- style
        \_":style"
        !- script
        \_":script"
        !- pebbles
        \_":pebbles"
        !- code
        \_":code"
        !- header
        \_":header"
        !- begin
        \_":begin"
        !- end
        \_":end"
    
    [style]() 

    [script]()

    [pebbles]()

    PEBBLES

    [code]()

    CODE

    [header]()

    [begin]()

    [end]()

    SECTIONS
