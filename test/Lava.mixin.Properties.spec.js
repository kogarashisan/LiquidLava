
Lava.init();

describe("Lava.mixin.Properties", function() {

    it("Once property listener works correcly", function() {

        var spy = chai.spy();
        var context = {
            callback: function () {
                spy();
            }
        };

        var test = new Lava.mixin.Properties({
            test_property: true
        });
        test.oncePropertyChanged('test_property', context.callback, context);

        test.set('test_property', false);
        test.set('test_property', "test");
        expect(spy).to.have.been.called.once;

    });

});