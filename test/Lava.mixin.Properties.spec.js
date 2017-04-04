
Lava._is_initialized || Lava.init();

describe("Lava.mixin.Properties", function() {

	it("Fires and removes property listener", function() {

		var spy = chai.spy();
		var context = {
			callback: function() {
				spy();
			}
		};

		var test = new Lava.mixin.Properties({
			test_property: 1
		});
		var listener = test.onPropertyChanged('test_property', context.callback, context);

		test.set('test_property', 2);
		test.removeListener(listener);
		test.set('test_property', 3);
		expect(spy).to.have.been.called.once;

	});

    it("Once property listener works correcly", function() {

        var spy = chai.spy();
        var context = {
            callback: function() {
                spy();
            }
        };

        var test = new Lava.mixin.Properties({
            test_property: 1
        });
        test.oncePropertyChanged('test_property', context.callback, context);

        test.set('test_property', 2);
        test.set('test_property', 3);
        expect(spy).to.have.been.called.once;

    });

});