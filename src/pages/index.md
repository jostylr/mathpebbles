# MathPebbles

    _"pieces | page /index, _'intro |md',
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

    MathPebbles is dedicated to exploring mathematics through interactive
    text and graphs, video, proofs, and programs. One can also take notes and
    do practice problems. 

    It is organized into seven books, each with seven chapters, and each
    chapter has seven sections. Sections may contain a lot of subsections or
    be fairly minimal. Some chapters can represent whole courses while others
    may only represent a small portion of a course's material. It gets heavier
    as one goes further on. 

    We start with counting and end with professional applications of
    mathematics. It is very ambitious. 

    The hope of this site is to inspire an exploratory attitude in using
    mathematics. Mathematics is a tool for understanding the world and is a
    world unto itself. Exploring that world and our world simultaneously will
    be our journey. 

    One of the features of this site is carefully crafted computer-aided
    explorations of mathematics. While there are incredible computer-based
    mathematical systems out there, e.g., [GeoGebra](https://geogebra.org),
    they are of a general purpose and can be hard to use to fully explore
    something. In paticular, it is not only answers that we seek, but the
    methods and how they vary. This requires a guided partnership between
    student and computer. 

    As of this writing, it is very much empty of content and still being
    worked on. It will take years to complete this, if ever. 




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

```ignore

            ec("Moser's Circle Problem"), _"Moser | md",
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
    previous number. Let's explore.  `#n=3`

    !PEBBLE moser

    !VIDEO 172749090 Moser's Circle Demonstration  
 

    !DETAILS: 
    
    What do we have here?

    * First step is to think

        In detail 

        More details

    * Next step 

    * Final step

        blah blah

     no blah

     !DETAILS: 

     * No leading blurb

        what? 

    * blurb blurb

        details
        
        more details

    !PROOF: Induction

    Inductive, 

       

    !PEBBLE moser-inductive

    !VIDEO https://bugbearday.org/ Moser's Circle Inductive Proof

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
    regions = 0;
    log(points); 
    regions = 31;
    this.regions += 1;
    this.dude += 10;
    log(regions, this.regions);
    out(`<p>${5}</p>`);

    ```

    !SOLUTION:

    To do this, ....

    
    ```
    regions = 31;
    log(regions);
    ```

    !END.

    !STOP.



##### Pebble

    moser (el)  {
        let n = this.n; 
        console.log(this, n, n.toString());
       el.id = 'cool';
        el.style = 'width:500px;height:200px;border:1px';

        let b = JXG.JSXGraph.initBoard('cool', {boundingbox: [-5, 2, 5, -2],
        showCopyright: false, showNavigation: true});
        let  p1 = b.create('point',[0,0], {name:'A',size: 4, face: 'o'});
        let p2 = b.create('point',[2,n.toNumber()], {name:'B',size: 4, face: 'o'});

        let ci = b.create('circle',["A","B"], {strokeColor:'#00ff00',strokeWidth:2}); 
    },

    'moser-inductive' : (el) => {
        el.innerHTML = "<h2>INDUCTION</h2>";
    },

##### Code


    counting1regions () {
        console.log("Moser code was here");
        this.vars = ['regions', 'points'];
        this.points = [[1,6],[2,7]];
        this.renew = () => {this.regions = 6; this.dude = 7}
        this.pre = `points = [[1,3], [2, 4]]`;
        this.post = 'log(this.regions, this.points, this.dude, regions, points)';
    },

```

## Hammer

The one method to rule them all. 

    Here is a quick example of what this site can do. Prior knowledge required
    for this example: arithmetic, acceptance that the volume of a box is the length times
    width times height, and we will do some graphing. 

    Armed with just that info, we will solve a silly problem quite quickly. 

    !-

    We want a box that can hold `#target=20` cubic feet of mulch. Its dimension
    are such that the length is `#overLength==3` feet longer than the width and the
    height is `#underHeight=1` foot less than the width. How do we find the
    dimensions? 

    Given the width, what is the volume of the box? Since volume is `L*H*W`$, we
    need to find those three quantities. 

    Everything is in terms of width. The translation of the given information
    is that `==L = W + ${overLength}` and `== H = W - ${underHeight}`. 

    Typically we write `x`$ for the unknown input and let's do that here. Then
    the formula for computing the volume given the width `x`$ 
    is `==(x + ${overLength} ) *(x - ${underHeight} ) * x`.

    To get a sense of this problem, we can graph it with the width values
    increasing along the horizontal axis towards the right while the volume
    amount will be measured with increasing value up the vertical axis.  

    !BOARD volumeGraph t:50, r:10 


    We explore a general method that we think of as the hammer method since it
    basically smashes any such "find the unknown that hits the target value"
    with very little understanding of the algebra of the problem.  (This is
    actually known as the Secant Method).

    The first step is to write an expression that computes the value for a
    given choice. This is actually the hard part of the problem and is
    required for any method of solution. 

    For this particular example, we use the (definitionesque) fact that we can
    get the volume from the dimnesions by multiplying them all together. So
    the expression is    where `x`$ is the width. 

    We try some number, such as `#width=10`, to get a sense of this. Plugging
    in, we get `=:volume`. Our task is get that volume to be our target number
    of `=target` and we are currently `= target.sub(volume)` away
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
        let l = x.add(this.overLength);
        let h = x.sub(this.underHeight);
        return x.mul(l).mul(h);
    },

    hammerTable (maxloops=50) {
        math.precision(64);
        let {g1, g2, precision} = this;
        let digits = Math.round(Math.abs(Math.log(precision)/Math.log(10)) );
        console.log(digits);
        let [xdiff, v1, v2, ydiff, targetDiff, r, g3] = this.hammerFunction(g1, g2);
        let rows = [];
        let count = 0;
        while (targetDiff.abs().gt( precision.toNumber()) &&  (count < maxloops)) {
            rows.push(  '<tr>' + [g1, g2, xdiff, v1, v2, ydiff, targetDiff, r, g3].map( num => {
                return `<td>${num.toFixed(digits)}</td>`;
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
        let xdiff = guess1.sub( guess2);
        let ydiff = v1.sub( v2);
        let target = this.target;
        let targetDiff = target.sub( v2);
        let r = targetDiff.div(ydiff);
        let g3 = guess2.add(r.mul( xdiff));
        return [xdiff, v1, v2, ydiff, targetDiff, r, g3];
    },
    volumeGraph (b, el)  {
        let self = this;
        let overLength, underHeight, target, x,y;
        ({overLength =3, underHeight=1, target=20} = self.toNumber);
        let eff = function update() {
            ({overLength =3, underHeight=1, target=20} = self.toNumber); //same this in and out
            [x,y] = self.vSolve(f);
            console.log( "x,y", x, y);
            b.fullUpdate();
        };
        let f = (x) => (x+overLength)*(x-underHeight)*x;
        let l = (x) => target;
        eff();
        b.create('functiongraph', f);
        b.create('functiongraph', l);
        b.create('point', [()=>x, ()=>y]); 
        console.log("we should have something on the screen");
        this.volumeGraph = eff;
    },
    vSolve (f) {
        let {overLength = 3, underHeight=1, target=20} = this.toNumber;
        let g1 = Math.max(underHeight+1, target/5);
        let g2 = Math.max(g1*1.1, g1+1);
        let tdiff = 100; //totally random
        let v2;
        let count = 0;
        while ( ( Math.abs(tdiff) > 1e-8 ) && (count < 20) ) {
            let v1 = f(g1);
            v2 = f(g2);
            tdiff = target - v2;
            let ydiff = v1-v2;
            if (Math.abs(ydiff) < 1e-10) { 
                g1 = (g1+g2+Math.random())/2; //just a random bit
                count += 1; 
                break;
            }
            let xdiff = g1 - g2;
            let xslope = xdiff/ydiff;
            g1 = g2;
            g2 += xslope*tdiff;
            count +=1;
        }
        return [g2, v2];
    },




##### Code 


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
