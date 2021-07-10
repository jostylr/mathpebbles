# MathPebbles

    _"pieces | page /index, _'intro |md',
            ec("Moser's Circle Problem"), _"Moser | md",
            ec("Hammer Method"), _"hammer | md",
            /arithmetic,  _'Arithmetic |md',
            /algebra,  _'Algebra |md',
            /geometry,  _'Geometry |md',
            /functions,  _'Functions |md',
            /many-variables,  _'Many Variables |md',
            /probability-and-statistics,  _'Probability and Statistics |md',
            /practitioners,  _'Practitioners |md'"

[../public/index.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro

##### Pebble

## Teaser

##### Pebble

## Pieces

    !- style
    _":style"
    !- script
    _":script"
    !- pebbles
    _"pebbles"
    !- code
    _"code runs"
    !- header
    _":header"
    !- begin
    _":begin"
    !- end
    _":end"



[style]() 

    
[script]()

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

    !PROOF: Induction

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

    !PROGRAM countProgram 

    How to count the regions (find all the intersections, then trace
    out each polygon (head in a direction to the next intersection, then turn
    along the meeting line in the same direction to be closer to the previous
    point), name them in a canonical way, and then count them.
    Special case of adjacent points on the circle. 

    !CODE: counting1regions

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



##### Pebble

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

##### Code


    counting1regions : (text, out) => {
        console.log("Moser code was here");
        let points = [[1,3], [2, 4]];
        let regions;
        eval(text);
        out.innerHTML =`<p>${regions}</p>`;
    },


## Hammer

The one method to rule them all. 

    We want a box that can hold `#target=20` cubic feet of mulch. Its dimension
    are such that the length is `#overLength==3` feet longer than the width and the
    height is `#underHeight=1` foot less than the width. How do we find the
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
    the expression is `==(x + ${overLength} ) *(x - ${underHeight} ) * x`
    where `x`$ is the width. 

    We try some number, such as `#width=10`, to get a sense of this. Plugging
    in, we get `=:volume`. Our task is get that volume to be our target number
    of `=target` and we are currently `=math.sub( target, volume)` away
    from the target. 

    To tackle this in a reasonably efficient manner, we do a couple of guesses
    and then we pretend that this expression is a representing a line. In
    particular, a line has the nice property that changes in `y`$ are
    proportional to changes in `x`$. That proportionality constant is the
    [slope](algebra/lines/slope.html#proportionality).

    Applying it here, we can compute our next guess by computing how much we
    want to change the volume amount to get to the target volume. We compare
    this to the change in the volume between our two guesses and then we apply
    that proportional change to our width. And that becomes our next guess. 

    Guess 1: `#g1=3`,  Guess 2: `#g2=10`, Precision: `#precision=1E-10`. Then
    here is our method computing the result: 

    `%tag:table;@innerHTML;=hammerTable()`
    


##### Pebble


    cVolume (x) {
        x = x ?? this.width;
        let l = math.add(x, this.overLength);
        let h = math.sub(x, this.underHeight);
        return math.mul(x, l, h);
    },

    hammerTable (maxloops=50) {
        let {g1, g2, precision} = this;
        let digits = Math.round(Math.abs(Math.log(precision)/Math.log(10)) );
        console.log(digits);
        let [xdiff, v1, v2, ydiff, targetDiff, r, g3] = this.hammerFunction(g1, g2);
        let rows = [];
        let count = 0;
        while ( math.gt(math.abs(targetDiff), precision) &&  (count < maxloops)) {
            rows.push(  '<tr>' + [g1, g2, xdiff, v1, v2, ydiff, targetDiff, r, g3].map( num => {
                return `<td>${math.format(num, {notation:'fixed', precision:digits})}</td>`;
            }).join('')+'</tr>');
            count += 1;
            g1 = g2;
            g2 = g3;
            [xdiff, v1, v2, ydiff, targetDiff, r, g3] = this.hammerFunction (g1, g2);
        }
        let header = '<thead><tr><th>' + 
            ['x1', 'x2', 'x1-x2', 'v1', 'v2', 'v1-v2', 't-v2', 'r', 'x3'].join('</th><th>')+ 
            '</th></tr></thead>';
        return header + '<tbody>' + rows.join('') + '</tbody>';
    },

    hammerFunction (guess1, guess2) {
        let v1 = this.cVolume(guess1);
        let v2 = this.cVolume(guess2);
        let xdiff = math.sub(guess1, guess2);
        let ydiff = math.sub(v1, v2);
        let target = this.target;
        let targetDiff = math.sub(target, v2);
        let r = math.div(targetDiff, ydiff);
        let g3 = math.add(guess2, math.mul(r, xdiff));
        return [xdiff, v1, v2, ydiff, targetDiff, r, g3];
    },


```ignore
## Arithmetic

    _"arithmetic::teaser"


[arithmetic](pages/arithmetic.md "load:")

## Algebra

    _"algebra::teaser"


[algebra](pages/algebra.md "load:")

## Geometry

    _"geometry::teaser"


[geometry](pages/geometry.md "load:")

## Functions

    _"functions::teaser"


[functions](pages/functions.md "load:")

## Many Variables

    _"many-variables::teaser"


[many-variables](pages/many-variables.md "load:")

## Probability and Statistics

    _"probability-and-statistics::teaser"


[probability-and-statistics](pages/probability-and-statistics.md "load:")

## Practitioners

    _"practitioners::teaser"


[practitioners](pages/practitioners.md "load:")
```

## Arithmetic


## Algebra

## Geometry

## Functions

## Many Variables

## Probability and Statistics

## Practitioners
