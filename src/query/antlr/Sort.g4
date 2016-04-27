grammar Sort;

parse  
    : condition EOF
    ;

condition
	: partial (SEMICOLON partial)* SEMICOLON?
	;

partial 
	: identifier (COMMA direction)?
	;

identifier
	: ID
	;
	
direction
	: ASC
	| DESC;

ASC: 					A S C;
DESC:					D E S C;

SPACE:					[ \t\r\n]+	-> skip;

ID:						[a-zA-Z_#][a-zA-Z_#$@0-9]*;
SEMICOLON: 				';';
COMMA: 					',';

fragment A: [aA];
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment E: [eE];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment I: [iI];
fragment J: [jJ];
fragment K: [kK];
fragment L: [lL];
fragment M: [mM];
fragment N: [nN];
fragment O: [oO];
fragment P: [pP];
fragment Q: [qQ];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];
fragment X: [xX];
fragment Y: [yY];
fragment Z: [zZ];