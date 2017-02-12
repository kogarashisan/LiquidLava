
Lava.init && Lava.init();
var TestNamespace = {
    badPath: null
};

describe("Lava.ClassManager", function() {

    Lava.ClassManager.registerRootNamespace('TestNamespace', TestNamespace);

    it("[general]", function() {

        expect(Lava.ClassManager.getClassData("Lava.mixin.Observable")).to.not.equal(null);
        expect(Lava.ClassManager.getAllClasses()["Lava.mixin.Observable"]).to.not.equal(null);

    });

    it("Does not allow nulls in path", function() {

        expect(function () {
            Lava.ClassManager._getNamespace(['TestNamespace', 'badPath', 'something'])
        }).to.throw(/Namespaces must be objects/);

    });

    // If a class has a member with the same name in prototype and in instance
    // - then member from prototype is hidden by member from instance.
    it("Does not allow member hiding", function() {

        Lava.define("TestNamespace.TestMixin", {
            test_property: {}
        });

        expect(function () {
            Lava.define("TestNamespace.TestTarget", {
                Implements: 'TestNamespace.TestMixin',
                Shared: ['test_property'],
                test_property: {}
            });
        }).to.throw(/Shared class member is hidden/);

    });

});