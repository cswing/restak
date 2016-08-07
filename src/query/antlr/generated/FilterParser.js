// Generated from src/query/antlr/Filter.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var FilterListener = require('./FilterListener').FilterListener;
var grammarFileName = "Filter.g4";

var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0003\u0019N\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0007",
    "\u0003\u001f\n\u0003\f\u0003\u000e\u0003\"\u000b\u0003\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0007\u0004\'\n\u0004\f\u0004\u000e\u0004*\u000b",
    "\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0005\u00054\n\u0005\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0005\u0006:\n\u0006\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0005\u0007?\n\u0007\u0003\b\u0003\b\u0003\t\u0003",
    "\t\u0003\n\u0005\nF\n\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003",
    "\f\u0003\f\u0003\f\u0002\u0002\r\u0002\u0004\u0006\b\n\f\u000e\u0010",
    "\u0012\u0014\u0016\u0002\u0007\u0003\u0002\u0012\u0013\u0003\u0002\u0014",
    "\u0015\u0004\u0002\u0011\u0011\u0016\u0016\u0003\u0002\u0018\u0019\u0003",
    "\u0002\u0005\fI\u0002\u0018\u0003\u0002\u0002\u0002\u0004\u001b\u0003",
    "\u0002\u0002\u0002\u0006#\u0003\u0002\u0002\u0002\b3\u0003\u0002\u0002",
    "\u0002\n9\u0003\u0002\u0002\u0002\f>\u0003\u0002\u0002\u0002\u000e@",
    "\u0003\u0002\u0002\u0002\u0010B\u0003\u0002\u0002\u0002\u0012E\u0003",
    "\u0002\u0002\u0002\u0014I\u0003\u0002\u0002\u0002\u0016K\u0003\u0002",
    "\u0002\u0002\u0018\u0019\u0005\u0004\u0003\u0002\u0019\u001a\u0007\u0002",
    "\u0002\u0003\u001a\u0003\u0003\u0002\u0002\u0002\u001b \u0005\u0006",
    "\u0004\u0002\u001c\u001d\u0007\r\u0002\u0002\u001d\u001f\u0005\u0006",
    "\u0004\u0002\u001e\u001c\u0003\u0002\u0002\u0002\u001f\"\u0003\u0002",
    "\u0002\u0002 \u001e\u0003\u0002\u0002\u0002 !\u0003\u0002\u0002\u0002",
    "!\u0005\u0003\u0002\u0002\u0002\" \u0003\u0002\u0002\u0002#(\u0005\b",
    "\u0005\u0002$%\u0007\u000e\u0002\u0002%\'\u0005\b\u0005\u0002&$\u0003",
    "\u0002\u0002\u0002\'*\u0003\u0002\u0002\u0002(&\u0003\u0002\u0002\u0002",
    "()\u0003\u0002\u0002\u0002)\u0007\u0003\u0002\u0002\u0002*(\u0003\u0002",
    "\u0002\u0002+,\u0005\n\u0006\u0002,-\u0005\u0016\f\u0002-.\u0005\f\u0007",
    "\u0002.4\u0003\u0002\u0002\u0002/0\u0007\u0003\u0002\u000201\u0005\u0004",
    "\u0003\u000212\u0007\u0004\u0002\u000224\u0003\u0002\u0002\u00023+\u0003",
    "\u0002\u0002\u00023/\u0003\u0002\u0002\u00024\t\u0003\u0002\u0002\u0002",
    "5:\u0007\u0013\u0002\u000267\u0007\u0013\u0002\u000278\u0007\u0017\u0002",
    "\u00028:\u0005\n\u0006\u000295\u0003\u0002\u0002\u000296\u0003\u0002",
    "\u0002\u0002:\u000b\u0003\u0002\u0002\u0002;?\u0005\u0010\t\u0002<?",
    "\u0005\u000e\b\u0002=?\u0005\u0012\n\u0002>;\u0003\u0002\u0002\u0002",
    "><\u0003\u0002\u0002\u0002>=\u0003\u0002\u0002\u0002?\r\u0003\u0002",
    "\u0002\u0002@A\t\u0002\u0002\u0002A\u000f\u0003\u0002\u0002\u0002BC",
    "\t\u0003\u0002\u0002C\u0011\u0003\u0002\u0002\u0002DF\u0005\u0014\u000b",
    "\u0002ED\u0003\u0002\u0002\u0002EF\u0003\u0002\u0002\u0002FG\u0003\u0002",
    "\u0002\u0002GH\t\u0004\u0002\u0002H\u0013\u0003\u0002\u0002\u0002IJ",
    "\t\u0005\u0002\u0002J\u0015\u0003\u0002\u0002\u0002KL\t\u0006\u0002",
    "\u0002L\u0017\u0003\u0002\u0002\u0002\b (39>E"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ 'null', "'('", "')'", "'='", "'>'", "'<'", "'<='", 
                     "'>='", "'<>'", "'!='", "'~'", 'null', 'null', 'null', 
                     'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                     "'.'", "'+'", "'-'" ];

var symbolicNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                      'null', 'null', 'null', 'null', "AND", "OR", "NOT", 
                      "SPACE", "DECIMAL", "HEX_ID", "ID", "SINGLE_QUOTED_STRING", 
                      "DOUBLE_QUOTED_STRING", "FLOAT", "DOT", "PLUS", "MINUS" ];

var ruleNames =  [ "parse", "condition", "condition_or", "predicate", "identifier", 
                   "literal", "idLiteral", "stringLiteral", "numericLiteral", 
                   "sign", "comparison_operator" ];

function FilterParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

FilterParser.prototype = Object.create(antlr4.Parser.prototype);
FilterParser.prototype.constructor = FilterParser;

Object.defineProperty(FilterParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

FilterParser.EOF = antlr4.Token.EOF;
FilterParser.T__0 = 1;
FilterParser.T__1 = 2;
FilterParser.T__2 = 3;
FilterParser.T__3 = 4;
FilterParser.T__4 = 5;
FilterParser.T__5 = 6;
FilterParser.T__6 = 7;
FilterParser.T__7 = 8;
FilterParser.T__8 = 9;
FilterParser.T__9 = 10;
FilterParser.AND = 11;
FilterParser.OR = 12;
FilterParser.NOT = 13;
FilterParser.SPACE = 14;
FilterParser.DECIMAL = 15;
FilterParser.HEX_ID = 16;
FilterParser.ID = 17;
FilterParser.SINGLE_QUOTED_STRING = 18;
FilterParser.DOUBLE_QUOTED_STRING = 19;
FilterParser.FLOAT = 20;
FilterParser.DOT = 21;
FilterParser.PLUS = 22;
FilterParser.MINUS = 23;

FilterParser.RULE_parse = 0;
FilterParser.RULE_condition = 1;
FilterParser.RULE_condition_or = 2;
FilterParser.RULE_predicate = 3;
FilterParser.RULE_identifier = 4;
FilterParser.RULE_literal = 5;
FilterParser.RULE_idLiteral = 6;
FilterParser.RULE_stringLiteral = 7;
FilterParser.RULE_numericLiteral = 8;
FilterParser.RULE_sign = 9;
FilterParser.RULE_comparison_operator = 10;

function ParseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_parse;
    return this;
}

ParseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParseContext.prototype.constructor = ParseContext;

ParseContext.prototype.condition = function() {
    return this.getTypedRuleContext(ConditionContext,0);
};

ParseContext.prototype.EOF = function() {
    return this.getToken(FilterParser.EOF, 0);
};

ParseContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterParse(this);
	}
};

ParseContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitParse(this);
	}
};




FilterParser.ParseContext = ParseContext;

FilterParser.prototype.parse = function() {

    var localctx = new ParseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, FilterParser.RULE_parse);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 22;
        this.condition();
        this.state = 23;
        this.match(FilterParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_condition;
    return this;
}

ConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConditionContext.prototype.constructor = ConditionContext;

ConditionContext.prototype.condition_or = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Condition_orContext);
    } else {
        return this.getTypedRuleContext(Condition_orContext,i);
    }
};

ConditionContext.prototype.AND = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(FilterParser.AND);
    } else {
        return this.getToken(FilterParser.AND, i);
    }
};


ConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterCondition(this);
	}
};

ConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitCondition(this);
	}
};




FilterParser.ConditionContext = ConditionContext;

FilterParser.prototype.condition = function() {

    var localctx = new ConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, FilterParser.RULE_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 25;
        this.condition_or();
        this.state = 30;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===FilterParser.AND) {
            this.state = 26;
            this.match(FilterParser.AND);
            this.state = 27;
            this.condition_or();
            this.state = 32;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function Condition_orContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_condition_or;
    return this;
}

Condition_orContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Condition_orContext.prototype.constructor = Condition_orContext;

Condition_orContext.prototype.predicate = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(PredicateContext);
    } else {
        return this.getTypedRuleContext(PredicateContext,i);
    }
};

