# JS

This is a little js library that should help create reactive and customizable
bindings between inputs, computational functions, and display functions. It's
my attempt to get the functionality I like most out of Svelte though it is
radically less in its scope. Basically, I want to be able manipulate various
things and stuff just propagates. Spreadsheet style, if  you will. 


    _"Event emitter"

    _"Waiter"

    _"Var"
    
    _"Dom helpers"

    const makeComputer = _"link:compute";

    const link = _"link";
    const mathSub = _"math helpers"
    // small wrapper here to pass in mathjs and jsxgraph
    const initKeys = _"init keys";


    const initController = _"make controller";

    const initMakeTypedInput = (math, jsx, keys, controller) => {
        _"types"
        return [_"typed input", types];
    };
    
    const makeScopes = _"local";
    
    const makeF = function makeF (math) {
        const f = _"function defs::f";
        this.f = f;
        return f;
    }

    const MP = {link, Var, Waiter, EventEmitter, 
        mathSub, $, $$, show, hide, 
        initMakeTypedInput,
        initKeys, makeScopes, makeF, initController}; 

    export {MP};


[../public/r/common.mjs](# "save")


[function defs](function-defs.md "load:")  These are the mathematical functions we
will use. 

## Link

This links a function to a bunch of linkable variables created by Var or link. It omits an output that is also a linkable variable. 

Note that linked variables trigger changes when the values change (assert
equality detection). So cycles of linked variables are fine as long as the
changes can stabilize. Otherwise infinite cycle happens. 

So the signature is `link(f[funs], triggers, vars)` where f is expecting vars, but
the triggers are what is being listened for. This allows for decoupling
between these two notions.

    function link (funs, triggers, vars) {

        _":arrayify"

        let ret = new Var();
        let g = makeComputer(funs, ret, vars);
        let h = () => ret.destroy();
        triggers.forEach( (v) => {
            v.on('change', g);
            v.on('clear', h);
        });

        g();
        return ret;
    }


If we wanted to do some computation and then take that into a dom display, we
can do  `out = link(computSomething, ...vars); link(makeDOM, out);` and then
as the vars changes, the dom get changed (or whatever you want to do). 

This is minimal 

[compute]()

This checks if the function is ready for computing. A null value in any of the
variables means the computation should not proceed and a null value should
return. 

We want to allow multiple inputs so that's why we do an array and then a
spread although later functions in the chain should expect to just take in a
single input variable. Ultimately, we just take a non-array as output. 


    function makeComputer (funs, ret, vars) {
        return function gCompute () {
            if (ret.paused) { return;} // avoids retriggering
            let inputs = vars.map( (v) => v.value); 
            let ready = inputs.every( (val) => val !== null );
            if (ready) {
                ret.paused = true;
                let [out] = funs.reduce( (prev, f) => {
                    let fOut = f(...prev);
                    return [fOut];
                }, inputs);
                ret.paused = false;
                ret.change(out);
            }
            return;
        }
    };

[arrayify]() 

This is to make sure all the inputs are arrays. We allow for a single
function, or a single var, to make it easy, but we want to treat them as all
arrays. We also check that all the functions are functions, all the
others are type Var....

    if (typeof funs === 'function') {
        funs = [funs];
    }
    if (! funs.every?.( (f) => typeof f === 'function')) {
        console.error("function into link must be function", funs);
        return;
    }
    if (!Array.isArray(triggers)) {
        triggers = [triggers];
    } 
    if (! triggers.every?.( (t) => (typeof t.on) === 'function' ) )  {
        console.error("triggers must be able to listen to events to trigger", triggers);
        return;
    }
    if (!vars) {
        vars = triggers;
    }
    if (vars instanceof Var) {
        vars = [vars];
    }
    if (! vars.every?.( (t) => t.hasOwnProperty('value')) ) {
        console.error("input variables must have value properties", vars);
        return;
    }

    


## Var

This is a class for the Var object which handles linking variables to inputs
for two-way binding. It also is useful for a link variable, which links up
variables and computing a function. For link, this is an output and the
bind/unbind are not relevant (weird to use them, I think). The toVar and
fromVar can do whatever so one can get creative such as binding to a list of
inputs to an array. 

The idea of this class is that it handles a value tied to other things, such
as input elements in the Dom and it becomes two-way binding there. It also is
part of a reactive structure so it can change on its own. 

The paused attribute is for when a value has changed and is propagating it to
other bound elements. This prevents accidental calls to the change of this
class while updating the DOM elements. 

External calls to change should generally be just the val, but internally,
when an input element causes a change, that element is passed in to avoid
rewriting its value in the subsequent updates. 

To record a history of the values, assign an array to the history property of
the instance. 

We extend eventemitter so that we get the on and off directly on Var. 

    class Var extends EventEmitter {
        value = null;
        paused = false;
        bound = [];
        data = {};

        constructor(val, ...els) {
            super();
            this.value = val;
            els.forEach( (b => this.bind(b) ) );
            return this;
        }

        bind ({el, evt, toVar, fromVar}) {
            _":bind"
        }
        
        unBind (el) {
            _":unbind"
        }

        equal (val) {  // forse interesting stuff, this should be replaced
            return this.value === val;
        }

        change(val, el) {
            _":change"
        }

        destroy() {
            _":destroy"
        }

    }

[bind]()

This binds a single DOM element to this var. The toVar takes something from
the element and converts it into the value, then replacing that value. The
fromVar takes a value from the variable and propagates to the bound elements.

When binding, a non-null value on the Var will dominate over the element's
value. Otherwise, the value comes from the element. 


    if (typeof el === 'string') {
        let str = el;
        el = document.querySelector(str);
        if (!el) {
            console.error(`cannot find ${str} as element to bind to`);
            return;
        }
    }

    let tv = () => {
        if (this.paused) {return;}
        let value = toVar(el, this);
        this.change(value, el);
    };

So the primary object can either be a value or a Variable itself (anything
that is an event emitter, actually. This would
allow for two-way binding between the variables. Links are basically one way. 

    if (el.addEventListener) {
        el.addEventListener(evt, tv);
    } else if (el.on) {
        el.on(evt, tv);
    } else {
        console.error(el, 'does not have on or addEventListener props. Context: ', evt)
        return;
    }

    if (this.value != null) {
        fromVar(this.value, el, this);
    } else {
        this.value = toVar(el, this);
    }

    this.bound.push({el, evt, toVar:tv, fromVar});

[unbind]()

Probably never used as the common unbinding at destruction time is handled
separately in destroy (simpler when dealing with all). 

    let ind = this.bound.findIndex( ((bel) => el === bel) );
    if (ind !== -1) {
        let {evt, toVar} = this.bound.splice(ind, 1); 
        _":remove listener"
    }

[remove listener]() 

This is used in unbing and destroy. They could be the same thing, but it seems
not worth it to do so. So we do a soft duplication.


    if (el.off) {
        el.off(evt, toVar);
    } else if (el.removeEventListner) {
        el.removeEventListener(evt, toVar);
    } else {
        console.error(el, 'does not have off or removeEventListenere props. Context: ', evt);
    }


[change]()

This runs through the bound elements whenever an element changes and calls
fromVar on el, val. 

We do check if the value has changed. Note that this is referential for
objects and arrays. 

We return val as change may part of a function chain in the link command. 

    
    if ( this.equal(val) )  { return ; } 
    if (this.history) {
        this.history.push(val);
    }
    this.value = val;
    this.paused =  el || true;
    this.bound.forEach( ({el, fromVar}) => {
        if (el !== this.paused) {
            fromVar(this.value, el, this);
        }
    });
    this.paused = false;
    this.emit('change', val);
    return val;

[destroy]()

This is to basically clean up before destroying the variable. Currently, it
calls a possible clean method which handles generic cleaning as well as
unbinding the input elements. 

    this?.clean();

    while (this.bound.length > 0) {
        let {el, evt, toVar} = this.bound.pop();
        _":remove listener"
    }



## Event emitter

Some basic event emitter code modified from https://medium.com/@contactsachinsingh/how-to-implement-eventemitter-in-javascript-e4f4ff224e84

In particular, not setTimeout delay for callbacks. Expect immediate execution.
Also, clearing an event emitter emits the clearing event which allows
propagated cleanup. 

    class EventEmitter {

        constructor() {
            this.listeners = [];
        }
      emit(eventName, data) {
        this.listeners
          .filter(({ name }) => name === eventName)
          .forEach(
            ({ callback }) =>
              callback.call(this, data)
            );
      }
      on(name, callback) {
        if (
          typeof callback === 'function'
          && typeof name === 'string'
        ) {
          this.listeners.push({ name, callback });
        }
      }
      off(eventName, callback) {
        this.listeners = this.listeners.filter(
          listener => !(listener.name === eventName &&
            listener.callback === callback)
        );
      }
      clear() {
        this.emit('clear', null);
        this.listener.length = 0;
      }
    }

## Waiter

This is for waiting for multiple events to happen. Then it executes the
function. It is designed for one-time events. One can wait.more('str') to add
more to wait and wait.less('str') to remove a string that has now happened.
One can start with no events, but then it will not trigger until at least one
is added and removed. 

    class Waiter {
        data = {};
        constructor (cb, ...evts) {
            this.evts = evts;       
            this.cb = cb;
        }

        more (str) {
            this.evts.push(str)
        }

        less (str,data) {
            this.evts = this.evts.filter( el=> el === str);
            this.data[str] = data;
            if (this.evts.length === 0) {
                try {
                    this.result = this.cb(data);
                } catch (e) {
                    this.err = e;
                }
            }
        }
    }

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

    (math) => {
        let subs = _":subs";
        for (const prop in subs) {
            math[prop] = math[subs[prop]];
        }


This does spacing of numbers (based on
[stackoverflow](https://stackoverflow.com/a/16637170)

This is for rendering in katex.


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
            n = n.replace(/ /g,'\\ '); //for katex not collapse spacing
            return n;
        };
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

    _"real:css"

    _"active nav"
    
### Active nav

This is for knowing which element is currently active.

    .currentActive {
        outline: dotted 2px #69ceff; 
    }

    sl-drawer.currentActive + .open-drawer {
        outline: dotted 2px #69ceff; 
    }

## Make Controller

This manages the variables and is available to all. 

    function () {
        let pNull = {container:null, line:null, localKeys:{}}; //empty primary
        let controller = {
            scopes : {},
            current : null, //put the current selected scope here
            container : $('.inputControl'),
            primary : pNull,
            activate : _":activate",
            deactivate : _":deactivate"
        };  

        return controller;
    }

[activate]() 

    function activate (container, line, localKeys)  {
        this.deactivate();
        line.classList.add('active');
        container.classList.add('active');
        controller.primary = {container, line, localKeys};
    }

[deactivate]()

    () => {
        let {container, line} = controller.primary;
        controller.primary = pNull;
        if (container && line) {
            container.classList.remove('active');
            line.classList.remove('active');
        } 
    }



        

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

    .typed-input {
        outline:none;
    }
    
But it is nice to outline the input ones. 

    .typed-input {
        border-bottom: 2px solid green;
    }

    .typed-input.open {
        border: 2px dotted green;
        border-bottom: 2px solid green;
    }

    .typed-input.active {
        border: 2px solid green;
        background-color: rgba(105,206,255, 0.3)
    }

    .typed-input:focus {
        border-bottom-color: red;
    }

    .hide { 
        display:none;
    }

Needed some kind of callout for the changing text. Figured blue color looked
nice. 

    .output {
        color: blue;
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

In specifics, we load attributes to the container element and initiate the
variable of interest.

    let value = null;
    if (specifics) {
        let attrs = specifics.attrs;
        $$$(container, attrs); // applies them through setAttribute or class stuff
        if (specifics.hasOwnProperty('value')) {
            value = specifics.value;
        }
    }

## Types

These are the defined types. 

    const types = {
        real : _"real",
        logarithm : _"logarithm",
        complex : _"complex",
        matrix : _"matrix",
        unit : _"unit",
        discrete : _"discrete",
        set : _"set",
        sequence : _"sequence"
    }; 
    types.default = 'number';


### Real

This is the most common type, being just a number with a linear scale to use. 


    (value, options, {container, line}) => {
        line.innerHTML = `_":html"`;
        container.classList.add('real-display');
        line.classList.add('real');
        let round = (v) => v;  //placeholder while things boot up
        _":children"
        _":variables"
        
        let defVal = varVal.value;

        _":incrementing"
        _":ui functions"
        
        $sub.addEventListener('click', subX);
        $add.addEventListener('click', addX);
        $low.addEventListener('click', lowerScale);
        $rai.addEventListener('click', raiseScale);

        const localKeys = { _":local keys"};

        const destroy = _":destroy"; 
        

        return [varVal, varScale, localKeys]; 
    }


[html]() 

    <div class="primary">
        <sl-button class="subtract" size="small">-</sl-button>
        <sl-input size="small"></sl-input>
        <sl-button class="add" size="small">+</sl-button>
    </div>

    <div class="exponent">
        <sl-button class="lower" size="small">_</sl-button>
        <span>1E</span><sl-input size="small"></sl-input>
        <sl-button class="raise" size="small">^</sl-button>
    </div>

    <div class="controls">
       <sl-icon-button name="x" label="close"></sl-icon-button>
    </div>

[children]()

This is grabbing the html elements of the children of the container. We use
them for the variables

    const [$varVal, $varScale] = $$('sl-input', line);
    const [$sub, $add, $low, $rai] = $$('sl-button', line);
    const $close = $('sl-icon-button', line);
    

[css]()

    .inputControl {
        position:fixed;
        width:100vw;
        bottom: 1.5em;
        background-color: whitesmoke;
        border-bottom: 1px solid gray;
        padding-top: 4px;
    }

    .inputControl > * {
        display: flex;
        flex-wrap: wrap;
        justify-content:space-around;
        width:100%;
    }

    .inputControl > * > * {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
    }

    .inputControl sl-input {
        width:30ch;
    }
 
    .exponent sl-input {
        width: 8ch;
    }
    
    .inputControl .active .primary sl-input {
        --sl-input-background-color: rgba(105,206,255, 0.3);
    }
    

 
[variables]()

We link up the html and the variables. 


Scalerange is set to 0 so rescale calls fromVar -- needed it to be a different value otherwise it does not call. And the range is not set correctly with that because the scale array is not setup yet. 

    const varScale = new Var(0, {_":input|sub $varVal, $varScale"}); 
    const varVal = new Var(value || 0, {_":input"});
    

    link((v)=>{ katex.render(math.spacedNumber(v), container);}, varVal);
    

The rounding is really rounding the center. Not sure where else this would
make sense to do.

    round = _":round";


[input]()

    el: $varVal,
    evt: 'sl-change',
    toVar: (el) => math.bignumber(el.value),
    fromVar: (v, el) => el.value = v


[round]() 

This is a function that will round the variable to the precision of one digit
past where the scale is sitting. We do this by computing 

    ( v ) => {

        let p = varScale.value;

        let ret;
        if ( p < 0) {
            ret = math.round(math.evaluate(v.toString()), math.abs(p));
        } else {
            let pow = math.pow(10, p.toString());
            ret = math.mul(math.round(math.div(v, pow)), pow);
        }

        return ret;
    }


[local keys]()

This is manipulating the number. We have
q -- quit 
w -- decrease imaginary
e -- increase imaginary
a -- lower scale 
s -- decrease main or decrease real
d -- increase main or increase real
f -- raise scale
z -- return to default
x -- main input edit
c -- scale input edit

    q : close,
    a : lowerScale,
    s : subX,
    d : addX,
    f : raiseScale,
    z : def, 
    x : focusMain,
    c : focusScale


[incrementing]()

This adds the functions that the keypresses and buttons do.  

So we want to manipulate the slider just as if we were dragging it. So we
add/subtract 1 accordingly. We don't want to manipulate the value of the Var
directly because then we need to convert back and forth which is handled in
toVar's of the bound elements. So we manipulate the range value and then feed
the range element in to the toVar as if the event of change had been issued
(it does not get emitted for js imposed changes). 


    const raiseScale = () => {
        varScale.change(math.add(varScale.value, 1));
    };
    const lowerScale = () => {
        varScale.change(math.sub(varScale.value, 1));
    };
    
    const addX = () => {
        varVal.change(round(math.add(varVal.value, math.pow(10,$varScale.value) ) ) );
    };
    addX.repeatable = true;

    const subX = () => {
        varVal.change(round(math.sub(varVal.value, math.pow(10,$varScale.value) ) ) );
    };
    subX.repeatable = true;


[ui functions]()

    const close = () => {
        if (controller.primary.line === line) {
            controller.deactivate();
        }
        line.classList.add('hide');
    };

    const def = () => {

    };

    const focusMain = () => {
        $varVal.focus();
    };

    const focusScale = () => {
        $varScale.focus();
    };

[destroy]()

Lots of stuff to do. Just a stub. Got to undo all the listeners, I presume. 

    () => {
        console.error("DESTROY needs to be implemented!");
    }



### Logarithm

This does away with the shifting scale and just has a fixed multiplicative
number (10 by default) which we call the base. 

    _"basic template"


### Complex


    _"basic template"

### Matrix


    _"basic template"

### Unit

    _"basic template"


### Discrete


    _"basic template"

### Set


    _"basic template"

### Sequence


    _"basic template"


### Basic template 

    (value, options) => {
        let varVal = new Var();
        const settings = {};
        const destroy = () => {};
        const keys = {};

        return [varVal, settings, destroy, keys]; 
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

This is the stuff we want to do to the page once stuff is loaded. 


        $$('nav  sl-button' ).forEach(el => el.classList.remove('hide'));


        $$('a.explore').forEach( (el) => {
            el.addEventListener( 'click', (ev) => ev.stopPropagation()); 
        });

        $$('.plain').forEach( (el) => {
            el.addEventListener( 'click', (ev) => {
                const a = $('.explore', el)
                if (a) {a.click();}
            });
            el.classList.add('hier');
        });

        $$('sl-details, sl-drawer').forEach(el => el.classList.add('hier'));

        $$('.open-drawer').forEach( (el) => {
            let drawer = el.previousElementSibling;
            if (drawer.tagName === 'SL-DRAWER') {
                el.addEventListener('click', () => drawer.show());
                drawer.addEventListener('sl-show', (ev) => ev.stopPropagation());
                $('.close-drawer', drawer).
                    addEventListener('click', () => {
                        drawer.hide();
                    })
                ; 
            } else {
                console.log('Error; no drawer previously adjacent to open drawer buuton', el);
            }
        });

        $$('.stopProp').forEach( (el) => {
            el.addEventListener('click', (ev) => ev.stopPropagation());
        });

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
        if (type === 'katex') {
            katex.render(text, div);
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
        fo.setAttribute('width', 20 + interval);
        fo.setAttribute('x', Math.max(-16, -5 - interval) );
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

This should highlight the parent pebble in the fano diagram. This is a way of
escalating up. 

    $$('.fano a').forEach( el => {
        let path = el.attributes.href.value.slice(0,-5);
        if (location.pathname.includes(path) ) {
            $('circle', el).classList.add('parent');
        }
    });



[shift padding]()

TODO REMOVE. This failed because the padding of other elements would change
where the link would send it. Instead embarking on direct scroll control. 


This shifts the padding of the targeted element in case the nav height
changes. 

Creating style sheet per https://davidwalsh.name/add-rules-stylesheets

    {
        let style = document.createElement("style");

        style.appendChild(document.createTextNode(""));

	    document.head.appendChild(style);

	    let sheet = style.sheet;
        let rules = sheet.cssRules;

        let nav = $('body > nav'); 
        let computePaddingRule = () => {
            let h = nav.clientHeight;
            return `:target { padding-top: ${h - 28}px;}`;
        };

        let currentRule = computePaddingRule();
        sheet.insertRule(currentRule, 0);
    
        let obs = new ResizeObserver( () => {
            let oldRule = currentRule;
            currentRule = computePaddingRule();
            if (currentRule !== oldRule) {
                sheet.insertRule(currentRule, 0);
                
Now we delete the old rule, looping through the ruleslist to catch it all. 

                let n = rules.length;
                for (let i = 0; i < n; i += 1) {
                    if (rules[i]cssText === oldRule) {
                        sheet.deleteRule(i);
                    }
                }
            }
        });

        obs.observe(nav);
 
    }

## Local

So this creates scoped variables. For each input or output classed variable
element, it checks if there is a data-scope on it. If not, it looks for the
next parent. It also looks for an id until it finds one. If no scope, then it
takes the first id it finds as a scope, but a later data-scope always
overrides. It will stop at body. Those with same data-scope will have a merged
scope. 

    
    function makeScopes (makeTypedInput, controller) {

        const scopes = controller.scopes;

        let scanParents = _":scan parents";

        let openScope = _":open scope";

        const replace = _":replace";

        const update = _":update";

        _":create inputs" 

        _":deal with outputs"

        const outputs = _":outputs";

        return {scanParents, openScope, outputs};

    }

[create inputs]()

This is how we define variables from the text. Easy enough. 

    $$('.input').forEach( el => {
        const scopeName = scanParents(el) || '';
        const scope = openScope(scopeName, scopes);
        const ds = el.dataset;
        const name = ds.name;
        const inp = scope.inputs[name] = makeTypedInput(el, ds.type || 'real', {value:ds.value} );
        let v = scope.vars[name] = inp.varVal;
        link(update(name, scope), v);
    });

  
[deal with outputs]()

This is a little trickier. We need to link the variables to change the output
expression whenever the variable gets updated. This is what the whole var
setup is for, but they may not be in existence yet here. 

    $$('.output').forEach( el => {
        const scopeName = scanParents(el) || '';
        const scope = openScope(scopeName);
        let outs = scope.outs;
        let ds = el.dataset;
        let template = ds.value || '';
        
        let bits = template.split('%'); 
        let first = bits.shift(); //first bit before percent is not relevant for variable 
        bits.forEach( (bit) => {
            if (bit[0] === ' ') {
                return;  // actual percent, skip 
            }
            let ind = bit.indexOf(' ');
            if (ind === -1) { ind = bit.length;}
            let vname = bit.slice(0,ind);
            let o = outs[vname] = outs[vname] || [];
            o.push(el);
        });
        katex.render(replace(el.dataset.value, scope), el);
    });



[outputs]()

This takes in an object whose key is the scope name and whose value is a
linked variable whose change should trigger an update. 

Doesn't seem to be used?

    (obj, scope) => {
        Object.keys(obj).forEach( (key) => {
            let pebbleProducedVar = obj[key];
            let local = update(key, scope);
            scope.vars[key] = pebbleProducedVar;
            link(local, pebbleProducedVar);
            local();
        });
    }


[update]() 

This creates an update function that basically updates the expressions that
are linked to the variable. 

    function makeUpdate (name, scope) {
        return function update () {
            let o = scope.outs[name];
            if (o) {
                o.forEach( (el) => {
                    let text = replace(el.dataset.value, scope);
                    katex.render(text, el);
                });
            }
        };
    }

[replace]() 

This replaces all instances of `%var` with values. If no such var exists,
console.error it and put a 0.

Tricky bit was to make sure to leave a percent sign there. If an actual
percent sign, put a space immediately after it. If need an actual space after
the actual percent, use two spaces. Also true of vars. 

    (txt, scope) => {
        let bits = txt.split('%'); 
        let first = bits.shift(); //first bit is before percent
        let replaced = bits.map( (bit) => {
            if (bit[0] === ' ') {
                return '%' + bit.slice(1); //strip space, but no var here actual %
            }
            let ind = bit.indexOf(' ');
            if (ind === -1) { ind = bit.length;}
            let vname = bit.slice(0,ind);
            let [sc, na] = vname.split('/');
            let localScope;
            if (na) { 
                 localScope = scopes[sc];
                 vname = na;
            } else {
                 localScope = scope;
                 vname = sc;
            };
            let rest = bit.slice(ind+1);
            let v = localScope.vars[vname];
            if (!v) { 
                v = '';
            } else {
                v = v.value;
                _":format v"
            }
            return v + rest;
        }).join('');
        return first+replaced;
    }
    
[format v]()

This attempts to do a proper formatting of the output of the function. We use
the mathjs type function. TODO add other types (complex, fraction, ... with
the desire of having spaced numbers of their separate parts).  

    let t = math.typeOf(v);
    switch (t) {
    case 'number':
    case 'BigNumber':
        v = math.spacedNumber(v);
    break;
    default:
        v = v.toString();
    }



[scan parents]()

This scans parent  elements for a data-scope or, as fallback, an id. This
becomes the scope. An item might also have data-scope so we start there.
It should return a string. We ignore the element's actual id which is why we 

    function scanParents (el) {
        let id, scope;
        while (el.nodeName !== 'BODY') {
            scope = el.dataset.scope || '';
            if (scope) {break;}
            el = el.parentElement;
            if (!el) {break;}
            if (!id) { id = el.id; } //take id once, placed here for parent sake
        }
        return scope || id || '';
    }


[open scope]() 

This retrieves the named scope, creating it if necessary. 

    function openScope (name) {
        let scope = scopes[name];
        if (scope) {return scope;}
        scope = scopes[name] = {
            inputs: {},
            outs : {},
            vars :{},
        };
        return scope;
    }
