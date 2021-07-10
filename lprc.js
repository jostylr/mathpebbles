/*global module, require */
module.exports = function(Folder, args) {

   // Folder.plugins.htmlmin = htmlmin.minify;

    Folder.plugins.md.prepost.push(  function varsub (code) {
            let snips = [];
    
            let parseInsides = function (text) {
                let kind = 'input';
                if (text[0] === '%') {
                    kind = 'output';
                    text = text.slice(1);
                } else if ( (text[0] === '=') || (text.slice(0,2) === '!=') ) {
                    kind = 'output';
                }
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
            };
    
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
    
            let reg = /(\`+)((?:\%|\=|\!\=|\#|\!\#)[^`]+)\1/g; //leading characters
            code = code.replace(reg, mask);
            let escaped = /(\`+)(\s+)((?:\%|\=|\!\=|\#|\!\#)[^`]+)(\1)/g; //leading characters
            code = code.replace(escaped, (match, lead, space, text, close) => {
                return lead + space.slice(1) + text + close;
            });
            return [code, undo];
        } ); 
  
};
