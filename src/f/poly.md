Functions for polynomial manipulations. This is specifically supporting
different centers. 

    _"poly"
    _"poly equal"
    _"poly write"
    _"poly parse"
    _"poly scale"
    _"poly add"
    _"poly subtract"
    _"poly multiply"
    _"poly power"
    _"poly eval"
    _"descartes rule"
    _"poly rational roots"
    _"poly roots"
    _"poly factor"
    _"poly maxmin"
    _"poly derivative"
    _"poly integration"
    _"synthetic division"
    _"rebasing"


#### Poly

This just makes a polynomial given an array and a center (just attaches the
center, mainly just so it can be done in one line); 

We assign poly manually to ensure that any undefined bits are 0. 

    poly: function poly (arr, b) { 
        let n = arr.length;
        let poly = [];
        for (let i = 0; i < n; i+= 1) {
            poly[i] = arr[i] ?? 0; 
        }
        poly.center = b ?? arr.center ?? 0; 
        return poly;
    },

### Poly Write

This writes a polynomial in a fashion that allows it to be read by humans and
parsed. The optional second parameter should be an options object. Currently,
recenter boolean (true means center to 0) and the letter to use for the
unknown, default as x. HighestFirst is a boolean that, if true, will put the
highest power term first. The tex boolean is whether the output should be for
tex parsing. 


    polyWrite: function (poly, {recenter, letter, highestFirst, tex}) {
        let f = this;
        letter = letter || 'x';
        if (recenter && (poly.center !== 0) ) {
            poly = f.polyRecenter(poly, 0);
        }
        let v; 
        if (poly.center === 0) {
            v = letter;
        } else {
            let c = poly.center;
            let sign = '+';
            if (math.lt(c, 0) ) {
                sign = '-';
                c = math.neg(c);
            }
            let cString = tex ? math.spacedNumber(c) : math.format(c); 
            v = `(${letter} ${sign} ${cString})`;
        }

We make the string version of the terms. 

        let terms = poly.map( (coef, pow) => {
            let ret;
            if (coef === 0) { return '';}
            let cString = tex ? math.spacedNumber(coef) : math.format(coef); 
            if (pow === 0) {
                ret = cString;
            } else if (pow === 1) {
                ret = cString + v;
            } else {
                let p = pow.toString();
                ret = cString + v + '^' + (tex ? `{ ${p} }` : p);
            }
            return ret;
        }).filter( el => el); // filters empty strings

If highestFirst, then we want to reverse this first. We then join with a '+'
and then deal with '+ -' by just replacing it out. 

        if (highestFirst) {
            terms.reverse();
        }
        let ret = terms.join(' + ').replace(/\+ \-/g, '- ');
        return ret;
    },

### Poly simple parse

This parses a string that is written as a straightforward centered polynomial. Alternative form, to be searched for, is to have simple vars, but then have a `;` separating the polynomial and giving the center. This has a default of `u` for the variable with the semicolon while `x` is default for center 0. 

    polySimpleParse : function (str, letter) {
        let f = this;
        let poly = [];
        let center; 
        _":deal with semicolon version"

        _":search for center"
        _":replace center with letter"
        
    
        return f.poly(poly, center);
    },

[deal with semicolon version]()

Search for a semicolon. If found, then set an undefined letter to u. If not
found set it to x. 

    let semi = str.indexOf(';'); 

[search for center]()

[replace center with letter]()

### Poly Parse

This will parse a string into a polynomial, if it fits. It tries to see if it
can be parsed as a single polynomial, looking for square brackets first (they
denote a polynomial in the affirmative on the inside), then checking to see if
parentheses match the same monomial of a centered polynomial. If not, then we
construct many separate polynommials. 


    polyParse : function polyParse (str, letter='x') {
        let f = this;
        let poly;   
    
        return poly;
    },


### poly equal 

This tests if the polynomials are equal, taking equality to also mean that if
they were centered to the same place, then they would have the same
coefficients. 


    polyEqual : function (a,b, noRecenter) {
        let f = this;
        if (noRecenter === true) {
            if (a.center !== b.center) {
                return false;
            }
        }
        if (a.length !== b.length) {
            return false;
        }
        if (!a.hasOwnProperty('center')) {
            a = f.poly(a);
        } 
        if (!b.hasOwnProperty('center')) {
            b = f.poly(b);
        } 
        if (a.center !== b.center) {
            b = f.polyRecenter(b, a.center).poly;
        }
        return a.every( (el,ind) => math.eq(el, b[ind] ) );
    },


### poly scale

Multiply a polynomial by a scalar: 

    polyScale : function (poly, scalar) { 
        let f = this;
        return f.poly(poly.map( (el) => math.mul(scalar, el) ), poly.center);
    },

### poly add

Add multiple polynomials together. The common center will be the first
polynomial's center ( 0 if none as done in the poly command).

    polyAdd : function polyAdd (...polys) {
        let f = this;
        let ret = f.poly(polys.shift());
        let center = ret.center;
        while ( polys.length) {
            let nxt = polys.shift();
            nxt = f.polyRecenter(nxt, center).poly;
            nxt.forEach( (el, ind) => {
                ret[ind] = math.add((ret[ind] ?? 0), el);
            });
        }
        return ret;
    },

### poly subtract

This does the multiply by -1 and add trick. This is strictly two arguments
since not sure what multiple subtraction would mean.

    polySub : function polySub (a, b) {
        let f = this;
        b = f.polyScale(b, -1);
        return f.polyAdd(a, b);
    },



### poly multiply

