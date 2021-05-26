
//let htmlmin = require('html-minifier');

/*global module, require */
module.exports = function(Folder, args) {

   // Folder.plugins.htmlmin = htmlmin.minify;

    Folder.plugins.md.prepost.push( 
        function varsub (code) {
            let snips = [];

            let parseInsides = function (text, typ) { 
                let cls = [typ, 'stopProp'];
                let data = {};
                if (text[text.length-1] === '$') {
                    cls.push('math');
                    text = text.slice(0, -1);
                }
                let eqind = text.indexOf('='); // end with value
                if (eqind === -1) {
                    eqind = text.length;
                } else {
                    data.value = text.slice(eqind+1);
                }
                let rest = text.slice(0,eqind); 
                let bits = rest.split(';');
                data.name = bits.shift(); //start with name
                bits.forEach( bit => {
                    bit = bit.split(':');
                    if (bit.length === 1) {
                        cls.push(bit[0]); //classes by themselves
                    } else if (bit.length === 2) {
                        data[bit[0]] = bit[1];
                    } else {
                        console.error("misunderstood semicolon (varsub):", txt);
                    }
                });
                let ret = '<span class="' + 
                    cls.join(' ') + '" ' +
                    (typ === 'input' ? 'tabindex="0" ' : '' ) + 
                    Object.keys(data).map( key => { return 'data-' + key + 
                        '="' + data[key] + '"'}).
                    join(' ') + '></span>';
                return ret; 
            };

            
            let maskinput = function (match, ignore, text) {
                let snip = parseInsides(text, 'input');
                snips.push(snip);
                return "<!--VARSNIP" + (snips.length-1) + "-->";

            };

            let maskoutput = function (match, ignore, text) {
                let snip = parseInsides(text, 'output');
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

            let input = /(\`+)\#([^`]+)\1/g;
            code = code.replace(input, maskinput);
            let output = /(\`+)\%([^`]+)\1/g;
            code = code.replace(output, maskoutput);
            let equaloutput = /(\`+)(\=[^`]+)\1/g; //if no attributes
            code = code.replace(equaloutput, maskoutput);
            return [code, undo];
        } );


};
