grammar Query;

parse  
    : condition EOF
    ;

condition
	: condition_or (AND condition_or)*
	;

condition_or
	: predicate (OR predicate)*
	;

predicate
	: identifier comparison_operator literal
	| '(' condition ')'
	;

identifier
	: ID
	| ID DOT identifier
	;

literal
	: stringLiteral
	| idLiteral
	| numericLiteral
//	| '(' literal ')'	
	;

idLiteral
	: HEX_ID 
	| ID
	;
	
stringLiteral
	: SINGLE_QUOTED_STRING
	| DOUBLE_QUOTED_STRING
	;
 	
numericLiteral
	: sign? (DECIMAL | FLOAT)
	;

sign
	: PLUS
	| MINUS
	;

comparison_operator
	: '=' | '>' | '<' | '<=' | '>=' | '<>' | '!=' | '~'
	;

//Lexer

// Keywords
AND:					A N D;
OR:						O R;
NOT: 					N O T;

SPACE:					[ \t\r\n]+	-> skip;

DECIMAL:				DEC_DIGIT+;
HEX_ID: 				HEX_DIGIT+;
ID:						[a-zA-Z_#][a-zA-Z_#$@0-9]*;
SINGLE_QUOTED_STRING:  	'\'' ( '\\\'' | ~('\r' | '\n') )*? '\''; 
DOUBLE_QUOTED_STRING: 	 '"' (~('"' | '\\' | '\r' | '\n') | '\\' ('"' | '\\'))* '"';
FLOAT:					DEC_DOT_DEC;

DOT:					'.';
PLUS:					'+';
MINUS:					'-';

fragment LETTER:       [a-zA-Z_];
fragment DEC_DOT_DEC:  (DEC_DIGIT+ '.' DEC_DIGIT+ |  DEC_DIGIT+ '.' | '.' DEC_DIGIT+);
fragment HEX_DIGIT:    [0-9A-Fa-f];
fragment DEC_DIGIT:    [0-9];

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