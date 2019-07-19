(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@auth0/angular-jwt'), require('@angular/router'), require('@angular/platform-browser'), require('ngx-cookie-service'), require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('gnx-auth', ['exports', '@auth0/angular-jwt', '@angular/router', '@angular/platform-browser', 'ngx-cookie-service', '@angular/core', '@angular/common/http', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global['gnx-auth'] = {}),global.angularJwt,global.ng.router,global.ng.platformBrowser,global.i2,global.ng.core,global.ng.common.http,global.rxjs,global.rxjs.operators));
}(this, (function (exports,angularJwt,i3,platformBrowser,i2,i0,i1,rxjs,operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GnxAuthService = /** @class */ (function () {
        function GnxAuthService(http, cookieService, router, route, env) {
            this.http = http;
            this.cookieService = cookieService;
            this.router = router;
            this.route = route;
            this.env = env;
            this.AUTH_SERVER_TOKEN_ENDPOINT = '/oauth/token';
            this.AUTH_SERVER_LOGIN_ENDPOINT = '/oauth/authorize';
            this.AUTH_SERVER_SIGN_UP_ENDPOINT = '/registration';
            this.AUTH_SERVER_LANGUAGE_ENDPOINT = '/api/accounts/current/locale';
            this.ACCESS_TOKEN_COOKIE_NAME = 'access_token';
            this.REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
            this.COOKIE_PATH = '/';
            this.initialized = false;
            this.jwtHelper = new angularJwt.JwtHelperService();
            this.accessToken$ = new rxjs.ReplaySubject(1);
            this.clientId = env.clientId;
            this.authServerUrl = env.authServerUrl;
            this.cookieDomainName = env.cookieDomainName;
        }
        /**
         * @param {?} translatorService
         * @return {?}
         */
        GnxAuthService.prototype.setTranslatorService = /**
         * @param {?} translatorService
         * @return {?}
         */
            function (translatorService) {
                this.translatorService = translatorService;
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.init = /**
         * @return {?}
         */
            function () {
                // intercept request with 'code' param to get token by the code
                /** @type {?} */
                var matchings = window.location.search.match(/code=(.+?)(&.+)?$/);
                /** @type {?} */
                var code = matchings ? matchings[1] : null;
                if (code) {
                    this.getTokensByCode(code);
                }
                else {
                    this.tryToGetTokensFromCookieOrStorage().subscribe();
                }
                this.initialized = true;
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.getToken = /**
         * @return {?}
         */
            function () {
                if (!this.initialized) {
                    this.init();
                }
                return this.accessToken$.asObservable();
            };
        /**
         * @param {?} code
         * @return {?}
         */
        GnxAuthService.prototype.getTokensByCode = /**
         * @param {?} code
         * @return {?}
         */
            function (code) {
                var _this = this;
                /** @type {?} */
                var params = new URLSearchParams();
                params.append('grant_type', 'authorization_code');
                params.append('client_id', this.clientId);
                params.append('redirect_uri', this.getRedirectUri());
                params.append('code', code);
                /** @type {?} */
                var headers = new i1.HttpHeaders({
                    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
                });
                this.http.post(this.authServerUrl + this.AUTH_SERVER_TOKEN_ENDPOINT, params.toString(), { headers: headers }).subscribe(( /**
                 * @param {?} tokenData
                 * @return {?}
                 */function (tokenData) {
                    _this.saveTokens(tokenData);
                    _this.accessToken$.next(_this.accessToken);
                    _this.removeCodeParamAndNavigateToTheSamePage().then();
                }), ( /**
                 * @param {?} err
                 * @return {?}
                 */function (err) { return _this.accessToken$.next(null); }));
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.getAccessTokenByRefreshToken = /**
         * @return {?}
         */
            function () {
                var _this = this;
                return this.tryToGetTokensFromCookieOrStorage().pipe(operators.switchMap(( /**
                 * @param {?} val
                 * @return {?}
                 */function (val) { return _this.getToken(); })));
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.redirectToLoginPage = /**
         * @return {?}
         */
            function () {
                window.location.href = "" + this.authServerUrl + this.AUTH_SERVER_LOGIN_ENDPOINT +
                    ("?response_type=code&client_id=" + this.clientId + "&redirect_uri=" + this.getRedirectUri());
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.redirectToSignUpPage = /**
         * @return {?}
         */
            function () {
                window.location.href = "" + this.authServerUrl + this.AUTH_SERVER_SIGN_UP_ENDPOINT;
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.logout = /**
         * @return {?}
         */
            function () {
                this.deleteTokens();
                this.accessToken$.next(null);
                this.navigateToTheSamePage().then();
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.retrieveUserLanguageFromServer = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.http.get(this.authServerUrl + this.AUTH_SERVER_LANGUAGE_ENDPOINT)
                    .subscribe(( /**
             * @param {?} res
             * @return {?}
             */function (res) {
                    if (res && res.locale !== _this.translatorService.getCurrentLang().toLowerCase()) {
                        _this.userLanguage = res.locale;
                        _this.translatorService.useLanguage(_this.userLanguage);
                    }
                }));
            };
        /**
         * @return {?}
         */
        GnxAuthService.prototype.setDefaultUserLanguage = /**
         * @return {?}
         */
            function () {
                this.userLanguage = this.translatorService.getCurrentLang();
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.tryToGetTokensFromCookieOrStorage = /**
         * @private
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.isValidToken(this.accessToken)) {
                    this.accessToken$.next(this.accessToken);
                    return rxjs.of(true);
                }
                // look for access_token in cookie
                /** @type {?} */
                var encodedToken = this.cookieService.get(this.ACCESS_TOKEN_COOKIE_NAME);
                /** @type {?} */
                var decodedToken = this.decodeToken(encodedToken);
                if (this.isValidToken(decodedToken)) {
                    this.accessToken = decodedToken;
                    this.accessToken$.next(decodedToken);
                    return rxjs.of(true);
                }
                else {
                    this.removeAccessTokenFromCookie();
                }
                // look for a refresh token in cookie
                /** @type {?} */
                var refreshToken;
                if (this.refreshToken) {
                    refreshToken = this.refreshToken;
                }
                else {
                    refreshToken = this.decodeToken(this.cookieService.get(this.REFRESH_TOKEN_COOKIE_NAME));
                }
                if (this.isValidToken(refreshToken)) {
                    return this.getNewTokensByRefreshToken(refreshToken).pipe(operators.tap(( /**
                     * @param {?} tokenData
                     * @return {?}
                     */function (tokenData) {
                        _this.saveTokens(tokenData);
                        _this.accessToken$.next(_this.accessToken);
                    })), operators.map(( /**
                     * @param {?} tokenData
                     * @return {?}
                     */function (tokenData) { return !!tokenData; })), operators.catchError(( /**
                     * @param {?} err
                     * @return {?}
                     */function (err) {
                        _this.removeRefreshTokenFromCookie();
                        _this.accessToken$.next(null);
                        return rxjs.of(false);
                    })));
                }
                else {
                    this.removeRefreshTokenFromCookie();
                }
                this.accessToken$.next(null);
                return rxjs.of(false);
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.removeCodeParamAndNavigateToTheSamePage = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var queryParams = {};
                /** @type {?} */
                var params = this.route.snapshot.queryParamMap;
                params.keys.forEach(( /**
                 * @param {?} k
                 * @return {?}
                 */function (k) {
                    if (k !== 'code') {
                        queryParams[k] = params.get(k);
                    }
                }));
                /** @type {?} */
                var currentUrlPath = this.getCurrentUrlPath();
                return this.router.navigate([currentUrlPath], {
                    relativeTo: this.route,
                    queryParams: queryParams,
                });
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.navigateToTheSamePage = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var queryParams = {};
                /** @type {?} */
                var params = this.route.snapshot.queryParamMap;
                params.keys.forEach(( /**
                 * @param {?} k
                 * @return {?}
                 */function (k) {
                    queryParams[k] = params.get(k);
                }));
                /** @type {?} */
                var currentUrlPath = this.getCurrentUrlPath();
                return this.router.navigate([currentUrlPath], {
                    relativeTo: this.route,
                    queryParams: queryParams,
                });
            };
        /**
         * @private
         * @param {?} tokenData
         * @return {?}
         */
        GnxAuthService.prototype.saveTokens = /**
         * @private
         * @param {?} tokenData
         * @return {?}
         */
            function (tokenData) {
                if (tokenData) {
                    /** @type {?} */
                    var decodedAccessToken = this.decodeToken(tokenData.access_token);
                    /** @type {?} */
                    var acExpireDate = new Date(decodedAccessToken.exp * 1000);
                    this.cookieService.set(this.ACCESS_TOKEN_COOKIE_NAME, tokenData.access_token, acExpireDate, this.COOKIE_PATH, this.cookieDomainName);
                    this.accessToken = decodedAccessToken;
                    /** @type {?} */
                    var decodedRefreshToken = this.decodeToken(tokenData.refresh_token);
                    /** @type {?} */
                    var rtExpireDate = new Date(decodedRefreshToken.exp * 1000);
                    this.cookieService.set(this.REFRESH_TOKEN_COOKIE_NAME, tokenData.refresh_token, rtExpireDate, this.COOKIE_PATH, this.cookieDomainName);
                    this.refreshToken = this.decodeToken(tokenData.refresh_token);
                }
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.getCurrentUrlPath = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var url = this.router.url;
                if (url.indexOf('?') > 0) {
                    url = url.substr(0, url.indexOf('?'));
                }
                return url;
            };
        /**
         * @private
         * @param {?} refreshToken
         * @return {?}
         */
        GnxAuthService.prototype.getNewTokensByRefreshToken = /**
         * @private
         * @param {?} refreshToken
         * @return {?}
         */
            function (refreshToken) {
                /** @type {?} */
                var headers = new i1.HttpHeaders({
                    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
                });
                /** @type {?} */
                var body = new URLSearchParams();
                body.set('grant_type', 'refresh_token');
                body.set('refresh_token', refreshToken.encodedToken);
                return this.http.post(this.authServerUrl + this.AUTH_SERVER_TOKEN_ENDPOINT, body.toString(), { headers: headers });
            };
        /**
         * @private
         * @param {?} token
         * @return {?}
         */
        GnxAuthService.prototype.isValidToken = /**
         * @private
         * @param {?} token
         * @return {?}
         */
            function (token) {
                if (!token) {
                    return false;
                }
                /** @type {?} */
                var expirationSeconds = token.exp;
                return expirationSeconds && (new Date().getTime() < expirationSeconds * 1000);
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.deleteTokens = /**
         * @private
         * @return {?}
         */
            function () {
                this.removeAccessTokenFromCookie();
                this.accessToken = null;
                this.removeRefreshTokenFromCookie();
                this.refreshToken = null;
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.removeAccessTokenFromCookie = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var cookieValue = this.cookieService.get(this.ACCESS_TOKEN_COOKIE_NAME);
                if (cookieValue) {
                    /** @type {?} */
                    var expireDate = new Date(0);
                    this.cookieService.set(this.ACCESS_TOKEN_COOKIE_NAME, cookieValue, expireDate, this.COOKIE_PATH, this.cookieDomainName);
                }
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.removeRefreshTokenFromCookie = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var cookieValue = this.cookieService.get(this.REFRESH_TOKEN_COOKIE_NAME);
                if (cookieValue) {
                    /** @type {?} */
                    var expireDate = new Date(0);
                    this.cookieService.set(this.REFRESH_TOKEN_COOKIE_NAME, cookieValue, expireDate, this.COOKIE_PATH, this.cookieDomainName);
                }
            };
        /**
         * @private
         * @param {?} encodedToken
         * @return {?}
         */
        GnxAuthService.prototype.decodeToken = /**
         * @private
         * @param {?} encodedToken
         * @return {?}
         */
            function (encodedToken) {
                if (!encodedToken) {
                    return null;
                }
                /** @type {?} */
                var decodedToken = ( /** @type {?} */(this.jwtHelper.decodeToken(encodedToken)));
                if (decodedToken) {
                    decodedToken.encodedToken = encodedToken;
                }
                return decodedToken;
            };
        /**
         * @private
         * @return {?}
         */
        GnxAuthService.prototype.getRedirectUri = /**
         * @private
         * @return {?}
         */
            function () {
                return window.location.href.replace(/^(http[s]?:\/\/[a-zA-Z\\.:0-9]+)(\/.*)$/, '$1');
            };
        GnxAuthService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        GnxAuthService.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: i2.CookieService },
                { type: i3.Router },
                { type: i3.ActivatedRoute },
                { type: undefined, decorators: [{ type: i0.Inject, args: ['env',] }] }
            ];
        };
        /** @nocollapse */ GnxAuthService.ngInjectableDef = i0.defineInjectable({ factory: function GnxAuthService_Factory() { return new GnxAuthService(i0.inject(i1.HttpClient), i0.inject(i2.CookieService), i0.inject(i3.Router), i0.inject(i3.ActivatedRoute), i0.inject("env")); }, token: GnxAuthService, providedIn: "root" });
        return GnxAuthService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AllowNonLoggedUserGuard = /** @class */ (function () {
        function AllowNonLoggedUserGuard(auth, router) {
            this.auth = auth;
            this.router = router;
        }
        /**
         * @return {?}
         */
        AllowNonLoggedUserGuard.prototype.canActivate = /**
         * @return {?}
         */
            function () {
                var _this = this;
                return rxjs.of(null).pipe(operators.switchMap(( /**
                 * @return {?}
                 */function () { return _this.auth.getToken(); })), operators.map(( /**
                 * @param {?} token
                 * @return {?}
                 */function (token) {
                    return true;
                })) // always returns true, needed to try to get token from cookie
                );
            };
        AllowNonLoggedUserGuard.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root',
                    },] }
        ];
        /** @nocollapse */
        AllowNonLoggedUserGuard.ctorParameters = function () {
            return [
                { type: GnxAuthService },
                { type: i3.Router }
            ];
        };
        /** @nocollapse */ AllowNonLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function AllowNonLoggedUserGuard_Factory() { return new AllowNonLoggedUserGuard(i0.inject(GnxAuthService), i0.inject(i3.Router)); }, token: AllowNonLoggedUserGuard, providedIn: "root" });
        return AllowNonLoggedUserGuard;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RequireLoggedUserGuard = /** @class */ (function () {
        function RequireLoggedUserGuard(auth, router) {
            this.auth = auth;
            this.router = router;
        }
        /**
         * @return {?}
         */
        RequireLoggedUserGuard.prototype.canActivate = /**
         * @return {?}
         */
            function () {
                var _this = this;
                return this.auth.getToken().pipe(operators.map(( /**
                 * @param {?} token
                 * @return {?}
                 */function (token) {
                    if (!token) {
                        _this.auth.redirectToLoginPage();
                        return false;
                    }
                    return true;
                })));
            };
        RequireLoggedUserGuard.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root',
                    },] }
        ];
        /** @nocollapse */
        RequireLoggedUserGuard.ctorParameters = function () {
            return [
                { type: GnxAuthService },
                { type: i3.Router }
            ];
        };
        /** @nocollapse */ RequireLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function RequireLoggedUserGuard_Factory() { return new RequireLoggedUserGuard(i0.inject(GnxAuthService), i0.inject(i3.Router)); }, token: RequireLoggedUserGuard, providedIn: "root" });
        return RequireLoggedUserGuard;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GnxAuthComponent = /** @class */ (function () {
        function GnxAuthComponent(service, translatorService, env) {
            this.service = service;
            this.translatorService = translatorService;
            this.env = env;
            this.redirectToLoginPageIfUserNotLoggedIn = true;
            this.initialized = false;
            service.setTranslatorService(translatorService);
        }
        /**
         * @return {?}
         */
        GnxAuthComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.service.getToken().subscribe(( /**
                 * @param {?} token
                 * @return {?}
                 */function (token) {
                    if (token) {
                        _this.userName = token.user_name;
                        _this.isLoggedIn = true;
                        _this.service.retrieveUserLanguageFromServer();
                    }
                    else {
                        _this.userName = null;
                        _this.isLoggedIn = false;
                        _this.service.setDefaultUserLanguage();
                    }
                    _this.initialized = true;
                }));
            };
        /**
         * @return {?}
         */
        GnxAuthComponent.prototype.login = /**
         * @return {?}
         */
            function () {
                this.service.redirectToLoginPage();
            };
        /**
         * @return {?}
         */
        GnxAuthComponent.prototype.signUp = /**
         * @return {?}
         */
            function () {
                this.service.redirectToSignUpPage();
            };
        /**
         * @return {?}
         */
        GnxAuthComponent.prototype.logout = /**
         * @return {?}
         */
            function () {
                this.service.logout();
                this.isLoggedIn = false;
            };
        /**
         * @param {?} text
         * @return {?}
         */
        GnxAuthComponent.prototype.translate = /**
         * @param {?} text
         * @return {?}
         */
            function (text) {
                return this.translatorService.translate.instant(text);
            };
        GnxAuthComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'gnx-auth',
                        template: "<div class=\"header-wrapper\">\r\n  <div class=\"header-left-container\">\r\n    <div class=\"m-r-lg\">\r\n      <a [href]=\"env.accountsUrl\">\r\n        <img alt=\"image\"\r\n             src=\"data:image/png;base64,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\">\r\n      </a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.questionsUrl\" class=\"service-link\">Questions</a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.profilesUrl\" class=\"service-link\">Profiles</a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.rentalsUrl\" class=\"service-link\">Rentals</a>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"header-right-container\" *ngIf=\"initialized\">\r\n    <div>\r\n      <ng-container *ngIf=\"!isLoggedIn\">\r\n        <button (click)=\"login()\" class=\"btn btn-white btn-sm\" type=\"button\">\r\n          {{translate('Log in')}} <i class=\"fa fa-sign-in m-l-xs\"></i>\r\n        </button>\r\n        <button (click)=\"signUp()\" class=\"btn btn-success btn-sm m-l-xs\" type=\"button\">\r\n          {{translate('Sign Up')}} <i class=\"fa fa-sign-in m-l-xs\"></i>\r\n        </button>\r\n      </ng-container>\r\n\r\n      <ng-container *ngIf=\"isLoggedIn\">\r\n        {{translate('Logged as')}}:\r\n        <a [href]=\"env.accountsUrl + '/me'\">\r\n          <label class=\"form-control-static\" style=\"cursor: inherit\">{{userName}}</label>\r\n        </a>\r\n        &nbsp;\r\n        <button (click)=\"logout()\" class=\"btn btn-success btn-sm\" type=\"button\">\r\n          {{translate('Log out')}} <i class=\"fa fa-sign-out m-l-xs\"></i>\r\n        </button>\r\n      </ng-container>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                        styles: [".auth-buttons{display:inline-block;margin-left:15px}.lang-button-active{cursor:default}.header-wrapper{display:flex;justify-content:space-between;align-items:center;padding:12px;background-color:#2d2d2d;color:#ededed}.header-wrapper .btn,.header-wrapper a,.header-wrapper a:hover{color:#ededed}.header-wrapper .btn{background-color:#95fedf;border-color:#95fedf;color:#2d2d2d}.header-wrapper .btn:hover{background-color:#8ceccd;border-color:#8ceccd}.header-wrapper .service-link{font-size:larger;font-weight:600}.header-left-container{display:flex;justify-content:flex-start;align-items:center}.header-right-container{display:flex;justify-content:flex-end;align-items:center}"]
                    }] }
        ];
        /** @nocollapse */
        GnxAuthComponent.ctorParameters = function () {
            return [
                { type: GnxAuthService },
                { type: undefined, decorators: [{ type: i0.Inject, args: ['TranslatorService',] }] },
                { type: undefined, decorators: [{ type: i0.Inject, args: ['env',] }] }
            ];
        };
        GnxAuthComponent.propDecorators = {
            redirectToLoginPageIfUserNotLoggedIn: [{ type: i0.Input }]
        };
        return GnxAuthComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GnxApplyTokenInterceptor = /** @class */ (function () {
        function GnxApplyTokenInterceptor(gnxAuthService) {
            this.gnxAuthService = gnxAuthService;
        }
        /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
        GnxApplyTokenInterceptor.prototype.intercept = /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
            function (req, next) {
                if (req.url.indexOf('/api/') > -1) {
                    return this.gnxAuthService.getToken().pipe(operators.first(), operators.map(( /**
                     * @param {?} token
                     * @return {?}
                     */function (token) {
                        if (token) {
                            return req.clone({
                                setHeaders: {
                                    Authorization: 'Bearer ' + token.encodedToken
                                }
                            });
                        }
                        return req;
                    })), operators.switchMap(( /**
                     * @param {?} request
                     * @return {?}
                     */function (request) { return next.handle(request); })));
                }
                return next.handle(req);
            };
        GnxApplyTokenInterceptor.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        GnxApplyTokenInterceptor.ctorParameters = function () {
            return [
                { type: GnxAuthService }
            ];
        };
        return GnxApplyTokenInterceptor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GnxRefreshTokenInterceptor = /** @class */ (function () {
        function GnxRefreshTokenInterceptor(gnxAuthService) {
            this.gnxAuthService = gnxAuthService;
            this.notTriedYet = true;
        }
        /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
        GnxRefreshTokenInterceptor.prototype.intercept = /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
            function (req, next) {
                var _this = this;
                if (req.url.startsWith('/api/')) {
                    return next.handle(req).pipe(operators.catchError(( /**
                     * @param {?} err
                     * @return {?}
                     */function (err) {
                        if (err instanceof i1.HttpErrorResponse && err.status === 401) { // it seems access token hs expired, try to get new tokens by refresh token
                            if (_this.notTriedYet) {
                                _this.notTriedYet = false;
                                return _this.gnxAuthService.getAccessTokenByRefreshToken().pipe(operators.first(), operators.switchMap(( /**
                                 * @param {?} token
                                 * @return {?}
                                 */function (token) {
                                    _this.notTriedYet = true;
                                    if (token) {
                                        /** @type {?} */
                                        var newRequest = req.clone({
                                            setHeaders: {
                                                Authorization: 'Bearer ' + token.encodedToken
                                            }
                                        });
                                        return next.handle(newRequest);
                                    }
                                    _this.gnxAuthService.redirectToLoginPage();
                                })));
                            }
                            else {
                                _this.notTriedYet = true;
                                _this.gnxAuthService.redirectToLoginPage();
                            }
                        }
                        else {
                            return rxjs.throwError(err);
                        }
                    })));
                }
                return next.handle(req);
            };
        GnxRefreshTokenInterceptor.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        GnxRefreshTokenInterceptor.ctorParameters = function () {
            return [
                { type: GnxAuthService }
            ];
        };
        return GnxRefreshTokenInterceptor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GnxAuthModule = /** @class */ (function () {
        function GnxAuthModule() {
        }
        /**
         * @param {?} environment
         * @param {?} translatorService
         * @return {?}
         */
        GnxAuthModule.forRoot = /**
         * @param {?} environment
         * @param {?} translatorService
         * @return {?}
         */
            function (environment, translatorService) {
                return {
                    ngModule: GnxAuthModule,
                    providers: [
                        GnxAuthService,
                        { provide: 'TranslatorService', useClass: translatorService },
                        {
                            provide: 'env',
                            useValue: environment
                        }
                    ]
                };
            };
        GnxAuthModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [
                            GnxAuthComponent
                        ],
                        imports: [
                            platformBrowser.BrowserModule,
                        ],
                        exports: [
                            GnxAuthComponent
                        ],
                        providers: [
                            i2.CookieService,
                            { provide: i1.HTTP_INTERCEPTORS, useClass: GnxApplyTokenInterceptor, multi: true },
                            { provide: i1.HTTP_INTERCEPTORS, useClass: GnxRefreshTokenInterceptor, multi: true },
                        ]
                    },] }
        ];
        return GnxAuthModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.GnxAuthService = GnxAuthService;
    exports.AllowNonLoggedUserGuard = AllowNonLoggedUserGuard;
    exports.RequireLoggedUserGuard = RequireLoggedUserGuard;
    exports.GnxAuthModule = GnxAuthModule;
    exports.ɵa = GnxAuthComponent;
    exports.ɵc = GnxApplyTokenInterceptor;
    exports.ɵd = GnxRefreshTokenInterceptor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=gnx-auth.umd.js.map