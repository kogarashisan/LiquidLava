
Lava._is_initialized || Lava.init();
var TestNamespace = {
    badPath: null
};

describe("Lava.ClassManager", function() {

    Lava.ClassManager.registerRootNamespace('TestNamespace', TestNamespace);

    it("[general]", function() {

        expect(Lava.ClassManager.getClassData("Lava.mixin.Observable")).to.not.equal(null);
        expect(Lava.ClassManager.getAllClasses()["Lava.mixin.Observable"]).to.not.equal(null);

    });

    it("Does not allow nulls in namespace path", function() {

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
        }).to.throw(/class member is hidden/);

    });

	it("Allows nulls in parents to become methods in child", function() {

		Lava.define("TestNamespace.Parent1", {
			test_property: null
		});

		Lava.define("TestNamespace.Child1", {
			Extends: 'TestNamespace.Parent1',
			test_property: function () {}
		});

	});

	it("Does not allow to replace a method from parent with other values", function() {

		Lava.define("TestNamespace.Parent2", {
			test_property: function () {}
		});

		expect(function () {
			Lava.define("TestNamespace.Child2", {
				Extends: 'TestNamespace.Parent2',
				test_property: null
			});
		}).to.throw(/must not become/);

	});

	it("Creates an abstract constructor for abstract classes", function() {

		Lava.define("TestNamespace.AbstractClass", {
			Class: {
				is_abstract: true
			},
			test_property: 'test'
		});

		expect(function() {
			new TestNamespace.AbstractClass();
		}).to.throw(/Trying to create an instance of an abstract class/);

	});

	it("Calls '_afterInit' hook", function() {

		var after_init_spy = chai.spy();

		Lava.define("TestNamespace.ClassWithAfterInit", {
			test: true,
			init: function() {},
			_afterInit: function() {
				after_init_spy();
			}
		});
		new TestNamespace.ClassWithAfterInit();

		after_init_spy.should.have.been.called();

	});

	it("Does not allow calling class constructors without `new` in DEBUG mode", function() {

		Lava.define("TestNamespace.TestClass3", {});

		expect(function() {
			TestNamespace.TestClass3();
		}).to.throw(/Class constructor was called without `new`/);

	});

});