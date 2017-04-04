
Lava._is_initialized || Lava.init();

describe("Lava.mixin.Observable", function() {

	it("Fires and removes a listener", function() {

		var spy = chai.spy();
		var context = {
			callback: function () {
				spy();
			}
		};

		var test = new Lava.mixin.Observable();
		var listener = test.on('test_event', context.callback, context);

		test._fire('test_event');
		test.removeListener(listener);
		test._fire('test_event');
		expect(spy).to.have.been.called.once;

	});

    it("Removes all listeners by context", function() {

        var bad_context = {
            callback: function () {
                throw new Error("This must not be called");
            }
        };

        var spy = chai.spy();
        var good_context = {
            callback: function () {
                spy(); // this must be called
            }
        };

        var test = new Lava.mixin.Observable();
        test.on('test1', bad_context.callback, bad_context);
        test.on('test2', bad_context.callback, bad_context);
        test.on('test2', good_context.callback, good_context);

        expect(function () {
            test._fire("test1");
        }).to.throw(/This must not be called/);

        test.removeAllListenersByContext(bad_context);

        test._fire("test1");
        test._fire("test2");

        spy.should.have.been.called();

    });

    it("Once works correcly", function() {

        var spy = chai.spy();
        var context = {
            callback: function () {
                spy();
            }
        };

        var test = new Lava.mixin.Observable();
        test.once('test_event', context.callback, context);

        test._fire('test_event');
        test._fire('test_event');
        expect(spy).to.have.been.called.once;

    });

});