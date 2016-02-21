grammar Query;

parse  
    : predicate EOF
    ;

//condition
//	: predicate
//	;

//condition
//	: condition_or (AND condition_or)*
//	;

//condition_or
//	: condition_not (OR condition_not)*
//	;

//condition_not
//	: NOT? predicate
//	;

predicate
	: identifier comparison_operator literal
	;

//expression
//	: STRING
//	| ID
//	| number
//	| '(' expression ')'
//	;

//expression_list
//    : expression (',' expression)*
//	;

identifier
	: ID
	| ID DOT identifier
	;

literal
	: identifier
	| stringLiteral
	| numericLiteral
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

//AND:					A N D;
//OR:						O R;

ID:						[a-zA-Z_#][a-zA-Z_#$@0-9]*;
DECIMAL:				DECIMAL_DIGIT+;
FLOAT:					DEC_DOT_DEC;
PLUS:					'+';
MINUS:					'-';
DOT:					'.';
SPACE:					[ \t\r\n]+	-> skip;

fragment DECIMAL_DIGIT
	: [0-9]
	;

fragment DEC_DOT_DEC
	: (DECIMAL_DIGIT+ '.' DECIMAL_DIGIT+ |  DECIMAL_DIGIT+ '.' | '.' DECIMAL_DIGIT+)
	;