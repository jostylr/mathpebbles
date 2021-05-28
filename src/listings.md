# Listings

This is the full list of pages involved in this, listed in order for the next,
previous stuff to be setup correctly. We autogenerate the full part below. Do
not write below it. 

## Links

    _"full|createlinks"

## createLinks

    function createLinks (text) {
        let doc = this;
        const ret = {};
        const arr = text.split('\n').map(line=> {
             let [propath, name, symbol] = line.split('|').map(e=> e.trim())
             let [progress, path] = [propath[0],  '/'+propath.slice(1)];
             symbol = symbol ?? '';
             return {progress, path, name, symbol};
        });
        arr.
            forEach( ({progress, path, name, symbol}, ind, arr) => {
            let pieces = path.split('/');
            if (!pieces[1]) {pieces.pop(); } //main should have 1
            let type;
            switch (pieces.length) {
                case 1 : type = 'main'; break; 
                case 2 : type = 'book'; break;
                case 3 : type = 'chapter'; break;
                case 4 : type = 'section'; break;
                default : type = 'main'; 
            }
            let prefix = pieces.slice(0, -1).join('/');
            if (!prefix) {prefix = '/';} //top level
            ret[path] = {
                prev :  arr[ind-1]?.path || '', 
                next : arr[ind+1]?.path || '',  
                progress,   
                type, 
                prefix,
                name, 
                children: [] 
            };
            if (name !== 'MathPebbles') {  //prevents main from being added
                ret[prefix].children.push( [name, path, symbol]);
            }
        });
        return JSON.stringify(ret);
    }

