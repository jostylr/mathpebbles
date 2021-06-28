# Solving Quadratics

    _"pieces | page /algebra/quadratics/solving-quadratics, _'intro |md',
            ec('Iterative Answers'), _'Iterative Answers |md ',
            ec('Completing the Square'), _'Completing the Square |md ',
            ec('Quadratic Formula'), _'Quadratic Formula |md ',
            ec('A Better Quadratic Formula'), _'A Better Quadratic Formula |md ',
            ec('Examples'), _'Examples |md ' "

[../public/algebra/quadratics/solving-quadratics.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro






[pebble]()

    Practice solving the quadratic problems

[proof]()

    prove the quadratic formula, 

[program]()

    Implement the iterative approximation and quadratic formula

##### Pebble

## Teaser

    We can solve quadratic equations with iterative guessing, inspired algebraic
    manipulations, or formulas. We will explore them and then do a variety of
    applied examples to see how each technique works out. 

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

## Iterative Answers




##### Pebble


##### Code


## Completing the Square




##### Pebble


##### Code


## Quadratic Formula


    The quadratic formula for the quadratic `ax^2 + bx + c`$ is 

    ```$
    x = \frac{-b \pm \sqrt{b^2 - 4ac} }{2a}
    ```

##### Pebble


##### Code


## A Better Quadratic Formula

    The standard quadratic formula is a bit of a mess and has some
    instabilities. By rewriting the quadratic before going to the formula, we
    can create a more stable formula and better control the accuracy at the
    start.

    !-

    Transform into `x^2 - 2px + q`$  (we can turn the `x^2`$ coefficient into
    1 since it should be non-zero for a quadratic and in solving for when it
    is equal to 0, we can divide by `a`$ freely). Then the formula is 

    ```$
    x = p \pm \sqrt{p^2 -q}
    ```

    If `q`$ is near 0 relative to the size of `p^2`$, then the combination
    will be roughly 0 and `2p`$.  The second one is fine, but that 0 is
    potentially a place for significant error. So we can use the fact that the
    product of the roots is `q`$ and thus the second root can be found by
    dividing `q`$ by the first root which will be stable as the approximate
    `2p`$ root will be large relative to `q`$ in this situation. 

    Let's try it on the quadratic: `#quadratic;type:poly;=2x^2+12x + 3`
    
    !PEBBLE better-quadratic

    Steps:

    1. Divide all by `=a=%q2`$:  `%better-quad`$
    2. Divide `b`$ by 2:   `%better-p`$. This is `p`$ 
    3. `q`$ is the constant term: `%better-q`
    4.  

    


##### Pebble

    Given a quadratic (input or randomly generated), transform into the form and then compute the formula with the two roots. Compute both the two roots directly as well as doing a version with the division trick. 


##### Code


## Examples

    Geometric

    Parabolic ball




##### Pebble


##### Code



