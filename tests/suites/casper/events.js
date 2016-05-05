/*eslint strict:0*/
casper.test.begin('events', 2, function(test) {
    casper.plopped = false;
    casper.once("plop", function() {
        this.plopped = true;
    });
    test.assert(Object.keys(casper._events).some(function(i) {
        return i === "plop";
    }), "on() has set an event handler");
    casper.emit("plop");
    test.assert(casper.plopped, "emit() emits an event");
    test.done();
});

casper.test.begin('filters', 3, function(test) {
    casper.foo = 0;
    casper.setFilter("test", function(a) {
        this.foo = 42;
        return a + 1;
    });
    test.assert(Object.keys(casper._filters).some(function(i) {
        return i === "test";
    }), "setFilter() has set a filter");
    test.assertEquals(casper.filter("test", 1), 2, "filter() filters a value");
    test.assertEquals(casper.foo, 42, "filter() applies the correct context");
    delete casper.foo;
    test.done();
});

casper.test.begin('events order', 2, function(test) {
    casper.mooed = "Moo";
    casper.on("mooed", function() {
        this.mooed = casper.mooed + " Moo";
    });
    casper.emit("mow");
    test.assertEquals(casper.mowed, "Moo Moo", "mooed has the correct value");

    casper.prependListener("mow", function() {
        this.mooed = this.mooed + " Boo";
    });
    casper.emit("mow");
    test.assertEquals(casper.mowed, "Moo Moo Boo Moo", "mowed has the correct value");
    test.done();
});
