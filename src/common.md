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
    const initScaledNumber = (math, jsx, keys) => {
        return _"scaled number"
    };

    const initMakeTypedInput = (math, jsx, keys) => {
        _"types"
        return [_"typed input", types];
    };
    
    const makeScope = _"local"


    const MP = {link, Var, Waiter, EventEmitter, 
        mathSub, $, $$, show, hide, 
        initMakeTypedInput,
        initScaledNumber, initKeys, makeScope }; 

    export {MP};


[../public/r/common.mjs](# "save")

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

    function makeComputer (funs, ret, vars) {
        return function gCompute () {
            if (ret.paused) { return;} // avoids retriggering
            let inputs = vars.map( (v) => v.value); 
            let ready = inputs.every( (val) => val !== null );
            if (ready) {
                ret.paused = true;
                let out = funs.reduce( (prev, f) => {
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
    }

[subs]()

    { 
        sub: "subtract", 
        mul : "multiply", 
        div: "divide", 
        eq : "equal", 
        gt : "larger", 
        lt : "smaller"
    }

## CSS

This is the hook for the CSS to go with the HTML page. 

    _"typed input:css"

    _"real:css"


## Typed Input

This creates a Var that is displayed in a span by default and, when
selected/clicked, it transforms into an input depending on type. The main two
types are real and complex. The real is a linear scale whose scale can be
easily changed. The complex is a planar scale choice whose underlying scale. 

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

type is a creation function

    function makeTypedInput (container, type, specifics, options) {
        _":initiate container"
        _":initiate type"
        _":apply specifics"

        let [varVal, settings, typeDestroy, typeKeys] = type(value, options, {
            container, sp, inp, div}
        );

        let genKeys = {};
        const loadKeys = () => {
            if (!keys.includes(genKeys) ) {
                keys.unshift(genKeys);
            }
            if (!keys.includes(typeKeys) ) {
                keys.unshift(typeKeys);
            }
            console.log("keys", keys);
        };
        const removeKeys = () => {
            let ind;
            ind = keys.findIndex( (el) => el === typeKeys);
            if (ind !== -1) {
                keys.splice(ind, 1);
            }
            ind = keys.findIndex((el) => el === genKeys);
            if (ind !== -1) {
                keys.splice(ind, 1);
            }
            console.log("removed keys", keys);
        };

        _":hook in behavior"

        const destroy = () => {
            typeDestroy();
            _":unhook behavior"
            container.remove();
        };

        const replace = (newType, options) => {
            typeDestroy();
            type = newType;
            [varVal, settings, typeDestroy] = type(varVal.value, options);
            return {container, varVal, settings, destroy};
        };

        return {container, varVal, settings, destroy};
    }

[initiate container]()

    if (container === null) {
        container = $$$('div');
    } else if (typeof container === "string") {
        container = $(container);
    } 
    $$$(container, {class:'typed-input', tabIndex: 0});
    
    let sp = $$$('span', {class:'display'}, ['prepend', container]);
    let inp = $$$('sl-input', {class:'numinp hide'}, ['append', container]);
    let div = $$$('div', {class:'type hide'}, ['append', container]);
    let closeButton = $$$('sl-icon-button', {class:'hide', name:'x', label:'close'}, ['append', container]);


[css]() 

Safari outlines this element because of focus stuff and the outline is weird
and unneeded. 

    .typed-input {
        outline:none;
    }

    .typed-input .display {
        border-bottom: 2px solid green;
    }

    .typed-input.focus .display {
        border: 2px solid green;
    }

    .hide { 
        display:none;
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

    
[hook in behavior]()

This is for common functionality across all the inputs. 

There is a span prepended as the first child of container. This is where the
value is shown. It is styled with a green underline (as of this writing).
Clicking on it activates the type's input stuff. (hide/show stuff, basically).
focusing on the div should activate type's keys while blurring should
deactivate them. 

    let state = 'closed';
    let edit = 'closed';
    _":focus behavior"


    const open = () => {
        state = 'open';
        show(div);
        div.classList.add('ignore');
        container.classList.add('edit');
        show(closeButton);
    };
    const close = () => {
        state = 'closed';
        edit = 'closed';
        show(sp);
        hide(inp);
        hide(div);
        div.classList.remove('ignore');
        container.classList.remove('edit');
        hide(closeButton);
        removeKeys();
    };
    const openEdit = () => {
        console.log("open edit");
        hide(sp);
        show(inp);
        console.log(inp);
        inp.setFocus();
        inp.setSelectionRange(0, inp.value.length, 'forward');
        edit = 'open';
    }
    const closeEdit = () => {
        console.log("close edit");
        show(sp);
        hide(inp);
        edit = 'closed';
    }
    const cli = () => {
        console.log('clicked', state);
        if (state === 'open') {
            openEdit();
        } else {
            open();
        }
    };
    
    genKeys['Enter'] = () => {
        if (edit === 'open') {
            closeEdit();
        } else {
            openEdit();
        }
    };
    
    genKeys['Escape'] = () => {
        console.log("escape pressed", edit);
        if (edit === 'open') {
            closeEdit();
        } else {
           close(); 
        }
    };

    genKeys['o'] = () => {
        if (state === 'open') {
            close();
        } else {
            open();
        }
    }




    closeButton.addEventListener('click', close);
    container.addEventListener('focusin', foc);
    container.addEventListener('focusout', focOut);
    sp.addEventListener('click', cli);
    inp.addEventListener('sl-blur', closeEdit); 
    

[focus behavior]()

The focus in and out stuff is tricky. Focusout seems to fire first and then
focusin. It is rather unstable and not clear that we really want something
that acts like this. We have the control panel interface and the keys
interface. For the keys, we should outline the number while the keys are
active. The keys should remain active until another key interactive item is
activated. The panel interface opens when clicking on the number 


    const foc = () => {
        console.log("focusin fired");
        container.classList.add('focus');
        loadKeys();
    };
    const focOut =() => {
        console.log("focusout fired");
        container.classList.remove('focus');
    };


[unhook behavior]()

This is to remove any listeners. 

    closeButton.removeEventListener('click', close);
    container.removeEventListener('focusin', foc);
    sp.removeEventListener('click', cli);
    inp.removeEventListener('sl-blur', closeEdit); 


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


    (value, options, {container, sp, inp, div}) => {
        div.innerHTML = `_":html"`;
        container.classList.add('real');
        let round = (v) => v;  //placeholder while things boot up
        let f = { _":value range functions" };
        _":children"
        _":variables"
        const keys = {_":local keys"};
        const settings = {};
        const destroy = _":destroy"; 

        return [varVal, settings, destroy, keys]; 
    }


[html]() 

    <sl-range class="numrange" min=0 max=100 step=1 tooltip="none"></sl-range>
    <sl-range class="scalerange" min=0 max=40 step=1 tooltip="none"></sl-range>
    <span class="scale-number"></span>
    <sl-tooltip content="Scale Settings">
        <sl-icon-button name="gear" label="Scale Settings"></sl-icon-button>
    </sl-tooltip>
    <sl-tooltip content="Redefine Center">
        <sl-icon-button name="chevron-bar-up" label="Redefine Center"></sl-icon-button>
    </sl-tooltip>
    <sl-tooltip content="Open History">
        <sl-icon-button name="skip-backward" label="Open History"></sl-icon-button>
    </sl-tooltip>
    <sl-dialog class="scale-settings" label="Scale Settings">
        <p>This is where we can change how the ranges change. For scale, we
        have it setup so that we can do two alternating scale factors. The
        default is that we first multiply the lowest scale factor by 5, then
        that one by 2, then by 5, then by 2, etc. This allows us to go up by
        multiples of 5. So from 0.1 we got to 0.5 and then to 1 then to 5 then
        to 10, etc.  Here is where one can change those scale factors and the
        lowest value to start. </p>
        <sl-input type="text" label="First Scale Factor"></sl-input>
        <sl-input type="text" label="Second Scale Factor"></sl-input>
        <sl-input type="text" label="Lowest Value"></sl-input>
    </sl-dialog>
    <sl-dialog class="history" label="History of Number">
        <p>Simply select the value you wish to return to and then close the
        dialog. To delete a history item, click the trash icon next to it.
        The history gets populated whenever the main text changes by direct
        input or the main slider gets recentered to a current value.</p>
        <sl-select clearable>

        </sl-select>
    </sl-dialog>

[children]()

This is grabbing the html elements of the children of the container. We use
them for the variables

    const [$firstScale, $secondScale, $startScale] = $$('sl-input', div);
    const $numrange = $('.numrange', container);
    const $scaleRange = $('.scalerange', container);
    const $gear   = $('sl-icon-button[name="gear"]', container);
    const $openHistory = $('sl-icon-button[name="skip-backward"]', container);
    const $redefineCenter = $('sl-icon-button[name="chevron-bar-up"]', container);
    const $dialog = $('sl-dialog.scale-settings', container);
    const $history = $('sl-dialog.history', container);
    const $hisSel = $('sl-select', $history);
    const $scaleDisplay = $('.scale-number', container);
    

Should have focus listeners for dialogs to change initial focus if needed

    const openSS = () => $dialog.show();
    $gear.addEventListener('click', openSS);

    const openH = () => $history.show();
    $openHistory.addEventListener('click', openH);

[css]()


    .real.edit {
        display: inline-grid;
        grid-template-columns : 40px 40px 40px  30px 30px;
        grid-template-areas: 
            "num num num num num"
            "nr nr nr sr close"
            "hist center gear sr scnum";   
    }
    
    .real * {
        justify-self:center;
        align-self:center;
    }

    .real .display, .real .numinp {
        justify-self : start;
    }

    .ignore {   
        display:contents;
    }

    .real .numrange {
        grid-area: nr;
    }


Want the scalerange thumb to have a different color, the same as the scale
number. So we hack different colors here. TODO REVIEW. 

    .real .scalerange {
        grid-area: sr;
        --sl-color-primary-500 : red;
        --sl-color-primary-400 : red;
        --sl-color-primary-600 : darkred;
        --sl-focus-ring-color-primary : lightsalmon;
    } 

    .real .scalerange::part(input) {
        width: 9ch;
        height: 3ch;
        margin: 0;
        transform-origin: 4.6ch 1.6ch;
        transform: rotate(-90deg);
    }

    .real .scalerange::part(input)::moz-range-thumb {
        background: red;
    }

    .real sl-icon-button[name="gear"] {
        grid-area: gear;
    }

    .real sl-icon-button[name="skip-backward"] {
        grid-area:hist;
    }

    .real sl-icon-button[name="chevron-bar-up"] {
        grid-area:center;
    }
    
    .real sl-icon-button[name="x"] {
        grid-area:close;
    }

    .real .scale-number {
        grid-area: scnum;
        color: red;
        font-family: monospace;
        justify-self:start;
        white-space:nowrap;

Min width is for making a bigger click area. 

        min-width:4ch; 
    }


[variables]()

We link up the html and the variables. 

We also track the mode we are in. There are three modes: plain text of just
the main number, text input for the number, or the whole slider construct. The
mode is toggled by 't' and reversed by 'T'. could actually consider the
complex part with this. (plain,  linear, plane)

    let scale = [];

    const firstScale = new Var(5, {_":input| sub inp, $firstScale"});
    const secondScale = new Var(2, {_":input| sub inp, $secondScale"});
    const startScale = new Var(1e-10, {_":input| sub inp, $startScale"});

Scalerange is set to 0 so rescale calls fromVar -- needed it to be a different value otherwise it does not call. And the range is not set correctly with that because the scale array is not setup yet. 

    const scaleRange = new Var(0, {_":scale range"}); 
    const center = new Var(0, {_":center"});
    const varVal = new Var(value || 0, {_":input"}, {_":numrange"});
    const main = varVal; // older code merge TODO Remove
    const setCenter = _":set center";
    const _setCenter = link(setCenter, scaleRange, main); 
    
    link((v)=>{$scaleDisplay.innerText=v}, scaleRange);
    link((v)=>{sp.innerText=v}, main);


    const precision = link(_":precision", scaleRange);

The rounding is really rounding the center. Not sure where else this would
make sense to do.

    round = _":round";

    link(() => center.value=round(center.value) , precision);


This handles the main scale setup where we generally want to center the scale
range in the middle of the range and reset parameters after the dialog closes. 

    const rescale = () => {
        let cur = math.evaluate(startScale.value);
        let fir = math.evaluate(firstScale.value);
        let sec = math.evaluate(secondScale.value);
        scale[0] = cur;
        for (let i = 0; i<20; i+=1) {
            cur = scale[2*i+1] = math.mul(cur, fir);
            cur = scale[2*i+2] = math.mul(cur, sec); 
        }
        scaleRange.change(scale[20]);
    };
    $dialog.addEventListener('sl-hide', rescale);
    rescale();

    _":key helpers"

    $scaleDisplay.addEventListener('click', lowerScale);



[input]()

    el: inp,
    evt: 'sl-change',
    toVar: (el) => el.value,
    fromVar: (v, el) => el.value = v

[numrange]()

This relates the slider value to the main value. We do the shifts manually as
this allows us to use the f functions with complex stuff just be converting
them into their values appropriately.


    el: $numrange,
    evt: 'sl-change',
    toVar: (el) =>  {
        let shift = math.sub(math.evaluate(el.value), 50);
        let newV = f.add(shift, scaleRange.value, center.value); 
        return newV;
    },
    fromVar: (v, el) =>  {
        let newPlace = f.addInv(v, scaleRange.value, center.value);
        el.value = math.round(math.add(newPlace, 50));
    }




[scale range]()

This handles the var for shifting the scale. 

Not sure how variable would be changed, but if it was, we do a reverse lookup.

    el: $scaleRange,
    evt: 'sl-change',
    toVar : (el) => scale[el.value] || scale[20],
    fromVar : (v, el) => { el.value = scale.findIndex( (sc) => math.largerEq(sc, v) ) }


[round]() 

This is a function that will round the variable to the precision of one digit
past where the scale is sitting. We do this by computing 

    ( v ) => {

        let p = precision.value;

        let ret;
        if ( p < 0) {
            ret = math.round(math.evaluate(v.toString()), math.abs(p));
        } else {
            let pow = math.pow(10, p.toString());
            ret = math.mul(math.round(math.div(v, pow)), pow);
        }

        //console.log(v.toString(), p.toString(), ret.toString());
        return ret;
    }


[precision]()

This takes in the scalerange value and converts it to the power of 10 that
implements our significance. 

    (s) => {
        if (s <= 0) {
            return 1;
        } else {
            let ret = math.sub(math.round(math.log10(s)), 1);
            //console.log("pre", s, ret);
            return ret;
        }
    }


[value range functions]()

These are simple arithmetic functions that given the value or the scale
pointer will yield the other. The inverse goes from the value to the pointer. 

Adding implements `v = (place - 50)*scale + centerValue` Inverted it is `place
= (v- center)/scale + 50`

Multiplying implements `v = center*scale^(place-50)` Inverting, we need the
value and center to be the same sign to have this make actual sense and
non-zero, but anyway:  `log(v /center)/log(scale) + 50 = place` will error if
v and center are different signs or center is zero. 

    add : (shift, scale, center) => round(math.add( math.mul(shift, scale), center)),
    addInv : (v, scale, center) => math.div(math.sub(v, center), scale),

[set center]()

This resets the main slider to the middle and sets the center value to the
current value of the main variable

    function setCenter (v) {
        center.change( v );
        $numrange.value = 50;
    }

[center]()

    el : $redefineCenter,
    evt: 'click',
    toVar: () => {$numrange.value=50; return main.value;},
    fromVar: () => {}



[local keys]()

This is manipulating the number. We have
q -- raise scale
a -- center scale to current value
z -- lower scale
w -- increase imaginary
s -- decrease main or decrease real
d -- increase main or increase real
c -- decrease imaginary
f -- text main edit
g -- open setting for scale stuff
v -- toggle view of complex or main slider
b -- select history of main input
t -- cycle forward through edit modes (plain, input, linear, plane)
T -- cycle backward through edit modes

    q : addScale,
    a : () => setCenter(main.value),
    z : lowerScale,
    s : lowerX,
    d : addX,
    g : openSS,
    b : openH


[key helpers]()

This adds the functions that the keypresses do.  

So we want to manipulate the slider just as if we were dragging it. So we
add/subtract 1 accordingly. We don't want to manipulate the value of the Var
directly because then we need to convert back and forth which is handled in
toVar's of the bound elements. So we manipulate the range value and then feed
the range element in to the toVar as if the event of change had been issued
(it does not get emitted for js imposed changes). 


    const addScale = () => {
        let v = $scaleRange.value*1;
        if (v < 40) {
            $scaleRange.value = v + 1;
            scaleRange.bound[0].toVar($scaleRange);
        }
    };
    const lowerScale = () => {
        let v = $scaleRange.value*1;
        if (v > 0) {
            $scaleRange.value = v -1;
            scaleRange.bound[0].toVar($scaleRange);
        }
    };
    
    const addX = () => {
        let m = $numrange.value*1;
        $numrange.value = m+ 1;
        main.bound[1].toVar($numrange);
    };



    const lowerX = () => {
        let m = $numrange.value*1;
        $numrange.value = m- 1;
        main.bound[1].toVar($numrange);
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

    

### Scaled Number

This is a function that takes in some data (id, label, initial value, settings
options), and produces a containerized input number environment, one which has
a text input for whatever, a slider for changing the value, another slider for
changing the scale of the change, and a gear button to tweak some of the
settings. These will be arranged in a grid with the main slider being the
bottom row, spanning the other three columns.  

The function should return the html element for embedding, and the various relevant
variables. 

This is included in a constructor that has access to math, jsx, and keys


        function makeScaledNumber (id, label, value, settings) {
        
            let round = (v) => v;  //placeholder while things boot up
            let f = { _":value range functions" };
            let container = document.createElement('div');
            container.id = id;
            container.classList.add("scaled-number");
            container.innerHTML= `_":html"`;
            container.tabIndex = 0; // tabbable!
            _":children"
            _":variables"
            /* $numrange.tooltipFormatter = () => main.value;
            $scaleRange.tooltipFormatter = () => scaleRange.value;*/
            _":keypresses"

            const destroy = _":destroy"; 
            return {container, firstScale, secondScale, scaleRange, center, multiply,
                complex, main, setCenter, destroy};

        }

[html]()

    
    <span class="sn-main"></span>
    <sl-input type="text" label="${label}"></sl-input>
    <sl-tooltip content="Edit mode">
        <sl-icon-button name="sliders" label="Edit mode"></sl-icon-button>
    </sl-tooltip>

   

    <div class="sn-sliders">
    <sl-range class="numrange" min=0 max=100 step=1 tooltip="none"></sl-range>
    <sl-range class="scalerange" min=0 max=40 step=1 tooltip="none"></sl-range>
    <span class="scale-number"></span>
    <sl-tooltip content="Scale Settings">
        <sl-icon-button name="gear" label="Scale Settings"></sl-icon-button>
    </sl-tooltip>
    <sl-tooltip content="Redefine Center">
        <sl-icon-button name="chevron-bar-up" label="Redefine Center"></sl-icon-button>
    </sl-tooltip>
    <sl-tooltip content="Open History">
        <sl-icon-button name="skip-backward" label="Open History"></sl-icon-button>
    </sl-tooltip>
    <sl-dialog class="scale-settings" label="Scale Settings">
        <p>This is where we can change how the ranges change. For scale, we
        have it setup so that we can do two alternating scale factors. The
        default is that we first multiply the lowest scale factor by 5, then
        that one by 2, then by 5, then by 2, etc. This allows us to go up by
        multiples of 5. So from 0.1 we got to 0.5 and then to 1 then to 5 then
        to 10, etc.  Here is where one can change those scale factors and the
        lowest value to start. </p>
        <sl-input type="text" label="First Scale Factor"></sl-input>
        <sl-input type="text" label="Second Scale Factor"></sl-input>
        <sl-input type="text" label="Lowest Value"></sl-input>
        <p>We can also toggle whether to add that amount or multiply that
        amount as we change the scale. Typically it should be to add, but
        multiplication has some good uses to.</p>
        <sl-switch>Multiply</sl-switch> 
        <p>Our final option is to do a complex plane input option for the main
        value. It works by using the scale to modify the two independent
        diretions as directed by moving the point. </p>
        <sl-switch>Complex Input</sl-switch>
    </sl-dialog>
    <sl-dialog class="history" label="History of Number">
        <p>Simply select the value you wish to return to and then close the
        dialog. To delete a history item, click the trash icon next to it.
        The history gets populated whenever the main text changes by direct
        input or the main slider gets recentered to a current value.</p>
        <sl-select clearable>

        </sl-select>
    </sl-dialog>
    <div class="complex-input"></div> 
    </div>

[css]() 

This is to be loaded into the primary css, not here. But this is where the
structure is so...

We want the container to be a grid, with 3 columns. The first row has the
input, a vertical scalerange, and the gear icon. The second row has the number
scale spanning all three columns. 

TODO

    

    .scaled-number .sn-main { 
        border-bottom: solid 2px green;
    }

    .scaled-number.linear .complex-input {
    }
    
    .complex-input {
        width:100px;
        height:100px;
        border: black solid 1px;
    }


    

[children]()

This is grabbing the html elements of the children of the container. We use
them for the variables

    const [$main, $firstScale, $secondScale, $startScale] = $$('sl-input', container);
    const $numrange = $('.numrange', container);
    const $scaleRange = $('.scalerange', container);
    const $gear   = $('sl-icon-button[name="gear"]', container);
    const $openHistory = $('sl-icon-button[name="skip-backward"]', container);
    const $redefineCenter = $('sl-icon-button[name="chevron-bar-up"]', container);
    const $edit = $('sl-icon-button[name="sliders"]', container);
    const $dialog = $('sl-dialog.scale-settings', container);
    const $history = $('sl-dialog.history', container);
    const $hisSel = $('sl-select', $history);
    const [$multiply, $complex] = $$('sl-switch', container);
    const $comInp = $('.complex-input', container);
    const $scaleDisplay = $('.scale-number', container);
    const $mainDisplay = $('.sn-main', container);
    const $snSliders = $('.sn-sliders', container);
    
JSXGraph seems to need an id for the element instead of the element itself. 

    $comInp.id = id+'-complex-input';
    

Should have focus listeners for dialogs to change initial focus if needed

    const openSS = () => $dialog.show();
    $gear.addEventListener('click', openSS);

    const openH = () => $history.show();
    $openHistory.addEventListener('click', openH);


    const openMain = () => {
        hide($mainDisplay);
        show($main);
        $main.setFocus();
        $main.setSelectionRange(0, $main.value.length, 'forward');
    }
    const closeMain = () => {
        show($mainDisplay);
        hide($main);
    }
    $mainDisplay.addEventListener('click', openMain);
    $main.addEventListener('sl-blur', closeMain);

    let ci;
    let makeComplex = () => {
        let board = jsx.JSXGraph.initBoard($comInp.id, {boundingbox: [0, 100, 100, 0], 
            axis:false,showCopyright : false, showNavigation : false , zoom
            :{enabled:false}, pan: {enabled:false} });
        let point = board.create('point', [50,50], {size:1, visible:true, withLabel:false});
        ci = {board, point};
    }


Zoom and pan options:  https://github.com/jsxgraph/jsxgraph/blob/53dcec661e0fd819158c30e365a2058fc07ca8b9/src/options.js#L558  from https://stackoverflow.com/questions/23227360/jsxgraph-zoom-property



[variables]()

We link up the html and the variables. 

We also track the mode we are in. There are three modes: plain text of just
the main number, text input for the number, or the whole slider construct. The
mode is toggled by 't' and reversed by 'T'. could actually consider the
complex part with this. (plain,  linear, plane)

    let scale = [];

    const firstScale = new Var(5, {_":input| sub main, firstScale"});
    const secondScale = new Var(2, {_":input| sub main, secondScale"});
    const startScale = new Var(1e-10, {_":input| sub main, startScale"});

Scalerange is set to 0 so rescale calls fromVar -- needed it to be a different value otherwise it does not call. And the range is not set correctly with that because the scale array is not setup yet. 

    const scaleRange = new Var(0, {_":scale range"}); 
    const center = new Var(0, {_":center"});
    const multiply = new Var(false, {_":multiply"});
    const complex = new Var(false, {_":complex"});
    const main = new Var(0, {_":input"}, {_":numrange"});
    const setCenter = _":set center";
    const _setCenter = link(setCenter, scaleRange, main); 
    
    _":modes setup"

    const mode = new Var('plain', {_":edit click"});

    link(_":complex toggle", complex);
    link((v)=>{$scaleDisplay.innerText=v}, scaleRange);
    link((v)=>{$mainDisplay.innerText=v}, main);

    link( _":toggle edit mode", mode );

    const precision = link(_":precision", scaleRange);

The rounding is really rounding the center. Not sure where else this would
make sense to do.

    round = _":round";

    link(() => center.value=round(center.value) , precision);


This handles the main scale setup where we generally want to center the scale
range in the middle of the range and reset parameters after the dialog closes. 

    const rescale = () => {
        let cur = math.evaluate(startScale.value);
        let fir = math.evaluate(firstScale.value);
        let sec = math.evaluate(secondScale.value);
        scale[0] = cur;
        for (let i = 0; i<20; i+=1) {
            cur = scale[2*i+1] = math.mul(cur, fir);
            cur = scale[2*i+2] = math.mul(cur, sec); 
        }
        scaleRange.change(scale[20]);
    };
    $dialog.addEventListener('sl-hide', rescale);
    rescale();

    _":key helpers"


[modes setup]()


    const modes = ['plain', 'linear', 'plane'];
    const forwardEdit = (m) => {
        let ind = modes.indexOf(m);
        ind += 1;
        if (ind >= modes.length) { ind = 0; }
        return modes[ind];
    };

    const backwardEdit = (m) => {
        let ind = modes.indexOf(m);
        ind -= 1;
        if (ind < 0 ) { ind = modes.length-1; }
        return modes[ind];
    };

[toggle edit mode]()

This is the function that toggles the edit mode.


    (v) => { 
        setCenter(main.value);
        switch (v) {
        case 'plain' : 
            show($mainDisplay);
            hide($main);
            hide($snSliders);
        break;
        case 'input' :  //deprecated
            hide($mainDisplay);
            show($main);
            hide($snSliders);
        break;
        case 'linear' : 
            show($mainDisplay);
            hide($main);
            show($snSliders);
            complex.change(false);
        break;
        case 'plane' : 
            show($mainDisplay);
            hide($main);
            show($snSliders);
            complex.change(true);
        break;
        }
    }


[edit click]()

    el : $edit,
    evt : 'click',
    toVar : (el, self) => forwardEdit(self.value),
    fromVar : () => {}

[input]()

    el: $main,
    evt: 'sl-change',
    toVar: (el) => el.value,
    fromVar: (v, el) => el.value = v

[numrange]()

This relates the slider value to the main value. We do the shifts manually as
this allows us to use the f functions with complex stuff just be converting
them into their values appropriately.

TODO: Review the use of math.re for making sure slider value is right. It
should, but try to some complex scenarios. 

    el: $numrange,
    evt: 'sl-change',
    toVar: (el) =>  {
        let shift = math.sub(math.evaluate(el.value), 50);
        let newV;
        if (multiply.value) {
            newV = f.mul(shift, scaleRange.value, center.value); 
            console.log("mul", newV.toString());
        } else { //we add
            newV = f.add(shift, scaleRange.value, center.value); 
        }
        return newV; 
    },
    fromVar: (v, el) =>  {
        let newPlace;
        if (multiply.value) {
            newPlace = f.mulInv(v, scaleRange.value, center.value);
            console.log("mulInv", newPlace.toString());
        } else {
            newPlace = f.addInv(v, scaleRange.value, center.value);
        }
        el.value = math.round(math.re(math.add(newPlace, 50)));
    }



[comInp]()

This handles the var corresponding to the point in the jsxgraph plane input.
The board is where we deal with updates: https://stackoverflow.com/questions/25447207/jsxgraph-point-update-event

This ignores the multiply option as that uses the main slider as a power and
doing a complex power is complicated. 

    el: ci.board,
    evt : 'update',
    toVar : (el) => {
        let p = [ci.point.X(), ci.point.Y()];
        let shift = math.complex(math.sub(p[0] , 50), math.sub(p[1],50) );
        let newV;
        if (multiply.value) {
            newV = f.mul(shift, scaleRange.value, center.value); 
        } else { //we add
            newV = f.add(shift, scaleRange.value, center.value); 
        }
        return newV; 
    },
    fromVar : (v, el) => {
        let newPlace;
        if (multiply.value) {
            newPlace = f.mulInv(v, scaleRange.value, center.value);
        } else {
            newPlace = f.addInv(v, scaleRange.value, center.value);
        }
        // should have a complex number that represents the point in the plane
        ci.point.moveTo([math.round(math.add(math.re(newPlace), 50)), math.round(math.add(math.im(newPlace), 50))]);
        

    }

[complex toggle]()

This toggles whether we are using the plane input or the slider input. 

    (showPlane) => {
        if (showPlane) {
            show($comInp);
            hide($numrange);
            if (!ci) {
                makeComplex(); 
                main.bind( {_":comInp"});
            }
            ci.point.moveTo([50, 50]);
        } else {
            hide($comInp);
            show($numrange);
        }
    }


[scale range]()

This handles the var for shifting the scale. 

Not sure how variable would be changed, but if it was, we do a reverse lookup.

    el: $scaleRange,
    evt: 'sl-change',
    toVar : (el) => scale[el.value] || scale[20],
    fromVar : (v, el) => { el.value = scale.findIndex( (sc) => math.largerEq(sc, v) ) }


[round]() 

This is a function that will round the variable to the precision of one digit
past where the scale is sitting. We do this by computing 

    ( v ) => {

        if (multiply.value) {
            return v;  // not sure best way to handle multiplying precision
        }
        let p = precision.value;

        let ret;
        if ( p < 0) {
            ret = math.round(math.evaluate(v.toString()), math.abs(p));
        } else {
            let pow = math.pow(10, p.toString());
            ret = math.mul(math.round(math.div(v, pow)), pow);
        }

        //console.log(v.toString(), p.toString(), ret.toString());
        return ret;
    }


[precision]()

This takes in the scalerange value and converts it to the power of 10 that
implements our significance. 

    (s) => {
        if (s <= 0) {
            return 1;
        } else {
            let ret = math.sub(math.round(math.log10(s)), 1);
            //console.log("pre", s, ret);
            return ret;
        }
    }


[value range functions]()

These are simple arithmetic functions that given the value or the scale
pointer will yield the other. The inverse goes from the value to the pointer. 

Adding implements `v = (place - 50)*scale + centerValue` Inverted it is `place
= (v- center)/scale + 50`

Multiplying implements `v = center*scale^(place-50)` Inverting, we need the
value and center to be the same sign to have this make actual sense and
non-zero, but anyway:  `log(v /center)/log(scale) + 50 = place` will error if
v and center are different signs or center is zero. 

    add : (shift, scale, center) => round(math.add( math.mul(shift, scale), center)),
    addInv : (v, scale, center) => math.div(math.sub(v, center), scale),
    mul : (shift, scale, center) => round(math.mul(center, math.pow(scale, shift ) )),  
    mulInv : (v, scale, center) => math.div(math.log(math.div(v, center)), math.log(scale))

[multiply]()


This toggles the multiply option. 

    el : $multiply,
    evt: 'sl-change',
    toVar : (el) => {
        let bool = el.checked
        if (bool && center.value === 0) {
            if (main.value === 0) {
                main.change(1);
                center.change(1);  //otherwise we just get 1. 
            } else {
                center.change(main.value);
            }
        }
        return bool;},
    fromVar: (v, el) => el.checked = v

[complex]()

    el : $complex,
    evt: 'sl-change',
    toVar : (el) => el.checked,
    fromVar: (v, el) => el.checked = v

[set center]()

This resets the main slider to the middle and sets the center value to the
current value of the main variable

    function setCenter (v) {
        center.change( v );
        $numrange.value = 50;
        if (ci) {
            ci.point.moveTo([50,50]);
        }
    }

[center]()

    el : $redefineCenter,
    evt: 'click',
    toVar: () => {$numrange.value=50; return main.value;},
    fromVar: () => {}


[keypresses]()

This handles keypresses. The functionality is encapsulated in an object whose
keys are the keycodes and whose values are the functions to act on. 

We use the "focusin" and out events on the container to activate this, which
is done by pushing this object onto the key processing which allows us to have
other key installations. 

    const localKeys = { _":local keys" };
    const shift = () => keys.shift();
    const unshift = () => keys.unshift(localKeys);
    container.addEventListener('focusin', unshift);
    container.addEventListener('focusout', shift);

[local keys]()

This is manipulating the number. We have
q -- raise scale
a -- center scale to current value
z -- lower scale
w -- increase imaginary
s -- decrease main or decrease real
d -- increase main or increase real
c -- decrease imaginary
f -- text main edit
g -- open setting for scale stuff
v -- toggle view of complex or main slider
b -- select history of main input
t -- cycle forward through edit modes (plain, input, linear, plane)
T -- cycle backward through edit modes

    q : addScale,
    a : () => setCenter(main.value),
    z : lowerScale,
    w : addY,
    s : lowerX,
    d : addX,
    c : lowerY,
    f : () => $main.setFocus(),
    g : openSS,
    v : () => $comInp.click(),
    b : openH,
    t : () => mode.change(forwardEdit(mode.value)),
    T : () => mode.change(backwardEdit(mode.value)),
    '=' : openMain


[key helpers]()

This adds the functions that the keypresses do.  

So we want to manipulate the slider just as if we were dragging it. So we
add/subtract 1 accordingly. We don't want to manipulate the value of the Var
directly because then we need to convert back and forth which is handled in
toVar's of the bound elements. So we manipulate the range value and then feed
the range element in to the toVar as if the event of change had been issued
(it does not get emitted for js imposed changes). 


    const addScale = () => {
        let v = $scaleRange.value*1;
        if (v < 40) {
            $scaleRange.value = v + 1;
            scaleRange.bound[0].toVar($scaleRange);
        }
    };
    const lowerScale = () => {
        let v = $scaleRange.value*1;
        if (v > 0) {
            $scaleRange.value = v -1;
            scaleRange.bound[0].toVar($scaleRange);
        }
    };
    
    const addX = () => {
        if (complex.value) {
            let x = ci.point.X();
            if (x < 100) {
                x += 1;
                ci.point.moveTo([x,ci.point.Y()]);
            }
        } else {
            let m = $numrange.value*1;
            $numrange.value = m+ 1;
            main.bound[1].toVar($numrange);
        }
    };

    const addY = () => {
        if (!complex.value) { return;}
        let y = ci.point.Y();
        if (y < 100) {
            y += 1;
            ci.point.moveTo([ci.point.X(), y]);
        }
    };

    const lowerX = () => {
        if (complex.value) {
            let x = ci.point.X();
            if (x < 100) {
                x -= 1;
                ci.point.moveTo([x,ci.point.Y()]);
            }
        } else {
            let m = $numrange.value*1;
            $numrange.value = m- 1;
            main.bound[1].toVar($numrange);
        }
    };

    const lowerY = () => {
        if (!complex.value) { return;}
        let y = ci.point.Y();
        if (y > 0) {
            y -= 1;
            ci.point.moveTo([ci.point.X(), y]);
        }
    };


[destroy]()

Lots of stuff to do. Just a stub. Got to undo all the listeners, I presume. 

    () => {
        console.error("DESTROY needs to be implemented!");
    }

### Init keys

This loads the key listening event and does the loading operation. It will
return the listener for removal if needed (should not be, but...)

For main navigation, we have: 
hjkl doing the vim thing on inputs. It requires figuring out how to manage the
ordering. Some kind of two dimensional array representing up down an
left/right (child). 

n, p   for next, previous in terms of major tabs on the page. N and P can
navigate between pages. 

Need to pass in the order and tabs arrays. They have a current property. The
order has a parent property. Probably need to do some kind of add/remove that
scalednumber can tap into.

    () => {
        const group = $('sl-tab-group');
        const focus = _":focus"; 
        const obj = {
            tabs : [...$$('sl-tab')],
        };
        obj.tabs.current = 0;

So to implement an up/down and left/right navigation, we have a parent object
with class order-parent and then children objects of class order. Ideally the
order elements should all be focusable as that is the point. I believe that as
long there is at least one tab, this should produce an array of arrays. 

        obj.tabOrder = obj.tabs.
            map((t) => [...$$('.order-parent', t)]).
            map((arr) => { 
                    return arr.map( (par) => {
                        let ret = [...$$('.order', par)];
                        ret.parentElement = par;  //so that the parent element can be known
                        ret.current = 0;
                        ret.parent = 0;
                        return ret;
                    }); 
                } 
            );

We need the panel name to show the tabs. 

        obj.panels = obj.tabs.map( (el) => el.getAttribute('panel') );

        const newOrder = () => {
            obj.order = obj.tabOrder[ obj.tabs.findIndex( el=> el.active) ];
        }

        
        //$('sl-tab-group').addEventListener('sl-tab-show', newOrder);
        //newOrder();
 
 For the orders, we want to attach the add and remove functions which will
 take in a this and become a method. 

        const add = _":add order";
        const remove = _":remove order";

        obj.tabOrder.forEach( arr => {
            arr.add = add;
            arr.remove = remove;
        });
   
        const keys = [{_":global"}];
        const f = _":listener";
        document.addEventListener('keydown', f);
        return {keyListener:f, navStructure: obj, keys};
    }

[listener]()

If we put null as the first element in keys, we effectively cut this off. This
would be useful for allowing unrestricted use of a text input. Since most of
our input will be numbers and the like, we don't want to do that generally,
but who knows? Actually, maybe we find a null, we stop. That we could have
some keys that respond specially, but we disable the more general stuff. 

    (ev) => {
        if (ev.target.nodeName === 'TEXTAREA') {
            return; // disables key listening in text areaas 
        }
        let key = ev.key;
        keys.some( (el)=>  {
            if (el === null) {
                return true;
            }
            if (el[key]) {
                el[key]();
                ev.preventDefault();
                return true;
            }
        });

    }

[global]()

    h : () => {
        let order = obj.order;
        let c = order.current;
        let arr = order[order.parent];
        if (c > 0 ) {
            c -= 1;
            order.current = c;
            focus(arr[c]);
        }
    },
    j : () => {
        let order = obj.order;
        let c = order.parent;
        if (c > 0 ) {
            c -= 1;
            order.parent = c;
            order.current = 0;
            focus(order[c][0]);
        }
    },
    k : () => {
        let order = obj.order;
        let c = order.parent;
        if (c < (order.length-1)) {
            c += 1;
            order.parent = c;
            order.current = 0;
            focus(arr[c]);
        }
    },
    l : () => {
        let order = obj.order;
        let c = order.current;
        let arr = order[order.parent];
        if (c < (arr.length-1)) {
            c += 1;
            order.current = c;
            focus(order[c][0]);
        }
    },
    n : () => {
        let tabs = obj.tabs;
        let c = tabs.current;
        if (c < (obj.tabs.length-1)) {
            c += 1;
            tabs.current = c;
            group.show(obj.panels[c]);
        }
    },
    p : () => {
        let tabs = obj.tabs;
        let c = tabs.current;
        if (c > 0) {
            c -= 1;
            tabs.current = c;
            group.show(obj.panels[c]);
        }
    },
    N : () => { if (obj.nxt)  window.location = obj.nxt },
    P : () => { if (obj.prv) window.location = obj.prv }


[focus]()

A little helper for bringing stuff into focus. Supports shoelace focus as
first and then html focus fallback. Also checks for existence. ~


    (el) => {
        if (!el) { console.error("nothing passed into focus on");}
        if (el.setFocus) {
            el.setFocus();
        } else if (el.focus) {
            el.focus();
        } else {
            console.error("element not focusable", el);
        }
    }

[active]()

This returns the active tab index. 

    () => obj.tabs.findIndex( el => el.active )


[add order]()

If we are adding a parent level, we expect an array with a parent attribute.
Otherwise, we assume we are adding it to a child level. If adding a parent,
then we expect a parent to be given and it will be added after it. If no
parent is given (null), then it is added at the beginning of the list.
Similarly, for a child, we add after the passed in element. If it is a parent
element, then we append it to that listing. For falsy placement, we prepend
to the first array, for truthy non-matching, we append to last array. 

This function handles adding to the counters as needed.

If the element is not matched, then we add on the end of the array. So one
could pass true in for placement and it presumably would not be present and
leads to appending to the array. 


    function addOrder (placement, insert, self)  {
        self = self ?? this;
        if (Array.isArray(insert) ) {
            if (placement) {
                _":splice in parent"
            } else { // falsey placement, prepend
                self.unshift(insert);
                self.parent += 1;
            }
        } else {  // child
            if (placement) {
                _":splice in child"
            } else { // falsy placement, prepend to first array
                self[0].unshift(insert);
                if ( (self.parent === 0) && 
                    (self[0].length > 1) ) {  //actually has another element
                    self.current += 1;  
                }
            }

        }
    }

[splice in parent]()

We are adding an array and this part is that we want to put after an element
which could be an actual given element if it matches or just at the end of
current ones. 

    let ind = self.findIndex( (arr) => arr.parentElement === placement );
    if (ind === -1) { // not matched, append
        self.push(insert);
    } else { //actual appending after placement
        self.splice(ind+1, 0, insert);
        if (self.parent > ind) {
            self.parent += 1;
        }
    }

[splice in child]()

Here we are trying to find an element. It could be a parent or it could be a
child. Failure to find anything leads to appending to last array. 

    let found = self.some( (arr, parind) => {
        if (arr.parentElement === placement) {
            arr.push(insert);
            return true;
        } else {
            let ind = arr.findIndex( (el) => el === placement );
            if (ind == -1) {
                return false;
            } else {
                arr.splice(ind+1, 0, insert);

If the element being added is in the current parent, then we need to worry
about changing the current point as well. If not, then we are good to go. 

                if ((self.parent === parind) &&
                    (self.current > ind) ) {
                        self.curent += 1;
                }
                return true;
            }
        }
    });
    if (!found) {
        self[self.length-1].push(insert);
    }



[remove order]()

This takes in an element and removes it by finding it. It updates the current
pointer as needed. We assume an element appears only once. If it is a parent,
we remove the whole array(!).

    function removeOrder (del, self) {
        self = self ?? this;
        let ind = -1;
        self.some( (arr, i) => {
            if (arr.parentElement === del) {
                ind = i;
                return true;
            } 
            let fi = arr.findIndex( (child) => child === del);
            if (fi !== -1) {
                arr.splice(fi, 1);
                if ( (self.parent === i) && (self.current > fi) ) {
                    self.current += 1;
                }
                return true;
            }
            return false;
        });

Remove parent, updating parent index if we deleted the last parent. Otherwise
it goes to the next one. We set current to 0, the first element of whatever
order we have. 

        if (ind !== -1) {
            self.splice(ind, 1);
            if (self.parent === ind) {
                self.current = 0;
                if (!self[ind]) {
                    self.parent = ind-1;
                }
            }
        }
    }


## Content Loaded

This is the stuff we want to do to the page once stuff is loaded. 


        $$('nav  sl-button' ).forEach(el => el.classList.remove('hide'));


        $$('a.explore').forEach( (el) => {
            el.addEventListener( 'click', (ev) => ev.stopPropagation()); 
        });

        $$('.open-drawer').forEach( (el) => {
            let drawer = el.nextElementSibling;
            if (drawer.tagName === 'SL-DRAWER') {
                el.addEventListener('click', () => drawer.show());
                drawer.addEventListener('sl-show', (ev) => ev.stopPropagation());
                $('.close-drawer', drawer).
                    addEventListener('click', () => {
                        drawer.hide();
                    })
                ; 
            } else {
                console.log('Error; no next door drawer', el);
            }
        });

        $$('.stopProp').forEach( (el) => {
            el.addEventListener('click', (ev) => ev.stopPropagation());
        });

        _":make fano math"

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
        } else {

Should add types as needed in the chain. default is plain text.
            
            div.innerText = text;

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
    console.log(scale, cbW);
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
            console.log("safari found");
        }

    }   


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
                    if (rules[i].cssText === oldRule) {
                        sheet.deleteRule(i);
                    }
                }
            }
        });

        obs.observe(nav);
 
    }

