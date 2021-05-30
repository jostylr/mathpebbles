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

    tests.forEach( ([fname, inputs, outputs, testname]) => {
        try {
            if ( typeof inputs === 'function' ) { 
                inputs = inputs();
            }
            let result = f[fname](...inputs);
            if (typeof outputs === 'function') {
                let compare = outputs(result);
                if (compare !== true) {
                    failed[testname] = `Wrong results from ${fname} when executing ${testname} with ${inputs}. The results were ${results}. The message is ${compare}`;
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



## Algebra

### Polynomials



#### Synthetic Division


##### Test

    ['syndiv', [[2,3,4], [5, 1]], {rows:[[85, -20, 0]], quot:[-17,4], rem:[87]}, "basic synthetic division"], 
                


##### Eq

This checks that the rows, quot, and rem are all the same. It uses the array
equality function

    syndiv : function(exp, act) {
       let msg = [];
       Object.keys(exp).forEach( (key) => {
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
    higher in the array. 

        ```
        syndiv([2,3,4],[5, 1]) =>  // 4x^2 + 3x + 2 / x+5
        {rows:[[85, -20, 0]],   // 0 -20 85 in standard synthetic division
        quot:[-17, 4]   // 4x -17
        rem:[87]  // constant term 87
        ```


##### Test 

##### Eq

##### Doc
