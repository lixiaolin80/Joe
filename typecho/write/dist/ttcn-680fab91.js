function words(t){for(var e={},n=t.split(" "),r=0;r<n.length;++r)e[n[r]]=!0;return e}const parserConfig={name:"ttcn",keywords:words("activate address alive all alt altstep and and4b any break case component const continue control deactivate display do else encode enumerated except exception execute extends extension external for from function goto group if import in infinity inout interleave label language length log match message mixed mod modifies module modulepar mtc noblock not not4b nowait of on optional or or4b out override param pattern port procedure record recursive rem repeat return runs select self sender set signature system template testcase to type union value valueof var variant while with xor xor4b"),builtin:words("bit2hex bit2int bit2oct bit2str char2int char2oct encvalue decomp decvalue float2int float2str hex2bit hex2int hex2oct hex2str int2bit int2char int2float int2hex int2oct int2str int2unichar isbound ischosen ispresent isvalue lengthof log2str oct2bit oct2char oct2hex oct2int oct2str regexp replace rnd sizeof str2bit str2float str2hex str2int str2oct substr unichar2int unichar2char enum2int"),types:words("anytype bitstring boolean char charstring default float hexstring integer objid octetstring universal verdicttype timer"),timerOps:words("read running start stop timeout"),portOps:words("call catch check clear getcall getreply halt raise receive reply send trigger"),configOps:words("create connect disconnect done kill killed map unmap"),verdictOps:words("getverdict setverdict"),sutOps:words("action"),functionOps:words("apply derefers refers"),verdictConsts:words("error fail inconc none pass"),booleanConsts:words("true false"),otherConsts:words("null NULL omit"),visibilityModifiers:words("private public friend"),templateMatch:words("complement ifpresent subset superset permutation"),multiLineStrings:!0};var wordList=[];function add(t){if(t)for(var e in t)t.hasOwnProperty(e)&&wordList.push(e);}add(parserConfig.keywords),add(parserConfig.builtin),add(parserConfig.timerOps),add(parserConfig.portOps);var curPunc,keywords=parserConfig.keywords||{},builtin=parserConfig.builtin||{},timerOps=parserConfig.timerOps||{},portOps=parserConfig.portOps||{},configOps=parserConfig.configOps||{},verdictOps=parserConfig.verdictOps||{},sutOps=parserConfig.sutOps||{},functionOps=parserConfig.functionOps||{},verdictConsts=parserConfig.verdictConsts||{},booleanConsts=parserConfig.booleanConsts||{},otherConsts=parserConfig.otherConsts||{},types=parserConfig.types||{},visibilityModifiers=parserConfig.visibilityModifiers||{},templateMatch=parserConfig.templateMatch||{},multiLineStrings=parserConfig.multiLineStrings,isOperatorChar=/[+\-*&@=<>!\/]/;function tokenBase(t,e){var n=t.next();if('"'==n||"'"==n)return e.tokenize=tokenString(n),e.tokenize(t,e);if(/[\[\]{}\(\),;\\:\?\.]/.test(n))return curPunc=n,"punctuation";if("#"==n)return t.skipToEnd(),"atom";if("%"==n)return t.eatWhile(/\b/),"atom";if(/\d/.test(n))return t.eatWhile(/[\w\.]/),"number";if("/"==n){if(t.eat("*"))return e.tokenize=tokenComment,tokenComment(t,e);if(t.eat("/"))return t.skipToEnd(),"comment"}if(isOperatorChar.test(n))return "@"==n&&(t.match("try")||t.match("catch")||t.match("lazy"))?"keyword":(t.eatWhile(isOperatorChar),"operator");t.eatWhile(/[\w\$_\xa1-\uffff]/);var r=t.current();return keywords.propertyIsEnumerable(r)?"keyword":builtin.propertyIsEnumerable(r)?"builtin":timerOps.propertyIsEnumerable(r)||configOps.propertyIsEnumerable(r)||verdictOps.propertyIsEnumerable(r)||portOps.propertyIsEnumerable(r)||sutOps.propertyIsEnumerable(r)||functionOps.propertyIsEnumerable(r)?"def":verdictConsts.propertyIsEnumerable(r)||booleanConsts.propertyIsEnumerable(r)||otherConsts.propertyIsEnumerable(r)?"string":types.propertyIsEnumerable(r)?"typeName.standard":visibilityModifiers.propertyIsEnumerable(r)?"modifier":templateMatch.propertyIsEnumerable(r)?"atom":"variable"}function tokenString(t){return function(e,n){for(var r,o=!1,i=!1;null!=(r=e.next());){if(r==t&&!o){var s=e.peek();s&&("b"!=(s=s.toLowerCase())&&"h"!=s&&"o"!=s||e.next()),i=!0;break}o=!o&&"\\"==r;}return (i||!o&&!multiLineStrings)&&(n.tokenize=null),"string"}}function tokenComment(t,e){for(var n,r=!1;n=t.next();){if("/"==n&&r){e.tokenize=null;break}r="*"==n;}return "comment"}function Context(t,e,n,r,o){this.indented=t,this.column=e,this.type=n,this.align=r,this.prev=o;}function pushContext(t,e,n){var r=t.indented;return t.context&&"statement"==t.context.type&&(r=t.context.indented),t.context=new Context(r,e,n,null,t.context)}function popContext(t){var e=t.context.type;return ")"!=e&&"]"!=e&&"}"!=e||(t.indented=t.context.indented),t.context=t.context.prev}const ttcn={startState:function(){return {tokenize:null,context:new Context(0,0,"top",!1),indented:0,startOfLine:!0}},token:function(t,e){var n=e.context;if(t.sol()&&(null==n.align&&(n.align=!1),e.indented=t.indentation(),e.startOfLine=!0),t.eatSpace())return null;curPunc=null;var r=(e.tokenize||tokenBase)(t,e);if("comment"==r)return r;if(null==n.align&&(n.align=!0),";"!=curPunc&&":"!=curPunc&&","!=curPunc||"statement"!=n.type)if("{"==curPunc)pushContext(e,t.column(),"}");else if("["==curPunc)pushContext(e,t.column(),"]");else if("("==curPunc)pushContext(e,t.column(),")");else if("}"==curPunc){for(;"statement"==n.type;)n=popContext(e);for("}"==n.type&&(n=popContext(e));"statement"==n.type;)n=popContext(e);}else curPunc==n.type?popContext(e):(("}"==n.type||"top"==n.type)&&";"!=curPunc||"statement"==n.type&&"newstatement"==curPunc)&&pushContext(e,t.column(),"statement");else popContext(e);return e.startOfLine=!1,r},languageData:{indentOnInput:/^\s*[{}]$/,commentTokens:{line:"//",block:{open:"/*",close:"*/"}},autocomplete:wordList}};

export { ttcn };
