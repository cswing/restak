// Generated from src/query/antlr/Sort.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var SortListener = require('./SortListener').SortListener;
var grammarFileName = "Sort.g4";

var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0003\b$\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t\u0004",
    "\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u0013\n\u0003",
    "\f\u0003\u000e\u0003\u0016\u000b\u0003\u0003\u0003\u0005\u0003\u0019",
    "\n\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u0004\u001e\n\u0004",
    "\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0002\u0002",
    "\u0007\u0002\u0004\u0006\b\n\u0002\u0003\u0003\u0002\u0003\u0004!\u0002",
    "\f\u0003\u0002\u0002\u0002\u0004\u000f\u0003\u0002\u0002\u0002\u0006",
    "\u001a\u0003\u0002\u0002\u0002\b\u001f\u0003\u0002\u0002\u0002\n!\u0003",
    "\u0002\u0002\u0002\f\r\u0005\u0004\u0003\u0002\r\u000e\u0007\u0002\u0002",
    "\u0003\u000e\u0003\u0003\u0002\u0002\u0002\u000f\u0014\u0005\u0006\u0004",
    "\u0002\u0010\u0011\u0007\u0007\u0002\u0002\u0011\u0013\u0005\u0006\u0004",
    "\u0002\u0012\u0010\u0003\u0002\u0002\u0002\u0013\u0016\u0003\u0002\u0002",
    "\u0002\u0014\u0012\u0003\u0002\u0002\u0002\u0014\u0015\u0003\u0002\u0002",
    "\u0002\u0015\u0018\u0003\u0002\u0002\u0002\u0016\u0014\u0003\u0002\u0002",
    "\u0002\u0017\u0019\u0007\u0007\u0002\u0002\u0018\u0017\u0003\u0002\u0002",
    "\u0002\u0018\u0019\u0003\u0002\u0002\u0002\u0019\u0005\u0003\u0002\u0002",
    "\u0002\u001a\u001d\u0005\b\u0005\u0002\u001b\u001c\u0007\b\u0002\u0002",
    "\u001c\u001e\u0005\n\u0006\u0002\u001d\u001b\u0003\u0002\u0002\u0002",
    "\u001d\u001e\u0003\u0002\u0002\u0002\u001e\u0007\u0003\u0002\u0002\u0002",
    "\u001f \u0007\u0006\u0002\u0002 \t\u0003\u0002\u0002\u0002!\"\t\u0002",
    "\u0002\u0002\"\u000b\u0003\u0002\u0002\u0002\u0005\u0014\u0018\u001d"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ 'null', 'null', 'null', 'null', 'null', "';'", "','" ];

var symbolicNames = [ 'null', "ASC", "DESC", "SPACE", "ID", "SEMICOLON", 
                      "COMMA" ];

var ruleNames =  [ "parse", "condition", "partial", "identifier", "direction" ];

function SortParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

SortParser.prototype = Object.create(antlr4.Parser.prototype);
SortParser.prototype.constructor = SortParser;

Object.defineProperty(SortParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

SortParser.EOF = antlr4.Token.EOF;
SortParser.ASC = 1;
SortParser.DESC = 2;
SortParser.SPACE = 3;
SortParser.ID = 4;
SortParser.SEMICOLON = 5;
SortParser.COMMA = 6;

SortParser.RULE_parse = 0;
SortParser.RULE_condition = 1;
SortParser.RULE_partial = 2;
SortParser.RULE_identifier = 3;
SortParser.RULE_direction = 4;

function ParseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SortParser.RULE_parse;
    return this;
}

ParseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParseContext.prototype.constructor = ParseContext;

ParseContext.prototype.condition = function() {
    return this.getTypedRuleContext(ConditionContext,0);
};

ParseContext.prototype.EOF = function() {
    return this.getToken(SortParser.EOF, 0);
};

ParseContext.prototype.enterRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.enterParse(this);
	}
};

ParseContext.prototype.exitRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.exitParse(this);
	}
};




SortParser.ParseContext = ParseContext;

SortParser.prototype.parse = function() {

    var localctx = new ParseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, SortParser.RULE_parse);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 10;
        this.condition();
        this.state = 11;
        this.match(SortParser.EOF);
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
    this.ruleIndex = SortParser.RULE_condition;
    return this;
}

ConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConditionContext.prototype.constructor = ConditionContext;

ConditionContext.prototype.partial = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(PartialContext);
    } else {
        return this.getTypedRuleContext(PartialContext,i);
    }
};

ConditionContext.prototype.SEMICOLON = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(SortParser.SEMICOLON);
    } else {
        return this.getToken(SortParser.SEMICOLON, i);
    }
};


ConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.enterCondition(this);
	}
};

ConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.exitCondition(this);
	}
};




SortParser.ConditionContext = ConditionContext;

SortParser.prototype.condition = function() {

    var localctx = new ConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, SortParser.RULE_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 13;
        this.partial();
        this.state = 18;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 14;
                this.match(SortParser.SEMICOLON);
                this.state = 15;
                this.partial(); 
            }
            this.state = 20;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 22;
        _la = this._input.LA(1);
        if(_la===SortParser.SEMICOLON) {
            this.state = 21;
            this.match(SortParser.SEMICOLON);
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

function PartialContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SortParser.RULE_partial;
    return this;
}

PartialContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PartialContext.prototype.constructor = PartialContext;

PartialContext.prototype.identifier = function() {
    return this.getTypedRuleContext(IdentifierContext,0);
};

PartialContext.prototype.COMMA = function() {
    return this.getToken(SortParser.COMMA, 0);
};

PartialContext.prototype.direction = function() {
    return this.getTypedRuleContext(DirectionContext,0);
};

PartialContext.prototype.enterRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.enterPartial(this);
	}
};

PartialContext.prototype.exitRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.exitPartial(this);
	}
};




SortParser.PartialContext = PartialContext;

SortParser.prototype.partial = function() {

    var localctx = new PartialContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, SortParser.RULE_partial);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 24;
        this.identifier();
        this.state = 27;
        _la = this._input.LA(1);
        if(_la===SortParser.COMMA) {
            this.state = 25;
            this.match(SortParser.COMMA);
            this.state = 26;
            this.direction();
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
    this.ruleIndex = SortParser.RULE_identifier;
    return this;
}

IdentifierContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IdentifierContext.prototype.constructor = IdentifierContext;

IdentifierContext.prototype.ID = function() {
    return this.getToken(SortParser.ID, 0);
};

IdentifierContext.prototype.enterRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.enterIdentifier(this);
	}
};

IdentifierContext.prototype.exitRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.exitIdentifier(this);
	}
};




SortParser.IdentifierContext = IdentifierContext;

SortParser.prototype.identifier = function() {

    var localctx = new IdentifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, SortParser.RULE_identifier);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 29;
        this.match(SortParser.ID);
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

function DirectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SortParser.RULE_direction;
    return this;
}

DirectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DirectionContext.prototype.constructor = DirectionContext;

DirectionContext.prototype.ASC = function() {
    return this.getToken(SortParser.ASC, 0);
};

DirectionContext.prototype.DESC = function() {
    return this.getToken(SortParser.DESC, 0);
};

DirectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.enterDirection(this);
	}
};

DirectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof SortListener ) {
        listener.exitDirection(this);
	}
};




SortParser.DirectionContext = DirectionContext;

SortParser.prototype.direction = function() {

    var localctx = new DirectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, SortParser.RULE_direction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 31;
        _la = this._input.LA(1);
        if(!(_la===SortParser.ASC || _la===SortParser.DESC)) {
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


exports.SortParser = SortParser;
