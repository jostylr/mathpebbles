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
        
## Module

There is a standalone module that we have produced as well. This is the file
for this. It depends on mathjs. 

    import {create, all} from 'mathjs';
    const math = create(all);
    math.config({number:'BigNumber'});
    (_"common::math helpers")(math);
    
    const f = _"f";

    export {f, math}; 

[f/index.mjs](# "save:")


## Arithmetic

    _"generate primes"

    _"factor"


### Generate Primes

This is inspired from https://benmccormick.org/2017/11/28/sieveoferatosthenes/

The idea is to have an ongoing list of knocked out numbers that hold the
primes to generate the next one but with the added efficiency of ignoring the
multiples of a found prime until it gets to prime^2 since everything
underneath is a multiple of an earlier prime. This returns a function which
generates primes. We also do a remember the primes version at the cost of
remembering primes. 

Modification of sieve of Erastothenes.

    arithPrimes : [],

    arithGenPrime : (_":independent generator")(),

    airthGenGenPrime : _":independent generator",


[independent generator]()

This allows for the creation of a new generator, for whatever purpose. 

    function* arithGenPrime (primes) { 
        let f = this;
        primes = primes ?? f.arithPrimes;
        const notPrimes = new Map();
        notPrimes.set(4, [2]);
        primes.push(2);
        yield 2;
        let curVal = 2;
        while (true) {
            curVal += 1;
            if (notPrimes.has(curVal) ) {
                _":update marks"
                notPrimes.delete(curVal);
            } else { //prime found
                primes.push(curVal);
                notPrimes.set(curVal**2, [curVal]);
                yield curVal;
            }
        }
    }


[update marks]()

We have a found an already marked value. The value is being pointed to an
array of primes that lead here (will have all prime factors listed here unless
the factor squared is greater than this number so 6 has 2, but not 3 since 3^2
is 9). So we add these primes to relevant later numbers ensuring that they are
marked. 

    let primes = notPrimes.get(curVal);
    primes.forEach( prime => {
        let nxtMarked = curVal + prime;
        if (notPrimes.has(nxtMarked) ) {
            notPrimes.get(nxtMarked).push(prime);
        } else {
            notPrimes.set(nxtMarked, [prime]);
        }
    });



### Factor


    _"prime factorization"

    _"all factors"

#### prime factorization

This lists the prime factors with their multiplicity. 

Here is a simple factor algorithm. It uses primes. It searches up to the square
root of the number.  This expects an integer and it will absolute value it. 


    arithPrimeFactorization : function (num) {
        let f = this;
        let primes = f.arithPrimes;
        let gen = f.arithGenPrime;
        if (math.eq(num, 0) ) { return 0;}
        num = math.abs(num);
        let root = math.sqrt(num);
        let primeInd = -1;
        let prime = 1;
        let primeFactors = [];
        while ( (math.lteq(prime, root)) && (math.gt(num, 1) ) ) { 
            primeInd += 1;
            if (primes.length < primeInd) {
                prime = primes[primeInd];
            } else {
                prime = f.arithGenPrime.next().value;
            }
            let gcd = math.gcd(num, prime);
            if ( gcd === 1) {
                continue;
            }
            let pbox = [prime, 0];
            primeFactors.push(pbox);
            while (math.neq(gcd, 1)) {
                pbox[1] += 1;
                num = math.div(num, prime);
                gcd = math.gcd(num, prime);
            }
            root = math.sqrt(num);
        }
        if (math.neq(num, 1) ) { // this should be a prime.
            primeFactors.push([num, 1]);
        }
        return primeFactors;
    },


#### All factors

So this calls the prime factorization algorithm, getting that list. Then it
builds up all the factors. It does this by multiplying the previous list by
all the relevant powers of the next prime, with power 0 there which gives the
prior list. 

The input can be a number, which does the prime factorization, or an array
which is presumed to be of the prime factorization form.


    arithFactors : function (inp) {
        let f = this;
        let pf = (Array.isArray(inp) ? inp : f.arithPrimeFactorization(inp));
        let ret = [1];
        pf.forEach( ([prime, pow]) => {
            let powers = [];
            for (j =0; j <= pow; j+=1 ) {
                powers[j] = math.pow(prime, pow); //includes 1 as 0 power
            }
            let multiples = powers.map( (ppower) => {
                return ret.map( (num) => math.mul(num, ppower) );
            });
            ret = [].concat(...multiples);
        });
        return ret; 
    },


## Algebra

    _"poly::"


[poly](f/poly.md "load:")

## Geometry

## Functions

## Many Variable

## Stats

## Higher level
