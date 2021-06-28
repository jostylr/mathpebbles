# Arithmetic of Polynomials

    _"pieces | page /algebra/polynomials/arithmetic-of-polynomials, _'intro |md',
            ec('sub 1'), _'sub 1 |md ',
            ec('sub 2'), _'sub 2 |md ',
            ec('sub 3'), _'sub 3 |md ',
            ec('sub 4'), _'sub 4 |md ',
            ec('sub 5'), _'sub 5 |md ',
            ec('sub 6'), _'sub 6 |md ',
            ec('sub 7'), _'sub 7 |md '"

[../public/algebra/polynomials/arithmetic-of-polynomials.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro

    Polynomials are the next step after lines and quadratics. It refers to
    sums of terms of the form of a number multiplying a positive integer power 
    of an unknown. Examples include: 

    * Cubic (degree 3): {$$} p(x) = 5x^3 -7x^{2} +2x + 1 {/$$}
    * Quartic (Degree 4) : {$$}q(x) = \frac{1}{2} x^{4} + 3 x^{2} - 7x{/$$}
    * Monomial, Quintic: {$$}r(x) = 9x^{5} {/$$}

    For polynomials, we generally name them using letters like {$$}p{/$$},
    {$$}q{/$$}, or {$$}r{/$$}. The *degree* of a polynomial refers to the
    highest power of {$$}x{/$$} (or whatever variable name is of relevance). 

    The expression {$$}p(x){/$$} is read as "p of x" and is meant to
    communicate that we are to put in a value in for {$$}x{/$$}. To evaluate
    the polynomial {$$}p{/$$} at 3, for example, we would have

    {$$}
    p(3) = 5*3^3 -7*3^2 +2*3 + 1 = 79
    {/$$}

    Polynomials can refer to single terms or many terms though the topic
    generally refers to those with at least degree 3 since degree 1 (lines)
    and degree 2 (quadratics) are covered separately. 

    This chapter covers the basic combination of polynomials, the questions we
    may care about regarding polynomials such as finding values that make a
    polynomial zero, and exploring deeply a fantastic tool called synthetic
    division. A novel approach here is to explore some notions of calculus
    using synthetic division. 

    The numbers in front of the power of {$$}x{/$$} is called a *coefficient*.
    Coefficients can be any number we like, however, the coefficient of the
    leading degree term should not be zero. This is similar to how we do not
    write 0300 for the number three hundred. 

    The coefficient and the power of {$$}x{/$$} combine to be a monomial. It
    is often also referred to a term, but a term can also refer to the portion
    of the monomial with no coefficient. This can be useful as we can talk
    about the number of terms in a polynomial in a way which is not subject to
    different ways of breaking apart the monomials. 

    Adding, subtracting, multiplying polynomials

[pebble]()

    * V: [Introduction to polynomials](https://youtu.be/6v5MNmILNgU) answers
      the question of what just what is a polynomial. What are its parts
      (coefficients, powers, degree, terms) and the most basic operation we
      can do with them: plugging a value in for x.   
    * P: [Evaluating polynomials](https://mathpebbles.com/polynomial-evaluation.html). 
      Type in a polynomial and an x-value to  get out an answer.  


[proof]()

[program]()

    #### Evaluating Polynomials

    _"evaluating polynomials"

## Evaluating Polynomials

    This bit of code takes in a polynomial and an input (x) and gives out the
    output p(x). 

    The polynomial is given in the form of an array of numbers, one slot for
    each coefficient. It is ordered from the constant term up to the highest
    degree term's coefficient. 

    Both the coefficients and the input could be a special thing, such as a
    fraction,  that is not a number. So we also have an operations object that
    we can pass in to handle adding and multiplying. 

    Our strategy is to first compute all the powers, doing the lower powers
    first so that we can basically use the fact that {$$}x^n = x^{n-1} * x{/$$}. After computing the powers, we multiply by the coefficients and then we sum. 

    We return all of those computations in an object. 

        _":program"

[program]()

This should be given an array representing a polynomial and a number to
evaluate. An optional argument can be provided with methods to add and
multiply numbers (such as doing exact fractional stuff). 

    function (poly, input, ops={}) {
        let powers = [1];
        poly.slice(1).reduce( (value, ignore, power)=> {
            value = ops.m?.(value, input) ?? value*input;
            powers.push(value);
            return value;
        }, 1);
        let terms = poly.map( (c, i) => ops.m?.(c, powers[i]) ?? c*powers[i]);
        let sum = terms.reduce( (s, t) => {return ops.a?.(s, t) ?? s + t }, 0);
        return {sum, terms, powers, terms, input, poly};
    }

[cli version]()

    let pe = _":program";
    
    console.log( pe( [3, 6, 7, -4], 2) );


[programs/evaluating-polynomials.js](# "save")



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

## sub 1




##### Pebble


##### Code


## sub 2




##### Pebble


##### Code


## sub 3




##### Pebble


##### Code


## sub 4




##### Pebble


##### Code


## sub 5




##### Pebble


##### Code


## sub 6




##### Pebble


##### Code


## sub 7




##### Pebble


##### Code


