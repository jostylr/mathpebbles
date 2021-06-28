# Testing the mathematical functions

This is where we construct the testing harness of all the mathematical
functions and also create a benchmark suite? We can also include a
documentation tool. 

We setup the math object.

    import {f, math} from './index.mjs';

    const tests = [_"tests"];

    const eq = {_"equality"};

    const passed = [];
    const failed = {};
    const exploring = {};


Note that if outputs is a function, then it takes in the results and verifies
that it conforms to whatever it is we want to be true; it should explicitly
return true if it is fine.  If it is not a function, then we treat them as
something to compare with the equality function. 

    tests.forEach( ([fname, inputs, outputs, testname]) => {
        try {
            let fun;
            if (typeof fname === 'function') {
                fun = fname;
                fname = fun.name || 'function';
            } else if (typeof fname === 'string') {
                fun = f[fname];
            } else {
                throw "need function or function name for test: " + fname +
                    '::' + testname;
            }
            if ( typeof inputs === 'function' ) { 
                inputs = inputs();
            }
            let result = fun.apply(f,inputs);
            if (typeof outputs === 'function') {
                let compare = outputs(result);
                if (compare !== true) {
                    failed[testname] = `Wrong results from ${fname} when executing ${testname} with ${inputs}. The results were ${result}. The message is ${compare}`;
                } else {
                    passed[testname] = [inputs, result];
                }
            } else if (typeof outputs === 'undefined') {
                exploring[testname] = [inputs, result];
            } else if (eq[fname] ) {
                let msg = eq[fname](outputs, result);
                if (msg.length === 0) {
                    passed.push(testname);
                } else {
                    msg.unshift(inputs);
                    msg.push(result);
                    failed[testname] = msg;
                }
            } else {
                exploring[testname] = [inputs, result];
            }
        } catch (e) {
            failed[testname] = [`Failure in ${fname} during test ${testname}.`, inputs, outputs, e];
        }
    });

    let opt = {depth:5, colors:true}
    console.log("passed:" + passed.length);
    console.dir(passed, opt);
    console.log("failed:" + Object.keys(failed).length);
    console.dir(failed, opt);
    console.log("exploring:" + Object.keys(exploring).length);
    console.dir(exploring, opt);

