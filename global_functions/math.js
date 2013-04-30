function sum(x) {
    var result = 0;
    for (var i = x.length - 1; i >= 0; i--) {
        result += x[i];
    };
    return result;
}
function minus(x) {
    var result = x.shift();
    for (var i = 0; i < x.length; i++) {
        result -= x[i];
    };
    return result;
}
function divide(x) {
    var result = x.shift();
    for (var i = 0; i < x.length; i++) {
        result = result * (1/x[i]);
    };
    return result;
}
function multiply(x) {
    var result = 1;
    for (var i = x.length - 1; i >= 0; i--) {
        result = result * x[i];
    };
    return result;
}
function equals(x) {
    argsCheck(2,x);
    return x[0] === x[1];
}
function lt(x) {
    argsCheck(2,x);
    return x[0] < x[1];
}
function gt(x) {
    return x[0] > x[1];
}
function le(x) {
    argsCheck(2,x);
    return x[0] <= x[1];
}
function ge(x) {
    argsCheck(2,x);
    return x[0] >= x[1];
}
function not_equals(x) {
    argsCheck(2,x);
    return x[0] !== x[1];
}
function not(x) {
    argsCheck(1,x);
    return !x[0];
}