## Local

Here are some setup things but they require access to local scope (could also
export a function that can be called instead if this gets unwieldy.  

    
    function makeScope (makeTypedInput) {
    
        const inputs = {};
    
        const scope = {};

        const outs = {};

        const replace = _":replace";

        const update = _":update";

        $$('body > sl-details').forEach( container => {
            _":create inputs" 
            
            _":deal with outputs"
        });


        console.log(scope);
        console.log(outs);

        const outputs = _":outputs";

        return {scope, inputs, outputs};

    }

[create inputs]()

This is how we define variables from the text. Easy enough. 

    $$('.input', container).forEach( el=> {
        let ds = el.dataset;
        let name = ds.name;
        let inp = inputs[name] = makeTypedInput(el, ds.type || 'real', {value:ds.value} );
        let v = scope[name] = inp.varVal;
        link(update(name), v);
    });

[deal with outputs]()

This is a little trickier. We need to link the variables to change the output
expression whenever the variable gets updated. This is what the whole var
setup is for, but they may not be in existence yet here. 

    $$('.output', container).forEach( el => {
        let ds = el.dataset;
        let template = ds.value || '';
        
        let bits = template.split('%'); 
        let first = bits.shift(); //first bit is before percent
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
        katex.render(replace(el.dataset.value), el);
    });

[inputs]()

NOT USED NOW


This runs through the input expressions and converts them into variables. 


    (...names) => {
        let ret = {};
        names.forEach( (n) => {
            let v = scope[n];
            if (!v) {
                console.error("missing variable " + n);
                return;
            }
            ret[n] = scope[n].varVal 
        });
        return ret;
    };


[outputs]()

This takes in an object whose key is the scope name and whose value is a
linked variable whose change should trigger an update. 

    (obj) => {
        Object.keys(obj).forEach( (key) => {
            let local = update(key);
            scope[key] = obj[key];
            link(local, obj[key]);
            local();
        });
    }


[update]() 

This creates an update function that basically updates the expressions that
are linked to the variable. 

    function makeUpdate (name) {
        return function update () {
            let o = outs[name];
            if (o) {
                o.forEach( (el) => {
                    let text = replace(el.dataset.value);
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

    (txt) => {
        let bits = txt.split('%'); 
        let first = bits.shift(); //first bit is before percent
        let replaced = bits.map( (bit) => {
            if (bit[0] === ' ') {
                return '%' + bit.slice(1); //strip space, but no var here actual %
            }
            let ind = bit.indexOf(' ');
            if (ind === -1) { ind = bit.length;}
            let vname = bit.slice(0,ind);
            let rest = bit.slice(ind+1);
            let v = scope[vname];
            if (!v) { 
                v = '';
            } else {
                v = v.value;
            }
            return v + rest;
        }).join('');
        return first+replaced;
    }
    

