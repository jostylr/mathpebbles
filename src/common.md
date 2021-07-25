# JS

This is a little js library that should help create reactive and customizable
bindings between inputs, computational functions, and display functions. It's
my attempt to get the functionality I like most out of Svelte though it is
radically less in its scope. Basically, I want to be able manipulate various
things and stuff just propagates. Spreadsheet style, if  you will. 

    _"Dom helpers"

    const mathHelper = _"math helpers"
    
    _"keyboard commands"
    
    const makeF = function makeF (math) {
        const f = _"function defs::f";
        this.f = f;
        return f;
    }

    const MP = { keys,
        mathHelper, $, $$, show, hide, 
         makeF}; 

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
replace child. I guess? TODO == replaceWith? Not sure why not. 



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

TODO: This is some random css that should be organized into a better location.
Mainly button stuff.

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



### Keyboard commands

So we will listen for keyboard presses to make changes to the input element if
the keys match. Within the input, we will have a notion of the active text
input, which will have underline underneath it. For a fraction, it can be
numerator, denominator, or the whole fraction being added to something.

The keys are as follows: 

* left : decrease increment
* right: increase increment  (kind of like selecting the decimal place)
* up : add increment
* down : subtract increment
* #: focus on number text
* ^ : focus on increment text
* esc : flips to active button in main text
* <  > :  these cycle through active input numbers for something like a matrix
  or systems or polynomials, etc
* We can use the asterisk `*` to indicate multiply or divide by the increment. 
* The `/` slash can represent toggling through the fraction parts: numerator,
  denominator, and whole. 

The reason for having separate cycling commands is that types of numbers can
be combined. We can have complex fractions in a matrix, for example. This may
require some work to make actually happen, but it can be done and we want to
leave open that option. 



    const keys = {_":global"};
    keys['Escape'].input = true;
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach( str => {
        keys[str].repeatable = true;
    });
    const keyListener = _":key down listener";
    document.addEventListener('keydown', keyListener);


[key down listener]()

If we put null as the first element in keys, we effectively cut this off. This
would be useful for allowing unrestricted use of a text input. Since most of
our input will be numbers and the like, we don't want to do that generally,
but who knows? Actually, maybe we find a null, we stop. That we could have
some keys that respond specially, but we disable the more general stuff. 

    (ev) => {
        let f = keys[ev.key];
        if (!f) {return;}
        let stopDef = false;

        if (ev.target.nodeName === 'TEXTAREA') {
            if (f.textarea) {
                _":f call"
            } else {
                return; // disables key listening in text areaas 
            }
        }

        let bool = (ev.target.nodeName === 'INPUT')  ;

This prevents repeat keys from happening unless we want it to. The input
behavior is there to allow the default or not, depending on whether the
original key gets is not intercepted or is.  

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


Inputs are left alone unless the relevant key command says it is okay to
be used in an input. Since we want to use arrows and such, it is more than
just text inputs that could get messed up. 

        if (bool && !f.input) {
            return; 
        }

If we are here, then we want to check for key command.

        _":f call"
    }

[f call]()

    stopDef = f(ev.target);
    if (stopDef) {
        ev.preventDefault();
        return true;
    } else {
        return;
    }

[global]()



Tried to just click on the buttons programmatically, but that did not work. So
doing next thing of assigning window. 

    ArrowUp :  _":btn",
    ArrowDown : _":btn | sub add, sub",
    ArrowLeft : _":btn | sub add, lower",
    ArrowRight : _":btn | sub add, raise",
    '#' : _":focus",
    '^' : _":focus | sub primary, increment" ,
    Escape : _":escape",
    '<' : _":btn | sub add, cycle-left",
    '>' : _":btn | sub add, cycle-right",
    '*' : _":btn | sub add, mul",
    '/' : _":btn | sub add, frac",
    
[btn]()

    () => {
        let btn = $('.section.open .active .add');
        if (btn) {
            btn.click();
            return true;
        } else {
            return false;
        }
    }


[focus]() 

    () => {
        let input = $('.section.open .active .primary input, .open .active .primary textarea');
        if (input) {
            input.focus();
            return true;
        } else {
            return;
        }
    }

[escape]()

This tries to close various things. If first tries to close an active
variable. If there is none, then it tries to close overlays and then the
section.  

    () => {
        let el = $('.open .active .toggle');
        if (el) {
            let btn = $('.section.open button.active');
            el.click();
            btn?.focus?.();
            return true;
        }
        el = $('.overlay.open .close');
        if (el) {
            let btn = $('button.opened');           
            el.click();
            btn?.focus?.();
            return true;
        }
        el = $('.section.open h2 button');
        if (el) {
            el.click();
            el.focus();
            return true;
        }
        return ; 
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



