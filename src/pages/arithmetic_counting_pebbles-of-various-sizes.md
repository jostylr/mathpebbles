# Pebbles of Various Sizes

    _"pieces | page /arithmetic/counting/pebbles-of-various-sizes, _'intro |md',
            ec('sub 1'), _'sub 1 |md ',
            ec('sub 2'), _'sub 2 |md ',
            ec('sub 3'), _'sub 3 |md ',
            ec('sub 4'), _'sub 4 |md ',
            ec('sub 5'), _'sub 5 |md ',
            ec('sub 6'), _'sub 6 |md ',
            ec('sub 7'), _'sub 7 |md '"

[../public/arithmetic/counting/pebbles-of-various-sizes.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro

    Before getting into symbols representing numbers, a stepping stone is to
    consider pebbles as counters. Each pebble represents one item.

    Let's say we are counting books. For each book, we put one pebble into a
    bag. If we lose a book, we can remove a pebble. If we gain a book, we can
    add a pebble. This is a perfectly valid representation of numbers. But it
    is cumbersome. Imagine if we had 100 books, then our bag would have 100
    pebbles. 

    Instead, what we can do is have multiple bags. Each bag will have a
    diffrent meaning as to how many books a single pebble will represent. The
    first bag will represent one book for a pebble. The next bag will
    represent five pebbles from the first bag. So if the first bag gets five
    pebbles, then we can remove them, and put one pebble into the second bag.
    When the second bag gets five pebbles, put it in the third bag. And so on. 

    Notice that with this system, we do not have to know that 4 pebbles in the
    second bag and 2 pebbles in the first bag indicates we have 22 books. We
    need to know that if we want to communicate the overall number to someone
    else, but if we are simply tracking whether we have the same number of
    books now as we did before, then this is a perfectly adequate system with
    no further abstraction. 

    It should also be noted that while we are allowed to transfer five pebbles
    from one bag to the next one up, we do not have to. We could have 7
    pebbles in the first bag and 3 pebbles in the second bag; this would lead
    to the same 22 books being counted by this. There is a unique
    representation if we want to minimize the number of pebbles used which
    would require us to transfer five pebbles from any bag with more than four
    pebbles until all bags have no more than four pebbles. 

    Using our usual numbers to count only the pebbles, we could setup a
    notation system using, say, backslash, separating the numbers. For example,
    the 4 and 2 could be 4\2  and we could say 4\2 = 3\7 = 22 represent the same
    number of books. 

    With this, we have chosen to put the larger representing bag first,
    namely, the bag with five books per pebble. This is also what prompted the
    use of the backslash; the higher end is near the larger number. 

    We could have done the reverse, but knowing the largest amount first feels
    most natural. Of course, if we were removing or adding pebbles one at a
    time, then perhaps we would want to write it with the single pebbles
    first. This suggests a forward slash and that lead to confusion with
    division symbols, but it would mean 4\2 could be written as 2/4. 

    These are all conventions, choices that we make to represent these
    numbers. There is an actual reality of these numbers, namely, that we can
    match groups of the same number together. But to start working with the
    numbers in a useful fashion, we need to start giving them names. And as
    numbers of objects get to be large, we need compact names. 

    There is also the choice of what kind of clumping we chose. Here we chose
    five. Why would five be natural? Well, we have five fingers per hand
    (usually). That means that five is somehow a natural amount to count. 

    As you presumably know, and as we will discuss, five is not how we group
    numbers. We use 10 for groupings. 

    Time is perhaps the most notable exceptional grouping. We will get to that
    in the unit section. 

    
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


## Ideas

[pebble]()

    * V: [Pebble Counting]() 
    * P: [Pebble Grouping](https://mathpebbles.com/pebble-grouping.html) This
      allows you to explore with various grouping sizes.
      What is the optimal grouping size for humans? (Hint: Seven :)



[proof]()

    some stuff on equivalence of representation

[program]()

    converting between groups and overall count, possibly doing an actual
    pebble like operation with sets. 


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


