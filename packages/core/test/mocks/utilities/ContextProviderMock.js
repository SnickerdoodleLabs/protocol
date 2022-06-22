"use strict";
exports.__esModule = true;
exports.ContextProviderMock = void 0;
var objects_1 = require("@core/interfaces/objects");
var neverthrow_1 = require("neverthrow");
var rxjs_1 = require("rxjs");
var ContextProviderMock = /** @class */ (function () {
    function ContextProviderMock(context) {
        var _this = this;
        if (context === void 0) { context = null; }
        this.onControlClaimedActivations = [];
        this.setContextValues = new Array();
        this.onControlClaimed = new rxjs_1.Subject();
        this.onControlClaimed.subscribe(function (val) {
            _this.onControlClaimedActivations.push(val);
        });
        if (context != null) {
            this.context = context;
        }
        else {
            this.context = new objects_1.CoreContext();
        }
    }
    ContextProviderMock.prototype.getContext = function () {
        return (0, neverthrow_1.okAsync)(this.context);
    };
    ContextProviderMock.prototype.setContext = function (context) {
        this.setContextValues.push(context);
        return (0, neverthrow_1.okAsync)(null).map(function () { });
    };
    ContextProviderMock.prototype.assertEventCounts = function (expectedCounts) {
        var counts = {
            onControlClaimed: 0
        };
        // Merge the passed in counts with the basic counts
        Object.assign(counts, expectedCounts);
        expect(this.onControlClaimedActivations.length).toBe(counts.onControlClaimed);
        // Add a new claim for each event
        expect(this.onControlClaimedActivations.length).toBe(counts.onControlClaimed);
    };
    return ContextProviderMock;
}());
exports.ContextProviderMock = ContextProviderMock;
