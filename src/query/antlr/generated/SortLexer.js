// Generated from src/query/antlr/Sort.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0002\b\u0092\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e",
    "\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t!\u0003\u0002\u0003\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0004\u0006\u0004N\n\u0004\r\u0004\u000e\u0004O\u0003",
    "\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0007\u0005V\n\u0005\f\u0005",
    "\u000e\u0005Y\u000b\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003",
    "\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003",
    "\u000b\u0003\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003",
    "\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003",
    "\u0012\u0003\u0012\u0003\u0013\u0003\u0013\u0003\u0014\u0003\u0014\u0003",
    "\u0015\u0003\u0015\u0003\u0016\u0003\u0016\u0003\u0017\u0003\u0017\u0003",
    "\u0018\u0003\u0018\u0003\u0019\u0003\u0019\u0003\u001a\u0003\u001a\u0003",
    "\u001b\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001d\u0003\u001d\u0003",
    "\u001e\u0003\u001e\u0003\u001f\u0003\u001f\u0003 \u0003 \u0003!\u0003",
    "!\u0002\u0002\"\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007",
    "\r\b\u000f\u0002\u0011\u0002\u0013\u0002\u0015\u0002\u0017\u0002\u0019",
    "\u0002\u001b\u0002\u001d\u0002\u001f\u0002!\u0002#\u0002%\u0002\'\u0002",
    ")\u0002+\u0002-\u0002/\u00021\u00023\u00025\u00027\u00029\u0002;\u0002",
    "=\u0002?\u0002A\u0002\u0003\u0002\u001f\u0005\u0002\u000b\f\u000f\u000f",
    "\"\"\u0006\u0002%%C\\aac|\u0007\u0002%&2;B\\aac|\u0004\u0002CCcc\u0004",
    "\u0002DDdd\u0004\u0002EEee\u0004\u0002FFff\u0004\u0002GGgg\u0004\u0002",
    "HHhh\u0004\u0002IIii\u0004\u0002JJjj\u0004\u0002KKkk\u0004\u0002LLl",
    "l\u0004\u0002MMmm\u0004\u0002NNnn\u0004\u0002OOoo\u0004\u0002PPpp\u0004",
    "\u0002QQqq\u0004\u0002RRrr\u0004\u0002SSss\u0004\u0002TTtt\u0004\u0002",
    "UUuu\u0004\u0002VVvv\u0004\u0002WWww\u0004\u0002XXxx\u0004\u0002YYy",
    "y\u0004\u0002ZZzz\u0004\u0002[[{{\u0004\u0002\\\\||y\u0002\u0003\u0003",
    "\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003",
    "\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003",
    "\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0003C\u0003\u0002",
    "\u0002\u0002\u0005G\u0003\u0002\u0002\u0002\u0007M\u0003\u0002\u0002",
    "\u0002\tS\u0003\u0002\u0002\u0002\u000bZ\u0003\u0002\u0002\u0002\r\\",
    "\u0003\u0002\u0002\u0002\u000f^\u0003\u0002\u0002\u0002\u0011`\u0003",
    "\u0002\u0002\u0002\u0013b\u0003\u0002\u0002\u0002\u0015d\u0003\u0002",
    "\u0002\u0002\u0017f\u0003\u0002\u0002\u0002\u0019h\u0003\u0002\u0002",
    "\u0002\u001bj\u0003\u0002\u0002\u0002\u001dl\u0003\u0002\u0002\u0002",
    "\u001fn\u0003\u0002\u0002\u0002!p\u0003\u0002\u0002\u0002#r\u0003\u0002",
    "\u0002\u0002%t\u0003\u0002\u0002\u0002\'v\u0003\u0002\u0002\u0002)x",
    "\u0003\u0002\u0002\u0002+z\u0003\u0002\u0002\u0002-|\u0003\u0002\u0002",
    "\u0002/~\u0003\u0002\u0002\u00021\u0080\u0003\u0002\u0002\u00023\u0082",
    "\u0003\u0002\u0002\u00025\u0084\u0003\u0002\u0002\u00027\u0086\u0003",
    "\u0002\u0002\u00029\u0088\u0003\u0002\u0002\u0002;\u008a\u0003\u0002",
    "\u0002\u0002=\u008c\u0003\u0002\u0002\u0002?\u008e\u0003\u0002\u0002",
    "\u0002A\u0090\u0003\u0002\u0002\u0002CD\u0005\u000f\b\u0002DE\u0005",
    "3\u001a\u0002EF\u0005\u0013\n\u0002F\u0004\u0003\u0002\u0002\u0002G",
    "H\u0005\u0015\u000b\u0002HI\u0005\u0017\f\u0002IJ\u00053\u001a\u0002",
    "JK\u0005\u0013\n\u0002K\u0006\u0003\u0002\u0002\u0002LN\t\u0002\u0002",
    "\u0002ML\u0003\u0002\u0002\u0002NO\u0003\u0002\u0002\u0002OM\u0003\u0002",
    "\u0002\u0002OP\u0003\u0002\u0002\u0002PQ\u0003\u0002\u0002\u0002QR\b",
    "\u0004\u0002\u0002R\b\u0003\u0002\u0002\u0002SW\t\u0003\u0002\u0002",
    "TV\t\u0004\u0002\u0002UT\u0003\u0002\u0002\u0002VY\u0003\u0002\u0002",
    "\u0002WU\u0003\u0002\u0002\u0002WX\u0003\u0002\u0002\u0002X\n\u0003",
    "\u0002\u0002\u0002YW\u0003\u0002\u0002\u0002Z[\u0007=\u0002\u0002[\f",
    "\u0003\u0002\u0002\u0002\\]\u0007.\u0002\u0002]\u000e\u0003\u0002\u0002",
    "\u0002^_\t\u0005\u0002\u0002_\u0010\u0003\u0002\u0002\u0002`a\t\u0006",
    "\u0002\u0002a\u0012\u0003\u0002\u0002\u0002bc\t\u0007\u0002\u0002c\u0014",
    "\u0003\u0002\u0002\u0002de\t\b\u0002\u0002e\u0016\u0003\u0002\u0002",
    "\u0002fg\t\t\u0002\u0002g\u0018\u0003\u0002\u0002\u0002hi\t\n\u0002",
    "\u0002i\u001a\u0003\u0002\u0002\u0002jk\t\u000b\u0002\u0002k\u001c\u0003",
    "\u0002\u0002\u0002lm\t\f\u0002\u0002m\u001e\u0003\u0002\u0002\u0002",
    "no\t\r\u0002\u0002o \u0003\u0002\u0002\u0002pq\t\u000e\u0002\u0002q",
    "\"\u0003\u0002\u0002\u0002rs\t\u000f\u0002\u0002s$\u0003\u0002\u0002",
    "\u0002tu\t\u0010\u0002\u0002u&\u0003\u0002\u0002\u0002vw\t\u0011\u0002",
    "\u0002w(\u0003\u0002\u0002\u0002xy\t\u0012\u0002\u0002y*\u0003\u0002",
    "\u0002\u0002z{\t\u0013\u0002\u0002{,\u0003\u0002\u0002\u0002|}\t\u0014",
    "\u0002\u0002}.\u0003\u0002\u0002\u0002~\u007f\t\u0015\u0002\u0002\u007f",
    "0\u0003\u0002\u0002\u0002\u0080\u0081\t\u0016\u0002\u0002\u00812\u0003",
    "\u0002\u0002\u0002\u0082\u0083\t\u0017\u0002\u0002\u00834\u0003\u0002",
    "\u0002\u0002\u0084\u0085\t\u0018\u0002\u0002\u00856\u0003\u0002\u0002",
    "\u0002\u0086\u0087\t\u0019\u0002\u0002\u00878\u0003\u0002\u0002\u0002",
    "\u0088\u0089\t\u001a\u0002\u0002\u0089:\u0003\u0002\u0002\u0002\u008a",
    "\u008b\t\u001b\u0002\u0002\u008b<\u0003\u0002\u0002\u0002\u008c\u008d",
    "\t\u001c\u0002\u0002\u008d>\u0003\u0002\u0002\u0002\u008e\u008f\t\u001d",
    "\u0002\u0002\u008f@\u0003\u0002\u0002\u0002\u0090\u0091\t\u001e\u0002",
    "\u0002\u0091B\u0003\u0002\u0002\u0002\u0005\u0002OW\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function SortLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

SortLexer.prototype = Object.create(antlr4.Lexer.prototype);
SortLexer.prototype.constructor = SortLexer;

SortLexer.EOF = antlr4.Token.EOF;
SortLexer.ASC = 1;
SortLexer.DESC = 2;
SortLexer.SPACE = 3;
SortLexer.ID = 4;
SortLexer.SEMICOLON = 5;
SortLexer.COMMA = 6;


SortLexer.modeNames = [ "DEFAULT_MODE" ];

SortLexer.literalNames = [ 'null', 'null', 'null', 'null', 'null', "';'", 
                           "','" ];

SortLexer.symbolicNames = [ 'null', "ASC", "DESC", "SPACE", "ID", "SEMICOLON", 
                            "COMMA" ];

SortLexer.ruleNames = [ "ASC", "DESC", "SPACE", "ID", "SEMICOLON", "COMMA", 
                        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                        "U", "V", "W", "X", "Y", "Z" ];

SortLexer.grammarFileName = "Sort.g4";



exports.SortLexer = SortLexer;

