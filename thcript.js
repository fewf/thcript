// 

//math

var global_bindings =    {  
                        "+":sum, 
                        "-":minus, 
                        "*":multiply, 
                        "/":divide, 
                        "=":equals,
                        "<":lt,
                        ">":gt,
                        "<=":le,
                        ">=":ge,
                        "!=":not_equals,
                        "not":not,
                        "length": function(x)   { argsCheck(1, x); return x[0].length; },
                        "cons": function(x)     { argsCheck(2, x); x[1].unshift(x[0]); return x[1] },
                        "car": function(x)      { argsCheck(1, x); return x[0][0]; },
                        "cdr": function(x)      { argsCheck(1, x); return x[0].slice(1); },
                        "list": function(x)     { return x; },
                        "null?": function(x)    { argsCheck(1, x); return x[0] === []; },
                        "list?": function(x)    { argsCheck(1, x); return x[0] instanceof Array; },
                        "symbol?": function(x)  { argsCheck(1, x); return typeof(x[0]) === "string"; },
                        "append":   function(x) {
                                        var acc = x[0];
                                        for (var i = 1; i < x.length; i++) {
                                            acc = acc.concat(x[i]);
                                        };
                                        return acc; 
                                    }
                        }
//

//Custom Error Handling

function LispError(message) {
    this.name = "Lisp Syntax Error";
    this.message = message || "Something went wrong!";
}

LispError.prototype = new Error();
LispError.prototype.constructor = LispError;

function throwLispError(type) {
    throw new LispError("Ill-formed " + type + " statement.");
}

function argsCheck(n, argsList) {
    if (argsList.length !== n) {
        throw new LispError(
            arguments.callee.caller.name + " takes " + n + " arguments, " + argsList.length + " given."
            )
    }
}

// Environment stuff
function Env(parms, args, outer) {
    parms = (typeof (parms) === "undefined") ? [] : parms;
    args = (typeof (args) === "undefined") ? [] : args;
    outer = (typeof (outer) === "undefined") ? null : outer;

    this.outer = outer;

    for (var i = parms.length - 1; i >= 0; i--) {
        this[parms[i]] = args[i];
    };
}

Env.prototype.find = function(parm) {
    if (this.outer) {
        return (parm in this) ? this : this.outer.find(parm);
    } else {
        if (parm in this) {
            return this;
        } else {
            throw new LispError(parm + " is not defined.");
        }
    }    
}

function init_env() {
    global_env = new Env();

   for (var parm in global_bindings) {
            global_env[parm] = global_bindings[parm];
    }
}

init_env();

// Eval

function eval(x, env) {
    // Evaluate an expression in an environment.
    env = (typeof (env) === "undefined") ? global_env : env;

    if (typeof(x) === "string") {
        return env.find(x)[x];
    } else if (!(x instanceof Array)) {
        return x;
    } else if (x[0] === 'quote') {
        var exp = x[1];
        return exp;
    } else if (x[0] === 'if') {
        if (x.length !== 4) { throwLispError(x[0]); }
        var test = x[1];
        var conseq = x[2];
        var alt = x[3];
        var toEval = eval(test, env) ? conseq : alt;
        return eval(toEval, env);
    } else if (x[0] === "define") {
        if (x.length !== 3) { throwLispError(x[0]); }
        var vrbl = x[1];
        var exp = x[2];
        env[vrbl] = eval(exp, env);
    } else if (x[0] === "begin") {
        var val;
        for (var i = 1; i < x.length; i++) {
            val = eval(x[i], env);
        };
        return val;
    } else if (x[0] === "set!") {
        if (x.length !== 3) { throwLispError(x[0]); }
        var vrbl = x[1];
        var exp = x[2];
        env.find(vrbl)[vrbl] = eval(exp, env);
    } else if (x[0] === "lambda") {
        var vrbl = x[1];
        var exp = x[2];
        return function (args) { return eval(exp, new Env(vrbl, args, env)); };    
    } else if (x[0] === "let") {
        var bindings = x[1];
        var exp = x[2];
        var parms = [];
        var args = [];
        for (var i = bindings.length - 1; i >= 0; i--) {
            if (bindings[i].length !== 2) { throwLispError(x[0]); }
            parms.push(bindings[i][0]);
            args.push(bindings[i][1]);
        };
        return eval(exp, new Env(parms, args, env));
    } else {
        var exps = [];
        for (var i = 0; i < x.length; i++) {
            exps.push(eval(x[i], env));
        };
        var proc = exps.shift();

        return proc(exps);
    }
}

function exec(x) {
    try {
        result = to_string(eval(parse(x)));
        if (result === "undefined") result = "";
        return result
    } 
    catch (error) {
        return error.name + ": " + error.message
    }
}

// Parse read and user interaction

function read(s) {
    // read a scheme expression from a string
    return read_from(tokenize(s));
}

parse = read;

function tokenize(s) {
    // convert a string into a list of tokens
    return s.replace(/\s*\(\s*/g, ' ( ').replace(/\s*\)\s*/g, ' ) ').trim().split(/\s+/);
}

function read_from(tokens) {
    // read an expression from a sequence of tokens
    if (tokens.length === 0) {
        return "Error: unexpected EOF while reading";
    }
    var token = tokens.shift();
    if (token === '(') {
        var L = Array();
        while (tokens[0] !== ')') {
            L.push(read_from(tokens));
        }
        tokens.shift();
        return L;
    } else if (token === ')') {
        return "Error: unexpected )";
    } else {
        return atom(token);
    }
}

function atom(token) {
    // numbers become numbers; everything else becomes a symbol
    if (isNaN(token)) {
        return String(token);
    } else {
        return Number(token);
    }
}

function to_string(exp) {
    // Convert an array back into a Lisp-readable string.
    return (exp instanceof Array) ? '(' + exp.map(to_string).join(" ") + ')' : String(exp);
}