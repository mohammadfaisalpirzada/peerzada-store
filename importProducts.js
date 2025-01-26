"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var client_1 = require("@sanity/client");
var sanityClient = require('@sanity/client');
// Initialize the Sanity client
var client = (0, client_1.createClient)({
    projectId: 'k5n7yxex', // Replace with your projectId
    dataset: 'production', // Replace with your dataset name (e.g., 'production')
    apiVersion: '2025-01-01', // Use a valid API version
    token: 'skKzAPpaU7O6YMmrMzKH23Xl2ovgfp5xIBUkVcVZGeF5rQtIhpzRhF9wuZYRrPfJj4XGl7aTMiiN1qkUaCpkixdc1FZXT9n2WRayRC0k1FbbVfOTCC53yVjYf6GtJlKrfbukc3dzykFu0GDs4z6DpLYxOF91udhlzWrGyz0KxtHbflw86XSz', // Replace with your Sanity API write token
    useCdn: false, // Disable CDN for write operations
});
var fetchAndImportProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, products, _i, products_1, product, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, axios_1.default.get('https://next-ecommerce-template-4.vercel.app/api/product')];
            case 1:
                response = _a.sent();
                products = response.data.products;
                _i = 0, products_1 = products;
                _a.label = 2;
            case 2:
                if (!(_i < products_1.length)) return [3 /*break*/, 5];
                product = products_1[_i];
                return [4 /*yield*/, client.createOrReplace({
                        _type: 'product',
                        _id: product.id,
                        name: product.name,
                        imagePath: product.imagePath,
                        price: parseFloat(product.price),
                        description: product.description,
                        discountPercentage: product.discountPercentage,
                        isFeaturedProduct: product.isFeaturedProduct,
                        stockLevel: product.stockLevel,
                        category: product.category,
                    })];
            case 3:
                _a.sent();
                console.log("Imported product: ".concat(product.name));
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log('All products imported successfully!');
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('Error importing products:', error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
fetchAndImportProducts();
