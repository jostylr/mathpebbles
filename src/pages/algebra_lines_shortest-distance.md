# Shortest Distance


    _"pieces | page /algebra/lines/shortest-distance, _'intro |md',
            ec('Points'), _'Points |md ',
            ec('Paths'), _'Paths |md ',
            ec('Step Distance'), _'Step Distance |md ',
            ec('Taking the Least Number of Steps'), _'Taking the Least Number
            of Steps|md ',
            ec('Distance Defined'), _'Distance Defined |md ' "

[../public/algebra/lines/shortest-distance.html](# "save:")

[pebbles](#pebble "h5: | .join \n")
[code runs](#code "h5: | .join \n")

## Intro

    In this section, we build up the core tool in defining lines: the notion
    of distance. 

##### Pebble

## Teaser

    In this section, we build up the core tool in defining lines: the notion
    of distance. 


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

### Ideas

[pebble]()

    Some kind of graphical exploration of path lengths, number of (tiny) steps
    show the path


[proof]()

    At this point, we are treating points as primitive objects and defining
    paths in relation to strings. The latter is something that we have to wait
    to fix up. The former, however, is something that we can give easy models
    of. 

    Given two objects \x and \y, we  

    We can join two paths into one if the end point of the first path is the
    same as the starting point of the second. Then the joined path goes from
    the first path's starting point and ends at the second path's ending
    point. 

    The length of the new path is the sum of the lengths of the two subpaths.
    The number of the 

[program]()

    Computing the step distance on a path (requires a bit of later math stuff
    such as cartesian coordinates and Pythagorean) 


## Points

    I am here, you are there. From this, geometry flows. 

    The notion of separation in space of two people is the idea that we are
    located at different points in space. 

    The term "point" is a
    primitive notion in that we do not say what a point is in terms of
    anything else. The core idea of a point is that it is a distinct entity
    with no notion of overlapping other points. Often this is thought of as
    having no visible extent, but we also often depict points to our gross
    selves as something with extent. The core notion is that of distinctive
    separation.  

    We do have mathematical models of points. We often name the points with
    coordinates and thus we can construct a space of points by being a space
    of coordinates. For example, a map may refer to points with longitude and
    latitude. We could then consider the abstract space of all pairs of
    longitude and latitude numbers within a suitable region to model this. If
    we allow for the full range of real numbers between any two use numbers,
    then we will end up with a continuous space, with uncountably many points.
    Such a space is typically assumed in mathematical concepts, but
    in applications, points are quite limited by the crudeness of our
    measurements.  

    For us, the core question will be one of connections between points, such
    as paths and the lengths of those paths. That leads us to a question of
    what paths are.


##### Pebble


##### Code



## Paths

    A path is a journey from one point to another, travelling from one point
    in the space to the next until the destination is obtained. 

    At a minimum, a path is a set of points, one with a start,
    an end, and some kind of progression from the start to the end. There is
    a technical definition that will come much later in this series, but the
    best image to have in mind is that a path is something that one could
    cover with a string. 

    This string image then also tells us how to measure the length of a path.
    First, find a string that precisely fits the path. Second, take the string
    and pull it until it can no longer be pulled (taut). Third, compare that length
    to some standard measure.

    An important part of that procedure is that we do not have to already
    define "straight"; reality provides us with the ability to get straight by
    simply pulling on end of the string until it steps extending. Once fully
    extended, a string can only move by the end point travelling in a circle,
    as we discuss in the next section. 

    This also works in other contexts. Take a ball and a string. Fix one end
    of the string to a point on the ball and then move the other point on the
    ball until the string is taut. The path the string describes will be a
    very special path. It is a path equivalent to taking a part of the equator. 
    The equator is a sort of maximal circle on a sphere and these are the
    "straight" lines on a sphere. 


##### Pebble


##### Code



## Step Distance

    There is another notion of path length that we could consider. That is the
    notion of how far one has traveled along a path. This could be the number
    of steps taken or if, on a wheeled contraption, how many wheel rotations
    have happened. We will concentrate on the idea of a step.

    By step, we mean some kind of small length that indicates a travel from
    one point to another. In human terms, a person's step size might be a couple of
    feet. If we take a walk and go five steps, then we have gone ten feet. 

    This is a measurement of distance along our path. With fixed starting and
    ending points, we could take a much longer path, say, one with ten steps
    leading to a length of twenty feet. 

    If we take smaller steps, say, one inch steps, then the 5 steps become 60
    steps as there are 12 inch-long steps in a foot-long step. 

    This step size is a primitive notion. It is something that we humans
    should be comfortable with because that is how we assess distance
    experientially. 

    As we take smaller steps, our notion of distance will become more
    accurate, assuming we can count well. 

    Imagine we have a piece of a string that, when taut, we could take 5 steps
    across it. If we take a path that we could travel with 5 steps, then the
    string would perfectly fit along the path. Conversely, if the string fits
    a path perfectly, then it would take us 5 steps to go across it. 

    It is in that way that the notion of steps and string lengths are in
    harmony. 



##### Pebble


##### Code



## Taking the Least Number of Steps


    Life takes energy to travel and so life naturally tends to look for the
    path to the destination with the shortest amount of energy usage. This
    typically involves taking the shortest number of steps, at least when we
    are not going up and down a mountainside or something like that. 

    We are therefore interested in minimizing the number of steps taken (more
    generally, we would minimize the energy required to travel a path). This
    is equivalent to trying to minimize the length of the path per the string
    point of view. 

    The question then becomes "Given a starting and ending point, what is the
    path that minimizes the distance traveled between these two points?".

    There are separate questions of does such a path exist and can we describe
    such paths if they do exist. 

    The existence question is a technical question of what space you are
    actually talking about. Imagine, for instance, that you live on the north
    bank of a river and you travel to the south bank. Further suppose that the
    only way across the river is to take a bridge. Almost surely, the paths
    available will not allow you to take the shortest path available to a flying
    bird. The path ultimately taken by end up 

    We will focus on the case when there are no obstacles preventing the
    natural minimal length path from being an option.  


##### Pebble


##### Code


## Distance Defined


    The distance between two points is defined as the shortest length of all
    the paths connecting the two points. If two points are not connected by a
    path, the distance is undefined. 


##### Pebble


##### Code