[f/test.mjs](# "save:")


This is where we collect the tests. Tests is an array consisting of arrays
with the function name, the inputs (could be a function that yields inputs),
outputs (could be a function that yields outputs), and the testname. 

[tests](#test "h5: |.join \n")


So we need a way of testing for equality. The idea here is to develop for each
function, an equality checking function.

[equality](#eq "h5: |.join \n")


## Docs

This is where we generate the documentation for these functions. 

    # MathPebbles Functions

    In constructing math pebbles, we have programmed a great many mathematical
    functions. These are designed for pedagogical purposes so the information
    they return is greater than is typical. They can also be very special
    purpose. In any event, here is the documentation for them. 

    To install, ...

    ## Function Descriptions

    _"doc pieces"

[doc pieces](#doc "h5: | .join \n")

[f/README.md](# "save:")

## Arithmetic

## Factorization

#### Generate Primes

##### Test 

    

##### Eq

    

##### Doc

    * **arithGenPrime** This is a generator so use it by doing
      arithGenPrime.next().value. Associated with this is also **airthPrimes**
      which holds the primes generated so far. There is also
      **arithGenGenPrimes** which allows one to create an independent prime
      generator.  

## Algebra

### Polynomials


#### Poly

##### Test 

    ['poly', [[1,2,,4], 3], 
       ( () => {let ret = [1, 2, 0, 4]; ret.center = 3; return ret; })(),
        "testing poly with empty spot"
    ], 
    ['poly', [[1,2,3,4]], 
        (() => {let ret = [1, 2, 3, 4]; ret.center = 0; return ret; })(),
        "testing poly with no center"
    ], 


##### Eq

We need to verify the center and the entries. 

    poly : function (exp, act) { 
        let msg = [];
        if (! act.hasOwnProperty('center') ) {
            msg.push('Failure to have a center');
        } 
        if (exp.center !== act.center) {
            msg.push(`The centers do not agree: Expected ${exp.center}, Actual ${act.center}`);
        }
        if (exp.length !== act.length) {
            msg.push(`The lengths do not agree: Expected ${exp.length}, Actual ${act.length}`);
        }
        exp.forEach( (el, ind) => {
            if (math.neq(el, act[ind]) ) {
                msg.push(`Values differ at: Expected ${el}, Actual ${act[ind]}`);
            }
        });
        return msg;
    },

##### Doc

    * **poly** (array||poly, center) => poly.  This will fill in missing gaps
      in the array as 0s and it will ensure there is a center. It also returns
      a copy so future manipulations are safe. 

#### Poly Equal

##### Test 

    ['polyEqual',
        [f.poly( [1, 4, 0, 2], 1), f.poly([1, 4, , 2], 1)], 
        true,
        "poly equal with undefined" ],
    ['polyEqual', 
        [f.poly( [1, 4, 3, 2], 1), f.poly([1, 4, , 2], 1)], 
        false,
        "poly not equal in undefined spot" ],
    ['polyEqual', 
        [[3, 2, 4], f.poly([45, 26, 4], 3)],
        true,
        "poly equal with differnt centers" ],

##### Eq

    polyEqual: (a,b) => {let msg = []; if ( a !== b ) { msg.push('different conclusions') ;} return msg;} ,

##### Doc

    * **polyEqual** (polyA, polyB, ?noRecenter:bool) => boolean. Tests whether the two
      polynomials are equal in terms of their coefficients, once they are
      centered to the same center. If the optional noRecenter boolean is passed
      in, then they are considered not equal. 

#### polyAdd 

##### Test 

    ['polyAdd', [f.poly([1, 2, 3, 4, 5, 6]), f.poly([4, 5, 7], 2) ], 
    f.poly([23, -21, 10, 4, 5, 6], 0), 
     "Adding two polynomials, different degrees n >m and centers"],
    ['polyAdd', [f.poly([4, 5, 7], 2), f.poly([1, 2, 3, 4, 5, 6]) ], 
    f.poly([325, 707, 634, 284, 65, 6], 2), 
    "Adding two polynomials, different degrees m >n and centers"],

##### Eq

    polyAdd : (exp,act) => {
        let msg = [];
        if (!f.polyEqual(exp, act) ) {
            msg.push(
              `polynomials are not equal: Expected ${f.polyWrite(exp)} Actual ${f.polyWrite(act)}` );
        }
        if (exp.center !== act.center) {
            msg.push(`Centers do not agree: Expected ${exp.center} Actual ${act.center}`);
        }
        return msg;
    },

##### Doc

    * **polyAdd** (polyA, polyB, ...) Adds the passed in polynomials,
      recentering them if needed to be the center of the first polynomial. 

#### Example

##### Test 

##### Eq

##### Doc


#### Example

##### Test 

##### Eq

##### Doc



#### Example

##### Test 

##### Eq

##### Doc



#### Example

##### Test 

##### Eq

##### Doc


#### Example

##### Test 

##### Eq

##### Doc


#### Synthetic Division


##### Test

    ['polySynDiv', [[2,3,4], [5, 1]], {rows:[[85, -20, 0]], quot:[-17,4], rem:[87]}, "basic synthetic division"], 
                


##### Eq

This checks that the quotient and rem are all the same. We ignore rows as that
is more of a pain and besides the point. 

    polySynDiv : function(exp, act) {
       let msg = [];
       ['quot', 'rem'].forEach( (key) => {
            let expArr = exp[key];
            let actArr = exp[key];
            if (expArr.length !== actArr.length) {
                msg.push("not the same length: " + key);
                return;
            }
            expArr.forEach( (el, ind) => {
                if (! (math.equal(el, actArr[ind])) ) {
                    msg.push(`values differ for ${key}. Expected: ${el}.  Actual: ${actArr[ind]}`);
                }
            });
       });
       return msg;

    },


##### Doc

    *  **Synthetic Division**. It takes in two polynomials in the form of arrays
    of numbers such that the array location corresponds to the power. It
    returns an object with rows (the info needed for creating the synthetic
    division table), quot (the quotient polynomial), and rem (the remainder
    polynomial). These are all organized with the higher degree terms being
    higher in the array. We assume the polynomials have the same center (`a` in
    `(x-a)`); if not, use the recenter to get them into the same center.

        ```
        polySynDiv([2,3,4],[5, 1]) =>  // 4x^2 + 3x + 2 / (x+5)
        {rows:[[85, -20, 0]],   // 0 -20 85 in standard synthetic division
        quot:[-17, 4]   // 4x -17
        rem:[87]  // constant term 87
        ```

#### Rebasing

##### Test 

    ['polyRecenter', [ [3, 2, 4], 3], f.poly([45, 26, 4], 3),"basic recentering"], 
    ['polyRecenter', () => {return [f.polyRecenter([3, 2, 4], 3).poly, -2]}, 
        f.poly([15, -14, 4], -2), "rerecenter"],


##### Eq

    polyRecenter : function(exp, act) {
        let msg = [];
        exp = {poly:exp};
        if (exp.poly.length !== act.poly.length) {
            msg.push("not the same degree poly");
            return;
        }
        exp.poly.forEach( (el, ind) => {
            if (! (math.equal(el, act.poly[ind])) ) {
                msg.push(`values differ at ${ind}. Expected: ${el}.  Actual: ${act.poly[ind]}`);
            }
        });
       return msg;

    },

##### Doc

    **polyRecenter** This takes in a polynomial and a new center (the `a` in
    (`x-a)`. It then returns the polynomial in the new center. 

#### Example

##### Test 

##### Eq

##### Doc