Multiplying. Multiple arguments are done two at a time. The polynomial center is
that of the first one. 

    polyMul : function (...polys) {
        let f = this;
        let ret = f.poly(polys.shift());
        let center = ret.center;
        steps = [];
        while ( polys.length) {
            let nxt = polys.shift();
            nxt = f.polyRecenter(nxt, center).poly;
            let i, j, n = ret.length, m = nxt.length;
            let sum = [];
            step = [];
            steps.push(step);
            for (i = 0; i < n; i += 1) {
                row = step[i] = [];
                for (j = 0; j < n; j+= 1) {
                    sum[i+j] = row[j] = math.mul(ret[i], nxt[j]);
                }
            }
            ret = f.poly(sum, center);
            
        }
        return {poly: ret, steps};
    },

### Poly Power

This takes in a polynomial and a power and computes out the power into a new
polynomial. The power should be a positive integer, but it will not error if
not. 

    polyPow : function (poly, pow) {
        let f = this;
        ret = f.poly( [1], poly.center ?? 0);
        let steps = [];
        for (let i = 0; i < pow; i += 1) {
            ret = f.polyMul(poly);
            steps.push(ret);
        }
        return {poly:ret, steps};
    },



### poly eval

We use the synthetic division remainder for this. 
    
    polyEval : function polyEval (poly, x) {
        let f = this;
        return f.polySynDiv(poly, f.poly([math.neg(x), 1]) ).rem
    },


### descartes rule

This counts the sign change in the coefficients, giving both the straight
count and the `-x` version. It also returns the center of the polynomial used. 

The accumulator is of the form "number of sign changes, any pair change, index
of last non-zero, and last non-zero value.

    polySignVariations : function polySignVariations (poly) {
        let center = poly.center ?? 0;
        let counter =  (acc, el, ind) => {

Nothing to do if it is a zero.

            if (math.eq(el, 0) ) { return acc; } 

We need to deal with the first non-zero here, which is just doing our update
without changing a count or anything. 

            if (typeof acc[2] === 'undefined') {
                acc[2] = ind;
                acc[3] = el;
                return acc;
            }

            let preVal = acc[3];
            let preInd = acc[2];

If the current and previous multiply to a negative number, than we have a sign
change. 

            if ( math.lt(math.mul(preVal *preInd), 0 ) ) {
                acc[0] += 1;
                acc[1].push([acc[2], ind]);
            } 

We update this for all non-zero non-initial values.

            acc[2] = ind;
            acc[3] = el;

            return acc;

        }

We slice here to get rid of the internal tracked stuff and just reporting the
count and the indices between which the sign changed. 

        let pos = poly.reduce(counter, [0, []] ).slice(0,2);
        let neg = poly.map( (el, ind) => ( (ind % 2 === 1) ? math.mul(el, -1) : el) ).
            reduce(counter, [0, []]).slice(0,2);

        return {pos, neg, center};

    },


### poly rational roots


### poly roots

### poly factor

This attempts to provide a factorization of the polynomial. It uses poly
roots. It has a second parameter which, if true, will only factor over the
reals, leaving quadratic factors as needed. 

### poly maxmin

Need to compute an interval to search. could use derivative version and search
for zeros, but would like to do 

### poly derivative

### poly integration


#### synthetic division

We expect a polynomial in the form of an array of coefficients from constant
up to highest (for recursive calling, basically). The first term is the
polynomial be divided into, the second term is the polynomial being used to
divide into. The assumption for polynomials is that the last term is non-zero
and represents the highest power in the polynomial. 

All things returned follow this convention, namely everything works from right
to left. 


One source for higher power synthetic division: https://lostmathlessons.blogspot.com/2016/02/synthetic-division-with-higher-powers.html


    polySynDiv : (poly, div) => {
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
        if (math.neq(1, t) ) { //checking for 1 (assume not 0 leading)
            poly = poly.map( a => math.div(a, t) );
            div = div.map( a => math.div(a, t) );
        } // normalized now


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
        let zeroRow = poly.map( () => 0);

        for (let i = 0; i<m; i += 1) {
            rows[i] = [...zeroRow];
        }
        
        let quot = [];
        let rem = [];
        for (let i = n-1; i >= 0; i -= 1) {
            let a = poly[i];
            let sum = rows.reduce( (acc, row) => {
                return math.add(a, row[i]);
            }, a);

We want to be able place each of the items in div into a slot. We are
descending so we want i-m to be a valid index. A sum is also in the quotient
if we can still do this otherwise it is in the remainder.

            if ( (i-m) >= 0) {
                div.forEach( (b, ind) => {
                   rows[ind][i-(m-ind)] = math.mul(b, sum);
                });
                quot.unshift(sum);
            } else {
                rem.unshift(sum);
            }
        }

        return {rows, quot, rem};

    },

### Rebasing

This takes in a polynomial and a new center (the `a` in `(x-a)` and produces the
polynomial at that new `a`. If the polynomial has a non-zero center, the
rebasing respects this. 

    polyRecenter : function polyRecenter (poly, a) {
        let f = this;
        poly = f.poly(poly); // to ensure normalized
        let shift;

To compute the shift, we want a to be negated since it gets renegated in
syndiv. We want it to be -a when the poly center is 0. So we need to subtract.

        shift = math.sub( (poly.center ?? 0), a); 
        if (math.eq(shift, 0) ) { //no change
            return {
                poly: poly, 
                steps : []
            };
        }
        let q = poly;
        let ret = [];
        ret.center = a;
        let div = [shift, 1];
        let steps = [];
        while (q.length > 1) {
            let {quot, rem, rows} =  f.polySynDiv(q, div);
            steps.push( {quot, rem, rows});
            ret.push(rem[0]); // higher terms go later
            q = quot;
        }
        ret.push(q[0]);
        return {poly:ret, steps};
    },

