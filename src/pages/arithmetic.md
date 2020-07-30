# Arithmetic

## HTML

The video youube should go in the middle; cut and paste. 

    _"intro | md | katex"

    _"pebble"


### Intro

    Some stuff. $x^2$. A $$\\$ \sin( \frac{x}{x^3} )$$ expression \\$ 

    Hi

### Pebble
    
    <button on:click="{toggle}">Toggle</button>

    {#if toggled}
    <input type="text" bind:value={mtext} />
    <input type="text" bind:value={pA} />
    <input type="text" bind:value={pB} />
    <Katex str={mtext} block={true} />
    <Jxg id="jxgbox" width="500px" height="500px"
    options="{{showNavigation:true}}" {f} />
    {/if}


### katex f

Defines a katex function

    (text) => {
        text = text.replace(/\\\$/g, '&#36;');
        
        text = text.replace(/\$\$([^$]*)\$\$/g, (m, mtext, offset, whole) => {
                let ktds = mtext.
                    replace(/"/g, "''").
                    replace(/\\/g, '!@');
                let katex = '<Katex str="{"' + ktds + '"}" block={true} />';
                return katex;
            });

        text = text.replace(/\$([^$]*)\$/g, (m, mtext, offset, whole) => {
                let ktds = mtext.
                    replace(/"/g, "''");
                let katex = '<Katex str="{"' + ktds + '"}"/>';
                return katex;
            });

        return text;
    }

[katex](# "define:")


## Script
    
    import Navnew from '../components/Navnew.svelte'
    import Katex from '../components/Katex.svelte'
    import Jxg from '../components/Jxg.svelte'

    let mtext = '\\frac{-b \\pm \\sqrt{b^2 -4ac}}{2a}';

    let toggled = false;
    function toggle () {
        toggled = !toggled;
    }

    let b, p1, p2, li;
    let f = (a) => {
        b=a;
        p1 = b.create('point',[pAx,pAy], {name:'A',size:4});
        p2 = b.create('point',[pBx,pBy], {name:'B',size:4});
        li = b.create('line',["A","B"], {strokeColor:'#00ff00',strokeWidth:2});
    };

    let pA = '0,0';
    let pB = '1,1';

    let pAx = () => parseInt(pA.split(',')[0]);
    let pAy = () => parseInt(pA.split(',')[1]);
    let pBx = () => parseInt(pB.split(',')[0]);
    let pBy = () => parseInt(pB.split(',')[1]);

    let noop = () => {};

    $: if (b) {
        noop(pA, pB);
        b.update();
    }



## Style


# GENERATED

## Svelte

    <script>
        import Nav from '../components/Nav.svelte';
        const actual = ["Arithmetic"];

        _"script"
    
    </script>

    <style>
        _"style"
    </style>

    <Nav {actual} />

    _"html"

[../fullsapper/src/routes/arithmetic.svelte](# "save:")

