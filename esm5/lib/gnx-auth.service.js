/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from "@angular/router";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie-service";
import * as i3 from "@angular/router";
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
        var headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
        });
        this.http.post(this.authServerUrl + this.AUTH_SERVER_TOKEN_ENDPOINT, params.toString(), { headers: headers }).subscribe((/**
         * @param {?} tokenData
         * @return {?}
         */
        function (tokenData) {
            _this.saveTokens(tokenData);
            _this.accessToken$.next(_this.accessToken);
            _this.removeCodeParamAndNavigateToTheSamePage().then();
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) { return _this.accessToken$.next(null); }));
    };
    /**
     * @return {?}
     */
    GnxAuthService.prototype.getAccessTokenByRefreshToken = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.tryToGetTokensFromCookieOrStorage().pipe(switchMap((/**
         * @param {?} val
         * @return {?}
         */
        function (val) { return _this.getToken(); })));
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
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        function (res) {
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
            return of(true);
        }
        // look for access_token in cookie
        /** @type {?} */
        var encodedToken = this.cookieService.get(this.ACCESS_TOKEN_COOKIE_NAME);
        /** @type {?} */
        var decodedToken = this.decodeToken(encodedToken);
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
        var refreshToken;
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
            function (tokenData) {
                _this.saveTokens(tokenData);
                _this.accessToken$.next(_this.accessToken);
            })), map((/**
             * @param {?} tokenData
             * @return {?}
             */
            function (tokenData) { return !!tokenData; })), catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                _this.removeRefreshTokenFromCookie();
                _this.accessToken$.next(null);
                return of(false);
            })));
        }
        else {
            this.removeRefreshTokenFromCookie();
        }
        this.accessToken$.next(null);
        return of(false);
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
        params.keys.forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
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
        params.keys.forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
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
        var headers = new HttpHeaders({
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
        var decodedToken = (/** @type {?} */ (this.jwtHelper.decodeToken(encodedToken)));
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    GnxAuthService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: CookieService },
        { type: Router },
        { type: ActivatedRoute },
        { type: undefined, decorators: [{ type: Inject, args: ['env',] }] }
    ]; };
    /** @nocollapse */ GnxAuthService.ngInjectableDef = i0.defineInjectable({ factory: function GnxAuthService_Factory() { return new GnxAuthService(i0.inject(i1.HttpClient), i0.inject(i2.CookieService), i0.inject(i3.Router), i0.inject(i3.ActivatedRoute), i0.inject("env")); }, token: GnxAuthService, providedIn: "root" });
    return GnxAuthService;
}());
export { GnxAuthService };
if (false) {
    /** @type {?} */
    GnxAuthService.prototype.AUTH_SERVER_TOKEN_ENDPOINT;
    /** @type {?} */
    GnxAuthService.prototype.AUTH_SERVER_LOGIN_ENDPOINT;
    /** @type {?} */
    GnxAuthService.prototype.AUTH_SERVER_SIGN_UP_ENDPOINT;
    /** @type {?} */
    GnxAuthService.prototype.AUTH_SERVER_LANGUAGE_ENDPOINT;
    /** @type {?} */
    GnxAuthService.prototype.ACCESS_TOKEN_COOKIE_NAME;
    /** @type {?} */
    GnxAuthService.prototype.REFRESH_TOKEN_COOKIE_NAME;
    /** @type {?} */
    GnxAuthService.prototype.COOKIE_PATH;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.initialized;
    /** @type {?} */
    GnxAuthService.prototype.clientId;
    /** @type {?} */
    GnxAuthService.prototype.authServerUrl;
    /** @type {?} */
    GnxAuthService.prototype.cookieDomainName;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.jwtHelper;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.accessToken$;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.accessToken;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.refreshToken;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.translatorService;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.userLanguage;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.cookieService;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.router;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.route;
    /**
     * @type {?}
     * @private
     */
    GnxAuthService.prototype.env;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGguc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2dueC1hdXRoLyIsInNvdXJjZXMiOlsibGliL2dueC1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0QsT0FBTyxFQUFhLEVBQUUsRUFBRSxhQUFhLEVBQVUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUV2RDtJQTRCRSx3QkFBb0IsSUFBZ0IsRUFDaEIsYUFBNEIsRUFDNUIsTUFBYyxFQUNkLEtBQXFCLEVBQ04sR0FBRztRQUpsQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNOLFFBQUcsR0FBSCxHQUFHLENBQUE7UUE1QjdCLCtCQUEwQixHQUFHLGNBQWMsQ0FBQztRQUM1QywrQkFBMEIsR0FBRyxrQkFBa0IsQ0FBQztRQUNoRCxpQ0FBNEIsR0FBRyxlQUFlLENBQUM7UUFDL0Msa0NBQTZCLEdBQUcsOEJBQThCLENBQUM7UUFDL0QsNkJBQXdCLEdBQUcsY0FBYyxDQUFDO1FBQzFDLDhCQUF5QixHQUFHLGVBQWUsQ0FBQztRQUM1QyxnQkFBVyxHQUFHLEdB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O0lBQ3RCLDBDQUF5Qjs7Ozs7SUFFekIsbUNBQTJDOzs7OztJQUUzQyxzQ0FBbUU7Ozs7O0lBQ25FLHFDQUEyQjs7Ozs7SUFDM0Isc0NBQTRCOzs7OztJQUU1QiwyQ0FBeUM7Ozs7O0lBRXpDLHNDQUE2Qjs7Ozs7SUFFakIsOEJBQXdCOzs7OztJQUN4Qix1Q0FBb0M7Ozs7O0lBQ3BDLGdDQUFzQjs7Ozs7SUFDdEIsK0JBQTZCOzs7OztJQUM3Qiw2QkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0LCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtUb2tlbiwgVG9rZW5EYXRhLCBUcmFuc2xhdGVhYmxlfSBmcm9tICcuL2dueC1tb2RlbHMnO1xuaW1wb3J0IHtDb29raWVTZXJ2aWNlfSBmcm9tIFwibmd4LWNvb2tpZS1zZXJ2aWNlXCI7XG5pbXBvcnQge0p3dEhlbHBlclNlcnZpY2V9IGZyb20gJ0BhdXRoMC9hbmd1bGFyLWp3dCc7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlLCBSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgR254QXV0aFNlcnZpY2Uge1xuICByZWFkb25seSBBVVRIX1NFUlZFUl9UT0tFTl9FTkRQT0lOVCA9ICcvb2F1dGgvdG9rZW4nO1xuICByZWFkb25seSBBVVRIX1NFUlZFUl9MT0dJTl9FTkRQT0lOVCA9ICcvb2F1dGgvYXV0aG9yaXplJztcbiAgcmVhZG9ubHkgQVVUSF9TRVJWRVJfU0lHTl9VUF9FTkRQT0lOVCA9ICcvcmVnaXN0cmF0aW9uJztcbiAgcmVhZG9ubHkgQVVUSF9TRVJWRVJfTEFOR1VBR0VfRU5EUE9JTlQgPSAnL2FwaS9hY2NvdW50cy9jdXJyZW50L2xvY2FsZSc7XG4gIHJlYWRvbmx5IEFDQ0VTU19UT0tFTl9DT09LSUVfTkFNRSA9ICdhY2Nlc3NfdG9rZW4nO1xuICByZWFkb25seSBSRUZSRVNIX1RPS0VOX0NPT0tJRV9OQU1FID0gJ3JlZnJlc2hfdG9rZW4nO1xuICByZWFkb25seSBDT09LSUVfUEFUSCA9ICcvJztcblxuICBwcml2YXRlIGluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgY2xpZW50SWQ6IHN0cmluZztcbiAgYXV0aFNlcnZlclVybDogc3RyaW5nO1xuICBjb29raWVEb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBqd3RIZWxwZXIgPSBuZXcgSnd0SGVscGVyU2VydmljZSgpO1xuXG4gIHByaXZhdGUgYWNjZXNzVG9rZW4kOiBTdWJqZWN0PFRva2VuPiA9IG5ldyBSZXBsYXlTdWJqZWN0PFRva2VuPigxKTtcbiAgcHJpdmF0ZSBhY2Nlc3NUb2tlbjogVG9rZW47XG4gIHByaXZhdGUgcmVmcmVzaFRva2VuOiBUb2tlbjtcblxuICBwcml2YXRlIHRyYW5zbGF0b3JTZXJ2aWNlOiBUcmFuc2xhdGVhYmxlO1xuXG4gIHByaXZhdGUgdXNlckxhbmd1YWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvb2tpZVNlcnZpY2U6IENvb2tpZVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICAgICAgICBASW5qZWN0KCdlbnYnKSBwcml2YXRlIGVudikge1xuXG4gICAgdGhpcy5jbGllbnRJZCA9IGVudi5jbGllbnRJZDtcbiAgICB0aGlzLmF1dGhTZXJ2ZXJVcmwgPSBlbnYuYXV0aFNlcnZlclVybDtcbiAgICB0aGlzLmNvb2tpZURvbWFpbk5hbWUgPSBlbnYuY29va2llRG9tYWluTmFtZTtcbiAgfVxuXG4gIHNldFRyYW5zbGF0b3JTZXJ2aWNlKHRyYW5zbGF0b3JTZXJ2aWNlOiBUcmFuc2xhdGVhYmxlKSB7XG4gICAgdGhpcy50cmFuc2xhdG9yU2VydmljZSA9IHRyYW5zbGF0b3JTZXJ2aWNlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBpbnRlcmNlcHQgcmVxdWVzdCB3aXRoICdjb2RlJyBwYXJhbSB0byBnZXQgdG9rZW4gYnkgdGhlIGNvZGVcbiAgICBsZXQgbWF0Y2hpbmdzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5tYXRjaCgvY29kZT0oLis/KSgmLispPyQvKTtcbiAgICBsZXQgY29kZSA9IG1hdGNoaW5ncyA/IG1hdGNoaW5nc1sxXSA6IG51bGw7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHRoaXMuZ2V0VG9rZW5zQnlDb2RlKGNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyeVRvR2V0VG9rZW5zRnJvbUNvb2tpZU9yU3RvcmFnZSgpLnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIGdldFRva2VuKCk6IE9ic2VydmFibGU8VG9rZW4+IHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbiQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXRUb2tlbnNCeUNvZGUoY29kZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHBhcmFtcy5hcHBlbmQoJ2dyYW50X3R5cGUnLCAnYXV0aG9yaXphdGlvbl9jb2RlJyk7XG4gICAgcGFyYW1zLmFwcGVuZCgnY2xpZW50X2lkJywgdGhpcy5jbGllbnRJZCk7XG4gICAgcGFyYW1zLmFwcGVuZCgncmVkaXJlY3RfdXJpJywgdGhpcy5nZXRSZWRpcmVjdFVyaSgpKTtcbiAgICBwYXJhbXMuYXBwZW5kKCdjb2RlJywgY29kZSk7XG5cbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICdBdXRob3JpemF0aW9uJzogJ0Jhc2ljICcgKyBidG9hKHRoaXMuY2xpZW50SWQgKyAnOnNlY3JldCcpXG4gICAgfSk7XG5cbiAgICB0aGlzLmh0dHAucG9zdDxUb2tlbkRhdGE+KHRoaXMuYXV0aFNlcnZlclVybCArIHRoaXMuQVVUSF9TRVJWRVJfVE9LRU5fRU5EUE9JTlQsIHBhcmFtcy50b1N0cmluZygpLFxuICAgICAge2hlYWRlcnM6IGhlYWRlcnN9KS5zdWJzY3JpYmUodG9rZW5EYXRhID0+IHtcbiAgICAgICAgdGhpcy5zYXZlVG9rZW5zKHRva2VuRGF0YSk7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQodGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMucmVtb3ZlQ29kZVBhcmFtQW5kTmF2aWdhdGVUb1RoZVNhbWVQYWdlKCkudGhlbigpO1xuICAgICAgfSxcbiAgICAgIGVyciA9PiB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpKTtcbiAgfVxuXG4gIGdldEFjY2Vzc1Rva2VuQnlSZWZyZXNoVG9rZW4oKTogT2JzZXJ2YWJsZTxUb2tlbj4ge1xuICAgIHJldHVybiB0aGlzLnRyeVRvR2V0VG9rZW5zRnJvbUNvb2tpZU9yU3RvcmFnZSgpLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAodmFsID0+IHRoaXMuZ2V0VG9rZW4oKSlcbiAgICApO1xuICB9XG5cbiAgcmVkaXJlY3RUb0xvZ2luUGFnZSgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3RoaXMuYXV0aFNlcnZlclVybH0ke3RoaXMuQVVUSF9TRVJWRVJfTE9HSU5fRU5EUE9JTlR9YCArXG4gICAgICBgP3Jlc3BvbnNlX3R5cGU9Y29kZSZjbGllbnRfaWQ9JHt0aGlzLmNsaWVudElkfSZyZWRpcmVjdF91cmk9JHt0aGlzLmdldFJlZGlyZWN0VXJpKCl9YDtcbiAgfVxuXG4gIHJlZGlyZWN0VG9TaWduVXBQYWdlKCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYCR7dGhpcy5hdXRoU2VydmVyVXJsfSR7dGhpcy5BVVRIX1NFUlZFUl9TSUdOX1VQX0VORFBPSU5UfWA7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgdGhpcy5kZWxldGVUb2tlbnMoKTtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpO1xuICAgIHRoaXMubmF2aWdhdGVUb1RoZVNhbWVQYWdlKCkudGhlbigpO1xuICB9XG5cbiAgcmV0cmlldmVVc2VyTGFuZ3VhZ2VGcm9tU2VydmVyKCkge1xuICAgIHRoaXMuaHR0cC5nZXQ8eyBsb2NhbGU6IHN0cmluZyB9Pih0aGlzLmF1dGhTZXJ2ZXJVcmwgKyB0aGlzLkFVVEhfU0VSVkVSX0xBTkdVQUdFX0VORFBPSU5UKVxuICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICBpZiAocmVzICYmIHJlcy5sb2NhbGUgIT09IHRoaXMudHJhbnNsYXRvclNlcnZpY2UuZ2V0Q3VycmVudExhbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgdGhpcy51c2VyTGFuZ3VhZ2UgPSByZXMubG9jYWxlO1xuICAgICAgICAgIHRoaXMudHJhbnNsYXRvclNlcnZpY2UudXNlTGFuZ3VhZ2UodGhpcy51c2VyTGFuZ3VhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHNldERlZmF1bHRVc2VyTGFuZ3VhZ2UoKSB7XG4gICAgdGhpcy51c2VyTGFuZ3VhZ2UgPSB0aGlzLnRyYW5zbGF0b3JTZXJ2aWNlLmdldEN1cnJlbnRMYW5nKCk7XG4gIH1cblxuICBwcml2YXRlIHRyeVRvR2V0VG9rZW5zRnJvbUNvb2tpZU9yU3RvcmFnZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkVG9rZW4odGhpcy5hY2Nlc3NUb2tlbikpIHtcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQodGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICByZXR1cm4gb2YodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gbG9vayBmb3IgYWNjZXNzX3Rva2VuIGluIGNvb2tpZVxuICAgIGxldCBlbmNvZGVkVG9rZW4gPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KHRoaXMuQUNDRVNTX1RPS0VOX0NPT0tJRV9OQU1FKTtcbiAgICBsZXQgZGVjb2RlZFRva2VuID0gdGhpcy5kZWNvZGVUb2tlbihlbmNvZGVkVG9rZW4pO1xuICAgIGlmICh0aGlzLmlzVmFsaWRUb2tlbihkZWNvZGVkVG9rZW4pKSB7XG4gICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gZGVjb2RlZFRva2VuO1xuICAgICAgdGhpcy5hY2Nlc3NUb2tlbiQubmV4dChkZWNvZGVkVG9rZW4pO1xuICAgICAgcmV0dXJuIG9mKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUFjY2Vzc1Rva2VuRnJvbUNvb2tpZSgpO1xuICAgIH1cblxuICAgIC8vIGxvb2sgZm9yIGEgcmVmcmVzaCB0b2tlbiBpbiBjb29raWVcbiAgICBsZXQgcmVmcmVzaFRva2VuOiBUb2tlbjtcbiAgICBpZiAodGhpcy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgIHJlZnJlc2hUb2tlbiA9IHRoaXMucmVmcmVzaFRva2VuO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWZyZXNoVG9rZW4gPSB0aGlzLmRlY29kZVRva2VuKHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5SRUZSRVNIX1RPS0VOX0NPT0tJRV9OQU1FKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzVmFsaWRUb2tlbihyZWZyZXNoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXROZXdUb2tlbnNCeVJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pLnBpcGUoXG4gICAgICAgIHRhcCh0b2tlbkRhdGEgPT4ge1xuICAgICAgICAgIHRoaXMuc2F2ZVRva2Vucyh0b2tlbkRhdGEpO1xuICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQodGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAodG9rZW5EYXRhID0+ICEhdG9rZW5EYXRhKSxcbiAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICAgICAgICAgIHRoaXMucmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpO1xuICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQobnVsbCk7XG4gICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpO1xuICAgIH1cblxuICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQobnVsbCk7XG4gICAgcmV0dXJuIG9mKGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQ29kZVBhcmFtQW5kTmF2aWdhdGVUb1RoZVNhbWVQYWdlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGxldCBxdWVyeVBhcmFtczogYW55ID0ge307XG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucm91dGUuc25hcHNob3QucXVlcnlQYXJhbU1hcDtcbiAgICBwYXJhbXMua2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGsgIT09ICdjb2RlJykge1xuICAgICAgICBxdWVyeVBhcmFtc1trXSA9IHBhcmFtcy5nZXQoayk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgY3VycmVudFVybFBhdGggPSB0aGlzLmdldEN1cnJlbnRVcmxQYXRoKCk7XG4gICAgcmV0dXJuIHRoaXMucm91dGVyLm5hdmlnYXRlKFxuICAgICAgW2N1cnJlbnRVcmxQYXRoXSxcbiAgICAgIHtcbiAgICAgICAgcmVsYXRpdmVUbzogdGhpcy5yb3V0ZSxcbiAgICAgICAgcXVlcnlQYXJhbXM6IHF1ZXJ5UGFyYW1zLFxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBsZXQgcXVlcnlQYXJhbXM6IGFueSA9IHt9O1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLnJvdXRlLnNuYXBzaG90LnF1ZXJ5UGFyYW1NYXA7XG4gICAgcGFyYW1zLmtleXMuZm9yRWFjaChrID0+IHtcbiAgICAgICAgcXVlcnlQYXJhbXNba10gPSBwYXJhbXMuZ2V0KGspO1xuICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRVcmxQYXRoID0gdGhpcy5nZXRDdXJyZW50VXJsUGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcbiAgICAgIFtjdXJyZW50VXJsUGF0aF0sXG4gICAgICB7XG4gICAgICAgIHJlbGF0aXZlVG86IHRoaXMucm91dGUsXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBxdWVyeVBhcmFtcyxcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzYXZlVG9rZW5zKHRva2VuRGF0YTogVG9rZW5EYXRhKSB7XG4gICAgaWYgKHRva2VuRGF0YSkge1xuICAgICAgbGV0IGRlY29kZWRBY2Nlc3NUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4odG9rZW5EYXRhLmFjY2Vzc190b2tlbik7XG4gICAgICBsZXQgYWNFeHBpcmVEYXRlID0gbmV3IERhdGUoZGVjb2RlZEFjY2Vzc1Rva2VuLmV4cCAqIDEwMDApO1xuICAgICAgdGhpcy5jb29raWVTZXJ2aWNlLnNldCh0aGlzLkFDQ0VTU19UT0tFTl9DT09LSUVfTkFNRSwgdG9rZW5EYXRhLmFjY2Vzc190b2tlbiwgYWNFeHBpcmVEYXRlLCB0aGlzLkNPT0tJRV9QQVRILCB0aGlzLmNvb2tpZURvbWFpbk5hbWUpO1xuICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGRlY29kZWRBY2Nlc3NUb2tlbjtcblxuICAgICAgbGV0IGRlY29kZWRSZWZyZXNoVG9rZW4gPSB0aGlzLmRlY29kZVRva2VuKHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuKTtcbiAgICAgIGxldCBydEV4cGlyZURhdGUgPSBuZXcgRGF0ZShkZWNvZGVkUmVmcmVzaFRva2VuLmV4cCAqIDEwMDApO1xuICAgICAgdGhpcy5jb29raWVTZXJ2aWNlLnNldCh0aGlzLlJFRlJFU0hfVE9LRU5fQ09PS0lFX05BTUUsIHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuLCBydEV4cGlyZURhdGUsIHRoaXMuQ09PS0lFX1BBVEgsIHRoaXMuY29va2llRG9tYWluTmFtZSk7XG4gICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4odG9rZW5EYXRhLnJlZnJlc2hfdG9rZW4pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q3VycmVudFVybFBhdGgoKSB7XG4gICAgbGV0IHVybCA9IHRoaXMucm91dGVyLnVybDtcbiAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+IDApIHtcbiAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoJz8nKSlcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TmV3VG9rZW5zQnlSZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuOiBUb2tlbik6IE9ic2VydmFibGU8VG9rZW5EYXRhPiB7XG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAnQXV0aG9yaXphdGlvbic6ICdCYXNpYyAnICsgYnRvYSh0aGlzLmNsaWVudElkICsgJzpzZWNyZXQnKVxuICAgIH0pO1xuXG4gICAgbGV0IGJvZHkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgYm9keS5zZXQoJ2dyYW50X3R5cGUnLCAncmVmcmVzaF90b2tlbicpO1xuICAgIGJvZHkuc2V0KCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaFRva2VuLmVuY29kZWRUb2tlbik7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8VG9rZW5EYXRhPih0aGlzLmF1dGhTZXJ2ZXJVcmwgKyB0aGlzLkFVVEhfU0VSVkVSX1RPS0VOX0VORFBPSU5ULCBib2R5LnRvU3RyaW5nKCksIHtoZWFkZXJzOiBoZWFkZXJzfSk7XG4gIH1cblxuICBwcml2YXRlIGlzVmFsaWRUb2tlbih0b2tlbjogVG9rZW4pOiBib29sZWFuIHtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBleHBpcmF0aW9uU2Vjb25kcyA9IHRva2VuLmV4cDtcbiAgICByZXR1cm4gZXhwaXJhdGlvblNlY29uZHMgJiYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIDwgZXhwaXJhdGlvblNlY29uZHMgKiAxMDAwKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlVG9rZW5zKCkge1xuICAgIHRoaXMucmVtb3ZlQWNjZXNzVG9rZW5Gcm9tQ29va2llKCk7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgdGhpcy5yZW1vdmVSZWZyZXNoVG9rZW5Gcm9tQ29va2llKCk7XG4gICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVBY2Nlc3NUb2tlbkZyb21Db29raWUoKSB7XG4gICAgbGV0IGNvb2tpZVZhbHVlID0gdGhpcy5jb29raWVTZXJ2aWNlLmdldCh0aGlzLkFDQ0VTU19UT0tFTl9DT09LSUVfTkFNRSk7XG4gICAgaWYgKGNvb2tpZVZhbHVlKSB7XG4gICAgICBsZXQgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgICAgdGhpcy5jb29raWVTZXJ2aWNlLnNldCh0aGlzLkFDQ0VTU19UT0tFTl9DT09LSUVfTkFNRSwgY29va2llVmFsdWUsIGV4cGlyZURhdGUsIHRoaXMuQ09PS0lFX1BBVEgsIHRoaXMuY29va2llRG9tYWluTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVSZWZyZXNoVG9rZW5Gcm9tQ29va2llKCkge1xuICAgIGxldCBjb29raWVWYWx1ZSA9IHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5SRUZSRVNIX1RPS0VOX0NPT0tJRV9OQU1FKTtcbiAgICBpZiAoY29va2llVmFsdWUpIHtcbiAgICAgIGxldCBleHBpcmVEYXRlID0gbmV3IERhdGUoMCk7XG4gICAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KHRoaXMuUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSwgY29va2llVmFsdWUsIGV4cGlyZURhdGUsIHRoaXMuQ09PS0lFX1BBVEgsIHRoaXMuY29va2llRG9tYWluTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVUb2tlbihlbmNvZGVkVG9rZW46IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAoIWVuY29kZWRUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGRlY29kZWRUb2tlbiA9IHRoaXMuand0SGVscGVyLmRlY29kZVRva2VuKGVuY29kZWRUb2tlbikgYXMgVG9rZW47XG4gICAgaWYgKGRlY29kZWRUb2tlbikge1xuICAgICAgZGVjb2RlZFRva2VuLmVuY29kZWRUb2tlbiA9IGVuY29kZWRUb2tlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb2RlZFRva2VuO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZWRpcmVjdFVyaSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9eKGh0dHBbc10/OlxcL1xcL1thLXpBLVpcXFxcLjowLTldKykoXFwvLiopJC8sICckMScpO1xuICB9XG5cbn1cbiJdfQ==