# Setup

This sets up the lprc.js file. It could also set up some other stuff, but
right now just focusing on the lprc.js

## Lprc


    /*global module, require */
    module.exports = function(Folder, args) {

       // Folder.plugins.htmlmin = htmlmin.minify;

        Folder.plugins.md.prepost.push(_"inline code replacement"); 
      
    };

[../lprc.js](# "save:")


### inline code replacement

This will find inline code snippets and replace those with the starting
syntax, producing the following results:

% is the character that simply says to employ this mechanism. Anything can
follow it though if one wants the tag to be a div, use !.  One can also set
the tag in the properties:  tag:p  for example. @ signifies a method name for
an output, ~ signifies an input parser, one can also do `@method~` to do both
with the input being the method name with Parser added.  The # signifies the
name in the data to use for storing the value. A leading . yields the class. A
leading / denotes the type and could be multiple levels, I suppose, to split
on the slash (no leading slash). 

A leading =, !=, #, !# will also trigger this stuff and be processed as if a
leading percent was there. If the leading character (after possible !) is a #,
then the figure is considered an input. 

* = expression  A straight = will evaluate the expression as straight out JS in the context of
the element per Alpine. Its result goes into the @ version. 
* =: name_string   This expects to be pointing to a name that should be stored AND that
  there is a function called cName that will get called and whose return value
  will be where the name gets stored. The value gets displayed via the @
  method with the value being sent directly into it. 
* == expression.  This encapsulates the expression in a template literal
  string quotes before sending into the display expression. 


The = separator =: says to actually run the expression and possibly store the
expression if a name is present. This should be for output types, not inputs.
Regardless of other stuff, this will overwrite the type to output. 


* #props=value will initiate a value
* %props=expression will execute an expression
* =expression will execute an expression with almost no boilerplate. The
  default output is mathjax
* %! or != leading will lead to a div instead of a span which could also lead
  to display math


props should be of the form  key:value; for data-key="value" setup or class;
for class values.  Value should be whatever value makes sense. One can also
have @method;  which calls a method on the value (and possible other
arguments that go after the value in the method); The method name actually
creates distinct attributes x-init=methodParse(value)  to parse the given
value and x-html=method(value) to display. The default is bignum-parse and
bignum. ???

      function varsub (code) {
            let snips = [];

            let parseInsides = _"parsing";

            _"mask boilerplate"

            let reg = /(\`+)((?:\%|\=|\!\=|\#|\!\#)[^`]+)\1/g; //leading characters
            code = code.replace(reg, mask);
            _"check if escaped"
            return [code, undo];
        } 


Note that we do not want any code apostrophe in the middle as we wrap these
expressions in that anyway after processing for use in js in html attribute.
It does mean if we need a literal one we can do the unicode escape since that
works in such strings, at least for computed values. 


### Parsing

    
    function (text) {
        _":figure out kind"
        let data = {};
        let tag = 'span';
        if (text[0] === '!') {
            text = text.slice(1);
            tag = 'div';
        }
        let eqind = text.indexOf('='); // end with value
        let value, compute = true;
        let name = '';
        if (eqind === -1) {
            eqind = text.length;
            value = '';
        } else {
            value = text.slice(eqind+1);
            if (value[0] === ':') {
                name = value = value.slice(1);
                value = 'c' + value[0].toUpperCase() + value.slice(1) + '()';
                compute = true;
                kind = 'output';
            } else if (value[0] === '=') {
                compute = false;
                value= value.slice(1);
            }
        }
        if (kind === 'input') {
            data.value = value; //debugging, reset
        }
        let rest = text.slice(0,eqind); 
        let bits = rest.split(';').map( el => el.trim());
        let displayer = 'mathOut';
        let parser = 'mathParse';
        let type = data.type =  'bignumber';
        let cls = [kind];
        bits.forEach( bit => {
            let first = bit[0];
            switch (first) {
            case '@' : 
                if (bit[bit.length-1] === '~') {
                    let root = bit.slice(1,-1);
                    displayer = root + 'Out';
                    parser = root + 'Parser'; 
                } else {
                    displayer = bit.slice(1);
                }
            break;
            case '#' : 
                name = data.name = bit.slice(1);
            break;
            case '~' : 
                parser = bit.slice(1);
            break;
            case '/' : 
                type = data.type = bit.slice(1);
            break;
            case '.' : 
                cls.push(bit.slice(1));
            break;
            default : 
                let [key='', val=''] = bit.split(':').map( el=>el.trim() );
                if (key === 'tag') {
                    tag = val;
                } else if (key) {
                    data[key] = val;
                } else {
                    console.error('key value not understood: ' + bit);
                }
            break;
            }
        });
        let insert = '';

If there is a name, then we are parsing the initial value and storing it.
Other things may change it? Need to think that through. But we want the
displayer to use that. If no name, then the equals expression should be
evaluated as a interpolated string, taking in the values 

        let exp = compute ? value : '`' + value + '`';
        if (kind==='input') {
            insert += 'tabindex="0" '; 
            insert += 'x-init="store(' + parser + '(' + exp + ', $el), \''+ name +'\')" ';
            insert += 'x-effect="' + displayer + '(' + name + ', $el)" ';
            insert += '@click="toggleInput($el)"';
        } else {    
            if (name) { //want to store value
                insert += 'x-effect="' + displayer + '(store(' + exp + ', \'' + name + '\'), $el)" ';
            } else {
                insert += 'x-effect="' + displayer + '(' + exp + ', $el)" ';
            }
        }
        let ret = '<'+ tag + 
            ' class="' + cls.join(' ') + '" ' + 
            insert + 
            Object.keys(data).map( key => { return 'data-' + key + 
                '="' + data[key] + '"'}).
            join(' ') + '></' + tag+ '>';
        return ret; 
    }

[figure out kind]() 

This figures out if it is an input or an output. It is an output if the lead
is a `%`, `=`, or `!=`. 

    let kind = 'input';
    if (text[0] === '%') {
        kind = 'output';
        text = text.slice(1);
    } else if ( (text[0] === '=') || (text.slice(0,2) === '!=') ) {
        kind = 'output';
    }



### Mask boilerplate

This calls the parser with the matched information and also has the undo
function, etc.  Not much of interest other than the type. 

    let mask = function (match, ignore, text) {
        let snip = parseInsides(text);
        snips.push(snip );
        return "<!--VARSNIP" + (snips.length-1) + "-->";
    };

    let rep = function (match, num) {
        return snips[parseInt(num, 10)];
    };
    
    let undo = function (html) {
        let reg = /<\!\-\-VARSNIP(\d+)\-\->/g; 
        return html.replace(reg, rep);
    };

### Check if escaped

This is to allow one to have the string that would trigger this except it has
leading spaces. This trims one space. 

    let escaped = /(\`+)(\s+)((?:\%|\=|\!\=|\#|\!\#)[^`]+)(\1)/g; //leading characters
    code = code.replace(escaped, (match, lead, space, text, close) => {
        return lead + space.slice(1) + text + close;
    });
