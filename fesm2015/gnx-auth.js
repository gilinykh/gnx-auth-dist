import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Inject, Injectable, Component, Input, NgModule, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of, ReplaySubject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, first } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GnxAuthService {
    /**
     * @param {?} http
     * @param {?} cookieService
     * @param {?} router
     * @param {?} route
     * @param {?} env
     */
    constructor(http, cookieService, router, route, env) {
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
        this.jwtHelper = new JwtHelperService();
        this.accessToken$ = new ReplaySubject(1);
        this.clientId = env.clientId;
        this.authServerUrl = env.authServerUrl;
        this.cookieDomainName = env.cookieDomainName;
    }
    /**
     * @param {?} translatorService
     * @return {?}
     */
    setTranslatorService(translatorService) {
        this.translatorService = translatorService;
    }
    /**
     * @return {?}
     */
    init() {
        // intercept request with 'code' param to get token by the code
        /** @type {?} */
        let matchings = window.location.search.match(/code=(.+?)(&.+)?$/);
        /** @type {?} */
        let code = matchings ? matchings[1] : null;
        if (code) {
            this.getTokensByCode(code);
        }
        else {
            this.tryToGetTokensFromCookieOrStorage().subscribe();
        }
        this.initialized = true;
    }
    /**
     * @return {?}
     */
    getToken() {
        if (!this.initialized) {
            this.init();
        }
        return this.accessToken$.asObservable();
    }
    /**
     * @param {?} code
     * @return {?}
     */
    getTokensByCode(code) {
        /** @type {?} */
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', this.clientId);
        params.append('redirect_uri', this.getRedirectUri());
        params.append('code', code);
        /** @type {?} */
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
        });
        this.http.post(this.authServerUrl + this.AUTH_SERVER_TOKEN_ENDPOINT, params.toString(), { headers: headers }).subscribe((/**
         * @param {?} tokenData
         * @return {?}
         */
        tokenData => {
            this.saveTokens(tokenData);
            this.accessToken$.next(this.accessToken);
            this.removeCodeParamAndNavigateToTheSamePage().then();
        }), (/**
         * @param {?} err
         * @return {?}
         */
        err => this.accessToken$.next(null)));
    }
    /**
     * @return {?}
     */
    getAccessTokenByRefreshToken() {
        return this.tryToGetTokensFromCookieOrStorage().pipe(switchMap((/**
         * @param {?} val
         * @return {?}
         */
        val => this.getToken())));
    }
    /**
     * @return {?}
     */
    redirectToLoginPage() {
        window.location.href = `${this.authServerUrl}${this.AUTH_SERVER_LOGIN_ENDPOINT}` +
            `?response_type=code&client_id=${this.clientId}&redirect_uri=${this.getRedirectUri()}`;
    }
    /**
     * @return {?}
     */
    redirectToSignUpPage() {
        window.location.href = `${this.authServerUrl}${this.AUTH_SERVER_SIGN_UP_ENDPOINT}`;
    }
    /**
     * @return {?}
     */
    logout() {
        this.deleteTokens();
        this.accessToken$.next(null);
        this.navigateToTheSamePage().then();
    }
    /**
     * @return {?}
     */
    retrieveUserLanguageFromServer() {
        this.http.get(this.authServerUrl + this.AUTH_SERVER_LANGUAGE_ENDPOINT)
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        res => {
            if (res && res.locale !== this.translatorService.getCurrentLang().toLowerCase()) {
                this.userLanguage = res.locale;
                this.translatorService.useLanguage(this.userLanguage);
            }
        }));
    }
    /**
     * @return {?}
     */
    setDefaultUserLanguage() {
        this.userLanguage = this.translatorService.getCurrentLang();
    }
    /**
     * @private
     * @return {?}
     */
    tryToGetTokensFromCookieOrStorage() {
        if (this.isValidToken(this.accessToken)) {
            this.accessToken$.next(this.accessToken);
            return of(true);
        }
        // look for access_token in cookie
        /** @type {?} */
        let encodedToken = this.cookieService.get(this.ACCESS_TOKEN_COOKIE_NAME);
        /** @type {?} */
        let decodedToken = this.decodeToken(encodedToken);
        if (this.isValidToken(decodedToken)) {
            this.accessToken = decodedToken;
            this.accessToken$.next(decodedToken);
            return of(true);
        }
        else {
            this.removeAccessTokenFromCookie();
        }
        // look for a refresh token in cookie
        /** @type {?} */
        let refreshToken;
        if (this.refreshToken) {
            refreshToken = this.refreshToken;
        }
        else {
            refreshToken = this.decodeToken(this.cookieService.get(this.REFRESH_TOKEN_COOKIE_NAME));
        }
        if (this.isValidToken(refreshToken)) {
            return this.getNewTokensByRefreshToken(refreshToken).pipe(tap((/**
             * @param {?} tokenData
             * @return {?}
             */
            tokenData => {
                this.saveTokens(tokenData);
                this.accessToken$.next(this.accessToken);
            })), map((/**
             * @param {?} tokenData
             * @return {?}
             */
            tokenData => !!tokenData)), catchError((/**
             * @param {?} err
             * @return {?}
             */
            err => {
                this.removeRefreshTokenFromCookie();
                this.accessToken$.next(null);
                return of(false);
            })));
        }
        else {
            this.removeRefreshTokenFromCookie();
        }
        this.accessToken$.next(null);
        return of(false);
    }
    /**
     * @private
     * @return {?}
     */
    removeCodeParamAndNavigateToTheSamePage() {
        /** @type {?} */
        let queryParams = {};
        /** @type {?} */
        let params = this.route.snapshot.queryParamMap;
        params.keys.forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => {
            if (k !== 'code') {
                queryParams[k] = params.get(k);
            }
        }));
        /** @type {?} */
        let currentUrlPath = this.getCurrentUrlPath();
        return this.router.navigate([currentUrlPath], {
            relativeTo: this.route,
            queryParams: queryParams,
        });
    }
    /**
     * @private
     * @return {?}
     */
    navigateToTheSamePage() {
        /** @type {?} */
        let queryParams = {};
        /** @type {?} */
        let params = this.route.snapshot.queryParamMap;
        params.keys.forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => {
            queryParams[k] = params.get(k);
        }));
        /** @type {?} */
        let currentUrlPath = this.getCurrentUrlPath();
        return this.router.navigate([currentUrlPath], {
            relativeTo: this.route,
            queryParams: queryParams,
        });
    }
    /**
     * @private
     * @param {?} tokenData
     * @return {?}
     */
    saveTokens(tokenData) {
        if (tokenData) {
            /** @type {?} */
            let decodedAccessToken = this.decodeToken(tokenData.access_token);
            /** @type {?} */
            let acExpireDate = new Date(decodedAccessToken.exp * 1000);
            this.cookieService.set(this.ACCESS_TOKEN_COOKIE_NAME, tokenData.access_token, acExpireDate, this.COOKIE_PATH, this.cookieDomainName);
            this.accessToken = decodedAccessToken;
            /** @type {?} */
            let decodedRefreshToken = this.decodeToken(tokenData.refresh_token);
            /** @type {?} */
            let rtExpireDate = new Date(decodedRefreshToken.exp * 1000);
            this.cookieService.set(this.REFRESH_TOKEN_COOKIE_NAME, tokenData.refresh_token, rtExpireDate, this.COOKIE_PATH, this.cookieDomainName);
            this.refreshToken = this.decodeToken(tokenData.refresh_token);
        }
    }
    /**
     * @private
     * @return {?}
     */
    getCurrentUrlPath() {
        /** @type {?} */
        let url = this.router.url;
        if (url.indexOf('?') > 0) {
            url = url.substr(0, url.indexOf('?'));
        }
        return url;
    }
    /**
     * @private
     * @param {?} refreshToken
     * @return {?}
     */
    getNewTokensByRefreshToken(refreshToken) {
        /** @type {?} */
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
        });
        /** @type {?} */
        let body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken.encodedToken);
        return this.http.post(this.authServerUrl + this.AUTH_SERVER_TOKEN_ENDPOINT, body.toString(), { headers: headers });
    }
    /**
     * @private
     * @param {?} token
     * @return {?}
     */
    isValidToken(token) {
        if (!token) {
            return false;
        }
        /** @type {?} */
        let expirationSeconds = token.exp;
        return expirationSeconds && (new Date().getTime() < expirationSeconds * 1000);
    }
    /**
     * @private
     * @return {?}
     */
    deleteTokens() {
        this.removeAccessTokenFromCookie();
        this.accessToken = null;
        this.removeRefreshTokenFromCookie();
        this.refreshToken = null;
    }
    /**
     * @private
     * @return {?}
     */
    removeAccessTokenFromCookie() {
        /** @type {?} */
        let cookieValue = this.cookieService.get(this.ACCESS_TOKEN_COOKIE_NAME);
        if (cookieValue) {
            /** @type {?} */
            let expireDate = new Date(0);
            this.cookieService.set(this.ACCESS_TOKEN_COOKIE_NAME, cookieValue, expireDate, this.COOKIE_PATH, this.cookieDomainName);
        }
    }
    /**
     * @private
     * @return {?}
     */
    removeRefreshTokenFromCookie() {
        /** @type {?} */
        let cookieValue = this.cookieService.get(this.REFRESH_TOKEN_COOKIE_NAME);
        if (cookieValue) {
            /** @type {?} */
            let expireDate = new Date(0);
            this.cookieService.set(this.REFRESH_TOKEN_COOKIE_NAME, cookieValue, expireDate, this.COOKIE_PATH, this.cookieDomainName);
        }
    }
    /**
     * @private
     * @param {?} encodedToken
     * @return {?}
     */
    decodeToken(encodedToken) {
        if (!encodedToken) {
            return null;
        }
        /** @type {?} */
        let decodedToken = (/** @type {?} */ (this.jwtHelper.decodeToken(encodedToken)));
        if (decodedToken) {
            decodedToken.encodedToken = encodedToken;
        }
        return decodedToken;
    }
    /**
     * @private
     * @return {?}
     */
    getRedirectUri() {
        return window.location.href.replace(/^(http[s]?:\/\/[a-zA-Z\\.:0-9]+)(\/.*)$/, '$1');
    }
}
GnxAuthService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
GnxAuthService.ctorParameters = () => [
    { type: HttpClient },
    { type: CookieService },
    { type: Router },
    { type: ActivatedRoute },
    { type: undefined, decorators: [{ type: Inject, args: ['env',] }] }
];
/** @nocollapse */ GnxAuthService.ngInjectableDef = defineInjectable({ factory: function GnxAuthService_Factory() { return new GnxAuthService(inject(HttpClient), inject(CookieService), inject(Router), inject(ActivatedRoute), inject("env")); }, token: GnxAuthService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AllowNonLoggedUserGuard {
    /**
     * @param {?} auth
     * @param {?} router
     */
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    /**
     * @return {?}
     */
    canActivate() {
        return of(null).pipe(switchMap((/**
         * @return {?}
         */
        () => this.auth.getToken())), map((/**
         * @param {?} token
         * @return {?}
         */
        token => {
            return true;
        })) // always returns true, needed to try to get token from cookie
        );
    }
}
AllowNonLoggedUserGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
/** @nocollapse */
AllowNonLoggedUserGuard.ctorParameters = () => [
    { type: GnxAuthService },
    { type: Router }
];
/** @nocollapse */ AllowNonLoggedUserGuard.ngInjectableDef = defineInjectable({ factory: function AllowNonLoggedUserGuard_Factory() { return new AllowNonLoggedUserGuard(inject(GnxAuthService), inject(Router)); }, token: AllowNonLoggedUserGuard, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RequireLoggedUserGuard {
    /**
     * @param {?} auth
     * @param {?} router
     */
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    /**
     * @return {?}
     */
    canActivate() {
        return this.auth.getToken().pipe(map((/**
         * @param {?} token
         * @return {?}
         */
        token => {
            if (!token) {
                this.auth.redirectToLoginPage();
                return false;
            }
            return true;
        })));
    }
}
RequireLoggedUserGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
/** @nocollapse */
RequireLoggedUserGuard.ctorParameters = () => [
    { type: GnxAuthService },
    { type: Router }
];
/** @nocollapse */ RequireLoggedUserGuard.ngInjectableDef = defineInjectable({ factory: function RequireLoggedUserGuard_Factory() { return new RequireLoggedUserGuard(inject(GnxAuthService), inject(Router)); }, token: RequireLoggedUserGuard, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GnxAuthComponent {
    /**
     * @param {?} service
     * @param {?} translatorService
     * @param {?} env
     */
    constructor(service, translatorService, env) {
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
    ngOnInit() {
        this.service.getToken().subscribe((/**
         * @param {?} token
         * @return {?}
         */
        token => {
            if (token) {
                this.userName = token.user_name;
                this.isLoggedIn = true;
                this.service.retrieveUserLanguageFromServer();
            }
            else {
                this.userName = null;
                this.isLoggedIn = false;
                this.service.setDefaultUserLanguage();
            }
            this.initialized = true;
        }));
    }
    /**
     * @return {?}
     */
    login() {
        this.service.redirectToLoginPage();
    }
    /**
     * @return {?}
     */
    signUp() {
        this.service.redirectToSignUpPage();
    }
    /**
     * @return {?}
     */
    logout() {
        this.service.logout();
        this.isLoggedIn = false;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    translate(text) {
        return this.translatorService.translate.instant(text);
    }
}
GnxAuthComponent.decorators = [
    { type: Component, args: [{
                selector: 'gnx-auth',
                template: "<div class=\"header-wrapper\">\r\n  <div class=\"header-left-container\">\r\n    <div class=\"m-r-lg\">\r\n      <a [href]=\"env.accountsUrl\">\r\n        <img alt=\"image\"\r\n             src=\"data:image/png;base64,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\">\r\n      </a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.questionsUrl\" class=\"service-link\">Questions</a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.profilesUrl\" class=\"service-link\">Profiles</a>\r\n    </div>\r\n    <div class=\"m-l\">\r\n      <a [href]=\"env.rentalsUrl\" class=\"service-link\">Rentals</a>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"header-right-container\" *ngIf=\"initialized\">\r\n    <div>\r\n      <ng-container *ngIf=\"!isLoggedIn\">\r\n        <button (click)=\"login()\" class=\"btn btn-white btn-sm\" type=\"button\">\r\n          {{translate('Log in')}} <i class=\"fa fa-sign-in m-l-xs\"></i>\r\n        </button>\r\n        <button (click)=\"signUp()\" class=\"btn btn-success btn-sm m-l-xs\" type=\"button\">\r\n          {{translate('Sign Up')}} <i class=\"fa fa-sign-in m-l-xs\"></i>\r\n        </button>\r\n      </ng-container>\r\n\r\n      <ng-container *ngIf=\"isLoggedIn\">\r\n        {{translate('Logged as')}}:\r\n        <a [href]=\"env.accountsUrl + '/me'\">\r\n          <label class=\"form-control-static\" style=\"cursor: inherit\">{{userName}}</label>\r\n        </a>\r\n        &nbsp;\r\n        <button (click)=\"logout()\" class=\"btn btn-success btn-sm\" type=\"button\">\r\n          {{translate('Log out')}} <i class=\"fa fa-sign-out m-l-xs\"></i>\r\n        </button>\r\n      </ng-container>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                styles: [".auth-buttons{display:inline-block;margin-left:15px}.lang-button-active{cursor:default}.header-wrapper{display:flex;justify-content:space-between;align-items:center;padding:12px;background-color:#2d2d2d;color:#ededed}.header-wrapper .btn,.header-wrapper a,.header-wrapper a:hover{color:#ededed}.header-wrapper .btn{background-color:#95fedf;border-color:#95fedf;color:#2d2d2d}.header-wrapper .btn:hover{background-color:#8ceccd;border-color:#8ceccd}.header-wrapper .service-link{font-size:larger;font-weight:600}.header-left-container{display:flex;justify-content:flex-start;align-items:center}.header-right-container{display:flex;justify-content:flex-end;align-items:center}"]
            }] }
];
/** @nocollapse */
GnxAuthComponent.ctorParameters = () => [
    { type: GnxAuthService },
    { type: undefined, decorators: [{ type: Inject, args: ['TranslatorService',] }] },
    { type: undefined, decorators: [{ type: Inject, args: ['env',] }] }
];
GnxAuthComponent.propDecorators = {
    redirectToLoginPageIfUserNotLoggedIn: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GnxApplyTokenInterceptor {
    /**
     * @param {?} gnxAuthService
     */
    constructor(gnxAuthService) {
        this.gnxAuthService = gnxAuthService;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    intercept(req, next) {
        if (req.url.indexOf('/api/') > -1) {
            return this.gnxAuthService.getToken().pipe(first(), map((/**
             * @param {?} token
             * @return {?}
             */
            token => {
                if (token) {
                    return req.clone({
                        setHeaders: {
                            Authorization: 'Bearer ' + token.encodedToken
                        }
                    });
                }
                return req;
            })), switchMap((/**
             * @param {?} request
             * @return {?}
             */
            request => next.handle(request))));
        }
        return next.handle(req);
    }
}
GnxApplyTokenInterceptor.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GnxApplyTokenInterceptor.ctorParameters = () => [
    { type: GnxAuthService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GnxRefreshTokenInterceptor {
    /**
     * @param {?} gnxAuthService
     */
    constructor(gnxAuthService) {
        this.gnxAuthService = gnxAuthService;
        this.notTriedYet = true;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    intercept(req, next) {
        if (req.url.startsWith('/api/')) {
            return next.handle(req).pipe(catchError((/**
             * @param {?} err
             * @return {?}
             */
            err => {
                if (err instanceof HttpErrorResponse && err.status === 401) { // it seems access token hs expired, try to get new tokens by refresh token
                    if (this.notTriedYet) {
                        this.notTriedYet = false;
                        return this.gnxAuthService.getAccessTokenByRefreshToken().pipe(first(), switchMap((/**
                         * @param {?} token
                         * @return {?}
                         */
                        token => {
                            this.notTriedYet = true;
                            if (token) {
                                /** @type {?} */
                                let newRequest = req.clone({
                                    setHeaders: {
                                        Authorization: 'Bearer ' + token.encodedToken
                                    }
                                });
                                return next.handle(newRequest);
                            }
                            this.gnxAuthService.redirectToLoginPage();
                        })));
                    }
                    else {
                        this.notTriedYet = true;
                        this.gnxAuthService.redirectToLoginPage();
                    }
                }
                else {
                    return throwError(err);
                }
            })));
        }
        return next.handle(req);
    }
}
GnxRefreshTokenInterceptor.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GnxRefreshTokenInterceptor.ctorParameters = () => [
    { type: GnxAuthService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GnxAuthModule {
    /**
     * @param {?} environment
     * @param {?} translatorService
     * @return {?}
     */
    static forRoot(environment, translatorService) {
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
    }
}
GnxAuthModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    GnxAuthComponent
                ],
                imports: [
                    BrowserModule,
                ],
                exports: [
                    GnxAuthComponent
                ],
                providers: [
                    CookieService,
                    { provide: HTTP_INTERCEPTORS, useClass: GnxApplyTokenInterceptor, multi: true },
                    { provide: HTTP_INTERCEPTORS, useClass: GnxRefreshTokenInterceptor, multi: true },
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { GnxAuthService, AllowNonLoggedUserGuard, RequireLoggedUserGuard, GnxAuthModule, GnxAuthComponent as ɵa, GnxApplyTokenInterceptor as ɵc, GnxRefreshTokenInterceptor as ɵd };

//# sourceMappingURL=gnx-auth.js.map