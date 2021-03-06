"use strict";
var constants_1 = require("../../../constants");
var success_1 = require("./success");
var ava_1 = require("ava");
var config = {
    key: constants_1.default.DEFAULT_KEY,
    resourceName: "users",
};
var subject = constants_1.default.REDUCER_NAMES.UPDATE_SUCCESS;
function getCurrent() {
    return [
        {
            id: 1,
            name: "Blue",
            unsaved: true,
            busy: true,
        }, {
            id: 2,
            name: "Red",
            unsaved: true,
            busy: true,
        }
    ];
}
function getValid() {
    return {
        id: 2,
        name: "Green"
    };
}
ava_1.default(subject + "throws if given an array", function (t) {
    var curr = getCurrent();
    var record = [];
    function fn() {
        success_1.default(config, curr, record);
    }
    t.throws(fn, TypeError);
});
ava_1.default(subject + "adds the record if not there", function (t) {
    var curr = getCurrent();
    var record = {
        id: 3,
        name: "Green"
    };
    var updated = success_1.default(config, curr, record);
    t.is(updated.length, 3);
});
ava_1.default(subject + "doesnt mutate the original collection", function (t) {
    var curr = getCurrent();
    var record = {
        id: 3,
        name: "Green"
    };
    var updated = success_1.default(config, curr, record);
    t.is(curr.length, 2);
    t.is(updated.length, 3);
});
ava_1.default(subject + "updates existing", function (t) {
    var curr = getCurrent();
    var record = getValid();
    var updated = success_1.default(config, curr, record);
    t.is(updated.length, 2);
    t.is(updated[1].id, 2);
    t.is(updated[1].name, "Green");
});
ava_1.default(subject + "uses the given key", function (t) {
    var config = {
        key: "_id",
        resourceName: "users",
    };
    var curr = [{
            _id: 2,
            name: "Blue"
        }];
    var record = {
        _id: 2,
        name: "Green"
    };
    var updated = success_1.default(config, curr, record);
    t.is(updated.length, 1);
});
ava_1.default(subject + "it throws when record dont have an id", function (t) {
    var curr = getCurrent();
    var record = {
        name: "Green"
    };
    var f = function () {
        success_1.default(config, curr, record);
    };
    t.throws(f);
});
ava_1.default(subject + "removes busy and pendingUpdate", function (t) {
    var curr = [{
            id: 2,
            name: "Green",
            pendingUpdate: true,
            busy: true,
        }];
    var record = getValid();
    var updated = success_1.default(config, curr, record);
    t.deepEqual(updated.length, 1);
    t.truthy(updated[0].busy == null, "removes busy");
    t.truthy(updated[0].pendingUpdate == null, "removes pendingUpdate");
});
