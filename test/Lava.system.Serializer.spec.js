
//var expect = require('chai').expect;
Lava.init();

describe("Lava.system.Serializer", function() {

    var serializer = new Lava.system.Serializer({
        allow_dates_serialization: true
    });

    function transform(original_object) {

        return eval('(' + serializer.serialize(original_object) + ')');

    }

    it("Serializes basic types correctly", function() {

        var original_object = {
            boolean: true,
            string: "test",
            number: 1,
            'null': null,
            'undefined': undefined
        };
        var reconstructed_object = transform(original_object);

        for (var name in original_object) {
            assert.equal(original_object[name], reconstructed_object[name]);
        }

    });

    it("Serializes dates", function() {

        var date = new Date();
        var reconstructed_date = transform(date);
        assert(reconstructed_date instanceof Date);
        assert.equal(+reconstructed_date, +date);

    });

});
