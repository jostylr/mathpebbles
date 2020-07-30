const fs = require('fs');

const txt = fs.readFileSync('manifest.txt', {encoding:'utf8'});

// added filter to get rid of a spurious blank line at end
const lines = txt.split('\n').filter(line => line);

const prepped = lines.map( (line) => {
     let ret = [];
     const [full, first, ws, heading, symbol] = line.match( /^(.)(\s*)([^.]+)\.*\s*(.*)$/) ?? [];
     if (!heading) {
         console.error("error in parsing line. no heading", line, first, ws,
         heading, symbol);
         throw 'heading';
     }
     let cls;
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
     let level
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
     
     return [heading, cls, level, symbol];
})


const nav = prepped.reduce( (nav, arr) => {
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
}, []);

{
    const navFile = `export let navData = ${JSON.stringify(nav)};
    
    export function slugify (txt='') {
        return txt.toLowerCase().replace(/ /g, '-');
    }
    `; 
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
            join('_')+'.md';
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
        if (old) {
            top = old.split('# GENERATED')[0];
        } else {
            top = `# ${heading}
            
            ## HTML
            
            The video youube should go in the middle; cut and paste. 
            
                _"intro | md"
            
                
            
                _"pebble"
            
            
            ### Intro
            
            
            ### Pebble
            
            
            
            ## Script
            
            
            ## Style
            
            `.replace(/\n {12}/g, '\n');
        }
        
        generated = `# GENERATED
        
        ## Svelte
        
            <script>
                import Nav from '../components/Nav.svelte';
                const actual = [${levels.map(el => '"'  + el + '"').join(',')}];
        
                _"script"
            
            </script>
        
            <style>
                _"style"
            </style>
        
            <Nav {actual} />
        
            _"html"
        
        [../fullsapper/src/routes/${fname.slice(0,-2)+'svelte'}](# "save:")
        
        `.replace(/\n {8}/g, '\n');
        
        file = top + '\n' + generated;
        fs.writeFileSync('src/pages/'+fname, file, {encoding:'utf8'});
        litprorunner.push(`[${fname}](${'pages/'+fname} "load:")`);
        count += 1;
    });
    fs.writeFileSync('pagerunner.md', litprorunner.join('\n'));
}

console.log("done. Saved "+ count + " pages");
