function run_tests() {

    // Arithmetic
    function close_enough(x, y) {
        return !(Math.abs(x - y) > 0.000000001);
    }

    test( "addition", function() {
        equal( 1+1, exec("(+ 1 1)"), "Passed!" );
        equal( 10 + -16, exec("(+ 10 -16)"), "Passed!" );
        equal( (5 + 5.54) + -16, exec("(+ (+ 5 5.54) -16)"), "Passed!" );
    });

    test( "subtraction", function() {
        equal( 1 - 1, exec("(- 1 1)"), "Passed!" );
        equal( -7 - -34, exec("(- -7 -34)"), "Passed!" );
        equal( (2039.32 - 4311) - -198991, exec("(- (- 2039.32 4311) -198991)"), "Passed!" );
    });

    test( "multiplication", function() {
        equal( 1 * 1, exec("(* 1 1)"), "Passed!" );
        equal( 542 * (9663 * 3.124), exec("(* 542 9663 3.124)"), "Passed!" );
        equal( 1 * 1, exec("(* 1 1)"), "Passed!" );
    });

    test( "division", function() {
        equal( 1/1, exec("(/ 1 1)"), "Passed!" );
        equal( 10/2, exec("(/ 10 2)"), "Passed!" );
        equal( (32/543)/298, exec("(/ 32 543 298)"), "Passed!" );
    });

    test( "mixed arithmetic", function() {
        ok( close_enough((4 * (65/12)) + (65 - 4 * 2), exec("(+ (* 4 (/ 65 12)) (- 65 (* 4 2)))")), "Passed!" );
    });

    // Keywords

    test( "quote", function() {
        var testScheme = exec("(quote (1 2 3))");
        equal("(1 2 3)", testScheme, "Passed!");

        equal("hello",exec("(quote hello)"), "Passed!")
    });

    test( "if", function() {
        equal(42,exec("(if (= 1 1) 42 (quote nope))"), "If?")
    });

    test( "begin", function() {
        equal(30,exec("(begin (+ 3 2) (- 4 3) (* 5 6))"))
    });

    test( "define and set!", function() {
        exec("(define x 3)");
        equal(6, exec("(+ x x)"), "Define");
        exec("(set! x 6)");
        equal(12, exec("(+ x x)"), "Set!");
        init_env();
    });

    test( "lambda and let", function() {
        equal(3, exec("((lambda (n m) (+ n m)) 1 2)"), "lambda")
        equal(3, exec("(let ((n 1) (m 2)) (+ n m))"), "let")
    });

    test( "closure", function() {
         exec("(define add2 (lambda (n) (+ n 2)))");
         equal(6, exec("(let ((n 4)) (add2 n))"), "closure");
         init_env();
    });
}