[createlinks](# "define:")

[createlinks.js](# "save:")


## For next section

Symbols are the third item and are treated as katex rendering by default. To
have it treated as something else do %type:text where type is the kind of
thing (such as a remix icon; should be known in the parsing) and text is
whatever needs to be fed into the function (icon name). Using percent since
that's a comment in latex and should never be used as the first character

THE BELOW IS GENERATED. DO NOT EDIT!!!! WILL BE UPDATED OVER TIME

## FULL

    0 | MathPebbles | 
    0arithmetic | Arithmetic | +
    0arithmetic/counting | Counting | \ldots
    0arithmetic/counting/number-as-matching | Number as Matching | .. 
    0arithmetic/counting/pebbles-of-various-sizes | Pebbles of Various Sizes | oO
    0arithmetic/counting/digits | Digits | 09
    0arithmetic/counting/carry-overs | Carry Overs | \_
    0arithmetic/counting/units | Units | \textrm{in}
    0arithmetic/counting/base-representations | Base Representations | 01
    0arithmetic/counting/largest-number | Largest Number | \infty
    0arithmetic/addition | Addition | + 
    0arithmetic/addition/notions-of-additions | Notions of Additions | 
    0arithmetic/addition/adding-single-digits | Adding Single Digits | 
    0arithmetic/addition/complements-of-ten | Complements of Ten | 
    0arithmetic/addition/left-to-right-addition | Left to Right Addition | 
    0arithmetic/addition/significant-addition | Significant Addition | 
    0arithmetic/addition/tricks-and-checks-of-addition | Tricks and Checks of Addition | 
    0arithmetic/addition/properties-of-addition | Properties of Addition | 
    0arithmetic/multiplication | Multiplication | *
    0arithmetic/multiplication/notions-of-multiplication | Notions of Multiplication | 
    0arithmetic/multiplication/single-digit-multiplication | Single Digit Multiplication | 
    0arithmetic/multiplication/no-carry-left-to-right-multiplication | No Carry Left to Right Multiplication | 
    0arithmetic/multiplication/carry-left-to-right-multiplication | Carry Left to Right Multiplication | 
    0arithmetic/multiplication/significant-multiplication | Significant Multiplication | 
    0arithmetic/multiplication/tricks-and-checks-of-multiplication | Tricks and Checks of Multiplication | 
    0arithmetic/multiplication/properties-of-multiplication | Properties of Multiplication  | 
    0arithmetic/subtraction | Subtraction | -
    0arithmetic/subtraction/removal | Removal | 
    0arithmetic/subtraction/complement-subtraction | Complement Subtraction | 
    0arithmetic/subtraction/left-to-right-subtraction | Left to Right Subtraction | 
    0arithmetic/subtraction/negative-numbers | Negative Numbers | 
    0arithmetic/subtraction/significant-subtraction | Significant Subtraction | 
    0arithmetic/subtraction/tricks-and-checks-of-subtraction | Tricks and Checks of Subtraction | 
    0arithmetic/subtraction/properties-of-subtraction | Properties of Subtraction | 
    0arithmetic/division | Division | \div
    0arithmetic/division/notions-of-division | Notions of Division | 
    0arithmetic/division/foundational-divisions | Foundational Divisions | 
    0arithmetic/division/long-division | Long Division | 
    0arithmetic/division/significant-division | Significant Division | 
    0arithmetic/division/fractions | Fractions | 
    0arithmetic/division/decimals | Decimals | 
    0arithmetic/division/tricks-and-checks-of-division | Tricks and Checks of Division | 
    0arithmetic/powers | Powers | \wedge
    0arithmetic/powers/notions-of-exponents | Notions of Exponents | 
    0arithmetic/powers/rules-of-exponents | Rules of Exponents | 
    0arithmetic/powers/scientific-notation | Scientific Notation | 
    0arithmetic/powers/significant-powers | Significant Powers | 
    0arithmetic/powers/guesstimation | Guesstimation | 
    0arithmetic/powers/undoing-exponentiation | Undoing Exponentiation | 
    0arithmetic/powers/sums-and-powers | Sums and Powers | 
    0arithmetic/constructing-numbers | Constructing Numbers | \mathbb{N}
    0arithmetic/constructing-numbers/containers | Containers | 
    0arithmetic/constructing-numbers/natural-numbers | Natural Numbers | 
    0arithmetic/constructing-numbers/addition-and-multiplication | Addition and Multiplication | 
    0arithmetic/constructing-numbers/integers | Integers | 
    0arithmetic/constructing-numbers/rationals | Rationals | 
    0arithmetic/constructing-numbers/properties-revisited | Properties Revisited | 
    0arithmetic/constructing-numbers/relations | Relations | 
    0algebra | Algebra | x
    0algebra/lines | Lines | x
    0algebra/lines/shortest-distance | Shortest Distance | 
    0algebra/lines/basic-distance-shapes | Basic Distance Shapes | 
    0algebra/lines/cartesian-coordinate-plane | Cartesian Coordinate Plane | 
    0algebra/lines/slope | Slope | 
    0algebra/lines/solving-a-linear-equation | Solving a Linear Equation | 
    0algebra/lines/families-of-lines | Families of Lines | 
    0algebra/lines/linear-inequalities | Linear Inequalities | 
    0algebra/quadratics | Quadratics | x^2
    0algebra/quadratics/notions-of-quadratics | Notions of Quadratics | 
    0algebra/quadratics/the-vertex-of-a-quadratic | The Vertex of a Quadratic | 
    0algebra/quadratics/square-roots | Square Roots | 
    0algebra/quadratics/solving-quadratics | Solving Quadratics | 
    0algebra/quadratics/complex-numbers | Complex Numbers | 
    0algebra/quadratics/common-quadratic-problems | Common Quadratic Problems | 
    0algebra/quadratics/quadratic-inequalities | Quadratic Inequalities | 
    0algebra/polynomials | Polynomials | x^n
    0algebra/polynomials/arithmetic-of-polynomials | Arithmetic of Polynomials | 
    0algebra/polynomials/the-questions-of-polynomials | The Questions of Polynomials | 
    0algebra/polynomials/synthetic-division | Synthetic Division | 
    0algebra/polynomials/zeros-of-polynomials | Zeros of Polynomials | 
    0algebra/polynomials/calculus-of-polynomials | Calculus of Polynomials | 
    0algebra/polynomials/graphing-polynomials | Graphing polynomials | 
    0algebra/polynomials/powering-polynomials | Powering Polynomials | 
    0algebra/interest-accumulations | Interest Accumulations | \%
    0algebra/interest-accumulations/percentages | Percentages | 
    0algebra/interest-accumulations/simple-interest-and-discount | Simple Interest and Discount | 
    0algebra/interest-accumulations/compound-interest | Compound Interest | 
    0algebra/interest-accumulations/effective-rate | Effective Rate | 
    0algebra/interest-accumulations/payments | Payments | 
    0algebra/interest-accumulations/personal-finances | Personal Finances | 
    0algebra/interest-accumulations/tricks-of-business-mathematics | Tricks of Business Mathematics | 
    0algebra/inequalities-and-absolute-values | Inequalities and Absolute Values | \leq
    0algebra/inequalities-and-absolute-values/basic-inequalities | Basic Inequalities | 
    0algebra/inequalities-and-absolute-values/polynomial-inequalities | Polynomial Inequalities | 
    0algebra/inequalities-and-absolute-values/triangle-inequality | Triangle Inequality | 
    0algebra/inequalities-and-absolute-values/absolute-value | Absolute Value | 
    0algebra/inequalities-and-absolute-values/solving-absolute-value-equations | Solving Absolute Value Equations | 
    0algebra/inequalities-and-absolute-values/absolute-value-inequalities | Absolute Value Inequalities | 
    0algebra/inequalities-and-absolute-values/distance | Distance | 
    0algebra/linear-systems | Linear Systems | x_i
    0algebra/linear-systems/two-variable-systems | Two Variable Systems | 
    0algebra/linear-systems/systems-as-matrices | Systems as Matrices | 
    0algebra/linear-systems/solving-systems | Solving Systems | 
    0algebra/linear-systems/applications | Applications | 
    0algebra/linear-systems/not-the-right-amount-of-information | Not the Right Amount of Information | 
    0algebra/linear-systems/linear-programming | Linear Programming | 
    0algebra/linear-systems/simplex-method | Simplex Method | 
    0algebra/constructing-the-real-and-complex-numbers | Constructing the Real and Complex Numbers | \mathbb{R}
    0algebra/constructing-the-real-and-complex-numbers/square-root-2 | Square Root 2 | 
    0algebra/constructing-the-real-and-complex-numbers/zeroing-in-on-zeros | Zeroing in on Zeros | 
    0algebra/constructing-the-real-and-complex-numbers/notions-of-real-numbers | Notions of Real Numbers | 
    0algebra/constructing-the-real-and-complex-numbers/polynomial-zeros-beyond-radicals | Polynomial Zeros Beyond Radicals | 
    0algebra/constructing-the-real-and-complex-numbers/complex-number-construction | Complex Number Construction | 
    0algebra/constructing-the-real-and-complex-numbers/arithmetic-and-geometry-of-complex-numbers | Arithmetic and Geometry of Complex Numbers | 
    0algebra/constructing-the-real-and-complex-numbers/sizes-of-infinity | Sizes of Infinity | 
    0geometry | Geometry | \Delta
    0geometry/plane-geometry | Plane Geometry | \parallel
    0geometry/plane-geometry/euclidean-lines | Euclidean Lines | 
    0geometry/plane-geometry/euclidean-triangles | Euclidean Triangles | 
    0geometry/plane-geometry/similarity | Similarity | 
    0geometry/plane-geometry/polygons | Polygons | 
    0geometry/plane-geometry/euclidean-circles | Euclidean Circles | 
    0geometry/plane-geometry/transformations | Transformations | 
    0geometry/plane-geometry/coordinate-proofs | Coordinate Proofs | 
    0geometry/constructions | Constructions | \underline \circ
    0geometry/constructions/ruler-and-compass | Ruler and Compass | 
    0geometry/constructions/constructions-with-lines | Constructions with Lines | 
    0geometry/constructions/constructing-angles | Constructing Angles | 
    0geometry/constructions/drawing-triangles | Drawing Triangles | 
    0geometry/constructions/constructions-with-circles | Constructions with Circles | 
    0geometry/constructions/trisecting-the-angle | Trisecting the Angle | 
    0geometry/constructions/constructing-solutions-to-equations | Constructing Solutions to Equations | 
    0geometry/trigonometry | Trigonometry | \triangle
    0geometry/trigonometry/right-triangle | Right Triangle | 
    0geometry/trigonometry/any-triangle | Any Triangle | 
    0geometry/trigonometry/regular-polygons | Regular Polygons | 
    0geometry/trigonometry/areas | Areas | 
    0geometry/trigonometry/measuring-from-a-distance | Measuring from a Distance | 
    0geometry/trigonometry/parallax | Parallax | 
    0geometry/trigonometry/circumference-of-the-earth | Circumference of the Earth | 
    0geometry/conic-sections | Conic Sections | \asymp
    0geometry/conic-sections/notions-of-a-conic-section | Notions of a Conic Section | 
    0geometry/conic-sections/ellipses | Ellipses | 
    0geometry/conic-sections/parabolas | Parabolas | 
    0geometry/conic-sections/hyperbolas | Hyperbolas | 
    0geometry/conic-sections/cones | Cones | 
    0geometry/conic-sections/unifying-pictures | Unifying Pictures | 
    0geometry/conic-sections/generalizations | Generalizations | 
    0geometry/parametric-curves | Parametric Curves | \propto
    0geometry/parametric-curves/notions-of-parametric-curves | Notions of Parametric Curves | 
    0geometry/parametric-curves/functions-of-x-as-a-function-of-t | Functions of x as a Function of t | 
    0geometry/parametric-curves/spirals | Spirals  | 
    0geometry/parametric-curves/tangent-vectors | Tangent Vectors | 
    0geometry/parametric-curves/arc-length | Arc Length | 
    0geometry/parametric-curves/reparametrizations | Reparametrizations | 
    0geometry/parametric-curves/geodesics | Geodesics | 
    0geometry/higher-dimensions | Higher Dimensions | \mathbb{R}^N
    0geometry/higher-dimensions/three-dimensions | Three Dimensions | 
    0geometry/higher-dimensions/volumes | Volumes | 
    0geometry/higher-dimensions/surface-area | Surface area | 
    0geometry/higher-dimensions/even-higher-dimensions | Even Higher Dimensions | 
    0geometry/higher-dimensions/many-variable-inequalities | Many Variable Inequalities | 
    0geometry/higher-dimensions/norms-and-angles | Norms and Angles | 
    0geometry/higher-dimensions/transforming-space | Transforming Space | 
    0geometry/other-geometries | Other Geometries | d
    0geometry/other-geometries/taxicab-geometry | Taxicab Geometry | 
    0geometry/other-geometries/spherical-geometry | Spherical Geometry | 
    0geometry/other-geometries/hyperbolic-geometry | Hyperbolic Geometry | 
    0geometry/other-geometries/discrete-geometries | Discrete Geometries | 
    0geometry/other-geometries/metric-geometries | Metric Geometries | 
    0geometry/other-geometries/infinite-dimensional-geometries | Infinite Dimensional Geometries | 
    0geometry/other-geometries/compact-geometry | Compact Geometry | 
    0functions | Functions | f
    0functions/rational-and-power-functions | Rational and Power Functions | \sqrt{x}
    0functions/rational-and-power-functions/rational-functions | Rational Functions | 
    0functions/rational-and-power-functions/graphing-rational-functions | Graphing Rational Functions | 
    0functions/rational-and-power-functions/calculus-of-rational-functions | Calculus of Rational Functions | 
    0functions/rational-and-power-functions/rational-approximations | Rational Approximations | 
    0functions/rational-and-power-functions/powering-functions | Powering Functions | 
    0functions/rational-and-power-functions/graphing-radical-functions | Graphing Radical Functions | 
    0functions/rational-and-power-functions/calculus-of-radical-functions | Calculus of Radical Functions | 
    0functions/infinite-processes | Infinite Processes | \Sigma
    0functions/infinite-processes/sequences | Sequences | 
    0functions/infinite-processes/sums-and-products | Sums and products | 
    0functions/infinite-processes/off-to-infinity | Off to Infinity | 
    0functions/infinite-processes/limits | Limits | 
    0functions/infinite-processes/iterative-processes | Iterative Processes | 
    0functions/infinite-processes/errors | Errors | 
    0functions/infinite-processes/the-reality-of-infinity | The Reality of Infinity | 
    0functions/differential-calculus | Differential Calculus | \frac{df}{dx}
    0functions/differential-calculus/notions-of-derivatives | Notions of Derivatives | 
    0functions/differential-calculus/using-derivatives | Using Derivatives | 
    0functions/differential-calculus/derivative-rules | Derivative Rules | 
    0functions/differential-calculus/newtons-method | Newtons Method | 
    0functions/differential-calculus/optimization-problems | Optimization Problems | 
    0functions/differential-calculus/taylor-polynomials | Taylor Polynomials | 
    0functions/differential-calculus/implicit-differentiation | Implicit Differentiation | 
    0functions/integral-calculus | Integral Calculus | \int f
    0functions/integral-calculus/notions-of-integrals | Notions of Integrals | 
    0functions/integral-calculus/fundamental-theorem-of-calculus | Fundamental Theorem of Calculus | 
    0functions/integral-calculus/integral-rules | Integral Rules | 
    0functions/integral-calculus/numerical-integration | Numerical Integration | 
    0functions/integral-calculus/arc-length-of-functions | Arc Length of Functions | 
    0functions/integral-calculus/volumes-of-revolution | Volumes of Revolution | 
    0functions/integral-calculus/error-estimates | Error Estimates | 
    0functions/exponentials-and-logarithms | Exponentials and Logarithms | e^x
    0functions/exponentials-and-logarithms/paths-to-the-exponential | Paths to the Exponential | 
    0functions/exponentials-and-logarithms/properties-of-the-exponential | Properties of the Exponential | 
    0functions/exponentials-and-logarithms/paths-to-the-logarithm | Paths to the Logarithm | 
    0functions/exponentials-and-logarithms/properties-of-the-logarithm | Properties of the Logarithm | 
    0functions/exponentials-and-logarithms/dealing-with-large-numbers | Dealing with Large Numbers | 
    0functions/exponentials-and-logarithms/applications-of-exponentials-and-logarithms | Applications of Exponentials and Logarithms | 
    0functions/exponentials-and-logarithms/asymptotics | Asymptotics | 
    0functions/trigonometric-functions | Trigonometric Functions | \tan
    0functions/trigonometric-functions/notions-of-trigonometric-functions | Notions of Trigonometric Functions | 
    0functions/trigonometric-functions/properties-of-trigonometric-functions | Properties of Trigonometric Functions | 
    0functions/trigonometric-functions/approximating-trigonometric-functions | Approximating Trigonometric Functions | 
    0functions/trigonometric-functions/inverse-trigonometric-functions | Inverse Trigonometric Functions | 
    0functions/trigonometric-functions/applications-of-trigonometric-functions | Applications of Trigonometric Functions | 
    0functions/trigonometric-functions/sums-and-products-of-trigonometric-functions | Sums and Products of Trigonometric Functions | 
    0functions/trigonometric-functions/complex-exponentials | Complex Exponentials | 
    0functions/defining-functions | Defining Functions | y'
    0functions/defining-functions/taylor-series | Taylor Series | 
    0functions/defining-functions/functional-equations | Functional Equations | 
    0functions/defining-functions/differential-equations | Differential Equations | 
    0functions/defining-functions/special-functions | Special Functions | 
    0functions/defining-functions/laplace-transforms | Laplace Transforms | 
    0functions/defining-functions/fourier-approximations | Fourier Approximations | 
    0functions/defining-functions/tricks | Tricks | 
    0many-variables | Many Variables | \bar{x}
    0many-variables/linear-algebra | Linear Algebra | A \bar{x} 
    0many-variables/linear-algebra/vectors | Vectors | 
    0many-variables/linear-algebra/subspaces | Subspaces | 
    0many-variables/linear-algebra/matrices | Matrices | 
    0many-variables/linear-algebra/solving-linear-systems | Solving Linear Systems | 
    0many-variables/linear-algebra/changing-the-basis | Changing the Basis | 
    0many-variables/linear-algebra/diagonalizations | Diagonalizations | 
    0many-variables/linear-algebra/complex-linear-spaces | Complex Linear Spaces | 
    0many-variables/systems-of-ordinary-differential-equations | Systems of Ordinary Differential Equations | \bar{x}'
    0many-variables/systems-of-ordinary-differential-equations/predator-prey | Predator Prey | 
    0many-variables/systems-of-ordinary-differential-equations/two-dimensional-systems | Two Dimensional Systems | 
    0many-variables/systems-of-ordinary-differential-equations/matrix-solutions | Matrix Solutions | 
    0many-variables/systems-of-ordinary-differential-equations/numerical-systems | Numerical Systems | 
    0many-variables/systems-of-ordinary-differential-equations/non-linear-differential-systems | Non-linear Differential Systems | 
    0many-variables/systems-of-ordinary-differential-equations/chaos | Chaos | 
    0many-variables/systems-of-ordinary-differential-equations/critical-points | Critical Points | 
    0many-variables/multivariable-functions | Multivariable Functions | \bar{f}
    0many-variables/multivariable-functions/one-to-many | One to Many | 
    0many-variables/multivariable-functions/many-to-one | Many to One | 
    0many-variables/multivariable-functions/complex-to-complex | Complex to Complex | 
    0many-variables/multivariable-functions/many-to-many | Many to Many | 
    0many-variables/multivariable-functions/graphs | Graphs | 
    0many-variables/multivariable-functions/questions-to-ask | Questions to Ask | 
    0many-variables/multivariable-functions/multivariable-polynomials | Multivariable Polynomials | 
    0many-variables/multivaribale-differential-calculus | Multivaribale Differential Calculus | \frac{\partial f}{\partial x}
    0many-variables/multivaribale-differential-calculus/total-derivatives | Total Derivatives | 
    0many-variables/multivaribale-differential-calculus/partial-derivatives | Partial Derivatives | 
    0many-variables/multivaribale-differential-calculus/tangentials | Tangentials | 
    0many-variables/multivaribale-differential-calculus/extrema | Extrema | 
    0many-variables/multivaribale-differential-calculus/lagrange-multiplies | Lagrange Multiplies | 
    0many-variables/multivaribale-differential-calculus/high-dimensional-newtons-method | High Dimensional Newtons Method | 
    0many-variables/multivaribale-differential-calculus/local-approximations | Local Approximations | 
    0many-variables/multivariable-integral-calculus | Multivariable Integral Calculus | d\bar{x}
    0many-variables/multivariable-integral-calculus/volume-integrals | Volume Integrals | 
    0many-variables/multivariable-integral-calculus/surface-area-integrals | Surface Area Integrals | 
    0many-variables/multivariable-integral-calculus/line-integrals | Line Integrals | 
    0many-variables/multivariable-integral-calculus/integral-relations | Integral Relations | 
    0many-variables/multivariable-integral-calculus/change-of-basis-in-integrals | Change of Basis in Integrals | 
    0many-variables/multivariable-integral-calculus/antiderivatives | Antiderivatives | 
    0many-variables/multivariable-integral-calculus/generalizing-multivariable-integrals | Generalizing Multivariable Integrals | 
    0many-variables/partial-differential-equations | Partial Differential Equations | \Delta f
    0many-variables/partial-differential-equations/partial-versus-ordinary | Partial versus Ordinary | 
    0many-variables/partial-differential-equations/verifying-solutions | Verifying Solutions | 
    0many-variables/partial-differential-equations/laplacian-equations | Laplacian Equations | 
    0many-variables/partial-differential-equations/boundary-conditions | Boundary Conditions | 
    0many-variables/partial-differential-equations/time-versus-space | Time versus Space | 
    0many-variables/partial-differential-equations/approximations-in-pdes | Approximations in PDEs | 
    0many-variables/partial-differential-equations/generalized-solutions | Generalized Solutions | 
    0many-variables/curved-spaces | Curved Spaces | T_p M 
    0many-variables/curved-spaces/surfaces-in-3d | Surfaces in 3D | 
    0many-variables/curved-spaces/curves | Curves | 
    0many-variables/curved-spaces/coordinates | Coordinates | 
    0many-variables/curved-spaces/tangent-spaces | Tangent Spaces | 
    0many-variables/curved-spaces/metrics | Metrics | 
    0many-variables/curved-spaces/tensors-and-differential-forms | Tensors and Differential Forms | 
    0many-variables/curved-spaces/topological-concerns | Topological Concerns | 
    0probability-and-statistics | Probability and Statistics | \mu 
    0probability-and-statistics/descriptive-statistics | Descriptive Statistics | \sigma
    0probability-and-statistics/descriptive-statistics/gathering-data | Gathering Data | 
    0probability-and-statistics/descriptive-statistics/notions-of-centrality | Notions of Centrality | 
    0probability-and-statistics/descriptive-statistics/notions-of-spread | Notions of Spread | 
    0probability-and-statistics/descriptive-statistics/charts | Charts | 
    0probability-and-statistics/descriptive-statistics/other-measures | Other Measures | 
    0probability-and-statistics/descriptive-statistics/stories | Stories | 
    0probability-and-statistics/descriptive-statistics/lies | Lies | 
    0probability-and-statistics/fitting-functions | Fitting Functions | R^2
    0probability-and-statistics/fitting-functions/exact-fits | Exact Fits | 
    0probability-and-statistics/fitting-functions/least-squares | Least Squares | 
    0probability-and-statistics/fitting-functions/linear-regression | Linear Regression | 
    0probability-and-statistics/fitting-functions/polynomial-regression | Polynomial Regression | 
    0probability-and-statistics/fitting-functions/logging-data-for-regression | Logging Data for Regression | 
    0probability-and-statistics/fitting-functions/trust-and-regression | Trust and Regression | 
    0probability-and-statistics/fitting-functions/general-linear-model | General Linear Model | 
    0probability-and-statistics/probability | Probability | X
    0probability-and-statistics/probability/counting-outcomes | Counting Outcomes | 
    0probability-and-statistics/probability/combinatorial-probability | Combinatorial Probability | 
    0probability-and-statistics/probability/random-variables | Random variables | 
    0probability-and-statistics/probability/special-random-variables | Special Random Variables | 
    0probability-and-statistics/probability/conditional-probabilities | Conditional Probabilities | 
    0probability-and-statistics/probability/central-limit-theorem | Central Limit Theorem | 
    0probability-and-statistics/probability/to-ponder | To Ponder | 
    0probability-and-statistics/frequentist-statistics | Frequentist Statistics | t
    0probability-and-statistics/frequentist-statistics/notions-of-frequentist-statistics | Notions of Frequentist Statistics | 
    0probability-and-statistics/frequentist-statistics/varieties-of-statistics | Varieties of Statistics | 
    0probability-and-statistics/frequentist-statistics/proper-data-collection | Proper Data Collection | 
    0probability-and-statistics/frequentist-statistics/z-test | z-Test | 
    0probability-and-statistics/frequentist-statistics/t-test | t-Test | 
    0probability-and-statistics/frequentist-statistics/anova | ANOVA | 
    0probability-and-statistics/frequentist-statistics/categorical-tests | Categorical Tests | 
    0probability-and-statistics/bayesian-statistics | Bayesian Statistics | A|B
    0probability-and-statistics/bayesian-statistics/using-bayes-theorem | Using Bayes Theorem | 
    0probability-and-statistics/bayesian-statistics/parameter-estimation | Parameter Estimation | 
    0probability-and-statistics/bayesian-statistics/priors | Priors | 
    0probability-and-statistics/bayesian-statistics/posteriors | Posteriors | 
    0probability-and-statistics/bayesian-statistics/sampling | Sampling | 
    0probability-and-statistics/bayesian-statistics/monte-carlo | Monte Carlo | 
    0probability-and-statistics/bayesian-statistics/comparing-methods | Comparing Methods | 
    0probability-and-statistics/simulations | Simulations | \ddots
    0probability-and-statistics/simulations/exploring-probability | Exploring Probability | 
    0probability-and-statistics/simulations/randomness | Randomness | 
    0probability-and-statistics/simulations/simulating-random-variables | Simulating Random Variables | 
    0probability-and-statistics/simulations/central-limit-theorem-explorations | Central Limit Theorem Explorations | 
    0probability-and-statistics/simulations/z-test-explorations | z-Test Explorations | 
    0probability-and-statistics/simulations/t-test-explorations | t-Test Explorations | 
    0probability-and-statistics/simulations/bayesian-explorations | Bayesian Explorations | 
    0probability-and-statistics/multivariate-statistics | Multivariate Statistics | \bar{X}
    0probability-and-statistics/multivariate-statistics/random-multivariates | Random Multivariates | 
    0probability-and-statistics/multivariate-statistics/joint-distribution | Joint Distribution | 
    0probability-and-statistics/multivariate-statistics/multivariate-distributions | Multivariate Distributions | 
    0probability-and-statistics/multivariate-statistics/multivariate-means | Multivariate Means | 
    0probability-and-statistics/multivariate-statistics/multivariate-normals | Multivariate Normals | 
    0probability-and-statistics/multivariate-statistics/multivariate-analysis | Multivariate Analysis | 
    0probability-and-statistics/multivariate-statistics/multivariate-regression | Multivariate Regression | 
    0practitioners | Practitioners | \heartsuit
    0practitioners/algebraists | Algebraists | G
    0practitioners/algebraists/abstract-algebra | Abstract Algebra | 
    0practitioners/algebraists/number-theory | Number Theory | 
    0practitioners/algebraists/cryptography | Cryptography | 
    0practitioners/algebraists/algebraic-geometry | Algebraic Geometry | 
    0practitioners/algebraists/algebraic-topology | Algebraic Topology | 
    0practitioners/algebraists/computer-algebra | Computer Algebra | 
    0practitioners/algebraists/category-theory | Category Theory | 
    0practitioners/analysts | Analysts | \epsilon
    0practitioners/analysts/real-analysis | Real Analysis | 
    0practitioners/analysts/complex-analysis | Complex Analysis | 
    0practitioners/analysts/numerical-analysis | Numerical Analysis | 
    0practitioners/analysts/functional-analysis | Functional Analysis | 
    0practitioners/analysts/calculus-of-variations | Calculus of Variations | 
    0practitioners/analysts/delta-functions | Delta Functions | 
    0practitioners/analysts/optimization | Optimization | 
    0practitioners/geometers | Geometers | \omega
    0practitioners/geometers/toplogy | Toplogy | 
    0practitioners/geometers/differential-geometry | Differential Geometry | 
    0practitioners/geometers/soap-bubbles | Soap Bubbles | 
    0practitioners/geometers/symplectic-geometry | Symplectic Geometry | 
    0practitioners/geometers/control-theory | Control Theory | 
    0practitioners/geometers/mathematical-physics | Mathematical Physics | 
    0practitioners/geometers/infinite-dimensional-spaces | Infinite Dimensional Spaces | 
    0practitioners/booleans | Booleans | \binom{n}{r}
    0practitioners/booleans/combinatorics | Combinatorics | 
    0practitioners/booleans/graph-theory | Graph Theory | 
    0practitioners/booleans/mathematical-logic | Mathematical Logic | 
    0practitioners/booleans/game-theory | Game Theory | 
    0practitioners/booleans/computer-scientists | Computer Scientists | 
    0practitioners/booleans/politicians | Politicians | 
    0practitioners/booleans/risk-managers | Risk Managers | 
    0practitioners/scientists | Scientists | P_t
    0practitioners/scientists/physics | Physics | 
    0practitioners/scientists/chemistry | Chemistry | 
    0practitioners/scientists/biology | Biology | 
    0practitioners/scientists/health | Health | 
    0practitioners/scientists/ecology | Ecology | 
    0practitioners/scientists/economics | Economics | 
    0practitioners/scientists/sociology | Sociology | 
    0practitioners/engineers | Engineers | \jmath
    0practitioners/engineers/mechanical-engineering | Mechanical Engineering | 
    0practitioners/engineers/electrical-engineering | Electrical Engineering | 
    0practitioners/engineers/chemical-engineering | Chemical Engineering | 
    0practitioners/engineers/aerospace-engineering | Aerospace Engineering | 
    0practitioners/engineers/actuarial-science | Actuarial Science | 
    0practitioners/engineers/meterology | Meterology | 
    0practitioners/engineers/finance | Finance | 
    0practitioners/artists | Artists | \natural
    0practitioners/artists/music | Music | 
    0practitioners/artists/writing | Writing | 
    0practitioners/artists/architecture | Architecture | 
    0practitioners/artists/visualizations | Visualizations | 
    0practitioners/artists/computer-generation | Computer Generation | 
    0practitioners/artists/entertainment | Entertainment | 
    0practitioners/artists/fractals | Fractals | 