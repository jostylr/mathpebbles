# JS

This is a little js library that should help create reactive and customizable
bindings between inputs, computational functions, and display functions. It's
my attempt to get the functionality I like most out of Svelte though it is
radically less in its scope. Basically, I want to be able manipulate various
things and stuff just propagates. Spreadsheet style, if  you will. 

    _"Dom helpers"

    const mathHelper = _"math helpers"
    // small wrapper here to pass in mathjs and jsxgraph
    const initKeys = _"init keys";
    
    const makeF = function makeF (math) {
        const f = _"function defs::f";
        this.f = f;
        return f;
    }

    const MP = {
        mathHelper, $, $$, show, hide, 
        initKeys, makeF}; 

    export {MP};




[../public/r/common.mjs](# "save")


[function defs](function-defs.md "load:")  These are the mathematical functions we
will use. 


## DOM helpers

This is a collection of little items to help. Mainly $ and $$. 

$ and $$ are simple queryselector(All) replacements where we have an optional
element that we can pass in to limit scope (element can be string that then
gets queried). The $$$ creates elements and optionally replaces them. 


The selector stuff matches the entire css selector to the whole document and
then filters out descendants! So want to implement just the path starting with
the chosen element. Thus, we add a fake class and then add that to the
selector and hope it works well, removing the class when done. 


    const $ = (sel, el) => {
        if (el) {
            if (typeof el === "string") {
                el = document.querySelector(el);
            } 
            el.classList.add('fake-root');
            sel = sel.split(',').map( e => '.fake-root '+e).join(',');
            let ret = document.querySelector(sel);
            el.classList.remove('fake-root');
            return ret;
        } else { 
            return document.querySelector(sel);
        }
    };

    const $$ = (sel, el) => {
        let nodeList;
        if (el) {
            if (typeof el === "string") {
                el = document.querySelector(el);
            } 
            el.classList.add('fake-root');
            sel = sel.split(',').map( e => '.fake-root '+e).join(',');
            nodeList = document.querySelectorAll(sel);
            el.classList.remove('fake-root');
        } else { 
            nodeList = document.querySelectorAll(sel);
        }
        return Array.from(nodeList);
    };
    
    const $$$ = (el, options, target) => {
        _":create"

    }

    const show = (el) => {
        el.classList.remove('hide');
    };

    const hide = (el) => {
        el.classList.add('hide');
    };


[create]()

This creates an element based on the tag. We can also use it to pass in an
element and objects to set attributes. The target is something which does
replacement by default, but if target is an array, then the first element is a
method name to apply to the element that should be the second element and that
method gets the new element as its first argument, e.g.,
target.appendChild(el) could be `(el, null, ['appendChild', target])` 

Apparently, there is no "replace myself" method entirely, so we need to grab
the parent, find the child node that is the target, and replace it through
replace child. I guess?



    if (typeof el === "string") {
        el = document.createElement(el);
    }
    if (options) {
        if (options.class) {
            let cl = options.class.split(' ');
            delete options.class;
            cl.forEach( cls => {
                if (cls[0] == '-') {
                    el.classList.remove(cls.slice(1));
                } else if (cls[0] === '~') {
                    el.classList.toggle(cls.slice(1));
                } else {
                    el.classList.add(cls);
                }
            });
        }
        Object.keys(options).forEach( (key) => {
            el.setAttribute(key, options[key]);
        });
    }
    if (target) { 
        let mode = 'replace';
        let context = target;
        if (Array.isArray(target) ) {
            mode = target[0];
            if (target[2]) {
                context = target[2];
            }
            target = target[1];
        }
        if (typeof target === 'string') {
            target = $(target);
        } 
        if (mode === 'replace') {
            let par = context.parent;
            par.replaceChild(el, context);
        } else {
            if (context !== target) {
                target[mode](el);
            } else {
                target[mode](el, context);
            }
        }
    }
    return el;



## Math helpers

This does a quick abbreviation of some common math operators to make it less
painful to use. 

    (math, Decimal, Fraction) => {
        let subs = _":subs";
        for (const prop in subs) {
            math[prop] = math[subs[prop]];
        }


This does spacing of numbers (based on
[stackoverflow](https://stackoverflow.com/a/16637170)

This is for rendering in latex.


        math.spacedNumber = (a) => { 
            let n, d, e;
            [n, d] = a.toString().split(".");
            if (d) {
                 [d, e] = d.split('e')
                 if (d) {
                     d = d.split('').reverse().join('')
                     d = d.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                     d = d.split('').reverse().join('')
                 }
                 if (e) {
                    d = d+'\\mathrm{E}'+e;
                 }
            }
            n = n.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            if (d) {
                n = n + '.' + d;
            }
            n = n.replace(/ /g,'\\ '); //for latex not collapse spacing
            return n;
        };

This is where we add in direct type construction. 

        math.decimal = Decimal;
        math.precision = (num) => {math.decimal.precision = num};


        math.fraction = Fraction;
        Fraction.prototype.scale = _":scale";

    }

[scale]()

For fraction, want to be able to have non-reduced fractions. We can scale the
individual parts, but when combining fractions, it gets reduced again
(reasonable of course). There should be a boolean REDUCE; it is present in
normal fraction.js, but using bigfraction.js for now. The reduce does has the
issue that say, when adding fractions of same denominator, they still scale
with each other so that 6/8+6/8 = 96/64.  That seems not desired. 

So creating a function that will scale a fraction if given a scale factor. It
takes a second argument boolen to indicate that this should be the new
denominator (true to be denom).

This will scale the fraction, but any manipulations of the fraction will
almost surely lose the scale. So this is basically for display purposes (what
other reason is there anyway?) 

The denominator will ensure that that number is in there, but it may be a
larger number. 

    function (scale, isDenominator) {
        let frac = this.clone();
        scale = BigInt(scale) // using bigints!
        if (isDenominator) {
            let fd = frac.d;
            let fscale = Fraction(scale);
            let gcd = fscale.gcd(fd);
            scale = fscale.div(gcd).n;
        } 
        frac.n = frac.n*scale;
        frac.d = frac.d*scale;
        return frac;
    }


[subs]()

    { 
        sub: "subtract", 
        mul : "multiply", 
        div: "divide", 
        eq : "equal", 
        neq : "unequal",
        gt : "larger", 
        gteq : "largerEq",
        lt : "smaller",
        lteq : "smallerEq",
        neg : "unaryMinus",

    }

## CSS

This is the hook for the CSS to go with the HTML page. 

    _"typed input:css"



### Keyboard commands

So we will listen for keyboard presses to make changes 


## Typed Input

This creates a Var that is displayed in a span by default and, when
selected/clicked, it adds a bottom element to the page for the input. 

We will have various different types, but primarily a real and complex type
being used. 

Other types include discrete (basically normal range element), set/sequence
(basically select option, maybe a slider for the sequence exploration), and
logarithmic which is a multiplicative scale applied to the type. This is more
of an extension type. 

The input should be a container element (null to generate one, string to
select one),  type (string if known type or object that implements a type),
specifics (value, id, label, ?), 
options object to deal with everything else. 

It returns the container element, the Var that the value is related to, and a
settings object that everything else can be tweaked. 

This function is also defined in a context of a keys scope object, a
controller (with a vars, container, and active list), in addition to access to
the math and JXG objects (

type is a creation function.

    function makeTypedInput (container, type, specifics, options) {
        _":initiate container"
        _":initiate type"
        _":apply specifics"

        let [varVal, varScale, localKeys] = type(value, options, { container, line});

        container.addEventListener('click', _":toggle activate");

        return {container, varVal, varScale, line, localKeys};
    }

[initiate container]()

The given container will be the display and will handle the click (will have
enter function this way, to I think). The click will toggle whether the input
is displayed or not. 

    if (container === null) {
        container = $$$('span');
    } else if (typeof container === "string") {
        container = $(container);
    } 
    $$$(container, {class:'typed-input', tabIndex: 0});
    
    let footBoss = controller.container;

    let line = $$$('div', {class:'hide'}); // this will contain the input elements
    footBoss.append(line);


[toggle activate]()

This checks the status of line and acts appropriately: activate if not active
(unhide if needed), deactivate and hide if active.

    () => {
        let cl = line.classList;
        if (cl.contains('hide') ) {
            cl.remove('hide');
            container.classList.add('open');
            controller.activate(container, line, localKeys);
        } else if (controller.primary.line === line ) {
            cl.add('hide');
            container.classList.remove('open');
            controller.deactivate();
        } else {  //already visible, not active, mostly for keyboard
            controller.activate(container, line, localKeys);
        }
    }

[css]() 

Safari outlines this element because of focus stuff and the outline is weird
and unneeded. 

But it is nice to outline the input ones. 

    button.input {
        outline:none;
        padding: 2px 3px 0px;
        background-color: var(--pri-bg-moderate);
    }
    



    button.input:focus, button.input:hover {
       border-bottom-color: pink;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        filter: none;
        border-radius: 2px; 
    }

    button.input.active {
        border: 2px solid green;
        background-color: rgba(105,206,255, 0.3)
    }
    
    .hide { 
        display:none;
    }

Needed some kind of callout for the changing text. Figure a subtle pinkish
grey background gives a feeling of not manipulative. 

    .output {
        background-color: #f9e9e9;
        padding: 2px 3px 0px;
    }


[initiate type]()

Outside of this function, we need to define a types object and have a
defaultType (probably real [linear]) 


    if (typeof type === "string") {
        type = types[type];
    } 
    if (!type) { 
        type = types[types.default];
    }



[apply specifics]()

In specifics, weload attributes to the container element and initiate the
variable of interest.

    let value = null;
    if (specifics) {
        let attrs = specifics.attrs;
        $$$(container, attrs); // applies them through setAttribute or class stuff
        if (specifics.hasOwnProperty('value')) {
            value = specifics.value;
        }
    }

### Init keys

This loads the key listening event and does the loading operation. It will
return the listener for removal if needed (should not be, but...)

For main navigation, we have: 
we use h and l for left-right navigation in a given level (sibling order for
relevant blocks). We use j and k for going up and down levels, closing and
opening as needed. The keys n and m will do input travels, previous and later,
respectively. This allows us to not worry too much about the tabbing order
issue. These are known by inputs. We use b to activate them. 

o and p can navigate between pages. 

The keys will have the default page keys (right hand) and the input will have
their own keys (left). We use the keys on the primary current for those. 

    (controller) => {
        
        const focus = _":focus";
        const getCurrent = () => $('.currentActive') || document.activeElement; 
        const newCurrent = (nxt,cur) => {
            cur = cur ?? getCurrent();
            cur.classList.remove('currentActive');
            console.log("nexted", nxt);
            nxt.classList.add('currentActive');
            nxt.scrollIntoView({behavior:'smooth', block:'center' }); 
        };

        const filter = _":filtering for cur level";

        const keys = {_":global"};
        const getKC = _":get key command";

        const keyDown = _":key down listener";
        document.addEventListener('keydown', keyDown);
        return {keyDown, keys};
    }


[get key command]()

This looks up the key 

    (key) => {
        return controller.primary.localKeys[key] || keys[key] || null
    }


[key down listener]()

If we put null as the first element in keys, we effectively cut this off. This
would be useful for allowing unrestricted use of a text input. Since most of
our input will be numbers and the like, we don't want to do that generally,
but who knows? Actually, maybe we find a null, we stop. That we could have
some keys that respond specially, but we disable the more general stuff. 

    (ev) => {

Textareas are their own thing entirely. 

        if (ev.target.nodeName === 'TEXTAREA') {
            return; // disables key listening in text areaas 
        }

        let f = getKC(ev.key);
        
        if (!f) { return;}

        let bool = (ev.target.nodeName === 'SL-INPUT') ||
           (ev.target.nodeName === 'INPUT')  ;

        if (ev.repeat) {
            if (!f.repeatable) {
                if (bool) {
                    if (!f.input) {
                        return;
                    }
                }
                ev.preventDefault();
                return true;
            }
        }


Text inputs are left alone unless the relevant key command says it is okay to
be used in an input. 

        if (bool) {
            if (ev.target.type === 'text') {
                if (f.input) {
                    f();
                    ev.preventDefault();
                    return true;
                }
                return; 
            }
        }

If we are here, then we want to check for key command.

        f(ev.target);
        
        ev.preventDefault();
        return true;
    }


[global]()


Tried to just click on the buttons programmatically, but that did not work. So
doing next thing of assigning window. 

    o: _":prev nav",
    p : _":prev nav |sub prev, next",
    m : _":item focus",
    n : _":item focus | sub += 1, -= 1",
    b : _":toggle input",
    l : _":item focus | sub .typed-input, .hier",
    h : _":item focus | sub .typed-input, .hier, += 1, -= 1",
    j : _":descend",
    k : _":ascend" 



[prev nav]()

For traveling to other pages in sequence. 

    () => {
        let b = $('.prev');
        let h = b.getAttribute('aria-hidden');
        if (h) { return;} // not clickable
        window.location = window.location.origin + b.getAttribute('href');
    }

[item focus]()

This should be focused on input types. We grab the active element. If it is of
typed-input, then we cycle from there. 

    () => {
        let cur = getCurrent(); 
        _":deal with being in input control"
        let {siblings, index} = filter(cur, '.typed-input');
        index += 1;
        let n = siblings.length;
        console.log(index,n, siblings, cur);
        if (n === 0) { 
            console.error("no siblings", cur);
            return;
        }
        while (index >= n) {
            index -= n;
        }
        while (index < 0) {
            index += n;
        }
        newCurrent(siblings[index]);
    }
  
        
        
[deal with being in input control]()

We could be an active element in input control. We don't want to navigate
there. So we find its partner container in the main body. 

    let inCo = cur.closest('.inputControl');
    if (inCo) {
        let line = cur.closest('.inputControl > *');
        let inps = controller.scopes.inputs;
        for (const key in inps) {
            if (line === inps[key].line) {
                cur = inps[key].container;
                break;
            }
        }
    }


[filtering for cur level]()

So this is a function that takes in an element and a selector. It then returns
an array of siblings that match the selector, the index of the current element
if it matches the selector, and its parent in the hierarchy, and any children
of the hierarchy.

    (el, sel) => {
        let parent = el.parentElement.closest('.hier, body');

        let children = $$('.hier', parent);

        let siblings = $$(sel, parent);

        siblings = siblings.filter( (el) => {
            let anc = el.parentElement.closest('.hier, body',);
            return (anc === parent);
        });

        let index = siblings.indexOf(el); 

        //console.log("filter", el, parent, children, siblings, index);

        return {parent, children, siblings, index};
    }


[toggle input]()

We want to click an input. 

    () => {
        let cur = getCurrent();
        if (cur.matches('.typed-input') ) {
            cur.click();
        }
    }


[descend]()

This opens up 

    () => {
        let cur = getCurrent();
        
If it is an explore link, then we want to follow that link and we are done
here. 

        if (cur.matches('a.explore')) {
            cur.click();
            return;
        }
        if (cur.show) {
            cur.show();
        }
        
We need to look for a suitable element to be current in 

        let nxts = ['.typed-input', '.explore', '.hier'];
        for (let i = 0; i < nxts.length; i += 1) {
            let nxt = $$(nxts[i], cur);
            for (let j=0; j< nxt.length; j += 1) {
               let nxtEl = nxt[j]; 
               if (nxtEl.closest('.hier') === cur) {
                    newCurrent(nxtEl,cur);
                    return;
                }
            }
        }

We went through everything already. So now we do nothing. Descending to first
element is weird as it is probably a descent that is irrelevant. 

        return;
    }

[ascend]()

This will go up to a parent in the hierarchy and will close the current element
if open in some fashion.

    () => {
        let cur = getCurrent();
        let par = cur.closest('.hier, body');
        if (par.hide) {
            par.hide();
        }
        newCurrent(par, cur);

    }


[focus]()

A little helper for bringing stuff into focus. Supports shoelace focus as
first and then html focus fallback. Also checks for existence. ~


    (el) => {
        if (!el) { console.error("nothing passed into focus on"); return;}
        if (el.setFocus) {
            el.setFocus();
        } else if (el.focus) {
            el.focus();
        } else {
            console.error("element not focusable", el);
        }
    }

## Content Loaded


        _":make fano math"
    
        _":highlight fano"


[make fano math]() 

This loops through the nodes of the fano plane and renders the stuff into
them.


    _":safari bug"


    $$('.fano-math').forEach( (div) => {
        if (safari) {
            div.classList.add('safari-fixed');
        }
        let {type, text} = div.dataset;
        if (type === 'latex') {
            let svg = render(text);
            div.append(svg);
        } else if (type === "html") {
            div.innerHTML = text;
        } else if (type==="s") { //shoelace icon
            div.innerHTML = `<sl-icon name="${text}"></sl-icon>`;
        } else if (type==="img") { //remixicon
            div.innerHTML = `<img width="18" height="18" src="/img/${text}" />`;
        } else {

Should add types as needed in the chain. default is plain text. Need children
for measuring actual size. 
            
            div.innerHTML = `<span>${text}</span>`;

        }

        _":centering"

    });
    
[centering]()

Here we try to center the object in question. The coordinates to use are not
the coordinates given by bounding rectangle because it is all scaled. To get
the scale, we get the bounding rectangle for the circle and the foreignObject. We know the size of the circle in the default coordinates so that tell us how to scale. 

    let fo = div.parentElement;
    let fb = fo.getBoundingClientRect();
    let scale = fb.width/20; 
    let child = div.children[0];
    let cb = child.getBoundingClientRect();
    let cbW = cb.width/scale;
    if (cbW > 15) {
        let interval = (cbW-15)*2
        let oldx=fo.getAttribute('x'), oldwidth=fo.getAttribute('width');
        if (oldwidth==20) {
            fo.setAttribute('width', 20 + interval);
        } 
        if (oldx==-5) {
            fo.setAttribute('x', Math.max(-16, -5 - interval) );
        }
    }



[safari bug]()

So safari has a bug in svg rendering with a foreign object. See
https://stackoverflow.com/questions/63690664/safari-macos-foreign-object-not-scaled-properly-inside-svg
and https://stackoverflow.com/questions/51313873/svg-foreignobject-not-working-properly-on-safari

This detects whether it is Safari and then if so, we will add a fixed class to
the elements. 

    let safari = false;
    {
        let ua = navigator.userAgent.toLowerCase(); 
        if ( (ua.indexOf('safari') !== -1) && 
             (ua.indexOf('chrome') === -1) ) {
            safari = true;
        }

    }   


[highlight fano]() 

This is to deal with the element that is the page. It was going to be a parent
page and then one could hop up, but the goal now is to have a fano page
relevant to the page one is on at each level. So now we just want to disable
it. 

    $$('.fano a').forEach( el => {
        let path = el.attributes.href.value.slice(0,-5);
        if (location.pathname.includes(path) ) {
            $('circle', el).classList.add('here');
            el.removeAttribute('href');
        }
    });



