"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.BlockchainListener = void 0;
var inversify_1 = require("inversify");
var neverthrow_1 = require("neverthrow");
var utilities_1 = require("@query-engine/interfaces/utilities");
var business_1 = require("@query-engine/interfaces/business");
// Listen to events on blockchain
// Listen to events on consent contract
// Config - same as context but immutable, what vlaues are you viewing against
// Context - Global data / runtime
// @injectable - dependency injection: useful for testing, when dependencies can be mocked or stubbed out
// compiling nodes
// tsc filename
var BlockchainListener = /** @class */ (function () {
    function BlockchainListener(queryService, blockchainProvider, configProvider, contextProvider, logUtils) {
        this.queryService = queryService;
        this.blockchainProvider = blockchainProvider;
        this.configProvider = configProvider;
        this.contextProvider = contextProvider;
        this.logUtils = logUtils;
        this.mainProviderInitialized = false;
    }
    BlockchainListener.prototype.initialize = function () {
        var _this = this;
        return (0, neverthrow_1.combine)([
            this.blockchainProvider.getProvider(),
            this.contextProvider.getContext(),
        ]).map(function (_a) {
            var provider = _a[0], context = _a[1];
            if (_this.mainProviderInitialized === false) {
                //this.initializeMainProviderEvents(provider, context);
            }
        });
    };
    BlockchainListener = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(business_1.IQueryServiceType)),
        __param(1, (0, inversify_1.inject)(utilities_1.IBlockchainProviderType)),
        __param(2, (0, inversify_1.inject)(utilities_1.IConfigProviderType)),
        __param(3, (0, inversify_1.inject)(utilities_1.IContextProviderType)),
        __param(4, (0, inversify_1.inject)(utilities_1.ILogUtilsType))
    ], BlockchainListener);
    return BlockchainListener;
}());
exports.BlockchainListener = BlockchainListener;
