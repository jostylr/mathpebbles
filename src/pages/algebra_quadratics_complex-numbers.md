# Complex Numbers

    _"pieces | page /algebra/quadratics/complex-numbers, _'intro |md',
            ec('Square Root of a Negative Number'), _'Square Root of a
            Negative Number |md ',
            ec('Arithmetic of Complex Numbers'), _'Arithmetic of Complex
            Numbers |md ',
            ec('Quadratic Formula When There is No Real Solution'),
            _'Quadratic Formula When There is No Real Solution |md ',
            ec('Iterative Approximation When There is No Real Solution'), _'Iterative Approximation When There is No Real Solution |md ',
            ec('Graphing Complex Roots'), _'Graphing Complex Roots |md ',
            ec('Complex Factors'), _'Complex Factors | md', 
            ec('Visions of Complex Numbers'), _'Visions of Complex Numbers |md ' "

[../public/algebra/quadratics/complex-numbers.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro



    
[pebble]()

    iterative version with complex
    numbers, graphing with the flip, speed quadratic formula

[proof]()

    Establishing the reasonableness of the imaginary i

[program]()

    Compute out the flipping circle stuff, approximative scheme.


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

## Square Root of a Negative Number


    A number whose square is a negative number. That is the realm we are about
    to explore. 

    !-

    First, let's try to find an answer with the numbers we already know. 

    Let `x`$ be `#negsqrt=-1`. Then we compute `=x^2 = x*x =  %sqrd$`. If you
    run through any option you like, you will find that none of them give you
    a negative number. 

    !PEBBLE test-neg-sqrt

    So we make up a new number, a number called `i`$, which is also written 
    as `\sqrt{-1}`$. This is a number whose defining property is that `i^2 = -1`$.

    We define addition with `i`$ in the same way as if this was 1. For
    example, `i+i = 2i`$.  This leads to statements like `3*2i = 6i`$ 
    and `3i*2i=-6`$

    There ae two such numbers, namely `i`$ and `-i`$. We have chosen one of them aribitrarily to be `i`$. While it is largely not an issue to worry about, it can be useful to keep it in mind to avoid relying on an arbitrary choice (whatever you say about `i`$ should also apply to `-i`$). 
   

    This solves the issue of negative square roots

##### Pebble

    'test-neg-sqrt' : (el, scope) => {
        let {negsqrt} = scope.vars;
        let sqr = (x) => {let r = math.mul(x, x); console.log(x,r); return r;};
        let sqrd = link(sqr, negsqrt);
        console.log(sqrd);
        outputs({sqrd}, scope);
    },




##### Pebble


##### Code

## Arithmetic of Complex Numbers




##### Pebble


##### Code

## Quadratic Formula When There is No Real Solution




##### Pebble


##### Code


## Iterative Approximation When There is No Real Solution




##### Pebble


##### Code

## Complex Factors


##### Pebble


##### Code



## Graphing Complex Roots

    When there is no solution, reflecting across the horizontal through the
    vertex leads to a parabola with solutions. Find those roots. Draw the
    circle through those roots with that being a diameter. Then the complex
    points in the plane for the original's roots are the points at the top 

    contrast with Carlyle circle for real roots

    complex root circle construction explained: 
    https://scholarworks.umt.edu/cgi/viewcontent.cgi?article=1440&context=tme


##### Pebble


##### Code




## Visions of Complex Numbers




##### Pebble


##### Code