Condition_orContext.prototype.OR = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(FilterParser.OR);
    } else {
        return this.getToken(FilterParser.OR, i);
    }
};


Condition_orContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterCondition_or(this);
	}
};

Condition_orContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitCondition_or(this);
	}
};




FilterParser.Condition_orContext = Condition_orContext;

FilterParser.prototype.condition_or = function() {

    var localctx = new Condition_orContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, FilterParser.RULE_condition_or);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 33;
        this.predicate();
        this.state = 38;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===FilterParser.OR) {
            this.state = 34;
            this.match(FilterParser.OR);
            this.state = 35;
            this.predicate();
            this.state = 40;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function PredicateContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_predicate;
    return this;
}

PredicateContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PredicateContext.prototype.constructor = PredicateContext;

PredicateContext.prototype.identifier = function() {
    return this.getTypedRuleContext(IdentifierContext,0);
};

PredicateContext.prototype.comparison_operator = function() {
    return this.getTypedRuleContext(Comparison_operatorContext,0);
};

PredicateContext.prototype.literal = function() {
    return this.getTypedRuleContext(LiteralContext,0);
};

PredicateContext.prototype.condition = function() {
    return this.getTypedRuleContext(ConditionContext,0);
};

PredicateContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterPredicate(this);
	}
};

PredicateContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitPredicate(this);
	}
};




FilterParser.PredicateContext = PredicateContext;

FilterParser.prototype.predicate = function() {

    var localctx = new PredicateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, FilterParser.RULE_predicate);
    try {
        this.state = 49;
        switch(this._input.LA(1)) {
        case FilterParser.ID:
            this.enterOuterAlt(localctx, 1);
            this.state = 41;
            this.identifier();
            this.state = 42;
            this.comparison_operator();
            this.state = 43;
            this.literal();
            break;
        case FilterParser.T__0:
            this.enterOuterAlt(localctx, 2);
            this.state = 45;
            this.match(FilterParser.T__0);
            this.state = 46;
            this.condition();
            this.state = 47;
            this.match(FilterParser.T__1);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IdentifierContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_identifier;
    return this;
}

IdentifierContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IdentifierContext.prototype.constructor = IdentifierContext;

IdentifierContext.prototype.ID = function() {
    return this.getToken(FilterParser.ID, 0);
};

IdentifierContext.prototype.DOT = function() {
    return this.getToken(FilterParser.DOT, 0);
};

IdentifierContext.prototype.identifier = function() {
    return this.getTypedRuleContext(IdentifierContext,0);
};

IdentifierContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterIdentifier(this);
	}
};

IdentifierContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitIdentifier(this);
	}
};




FilterParser.IdentifierContext = IdentifierContext;

FilterParser.prototype.identifier = function() {

    var localctx = new IdentifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, FilterParser.RULE_identifier);
    try {
        this.state = 55;
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 51;
            this.match(FilterParser.ID);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 52;
            this.match(FilterParser.ID);
            this.state = 53;
            this.match(FilterParser.DOT);
            this.state = 54;
            this.identifier();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function LiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_literal;
    return this;
}

LiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LiteralContext.prototype.constructor = LiteralContext;

LiteralContext.prototype.stringLiteral = function() {
    return this.getTypedRuleContext(StringLiteralContext,0);
};

LiteralContext.prototype.idLiteral = function() {
    return this.getTypedRuleContext(IdLiteralContext,0);
};

LiteralContext.prototype.numericLiteral = function() {
    return this.getTypedRuleContext(NumericLiteralContext,0);
};

LiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterLiteral(this);
	}
};

LiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitLiteral(this);
	}
};




FilterParser.LiteralContext = LiteralContext;

FilterParser.prototype.literal = function() {

    var localctx = new LiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, FilterParser.RULE_literal);
    try {
        this.state = 60;
        switch(this._input.LA(1)) {
        case FilterParser.SINGLE_QUOTED_STRING:
        case FilterParser.DOUBLE_QUOTED_STRING:
            this.enterOuterAlt(localctx, 1);
            this.state = 57;
            this.stringLiteral();
            break;
        case FilterParser.HEX_ID:
        case FilterParser.ID:
            this.enterOuterAlt(localctx, 2);
            this.state = 58;
            this.idLiteral();
            break;
        case FilterParser.DECIMAL:
        case FilterParser.FLOAT:
        case FilterParser.PLUS:
        case FilterParser.MINUS:
            this.enterOuterAlt(localctx, 3);
            this.state = 59;
            this.numericLiteral();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IdLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_idLiteral;
    return this;
}

IdLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IdLiteralContext.prototype.constructor = IdLiteralContext;

IdLiteralContext.prototype.HEX_ID = function() {
    return this.getToken(FilterParser.HEX_ID, 0);
};

IdLiteralContext.prototype.ID = function() {
    return this.getToken(FilterParser.ID, 0);
};

IdLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterIdLiteral(this);
	}
};

IdLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitIdLiteral(this);
	}
};




FilterParser.IdLiteralContext = IdLiteralContext;

FilterParser.prototype.idLiteral = function() {

    var localctx = new IdLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, FilterParser.RULE_idLiteral);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 62;
        _la = this._input.LA(1);
        if(!(_la===FilterParser.HEX_ID || _la===FilterParser.ID)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function StringLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_stringLiteral;
    return this;
}

StringLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StringLiteralContext.prototype.constructor = StringLiteralContext;

StringLiteralContext.prototype.SINGLE_QUOTED_STRING = function() {
    return this.getToken(FilterParser.SINGLE_QUOTED_STRING, 0);
};

StringLiteralContext.prototype.DOUBLE_QUOTED_STRING = function() {
    return this.getToken(FilterParser.DOUBLE_QUOTED_STRING, 0);
};

StringLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterStringLiteral(this);
	}
};

StringLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitStringLiteral(this);
	}
};




FilterParser.StringLiteralContext = StringLiteralContext;

FilterParser.prototype.stringLiteral = function() {

    var localctx = new StringLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, FilterParser.RULE_stringLiteral);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 64;
        _la = this._input.LA(1);
        if(!(_la===FilterParser.SINGLE_QUOTED_STRING || _la===FilterParser.DOUBLE_QUOTED_STRING)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function NumericLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_numericLiteral;
    return this;
}

NumericLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NumericLiteralContext.prototype.constructor = NumericLiteralContext;

NumericLiteralContext.prototype.DECIMAL = function() {
    return this.getToken(FilterParser.DECIMAL, 0);
};

NumericLiteralContext.prototype.FLOAT = function() {
    return this.getToken(FilterParser.FLOAT, 0);
};

NumericLiteralContext.prototype.sign = function() {
    return this.getTypedRuleContext(SignContext,0);
};

NumericLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterNumericLiteral(this);
	}
};

NumericLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitNumericLiteral(this);
	}
};




FilterParser.NumericLiteralContext = NumericLiteralContext;

FilterParser.prototype.numericLiteral = function() {

    var localctx = new NumericLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, FilterParser.RULE_numericLiteral);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 67;
        _la = this._input.LA(1);
        if(_la===FilterParser.PLUS || _la===FilterParser.MINUS) {
            this.state = 66;
            this.sign();
        }

        this.state = 69;
        _la = this._input.LA(1);
        if(!(_la===FilterParser.DECIMAL || _la===FilterParser.FLOAT)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SignContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_sign;
    return this;
}

SignContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SignContext.prototype.constructor = SignContext;

SignContext.prototype.PLUS = function() {
    return this.getToken(FilterParser.PLUS, 0);
};

SignContext.prototype.MINUS = function() {
    return this.getToken(FilterParser.MINUS, 0);
};

SignContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterSign(this);
	}
};

SignContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitSign(this);
	}
};




FilterParser.SignContext = SignContext;

FilterParser.prototype.sign = function() {

    var localctx = new SignContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, FilterParser.RULE_sign);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 71;
        _la = this._input.LA(1);
        if(!(_la===FilterParser.PLUS || _la===FilterParser.MINUS)) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function Comparison_operatorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = FilterParser.RULE_comparison_operator;
    return this;
}

Comparison_operatorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Comparison_operatorContext.prototype.constructor = Comparison_operatorContext;


Comparison_operatorContext.prototype.enterRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.enterComparison_operator(this);
	}
};

Comparison_operatorContext.prototype.exitRule = function(listener) {
    if(listener instanceof FilterListener ) {
        listener.exitComparison_operator(this);
	}
};




FilterParser.Comparison_operatorContext = Comparison_operatorContext;

FilterParser.prototype.comparison_operator = function() {

    var localctx = new Comparison_operatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, FilterParser.RULE_comparison_operator);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 73;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << FilterParser.T__2) | (1 << FilterParser.T__3) | (1 << FilterParser.T__4) | (1 << FilterParser.T__5) | (1 << FilterParser.T__6) | (1 << FilterParser.T__7) | (1 << FilterParser.T__8) | (1 << FilterParser.T__9))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.FilterParser = FilterParser;
