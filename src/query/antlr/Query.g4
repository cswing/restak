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
	: singleQuotedString
	| doubleQuotedString
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

doubleQuotedString
	: '"' (~('"' | '\\' | '\r' | '\n') | '\\' ('"' | '\\'))* '"'
	;

singleQuotedString
	: '\'' ( '\\\'' | ~('\r' | '\n') )*? '\''
	;

//Lexer

// Keywords
AND:					A N D;
OR:						O R;
NOT: 					N O T;

HEX_ID: 				HEX_DIGIT+;
ID:						[a-zA-Z_#][a-zA-Z_#$@0-9]*;
DECIMAL:				DECIMAL_DIGIT+;
FLOAT:					DEC_DOT_DEC;
PLUS:					'+';
MINUS:					'-';

DOT:					'.';
SPACE:					[ \t\r\n]+	-> skip;

fragment HEX_DIGIT:    [0-9A-Fa-f];

fragment DECIMAL_DIGIT
	: [0-9]
	;

fragment DEC_DOT_DEC
	: (DECIMAL_DIGIT+ '.' DECIMAL_DIGIT+ |  DECIMAL_DIGIT+ '.' | '.' DECIMAL_DIGIT+)
	;

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