function wordObj(e){for(var t={},n=0,r=e.length;n<r;++n)t[e[n]]=!0;return t}var curPunc,keywordList=["alias","and","BEGIN","begin","break","case","class","def","defined?","do","else","elsif","END","end","ensure","false","for","if","in","module","next","not","or","redo","rescue","retry","return","self","super","then","true","undef","unless","until","when","while","yield","nil","raise","throw","catch","fail","loop","callcc","caller","lambda","proc","public","protected","private","require","load","require_relative","extend","autoload","__END__","__FILE__","__LINE__","__dir__"],keywords=wordObj(keywordList),indentWords=wordObj(["def","class","case","for","while","until","module","then","catch","loop","proc","begin"]),dedentWords=wordObj(["end","until"]),opening={"[":"]","{":"}","(":")"},closing={"]":"[","}":"{",")":"("};function chain(e,t,n){return n.tokenize.push(e),e(t,n)}function tokenBase(e,t){if(e.sol()&&e.match("=begin")&&e.eol())return t.tokenize.push(readBlockComment),"comment";if(e.eatSpace())return null;var n,r=e.next();if("`"==r||"'"==r||'"'==r)return chain(readQuoted(r,"string",'"'==r||"`"==r),e,t);if("/"==r)return regexpAhead(e)?chain(readQuoted(r,"string.special",!0),e,t):"operator";if("%"==r){var a="string",o=!0;e.eat("s")?a="atom":e.eat(/[WQ]/)?a="string":e.eat(/[r]/)?a="string.special":e.eat(/[wxq]/)&&(a="string",o=!1);var i=e.eat(/[^\w\s=]/);return i?(opening.propertyIsEnumerable(i)&&(i=opening[i]),chain(readQuoted(i,a,o,!0),e,t)):"operator"}if("#"==r)return e.skipToEnd(),"comment";if("<"==r&&(n=e.match(/^<([-~])[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/)))return chain(readHereDoc(n[2],n[1]),e,t);if("0"==r)return e.eat("x")?e.eatWhile(/[\da-fA-F]/):e.eat("b")?e.eatWhile(/[01]/):e.eatWhile(/[0-7]/),"number";if(/\d/.test(r))return e.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/),"number";if("?"==r){for(;e.match(/^\\[CM]-/););return e.eat("\\")?e.eatWhile(/\w/):e.next(),"string"}if(":"==r)return e.eat("'")?chain(readQuoted("'","atom",!1),e,t):e.eat('"')?chain(readQuoted('"',"atom",!0),e,t):e.eat(/[\<\>]/)?(e.eat(/[\<\>]/),"atom"):e.eat(/[\+\-\*\/\&\|\:\!]/)?"atom":e.eat(/[a-zA-Z$@_\xa1-\uffff]/)?(e.eatWhile(/[\w$\xa1-\uffff]/),e.eat(/[\?\!\=]/),"atom"):"operator";if("@"==r&&e.match(/^@?[a-zA-Z_\xa1-\uffff]/))return e.eat("@"),e.eatWhile(/[\w\xa1-\uffff]/),"propertyName";if("$"==r)return e.eat(/[a-zA-Z_]/)?e.eatWhile(/[\w]/):e.eat(/\d/)?e.eat(/\d/):e.next(),"variableName.special";if(/[a-zA-Z_\xa1-\uffff]/.test(r))return e.eatWhile(/[\w\xa1-\uffff]/),e.eat(/[\?\!]/),e.eat(":")?"atom":"variable";if("|"!=r||!t.varList&&"{"!=t.lastTok&&"do"!=t.lastTok){if(/[\(\)\[\]{}\\;]/.test(r))return curPunc=r,null;if("-"==r&&e.eat(">"))return "operator";if(/[=+\-\/*:\.^%<>~|]/.test(r)){var u=e.eatWhile(/[=+\-\/*:\.^%<>~|]/);return "."!=r||u||(curPunc="."),"operator"}return null}return curPunc="|",null}function regexpAhead(e){for(var t,n=e.pos,r=0,a=!1,o=!1;null!=(t=e.next());)if(o)o=!1;else {if("[{(".indexOf(t)>-1)r++;else if("]})".indexOf(t)>-1){if(--r<0)break}else if("/"==t&&0==r){a=!0;break}o="\\"==t;}return e.backUp(e.pos-n),a}function tokenBaseUntilBrace(e){return e||(e=1),function(t,n){if("}"==t.peek()){if(1==e)return n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n);n.tokenize[n.tokenize.length-1]=tokenBaseUntilBrace(e-1);}else "{"==t.peek()&&(n.tokenize[n.tokenize.length-1]=tokenBaseUntilBrace(e+1));return tokenBase(t,n)}}function tokenBaseOnce(){var e=!1;return function(t,n){return e?(n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n)):(e=!0,tokenBase(t,n))}}function readQuoted(e,t,n,r){return function(a,o){var i,u=!1;for("read-quoted-paused"===o.context.type&&(o.context=o.context.prev,a.eat("}"));null!=(i=a.next());){if(i==e&&(r||!u)){o.tokenize.pop();break}if(n&&"#"==i&&!u){if(a.eat("{")){"}"==e&&(o.context={prev:o.context,type:"read-quoted-paused"}),o.tokenize.push(tokenBaseUntilBrace());break}if(/[@\$]/.test(a.peek())){o.tokenize.push(tokenBaseOnce());break}}u=!u&&"\\"==i;}return t}}function readHereDoc(e,t){return function(n,r){return t&&n.eatSpace(),n.match(e)?r.tokenize.pop():n.skipToEnd(),"string"}}function readBlockComment(e,t){return e.sol()&&e.match("=end")&&e.eol()&&t.tokenize.pop(),e.skipToEnd(),"comment"}const ruby={startState:function(e){return {tokenize:[tokenBase],indented:0,context:{type:"top",indented:-e},continuedLine:!1,lastTok:null,varList:!1}},token:function(e,t){curPunc=null,e.sol()&&(t.indented=e.indentation());var n,r=t.tokenize[t.tokenize.length-1](e,t),a=curPunc;if("variable"==r){var o=e.current();"keyword"==(r="."==t.lastTok?"property":keywords.propertyIsEnumerable(e.current())?"keyword":/^[A-Z]/.test(o)?"tag":"def"==t.lastTok||"class"==t.lastTok||t.varList?"def":"variable")&&(a=o,indentWords.propertyIsEnumerable(o)?n="indent":dedentWords.propertyIsEnumerable(o)?n="dedent":"if"!=o&&"unless"!=o||e.column()!=e.indentation()?"do"==o&&t.context.indented<t.indented&&(n="indent"):n="indent");}return (curPunc||r&&"comment"!=r)&&(t.lastTok=a),"|"==curPunc&&(t.varList=!t.varList),"indent"==n||/[\(\[\{]/.test(curPunc)?t.context={prev:t.context,type:curPunc||r,indented:t.indented}:("dedent"==n||/[\)\]\}]/.test(curPunc))&&t.context.prev&&(t.context=t.context.prev),e.eol()&&(t.continuedLine="\\"==curPunc||"operator"==r),r},indent:function(e,t,n){if(e.tokenize[e.tokenize.length-1]!=tokenBase)return null;var r=t&&t.charAt(0),a=e.context,o=a.type==closing[r]||"keyword"==a.type&&/^(?:end|until|else|elsif|when|rescue)\b/.test(t);return a.indented+(o?0:n.unit)+(e.continuedLine?n.unit:0)},languageData:{indentOnInput:/^\s*(?:end|rescue|elsif|else|\})$/,commentTokens:{line:"#"},autocomplete:keywordList}};

export { ruby };
