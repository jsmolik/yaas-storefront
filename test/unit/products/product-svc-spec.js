/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
describe('ProductSvc Test', function () {

    var productUrl = 'http://dummy.product.url';
    var productRoute = '/products';
    var productsRestUrl = 'http://product-v1.test.cf.hybris.com/products';
    var testUrl = productUrl+productRoute;
    var $scope, $rootScope, $httpBackend, productSvc;
    var mockedStoreConfig = {};


    var prodList = [
        {name: 'Shirt'},
        {name: 'Hat'}
    ];

    beforeEach(angular.mock.module('ds.products', function ($provide) {
        $provide.value('storeConfig', mockedStoreConfig);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _ProductSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            productSvc = _ProductSvc_;
        });
    });


    it('query returns product array', function () {
        $httpBackend.expectGET(productsRestUrl).respond(prodList);

        var products = productSvc.query();

        $httpBackend.flush();
        expect(products.$object.length).toBeDefined();
        expect(products.$object.length).toEqual(prodList.length);
        for (var i = 0, prod; i < products.$object.length; i++) {
            prod = products.$object[i];
            expect(prod.name).toEqualData(prodList[i].name);
        };
    });

     it('queryWithResultHandler with success handler invokes callback on resolved promise', function () {
         var products;
         $httpBackend.expectGET(productsRestUrl).respond(prodList);

         var myCallback = function(result) {
             products = result;
         }

         productSvc.queryWithResultHandler({}, myCallback);
         $httpBackend.flush();
         expect(products.$object.length).toBeDefined();
         expect(products.$object.length).toEqual(prodList.length);
         for (var i = 0, prod; i < products.$object.length; i++) {
             prod = products.$object[i];
             expect(prod.name).toEqualData(prodList[i].name);
         };
     });

});
