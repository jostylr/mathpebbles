# Arithmetic and Geometry of Complex Numbers

    _"pieces | page /algebra/constructing-the-real-and-complex-numbers/arithmetic-and-geometry-of-complex-numbers, _'intro |md',
            ec('sub 1'), _'sub 1 |md ',
            ec('sub 2'), _'sub 2 |md ',
            ec('sub 3'), _'sub 3 |md ',
            ec('sub 4'), _'sub 4 |md ',
            ec('sub 5'), _'sub 5 |md ',
            ec('sub 6'), _'sub 6 |md ',
            ec('sub 7'), _'sub 7 |md '"

[../public/algebra/constructing-the-real-and-complex-numbers/arithmetic-and-geometry-of-complex-numbers.html](# "save:")


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

    _"sub 1:pebble"

    _"sub 2:pebble"

    _"sub 3:pebble"

    _"sub 4:pebble"

    _"sub 5:pebble"

    _"sub 6:pebble"

    _"sub 7:pebble"



[code]()

    _"sub 1:code"

    _"sub 2:code"

    _"sub 3:code"

    _"sub 4:code"

    _"sub 5:code"

    _"sub 6:code"

    _"sub 7:code"



[header]()

[begin]()

[end]()

## sub 1

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

    !PROOF: 

    Inductive, 

    !DETAILS: 
    
    What do we have here?

    * First step is to think

        In detail 

    * Next step 
    

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
    }

[code]()

    counting1regions : (text, out) => {
        console.log("Moser code was here");
        let points = [[1,3], [2, 4]];
        let regions;
        eval(text);
        out.innerHTML =`<p>${regions}</p>`;
    }






[pebble]()


[code]()


## sub 2




[pebble]()


[code]()


## sub 3




[pebble]()


[code]()


## sub 4




[pebble]()


[code]()


## sub 5




[pebble]()


[code]()


## sub 6




[pebble]()


[code]()


## sub 7




[pebble]()


[code]()


