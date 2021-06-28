# Number as Matching

    _"pieces | page /arithmetic/counting/number-as-matching, _'intro |md',
            ec('sub 1'), _'sub 1 |md ',
            ec('sub 2'), _'sub 2 |md ',
            ec('sub 3'), _'sub 3 |md ',
            ec('sub 4'), _'sub 4 |md ',
            ec('sub 5'), _'sub 5 |md ',
            ec('sub 6'), _'sub 6 |md ',
            ec('sub 7'), _'sub 7 |md '"

[../public/arithmetic/counting/number-as-matching.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro

    What is the number 4? In many ways, this is similar to asking what the
    color red is. There is a reality behind the description, but
    fundamentally, humans are comparing two aspects of that reality and giving
    it a name.  

    The fundamental meaning of 4 is that we can take a collection of objects
    and say that there are 4 objects in the collection if we can match each
    object in that group with a distinct object in another group of 4 objects. 

    ![](images/four.png)

    The mapping from the four squares to the four circles is good as each
    square has exactly one corresponding circle. Each circle has exactly one
    matching square. These groups have the same number of objects. 

    While the squares and dots have the same number of objects, the mapping
    indiciated in the picture is a bad mapping as there are two squares that
    map to a single dot. 

    We also have the mapping from circles to triangles. Each circle maps to
    exactly one triangle, but there is a triangle that is not mapped to. This
    not only means that these two groups of objects are not equal in number,
    but that the number of circles is smaller than the number of triangles. In
    this instance, we have four circles and five triangles. This is the sense
    in which five is larger than four. 


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
    
    * [Number as Matching]() Video demonstrating numbers as matching elements
      in groups. 
    * [Match It](https://mathpebbles.com/match-it.html) This pebble gives a
      set of objects and your task is to match it with another set of the same
      number of elements.


[proof]()

    We start with the notion of a set. A set is something which represents
    grouping stuff together. We take it as a primitive concept, meaning that
    it is not defined in terms of anything else. Instead, we list out stuff
    that we can do with sets: 

    * Sets have a something (function) that is associated with them, namely
      the "element of" notion. Given an object and a set, the "element of"
      tells us whether the object is in the set or not. We write 
      {$$}x \in A{/$$} (read as "x is an element of A" ) if {$$}x{/$$} is in the set
      {$$}A{/$$} and {$$}x \notin A{/$$} if not.

      There is no built-in notion of having multiple copies of an object in a
      set. Instead, if we need to have multiple copies of something in a set,
      we add some distinguishing information. In physical reality, this could
      correspond to the position of an object. For dollar bills, we could use
      the serial number. 
    * The empty set, denoted {$$}\emptyset{/$$}, is a set with no elements.
      That is, if we ask if a given object is an element of the set, the set
      always says no. It is considered unique from the perspective of sets as
      a set is entirely defined by its elements. 
    * A set {$$}B{/$$} is a subset of {$$}A{/$$} (written {$$}B \subset {/$$} 
      if every element in {$$}B{/$$} is an element of {$$}A{/$$}. It is a
      proper subset if it is neither empty nor the entire set.
    

    need complements of sets, removal of sets, expression of sets using
    brackets, talk about removal of elements, then explore removing elements
    to get finite, number, as well as mapping. 

[program]()

    We will use the Javascript type of object called "Set". This takes in
    unique values and is a great type of thing to explore creating sets. 


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


