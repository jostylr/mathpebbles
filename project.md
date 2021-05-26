# Math Pebbles

This is the source for compiling the project. 

We first need to load the template: [templates](templates.md "load:")



Then we need to load the various books, chapters, sections. 

Then we can load a page and it loads all sub-pages. If we do the index page,
then they all get loaded!

[mp](pages/index.md "load:")

[poly](pages/algebra_polynomials.md "load")

[one page](pages/algebra_constructing-the-real-and-complex-numbers_arithmetic-and-geometry-of-complex-numbers.md "load")



## Other

We make the non-math pages here. It can be a simpler setup. The initial pages
are the About, FAQ, Support, Resources, Settings (not sure what we are settings, maybe morphs into some account page), Table of Contents, and an Index.  

There is  a more plain version of the template for the other pages: [boilerplate](boilerplate.md "load:")

* [toc](other/toc.md "load:")  The table of contents
* [book-index](other/book-index.md "load:") The index of content
* [about](other/about.md "load:") The About page
* [faq](other/faq.md "load:") FAQ
* [resources](other/resources.md "load:") Resources
* [settings](other/settings.md "load:") Settings
* [support](other/support.md "load:") Support
* [notes](other/notes.md "load:") Notes


## Organization

Within each page, there is a default setup that has the pebbles that allow for
exploration, code that allows for programmatic exploration, and an option for
injecting other stuff. 

On the page, it has a variety of sections that one can do that does stuff,
such as embedded proof and program drawers. It can also access problems from a
global data bank of problems. I think that is the most sensible. For a pebble,
one can always go there, but the problems seem like one might want to
incorporate them into practice, quiz, or test options not on a page. This
could also facilitate some kind of problem creation. 

Also separate is the actual math function computations. They should be written
in a functional style of inputs giving outputs. These are called in pebbles.
They are accessible via the MP.f object. 


