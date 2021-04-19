# Listings

This is the full list of pages involved in this, listed in order for the next,
previous stuff to be setup correctly. We autogenerate the full part below. Do
not write below it. 

## Links

    _"full|createlinks"

## createLinks

    function createLinks (text) {
        let doc = this;
        const ret = {};
        const arr = text.split('\n').map(line=> {
             const [propath, name] = line.split('|').map(e=> e.trim())
             let [progress, path] = [propath[0],  '/'+propath.slice(1)];
             return {progress, path, name};
        });
        arr.
            forEach( ({progress, path, name}, ind, arr) => {
            let pieces = path.split('/');
            if (!pieces[1]) {pieces.pop(); } //main should have 1
            let type;
            switch (pieces.length) {
                case 1 : type = 'main'; break; 
                case 2 : type = 'book'; break;
                case 3 : type = 'chapter'; break;
                case 4 : type = 'section'; break;
                default : type = 'main'; 
            }
            let prefix = pieces.slice(0, -1).join('/');
            if (!prefix) {prefix = '/';} //top level
            ret[path] = {
                prev :  arr[ind-1]?.path || '', 
                next : arr[ind+1]?.path || '',  
                progress,   
                type, 
                prefix,
                name, 
                children: [] 
            };
            if (name !== 'MathPebbles') {  //prevents main from being added
                ret[prefix].children.push( [name, path]);
            }
        });
        return JSON.stringify(ret);
    }

[createlinks](# "define:")

[createlinks.js](# "save:")

## FULL

    0 | MathPebbles
    0algebra | Algebra 
    0algebra/lines | Lines
    0algebra/lines/shortest-distance | Shortest Distance 
    0algebra/lines/circles--angles--and-triangles | Circles, Angles, and Triangles
