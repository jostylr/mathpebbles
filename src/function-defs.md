# F

This creates an object of functional functions that take in inputs and give
out outputs. It should be about numbers as much as possible, but it can give
out values of a variety of ways. A lot of them will give the internal
computations as well, such as doing a synthetic division and having the
intermediate row presented. 

While functions may be used in a variety of places, we organize them by
roughly where they are most prominently presented or defined. 

    {

    _"arithmetic"

    _"algebra"

    _"geometry"

    _"functions"

    _"many variable"

    _"stats"

    _"higher level"

    }
        
## Arithmetic

## Algebra

    _"polynomials"


### Polynomials

    _"synthetic division"

#### synthetic division

We expect a polynomial in the form of an array of coefficients from constant
up to highest (for recursive calling, basically). The first term is the
polynomial be divided into, the second term is the polynomial being used to
divide into. The assumption for polynomials is that the last term is non-zero
and represents the highest power in the polynomial. 

All things returned follow this convention, namely everything works from right
to left. 


One source for higher power synthetic division: https://lostmathlessons.blogspot.com/2016/02/synthetic-division-with-higher-powers.html


    syndiv : (poly, div) => {
        if (div.length === 1) { // constant poly
            let con = div[0];
            return {
                rows : [],
                rem : [],
                quot : poly.map( (coef) => math.div(coef, con) ) 
            }
        }
        
        let n = poly.length;
        let m = div.length;
        let t = div[m-1]; //highest power
        if (math.neq(math.mul(t, t), t) ) { //checking for 1 (assume not 0 leading)
            poly = poly.map( a => math.div(a, t) );
            div = div.map( a => math.div(a, t) );
        } // normalized now

        let zero = math.sub(t, t);

Convert div into actual numbers to use, stripping lead and negating. 
        
        div = div.map( a => math.neg( a) );
        div.pop();
        m = div.length;

        let qlength = n -m;
        if (qlength < 0) { // only remainder left 
            ret.rem = poly.slice();
            return ret;
        }
        
Prepoplate rows with 0's. There should be one row for each of the divs.         

        let rows = [];
        let zeroRow = poly.map( () => zero);

        for (let i = 0; i<n; i += 1) {
            rows[i] = [...zeroRow];
        }
        
        let quot = [];
        let rem = [];
        for (let i = n; i >= 0; i -= 1) {
            let a = poly[i];
            let sum = rows.reduce( (acc, row) => {
                math.add(a, row[i]);
            }, a);

We want to be able place each of the items in div into a slot. We are
descending so we want i-m to be a valid index. A sum is also in the quotient
if we can still do this otherwise it is in the remainder.

            if ( (i-m) >= 0) {
                div.forEach( (b, ind) => {
                   row[ind][i-(m-ind)] = math.mul(b, sum);
                });
                quot.shift(sum);
            } else {
                rem.shift(sum);
            }
        }

        return {rows, quot, rem};

    },

## Geometry

## Functions

## Many Variable

## Stats

## Higher level
