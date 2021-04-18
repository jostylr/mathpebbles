# Listings

This is the full list of pages involved in this, listed in order for the next,
previous stuff to be setup correctly. We autogenerate the full part below. Do
not write below it. 

## Links

    _"full|createlinks"

## createLinks

    function (text) {
        let doc = this;
        const arr = text.split('\n').map(el=>el.trim());
        const ret = {};
        arr.forEach( (key, ind) => {
            let progress = key[0];
            ret[key.slice(1)] = [
                (arr[ind-1] || ' /').slice(1), //remove prefix
                (arr[ind+1] || ' /').slice(1), 
                progress]
            ;
        });
        return JSON.stringify(ret);
    }

[createlinks](# "define:")

## FULL

    0alegbra
    0algebra/lines
    0algebra/lines/shortest-distance
    0algebra/lines/lines--circles--angles--and-triangles
