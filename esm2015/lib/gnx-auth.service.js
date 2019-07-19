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
export class GnxAuthService {
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
/** @nocollapse */ GnxAuthService.ngInjectableDef = i0.defineInjectable({ factory: function GnxAuthService_Factory() { return new GnxAuthService(i0.inject(i1.HttpClient), i0.inject(i2.CookieService), i0.inject(i3.Router), i0.inject(i3.ActivatedRoute), i0.inject("env")); }, token: GnxAuthService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGguc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2dueC1hdXRoLyIsInNvdXJjZXMiOlsibGliL2dueC1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0QsT0FBTyxFQUFhLEVBQUUsRUFBRSxhQUFhLEVBQVUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUt2RCxNQUFNLE9BQU8sY0FBYzs7Ozs7Ozs7SUF5QnpCLFlBQW9CLElBQWdCLEVBQ2hCLGFBQTRCLEVBQzVCLE1BQWMsRUFDZCxLQUFxQixFQUNOLEdBQUc7UUFKbEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDTixRQUFHLEdBQUgsR0FBRyxDQUFBO1FBNUI3QiwrQkFBMEIsR0FBRyxjQUFjLENBQUM7UUFDNUMsK0JBQTBCLEdBQUcsa0JBQWtCLENBQUM7UUFDaEQsaUNBQTRCLEdBQUcsZUFBZSxDQUFDO1FBQy9DLGtDQUE2QixHQUFHLDhCQUE4QixDQUFDO1FBQy9ELDZCQUF3QixHQUFHLGNBQWMsQ0FBQztRQUMxQyw4QkFBeUIsR0FBRyxlQUFlLENBQUM7UUFDNUMsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFFbkIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFNcEIsY0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUVuQyxpQkFBWSxHQUFtQixJQUFJLGFBQWEsQ0FBUSxDQUFDLENBQUMsQ0FBQztRQWNqRSxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7SUFDL0MsQ0FBQzs7Ozs7SUFFRCxvQkFBb0IsQ0FBQyxpQkFBZ0M7UUFDbkQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQzdDLENBQUM7Ozs7SUFFRCxJQUFJOzs7WUFFRSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDOztZQUM3RCxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDMUMsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUN0RDtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUMsQ0FBQzs7Ozs7SUFFRCxlQUFlLENBQUMsSUFBWTs7Y0FDcEIsTUFBTSxHQUFHLElBQUksZUFBZSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDOztjQUV0QixPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUM7WUFDOUIsY0FBYyxFQUFFLGtEQUFrRDtZQUNsRSxlQUFlLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztTQUM1RCxDQUFDO1FBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUMvRixFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLFNBQVM7Ozs7UUFBQyxTQUFTLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsdUNBQXVDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4RCxDQUFDOzs7O1FBQ0QsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7SUFFRCw0QkFBNEI7UUFDMUIsT0FBTyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsQ0FBQyxJQUFJLENBQ2xELFNBQVM7Ozs7UUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUNsQyxDQUFDO0lBQ0osQ0FBQzs7OztJQUVELG1CQUFtQjtRQUNqQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQzlFLGlDQUFpQyxJQUFJLENBQUMsUUFBUSxpQkFBaUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7SUFDM0YsQ0FBQzs7OztJQUVELG9CQUFvQjtRQUNsQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7SUFDckYsQ0FBQzs7OztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVELDhCQUE4QjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBcUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUM7YUFDdkYsU0FBUzs7OztRQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQy9FLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDdkQ7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFRCxzQkFBc0I7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDOUQsQ0FBQzs7Ozs7SUFFTyxpQ0FBaUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakI7OztZQUdHLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUM7O1lBQ3BFLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakI7YUFBTTtZQUNMLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1NBQ3BDOzs7WUFHRyxZQUFtQjtRQUN2QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDbEM7YUFBTTtZQUNMLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7U0FDekY7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUN2RCxHQUFHOzs7O1lBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNDLENBQUMsRUFBQyxFQUNGLEdBQUc7Ozs7WUFBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUMsRUFDN0IsVUFBVTs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNmLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO2dCQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxFQUFDLENBQ0gsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBRU8sdUNBQXVDOztZQUN6QyxXQUFXLEdBQVEsRUFBRTs7WUFDckIsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWE7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUNoQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQztRQUNILENBQUMsRUFBQyxDQUFDOztZQUVDLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDekIsQ0FBQyxjQUFjLENBQUMsRUFDaEI7WUFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDdEIsV0FBVyxFQUFFLFdBQVc7U0FDekIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7SUFFTyxxQkFBcUI7O1lBQ3ZCLFdBQVcsR0FBUSxFQUFFOztZQUNyQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLENBQUMsRUFBRTtZQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLEVBQUMsQ0FBQzs7WUFFQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQzdDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ3pCLENBQUMsY0FBYyxDQUFDLEVBQ2hCO1lBQ0UsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3RCLFdBQVcsRUFBRSxXQUFXO1NBQ3pCLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7OztJQUVPLFVBQVUsQ0FBQyxTQUFvQjtRQUNyQyxJQUFJLFNBQVMsRUFBRTs7Z0JBQ1Qsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDOztnQkFDN0QsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckksSUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQzs7Z0JBRWxDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQzs7Z0JBQy9ELFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQzNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxTQUFTLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3ZJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDL0Q7SUFDSCxDQUFDOzs7OztJQUVPLGlCQUFpQjs7WUFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztRQUN6QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDdEM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7OztJQUVPLDBCQUEwQixDQUFDLFlBQW1COztjQUM5QyxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUM7WUFDOUIsY0FBYyxFQUFFLGtEQUFrRDtZQUNsRSxlQUFlLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztTQUM1RCxDQUFDOztZQUVFLElBQUksR0FBRyxJQUFJLGVBQWUsRUFBRTtRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFckQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBWSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUM5SCxDQUFDOzs7Ozs7SUFFTyxZQUFZLENBQUMsS0FBWTtRQUMvQixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTyxLQUFLLENBQUM7U0FDZDs7WUFDRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsR0FBRztRQUNqQyxPQUFPLGlCQUFpQixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoRixDQUFDOzs7OztJQUVPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQzs7Ozs7SUFFTywyQkFBMkI7O1lBQzdCLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFDdkUsSUFBSSxXQUFXLEVBQUU7O2dCQUNYLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN6SDtJQUNILENBQUM7Ozs7O0lBRU8sNEJBQTRCOztZQUM5QixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDO1FBQ3hFLElBQUksV0FBVyxFQUFFOztnQkFDWCxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDMUg7SUFDSCxDQUFDOzs7Ozs7SUFFTyxXQUFXLENBQUMsWUFBb0I7UUFDdEMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQztTQUNiOztZQUVHLFlBQVksR0FBRyxtQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFBUztRQUNwRSxJQUFJLFlBQVksRUFBRTtZQUNoQixZQUFZLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztTQUMxQztRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRU8sY0FBYztRQUNwQixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5Q0FBeUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RixDQUFDOzs7WUF0UkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7O1lBVk8sVUFBVTtZQUlWLGFBQWE7WUFFRyxNQUFNO1lBQXRCLGNBQWM7NENBa0NQLE1BQU0sU0FBQyxLQUFLOzs7OztJQTVCekIsb0RBQXFEOztJQUNyRCxvREFBeUQ7O0lBQ3pELHNEQUF3RDs7SUFDeEQsdURBQXdFOztJQUN4RSxrREFBbUQ7O0lBQ25ELG1EQUFxRDs7SUFDckQscUNBQTJCOzs7OztJQUUzQixxQ0FBNEI7O0lBRTVCLGtDQUFpQjs7SUFDakIsdUNBQXNCOztJQUN0QiwwQ0FBeUI7Ozs7O0lBRXpCLG1DQUEyQzs7Ozs7SUFFM0Msc0NBQW1FOzs7OztJQUNuRSxxQ0FBMkI7Ozs7O0lBQzNCLHNDQUE0Qjs7Ozs7SUFFNUIsMkNBQXlDOzs7OztJQUV6QyxzQ0FBNkI7Ozs7O0lBRWpCLDhCQUF3Qjs7Ozs7SUFDeEIsdUNBQW9DOzs7OztJQUNwQyxnQ0FBc0I7Ozs7O0lBQ3RCLCtCQUE2Qjs7Ozs7SUFDN0IsNkJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2YsIFJlcGxheVN1YmplY3QsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtUb2tlbiwgVG9rZW5EYXRhLCBUcmFuc2xhdGVhYmxlfSBmcm9tICcuL2dueC1tb2RlbHMnO1xyXG5pbXBvcnQge0Nvb2tpZVNlcnZpY2V9IGZyb20gXCJuZ3gtY29va2llLXNlcnZpY2VcIjtcclxuaW1wb3J0IHtKd3RIZWxwZXJTZXJ2aWNlfSBmcm9tICdAYXV0aDAvYW5ndWxhci1qd3QnO1xyXG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlLCBSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEdueEF1dGhTZXJ2aWNlIHtcclxuICByZWFkb25seSBBVVRIX1NFUlZFUl9UT0tFTl9FTkRQT0lOVCA9ICcvb2F1dGgvdG9rZW4nO1xyXG4gIHJlYWRvbmx5IEFVVEhfU0VSVkVSX0xPR0lOX0VORFBPSU5UID0gJy9vYXV0aC9hdXRob3JpemUnO1xyXG4gIHJlYWRvbmx5IEFVVEhfU0VSVkVSX1NJR05fVVBfRU5EUE9JTlQgPSAnL3JlZ2lzdHJhdGlvbic7XHJcbiAgcmVhZG9ubHkgQVVUSF9TRVJWRVJfTEFOR1VBR0VfRU5EUE9JTlQgPSAnL2FwaS9hY2NvdW50cy9jdXJyZW50L2xvY2FsZSc7XHJcbiAgcmVhZG9ubHkgQUNDRVNTX1RPS0VOX0NPT0tJRV9OQU1FID0gJ2FjY2Vzc190b2tlbic7XHJcbiAgcmVhZG9ubHkgUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSA9ICdyZWZyZXNoX3Rva2VuJztcclxuICByZWFkb25seSBDT09LSUVfUEFUSCA9ICcvJztcclxuXHJcbiAgcHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICBjbGllbnRJZDogc3RyaW5nO1xyXG4gIGF1dGhTZXJ2ZXJVcmw6IHN0cmluZztcclxuICBjb29raWVEb21haW5OYW1lOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgand0SGVscGVyID0gbmV3IEp3dEhlbHBlclNlcnZpY2UoKTtcclxuXHJcbiAgcHJpdmF0ZSBhY2Nlc3NUb2tlbiQ6IFN1YmplY3Q8VG9rZW4+ID0gbmV3IFJlcGxheVN1YmplY3Q8VG9rZW4+KDEpO1xyXG4gIHByaXZhdGUgYWNjZXNzVG9rZW46IFRva2VuO1xyXG4gIHByaXZhdGUgcmVmcmVzaFRva2VuOiBUb2tlbjtcclxuXHJcbiAgcHJpdmF0ZSB0cmFuc2xhdG9yU2VydmljZTogVHJhbnNsYXRlYWJsZTtcclxuXHJcbiAgcHJpdmF0ZSB1c2VyTGFuZ3VhZ2U6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgY29va2llU2VydmljZTogQ29va2llU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoJ2VudicpIHByaXZhdGUgZW52KSB7XHJcblxyXG4gICAgdGhpcy5jbGllbnRJZCA9IGVudi5jbGllbnRJZDtcclxuICAgIHRoaXMuYXV0aFNlcnZlclVybCA9IGVudi5hdXRoU2VydmVyVXJsO1xyXG4gICAgdGhpcy5jb29raWVEb21haW5OYW1lID0gZW52LmNvb2tpZURvbWFpbk5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXRUcmFuc2xhdG9yU2VydmljZSh0cmFuc2xhdG9yU2VydmljZTogVHJhbnNsYXRlYWJsZSkge1xyXG4gICAgdGhpcy50cmFuc2xhdG9yU2VydmljZSA9IHRyYW5zbGF0b3JTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vIGludGVyY2VwdCByZXF1ZXN0IHdpdGggJ2NvZGUnIHBhcmFtIHRvIGdldCB0b2tlbiBieSB0aGUgY29kZVxyXG4gICAgbGV0IG1hdGNoaW5ncyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gubWF0Y2goL2NvZGU9KC4rPykoJi4rKT8kLyk7XHJcbiAgICBsZXQgY29kZSA9IG1hdGNoaW5ncyA/IG1hdGNoaW5nc1sxXSA6IG51bGw7XHJcbiAgICBpZiAoY29kZSkge1xyXG4gICAgICB0aGlzLmdldFRva2Vuc0J5Q29kZShjb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudHJ5VG9HZXRUb2tlbnNGcm9tQ29va2llT3JTdG9yYWdlKCkuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGdldFRva2VuKCk6IE9ic2VydmFibGU8VG9rZW4+IHtcclxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuJC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIGdldFRva2Vuc0J5Q29kZShjb2RlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcclxuICAgIHBhcmFtcy5hcHBlbmQoJ2dyYW50X3R5cGUnLCAnYXV0aG9yaXphdGlvbl9jb2RlJyk7XHJcbiAgICBwYXJhbXMuYXBwZW5kKCdjbGllbnRfaWQnLCB0aGlzLmNsaWVudElkKTtcclxuICAgIHBhcmFtcy5hcHBlbmQoJ3JlZGlyZWN0X3VyaScsIHRoaXMuZ2V0UmVkaXJlY3RVcmkoKSk7XHJcbiAgICBwYXJhbXMuYXBwZW5kKCdjb2RlJywgY29kZSk7XHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XHJcbiAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmFzaWMgJyArIGJ0b2EodGhpcy5jbGllbnRJZCArICc6c2VjcmV0JylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaHR0cC5wb3N0PFRva2VuRGF0YT4odGhpcy5hdXRoU2VydmVyVXJsICsgdGhpcy5BVVRIX1NFUlZFUl9UT0tFTl9FTkRQT0lOVCwgcGFyYW1zLnRvU3RyaW5nKCksXHJcbiAgICAgIHtoZWFkZXJzOiBoZWFkZXJzfSkuc3Vic2NyaWJlKHRva2VuRGF0YSA9PiB7XHJcbiAgICAgICAgdGhpcy5zYXZlVG9rZW5zKHRva2VuRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiQubmV4dCh0aGlzLmFjY2Vzc1Rva2VuKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUNvZGVQYXJhbUFuZE5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpLnRoZW4oKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyID0+IHRoaXMuYWNjZXNzVG9rZW4kLm5leHQobnVsbCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWNjZXNzVG9rZW5CeVJlZnJlc2hUb2tlbigpOiBPYnNlcnZhYmxlPFRva2VuPiB7XHJcbiAgICByZXR1cm4gdGhpcy50cnlUb0dldFRva2Vuc0Zyb21Db29raWVPclN0b3JhZ2UoKS5waXBlKFxyXG4gICAgICBzd2l0Y2hNYXAodmFsID0+IHRoaXMuZ2V0VG9rZW4oKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZWRpcmVjdFRvTG9naW5QYWdlKCkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt0aGlzLmF1dGhTZXJ2ZXJVcmx9JHt0aGlzLkFVVEhfU0VSVkVSX0xPR0lOX0VORFBPSU5UfWAgK1xyXG4gICAgICBgP3Jlc3BvbnNlX3R5cGU9Y29kZSZjbGllbnRfaWQ9JHt0aGlzLmNsaWVudElkfSZyZWRpcmVjdF91cmk9JHt0aGlzLmdldFJlZGlyZWN0VXJpKCl9YDtcclxuICB9XHJcblxyXG4gIHJlZGlyZWN0VG9TaWduVXBQYWdlKCkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt0aGlzLmF1dGhTZXJ2ZXJVcmx9JHt0aGlzLkFVVEhfU0VSVkVSX1NJR05fVVBfRU5EUE9JTlR9YDtcclxuICB9XHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgIHRoaXMuZGVsZXRlVG9rZW5zKCk7XHJcbiAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpO1xyXG4gICAgdGhpcy5uYXZpZ2F0ZVRvVGhlU2FtZVBhZ2UoKS50aGVuKCk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVVzZXJMYW5ndWFnZUZyb21TZXJ2ZXIoKSB7XHJcbiAgICB0aGlzLmh0dHAuZ2V0PHsgbG9jYWxlOiBzdHJpbmcgfT4odGhpcy5hdXRoU2VydmVyVXJsICsgdGhpcy5BVVRIX1NFUlZFUl9MQU5HVUFHRV9FTkRQT0lOVClcclxuICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxvY2FsZSAhPT0gdGhpcy50cmFuc2xhdG9yU2VydmljZS5nZXRDdXJyZW50TGFuZygpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgIHRoaXMudXNlckxhbmd1YWdlID0gcmVzLmxvY2FsZTtcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRvclNlcnZpY2UudXNlTGFuZ3VhZ2UodGhpcy51c2VyTGFuZ3VhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXREZWZhdWx0VXNlckxhbmd1YWdlKCkge1xyXG4gICAgdGhpcy51c2VyTGFuZ3VhZ2UgPSB0aGlzLnRyYW5zbGF0b3JTZXJ2aWNlLmdldEN1cnJlbnRMYW5nKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyeVRvR2V0VG9rZW5zRnJvbUNvb2tpZU9yU3RvcmFnZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIGlmICh0aGlzLmlzVmFsaWRUb2tlbih0aGlzLmFjY2Vzc1Rva2VuKSkge1xyXG4gICAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KHRoaXMuYWNjZXNzVG9rZW4pO1xyXG4gICAgICByZXR1cm4gb2YodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbG9vayBmb3IgYWNjZXNzX3Rva2VuIGluIGNvb2tpZVxyXG4gICAgbGV0IGVuY29kZWRUb2tlbiA9IHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5BQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUpO1xyXG4gICAgbGV0IGRlY29kZWRUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4oZW5jb2RlZFRva2VuKTtcclxuICAgIGlmICh0aGlzLmlzVmFsaWRUb2tlbihkZWNvZGVkVG9rZW4pKSB7XHJcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBkZWNvZGVkVG9rZW47XHJcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQoZGVjb2RlZFRva2VuKTtcclxuICAgICAgcmV0dXJuIG9mKHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZW1vdmVBY2Nlc3NUb2tlbkZyb21Db29raWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsb29rIGZvciBhIHJlZnJlc2ggdG9rZW4gaW4gY29va2llXHJcbiAgICBsZXQgcmVmcmVzaFRva2VuOiBUb2tlbjtcclxuICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xyXG4gICAgICByZWZyZXNoVG9rZW4gPSB0aGlzLnJlZnJlc2hUb2tlbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlZnJlc2hUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4odGhpcy5jb29raWVTZXJ2aWNlLmdldCh0aGlzLlJFRlJFU0hfVE9LRU5fQ09PS0lFX05BTUUpKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmlzVmFsaWRUb2tlbihyZWZyZXNoVG9rZW4pKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldE5ld1Rva2Vuc0J5UmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbikucGlwZShcclxuICAgICAgICB0YXAodG9rZW5EYXRhID0+IHtcclxuICAgICAgICAgIHRoaXMuc2F2ZVRva2Vucyh0b2tlbkRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiQubmV4dCh0aGlzLmFjY2Vzc1Rva2VuKTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBtYXAodG9rZW5EYXRhID0+ICEhdG9rZW5EYXRhKSxcclxuICAgICAgICBjYXRjaEVycm9yKGVyciA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZVJlZnJlc2hUb2tlbkZyb21Db29raWUoKTtcclxuICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQobnVsbCk7XHJcbiAgICAgICAgICByZXR1cm4gb2YoZmFsc2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZVJlZnJlc2hUb2tlbkZyb21Db29raWUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpO1xyXG4gICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlQ29kZVBhcmFtQW5kTmF2aWdhdGVUb1RoZVNhbWVQYWdlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgbGV0IHF1ZXJ5UGFyYW1zOiBhbnkgPSB7fTtcclxuICAgIGxldCBwYXJhbXMgPSB0aGlzLnJvdXRlLnNuYXBzaG90LnF1ZXJ5UGFyYW1NYXA7XHJcbiAgICBwYXJhbXMua2V5cy5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICBpZiAoayAhPT0gJ2NvZGUnKSB7XHJcbiAgICAgICAgcXVlcnlQYXJhbXNba10gPSBwYXJhbXMuZ2V0KGspO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgY3VycmVudFVybFBhdGggPSB0aGlzLmdldEN1cnJlbnRVcmxQYXRoKCk7XHJcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoXHJcbiAgICAgIFtjdXJyZW50VXJsUGF0aF0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWxhdGl2ZVRvOiB0aGlzLnJvdXRlLFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBxdWVyeVBhcmFtcyxcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGxldCBxdWVyeVBhcmFtczogYW55ID0ge307XHJcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5xdWVyeVBhcmFtTWFwO1xyXG4gICAgcGFyYW1zLmtleXMuZm9yRWFjaChrID0+IHtcclxuICAgICAgICBxdWVyeVBhcmFtc1trXSA9IHBhcmFtcy5nZXQoayk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgY3VycmVudFVybFBhdGggPSB0aGlzLmdldEN1cnJlbnRVcmxQYXRoKCk7XHJcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoXHJcbiAgICAgIFtjdXJyZW50VXJsUGF0aF0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWxhdGl2ZVRvOiB0aGlzLnJvdXRlLFxyXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBxdWVyeVBhcmFtcyxcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhdmVUb2tlbnModG9rZW5EYXRhOiBUb2tlbkRhdGEpIHtcclxuICAgIGlmICh0b2tlbkRhdGEpIHtcclxuICAgICAgbGV0IGRlY29kZWRBY2Nlc3NUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4odG9rZW5EYXRhLmFjY2Vzc190b2tlbik7XHJcbiAgICAgIGxldCBhY0V4cGlyZURhdGUgPSBuZXcgRGF0ZShkZWNvZGVkQWNjZXNzVG9rZW4uZXhwICogMTAwMCk7XHJcbiAgICAgIHRoaXMuY29va2llU2VydmljZS5zZXQodGhpcy5BQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUsIHRva2VuRGF0YS5hY2Nlc3NfdG9rZW4sIGFjRXhwaXJlRGF0ZSwgdGhpcy5DT09LSUVfUEFUSCwgdGhpcy5jb29raWVEb21haW5OYW1lKTtcclxuICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGRlY29kZWRBY2Nlc3NUb2tlbjtcclxuXHJcbiAgICAgIGxldCBkZWNvZGVkUmVmcmVzaFRva2VuID0gdGhpcy5kZWNvZGVUb2tlbih0b2tlbkRhdGEucmVmcmVzaF90b2tlbik7XHJcbiAgICAgIGxldCBydEV4cGlyZURhdGUgPSBuZXcgRGF0ZShkZWNvZGVkUmVmcmVzaFRva2VuLmV4cCAqIDEwMDApO1xyXG4gICAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KHRoaXMuUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSwgdG9rZW5EYXRhLnJlZnJlc2hfdG9rZW4sIHJ0RXhwaXJlRGF0ZSwgdGhpcy5DT09LSUVfUEFUSCwgdGhpcy5jb29raWVEb21haW5OYW1lKTtcclxuICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSB0aGlzLmRlY29kZVRva2VuKHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q3VycmVudFVybFBhdGgoKSB7XHJcbiAgICBsZXQgdXJsID0gdGhpcy5yb3V0ZXIudXJsO1xyXG4gICAgaWYgKHVybC5pbmRleE9mKCc/JykgPiAwKSB7XHJcbiAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoJz8nKSlcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE5ld1Rva2Vuc0J5UmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbjogVG9rZW4pOiBPYnNlcnZhYmxlPFRva2VuRGF0YT4ge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XHJcbiAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmFzaWMgJyArIGJ0b2EodGhpcy5jbGllbnRJZCArICc6c2VjcmV0JylcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBib2R5ID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xyXG4gICAgYm9keS5zZXQoJ2dyYW50X3R5cGUnLCAncmVmcmVzaF90b2tlbicpO1xyXG4gICAgYm9keS5zZXQoJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoVG9rZW4uZW5jb2RlZFRva2VuKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8VG9rZW5EYXRhPih0aGlzLmF1dGhTZXJ2ZXJVcmwgKyB0aGlzLkFVVEhfU0VSVkVSX1RPS0VOX0VORFBPSU5ULCBib2R5LnRvU3RyaW5nKCksIHtoZWFkZXJzOiBoZWFkZXJzfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzVmFsaWRUb2tlbih0b2tlbjogVG9rZW4pOiBib29sZWFuIHtcclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IGV4cGlyYXRpb25TZWNvbmRzID0gdG9rZW4uZXhwO1xyXG4gICAgcmV0dXJuIGV4cGlyYXRpb25TZWNvbmRzICYmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IGV4cGlyYXRpb25TZWNvbmRzICogMTAwMCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlbGV0ZVRva2VucygpIHtcclxuICAgIHRoaXMucmVtb3ZlQWNjZXNzVG9rZW5Gcm9tQ29va2llKCk7XHJcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcclxuICAgIHRoaXMucmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpO1xyXG4gICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVBY2Nlc3NUb2tlbkZyb21Db29raWUoKSB7XHJcbiAgICBsZXQgY29va2llVmFsdWUgPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KHRoaXMuQUNDRVNTX1RPS0VOX0NPT0tJRV9OQU1FKTtcclxuICAgIGlmIChjb29raWVWYWx1ZSkge1xyXG4gICAgICBsZXQgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gICAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KHRoaXMuQUNDRVNTX1RPS0VOX0NPT0tJRV9OQU1FLCBjb29raWVWYWx1ZSwgZXhwaXJlRGF0ZSwgdGhpcy5DT09LSUVfUEFUSCwgdGhpcy5jb29raWVEb21haW5OYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpIHtcclxuICAgIGxldCBjb29raWVWYWx1ZSA9IHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5SRUZSRVNIX1RPS0VOX0NPT0tJRV9OQU1FKTtcclxuICAgIGlmIChjb29raWVWYWx1ZSkge1xyXG4gICAgICBsZXQgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gICAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KHRoaXMuUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSwgY29va2llVmFsdWUsIGV4cGlyZURhdGUsIHRoaXMuQ09PS0lFX1BBVEgsIHRoaXMuY29va2llRG9tYWluTmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlY29kZVRva2VuKGVuY29kZWRUb2tlbjogc3RyaW5nKTogVG9rZW4ge1xyXG4gICAgaWYgKCFlbmNvZGVkVG9rZW4pIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRlY29kZWRUb2tlbiA9IHRoaXMuand0SGVscGVyLmRlY29kZVRva2VuKGVuY29kZWRUb2tlbikgYXMgVG9rZW47XHJcbiAgICBpZiAoZGVjb2RlZFRva2VuKSB7XHJcbiAgICAgIGRlY29kZWRUb2tlbi5lbmNvZGVkVG9rZW4gPSBlbmNvZGVkVG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlY29kZWRUb2tlbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UmVkaXJlY3RVcmkoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9eKGh0dHBbc10/OlxcL1xcL1thLXpBLVpcXFxcLjowLTldKykoXFwvLiopJC8sICckMScpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19