# MathPebbles

    _"pieces | page /index, _'intro |md',
            ec("Moser's Circle Problem"), _"Moser | md",
            ec("Hammer Method"), _"hammer | md",
            /arithmetic,  _'Arithmetic',
            /algebra,  _'Algebra',
            /functions,  _'Functions',
            /many-variables,  _'Many Variables',
            /geometry,  _'Geometry',
            /probability-and-statistics,  _'Probability and Statistics',
            /practitioners,  _'Practitioners'"

[../public/index.html](# "save:")


## Intro

[pebble]()

[code]()

## Pieces

    !- style
    _":style"
    !- script
    _":script"
    !- pebbles
    _":pebbles"
    !- code
    _":code"
    !- header
    _":header"
    !- begin
    _":begin"
    !- end
    _":end"

[style]() 

[script]()

[pebbles]()

    _"arithmetic::intro:pebble"

    _"algebra::intro:pebble"

    _"functions::intro:pebble"

    _"many-variables::intro:pebble"

    _"geometry::intro:pebble"

    _"probability-and-statistics::intro:pebble"

    _"practitioners::intro:pebble"
    

    _"moser:pebble"


    _"hammer:pebble"


[code]()

    _"arithmetic::intro:code"

    _"algebra::intro:code"

    _"functions::intro:code"

    _"many-variables::intro:code"

    _"geometry::intro:code"

    _"probability-and-statistics::intro:code"

    _"practitioners::intro:code"


[header]()

[begin]()

[end]()

## Moser 
    
    What's the next term? 1, 2, 4, 8, 16, ??? (not 32) 

    !-

    A big field is enclosed by a circular fence. We are going to construct
    several straight fences crossing the field. These fences will enclose
    various regions inside the field. If `n`$ is the number of endpoints of
    the fences on the circle, what is the maximum number of enclosed regions
    that could be obtained? What causes the number to be lower? 

    This is called Moser's problem and it is an interesting problem because the
    number of regions at first doubles for each point added but when we add
    the 6th point, the maximum number of regions is less than double the
    previous number. Let's explore.

    !PEBBLE moser

    !VIDEO url  Moser's Circle Demonstration  
 

    !DETAILS: 
    
    What do we have here?

    * First step is to think

        In detail 

    * Next step 

    !PROOF: 

    Inductive, 

       

    !PEBBLE moser-inductive

    !VIDEO url Moser's Circle Inductive Proof

    Euler

    !SUMMARY:

    Regions and lines and points, oh my!

    !DETAIL:

    Some more stuff

    !DONE.
    

    !QED.

    !PROGRAM: 

    How to count the regions (find all the intersections, then trace
    out each polygon (head in a direction to the next intersection, then turn
    along the meeting line in the same direction to be closer to the previous
    point), name them in a canonical way, and then count them.
    Special case of adjacent points on the circle. 

    !CODE counting1regions:

    ```
    log(points); 
    regions = 0;

    ```

    !SOLUTION:

    To do this, ....

    
    ```
    regions = 31;
    log('my the solution goes here');
    ```

    !END.

    !STOP.


[pebble]()

    moser : (el) => {
       el.id = 'cool';
        el.style = 'width:500px;height:200px;border:1px';

        let b = JXG.JSXGraph.initBoard('cool', {boundingbox: [-5, 2, 5, -2],
        showCopyright: false, showNavigation: true});
        let  p1 = b.create('point',[0,0], {name:'A',size: 4, face: 'o'});
        let p2 = b.create('point',[2,-1], {name:'B',size: 4, face: 'o'});

        let ci = b.create('circle',["A","B"], {strokeColor:'#00ff00',strokeWidth:2}); 
    },

    'moser-inductive' : (el) => {
        el.innerHTML = "<h2>INDUCTION</h2>";
    },

[code]()

    counting1regions : (text, out) => {
        console.log("Moser code was here");
        let points = [[1,3], [2, 4]];
        let regions;
        eval(text);
        out.innerHTML =`<p>${regions}</p>`;
    }


## Hammer

The one method to rule them all. 

    We want a box that can hold `#h-target=20$` cubic feet of mulch. Its dimension
    are such that the length is `#h-overLength=3` feet longer than the width and the
    height is `#h-underHeight=1` foot less than the width. How do we find the
    dimensions? 

    We explore a general method that we think of as the hammer method since it
    basically smashes any such "find the unknown that hits the target value"
    with very little understanding of the algebra of the problem.  (This is
    actually known as the Secant Method).

    !-

    The first step is to write an expression that computes the value for a
    given choice. This is actually the hard part of the problem and is
    required for any method of solution. 

    For this particular example, we use the (definitionesque) fact that we can
    get the volume from the dimnesions by multiplying them all together. So
    the expression is `=(x + %h-overLength ) *(x - %h-underHeight ) * x$`
    where `x`$ is the width. 

    We try some number, such as `#h-width;type:real;=10`, to get a sense of this. Plugging
    in, we get `=%h-volume`. Our task is get that volume to be our target number
    of `=%h-target`.

    !PEBBLE hammer-text

    To tackle this in a reasonably efficient manner, we do a couple of guesses
    and then we pretend that this expression is a representing a line. In
    particular, a line has the nice property that changes in `y`$ are
    proportional to changes in `x.`$ That proportionality constant is the
    [slope](algebra/lines/slope.html#proportionality).

    Applying it here, we can compute our next guess by computing how much we
    want to change the volume amount to get to the target volume. We compare
    this to the change in the volume between our two guesses and then we apply
    that proportional change to our width. And that becomes our next guess. 

    !PEBBLE hammer-table
    


[pebble]() 

    'hammer-text' : (el) => {
        let {
            'h-width':target, 
            'h-overLength':overLength, 
            'h-underHeight':underHeight, 
             'h-width':width} = scope; 
        let computeVolume = (w, h, l) => {
            let ret = math.mul(w, 
                math.sub(w,h), 
                math.add(w,l)
            );
            console.log("volume computed:", ret);
            return ret;
        };
        let volume =  link( computeVolume, [width, underHeight, overLength]);
        outputs({'h-volume': volume});
    },

    'hammer-table' : (el) => {
        
        
    },

    'hammer-function' : (el) => {

    },

## Arithmetic

    _"arithmetic::intro"


[arithmetic](pages/arithmetic.md "load:")

## Algebra

    _"algebra::intro"


[algebra](pages/algebra.md "load:")

## Functions

    _"functions::intro"


[functions](pages/functions.md "load:")

## Many Variables

    _"many-variables::intro"


[many-variables](pages/many-variables.md "load:")

## Geometry

    _"geometry::intro"


[geometry](pages/geometry.md "load:")

## Probability and Statistics

    _"probability-and-statistics::intro"


[probability-and-statistics](pages/probability-and-statistics.md "load:")

## Practitioners

    _"practitioners::intro"


[practitioners](pages/practitioners.md "load:")
