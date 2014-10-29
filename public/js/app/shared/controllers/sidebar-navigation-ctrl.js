'use strict';

angular.module('ds.shared')
/** Handles interactions in the navigation side bar.   */


    .controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc',

        function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.currencies = GlobalData.getAvailableCurrencies();
            $scope.currency = { selected: GlobalData.getCurrency() };

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            $scope.language = { selected: { iso: GlobalData.getLanguageCode(), value: GlobalData.getLanguageCode() }};
            $scope.languages = GlobalData.getAvailableLanguages().map(function(lang) { return { iso:  lang.id, value: lang.id }; });

            function loadCategories(){
                CategorySvc.getCategories().then(function(categories){
                    $scope.categories = categories;
                });
            }

            loadCategories();

            function refreshDataOnLanguageChange(){
                if($state.is('base.category') || $state.is('base.product.detail')) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                } else {
                    loadCategories();
                }
            }

            function switchCurrency(currencyId) {
                GlobalData.setCurrency(currencyId);
                if($state.is('base.category') || $state.is('base.product.detail')) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
            }

            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    GlobalData.setLanguage(newValue.iso);
                }
            });

            $scope.$watch('currency.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    switchCurrency(newValue.id);
                }
            });


            // handling currency updates initiated from outside this controller
            var unbindCurrency = $rootScope.$on('currency:updated', function (eve, currencyId) {
                if(currencyId !== $scope.currency.id){
                    $scope.currency.selected = GlobalData.getCurrencyById(currencyId);
                }
            });

            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, newLangCode) {
                if(newLangCode !== $scope.language.selected.iso){
                    $scope.language.selected =  { iso: newLangCode, value: newLangCode };
                }
                refreshDataOnLanguageChange();
            });

            $scope.$on('$destroy', unbindCurrency, unbindLang);

            $scope.logout = function () {
                AuthSvc.signOut();
            };

            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.hideMobileNav = function(){
                $rootScope.showMobileNav = false;
            };

            $scope.myAccount = function() {
                $state.go('base.account');
                $scope.hideMobileNav();
            };

        }]);
