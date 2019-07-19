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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGguc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2dueC1hdXRoLyIsInNvdXJjZXMiOlsibGliL2dueC1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDN0QsT0FBTyxFQUFhLEVBQUUsRUFBRSxhQUFhLEVBQVUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUt2RCxNQUFNLE9BQU8sY0FBYzs7Ozs7Ozs7SUF5QnpCLFlBQW9CLElBQWdCLEVBQ2hCLGFBQTRCLEVBQzVCLE1BQWMsRUFDZCxLQUFxQixFQUNOLEdBQUc7UUFKbEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDTixRQUFHLEdBQUgsR0FBRyxDQUFBO1FBNUI3QiwrQkFBMEIsR0FBRyxjQUFjLENBQUM7UUFDNUMsK0JBQTBCLEdBQUcsa0JBQWtCLENBQUM7UUFDaEQsaUNBQTRCLEdBQUcsZUFBZSxDQUFDO1FBQy9DLGtDQUE2QixHQUFHLDhCQUE4QixDQUFDO1FBQy9ELDZCQUF3QixHQUFHLGNBQWMsQ0FBQztRQUMxQyw4QkFBeUIsR0FBRyxlQUFlLENB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b20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiwgUmVwbGF5U3ViamVjdCwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VG9rZW4sIFRva2VuRGF0YSwgVHJhbnNsYXRlYWJsZX0gZnJvbSAnLi9nbngtbW9kZWxzJztcbmltcG9ydCB7Q29va2llU2VydmljZX0gZnJvbSBcIm5neC1jb29raWUtc2VydmljZVwiO1xuaW1wb3J0IHtKd3RIZWxwZXJTZXJ2aWNlfSBmcm9tICdAYXV0aDAvYW5ndWxhci1qd3QnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEdueEF1dGhTZXJ2aWNlIHtcbiAgcmVhZG9ubHkgQVVUSF9TRVJWRVJfVE9LRU5fRU5EUE9JTlQgPSAnL29hdXRoL3Rva2VuJztcbiAgcmVhZG9ubHkgQVVUSF9TRVJWRVJfTE9HSU5fRU5EUE9JTlQgPSAnL29hdXRoL2F1dGhvcml6ZSc7XG4gIHJlYWRvbmx5IEFVVEhfU0VSVkVSX1NJR05fVVBfRU5EUE9JTlQgPSAnL3JlZ2lzdHJhdGlvbic7XG4gIHJlYWRvbmx5IEFVVEhfU0VSVkVSX0xBTkdVQUdFX0VORFBPSU5UID0gJy9hcGkvYWNjb3VudHMvY3VycmVudC9sb2NhbGUnO1xuICByZWFkb25seSBBQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUgPSAnYWNjZXNzX3Rva2VuJztcbiAgcmVhZG9ubHkgUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSA9ICdyZWZyZXNoX3Rva2VuJztcbiAgcmVhZG9ubHkgQ09PS0lFX1BBVEggPSAnLyc7XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIGNsaWVudElkOiBzdHJpbmc7XG4gIGF1dGhTZXJ2ZXJVcmw6IHN0cmluZztcbiAgY29va2llRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgand0SGVscGVyID0gbmV3IEp3dEhlbHBlclNlcnZpY2UoKTtcblxuICBwcml2YXRlIGFjY2Vzc1Rva2VuJDogU3ViamVjdDxUb2tlbj4gPSBuZXcgUmVwbGF5U3ViamVjdDxUb2tlbj4oMSk7XG4gIHByaXZhdGUgYWNjZXNzVG9rZW46IFRva2VuO1xuICBwcml2YXRlIHJlZnJlc2hUb2tlbjogVG9rZW47XG5cbiAgcHJpdmF0ZSB0cmFuc2xhdG9yU2VydmljZTogVHJhbnNsYXRlYWJsZTtcblxuICBwcml2YXRlIHVzZXJMYW5ndWFnZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb29raWVTZXJ2aWNlOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgICAgICAgQEluamVjdCgnZW52JykgcHJpdmF0ZSBlbnYpIHtcblxuICAgIHRoaXMuY2xpZW50SWQgPSBlbnYuY2xpZW50SWQ7XG4gICAgdGhpcy5hdXRoU2VydmVyVXJsID0gZW52LmF1dGhTZXJ2ZXJVcmw7XG4gICAgdGhpcy5jb29raWVEb21haW5OYW1lID0gZW52LmNvb2tpZURvbWFpbk5hbWU7XG4gIH1cblxuICBzZXRUcmFuc2xhdG9yU2VydmljZSh0cmFuc2xhdG9yU2VydmljZTogVHJhbnNsYXRlYWJsZSkge1xuICAgIHRoaXMudHJhbnNsYXRvclNlcnZpY2UgPSB0cmFuc2xhdG9yU2VydmljZTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLy8gaW50ZXJjZXB0IHJlcXVlc3Qgd2l0aCAnY29kZScgcGFyYW0gdG8gZ2V0IHRva2VuIGJ5IHRoZSBjb2RlXG4gICAgbGV0IG1hdGNoaW5ncyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gubWF0Y2goL2NvZGU9KC4rPykoJi4rKT8kLyk7XG4gICAgbGV0IGNvZGUgPSBtYXRjaGluZ3MgPyBtYXRjaGluZ3NbMV0gOiBudWxsO1xuICAgIGlmIChjb2RlKSB7XG4gICAgICB0aGlzLmdldFRva2Vuc0J5Q29kZShjb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cnlUb0dldFRva2Vuc0Zyb21Db29raWVPclN0b3JhZ2UoKS5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBnZXRUb2tlbigpOiBPYnNlcnZhYmxlPFRva2VuPiB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNjZXNzVG9rZW4kLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0VG9rZW5zQnlDb2RlKGNvZGU6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICBwYXJhbXMuYXBwZW5kKCdncmFudF90eXBlJywgJ2F1dGhvcml6YXRpb25fY29kZScpO1xuICAgIHBhcmFtcy5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpO1xuICAgIHBhcmFtcy5hcHBlbmQoJ3JlZGlyZWN0X3VyaScsIHRoaXMuZ2V0UmVkaXJlY3RVcmkoKSk7XG4gICAgcGFyYW1zLmFwcGVuZCgnY29kZScsIGNvZGUpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAnQXV0aG9yaXphdGlvbic6ICdCYXNpYyAnICsgYnRvYSh0aGlzLmNsaWVudElkICsgJzpzZWNyZXQnKVxuICAgIH0pO1xuXG4gICAgdGhpcy5odHRwLnBvc3Q8VG9rZW5EYXRhPih0aGlzLmF1dGhTZXJ2ZXJVcmwgKyB0aGlzLkFVVEhfU0VSVkVSX1RPS0VOX0VORFBPSU5ULCBwYXJhbXMudG9TdHJpbmcoKSxcbiAgICAgIHtoZWFkZXJzOiBoZWFkZXJzfSkuc3Vic2NyaWJlKHRva2VuRGF0YSA9PiB7XG4gICAgICAgIHRoaXMuc2F2ZVRva2Vucyh0b2tlbkRhdGEpO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLnJlbW92ZUNvZGVQYXJhbUFuZE5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpLnRoZW4oKTtcbiAgICAgIH0sXG4gICAgICBlcnIgPT4gdGhpcy5hY2Nlc3NUb2tlbiQubmV4dChudWxsKSk7XG4gIH1cblxuICBnZXRBY2Nlc3NUb2tlbkJ5UmVmcmVzaFRva2VuKCk6IE9ic2VydmFibGU8VG9rZW4+IHtcbiAgICByZXR1cm4gdGhpcy50cnlUb0dldFRva2Vuc0Zyb21Db29raWVPclN0b3JhZ2UoKS5waXBlKFxuICAgICAgc3dpdGNoTWFwKHZhbCA9PiB0aGlzLmdldFRva2VuKCkpXG4gICAgKTtcbiAgfVxuXG4gIHJlZGlyZWN0VG9Mb2dpblBhZ2UoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt0aGlzLmF1dGhTZXJ2ZXJVcmx9JHt0aGlzLkFVVEhfU0VSVkVSX0xPR0lOX0VORFBPSU5UfWAgK1xuICAgICAgYD9yZXNwb25zZV90eXBlPWNvZGUmY2xpZW50X2lkPSR7dGhpcy5jbGllbnRJZH0mcmVkaXJlY3RfdXJpPSR7dGhpcy5nZXRSZWRpcmVjdFVyaSgpfWA7XG4gIH1cblxuICByZWRpcmVjdFRvU2lnblVwUGFnZSgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3RoaXMuYXV0aFNlcnZlclVybH0ke3RoaXMuQVVUSF9TRVJWRVJfU0lHTl9VUF9FTkRQT0lOVH1gO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIHRoaXMuZGVsZXRlVG9rZW5zKCk7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiQubmV4dChudWxsKTtcbiAgICB0aGlzLm5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpLnRoZW4oKTtcbiAgfVxuXG4gIHJldHJpZXZlVXNlckxhbmd1YWdlRnJvbVNlcnZlcigpIHtcbiAgICB0aGlzLmh0dHAuZ2V0PHsgbG9jYWxlOiBzdHJpbmcgfT4odGhpcy5hdXRoU2VydmVyVXJsICsgdGhpcy5BVVRIX1NFUlZFUl9MQU5HVUFHRV9FTkRQT0lOVClcbiAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMubG9jYWxlICE9PSB0aGlzLnRyYW5zbGF0b3JTZXJ2aWNlLmdldEN1cnJlbnRMYW5nKCkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIHRoaXMudXNlckxhbmd1YWdlID0gcmVzLmxvY2FsZTtcbiAgICAgICAgICB0aGlzLnRyYW5zbGF0b3JTZXJ2aWNlLnVzZUxhbmd1YWdlKHRoaXMudXNlckxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBzZXREZWZhdWx0VXNlckxhbmd1YWdlKCkge1xuICAgIHRoaXMudXNlckxhbmd1YWdlID0gdGhpcy50cmFuc2xhdG9yU2VydmljZS5nZXRDdXJyZW50TGFuZygpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cnlUb0dldFRva2Vuc0Zyb21Db29raWVPclN0b3JhZ2UoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZFRva2VuKHRoaXMuYWNjZXNzVG9rZW4pKSB7XG4gICAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgcmV0dXJuIG9mKHRydWUpO1xuICAgIH1cblxuICAgIC8vIGxvb2sgZm9yIGFjY2Vzc190b2tlbiBpbiBjb29raWVcbiAgICBsZXQgZW5jb2RlZFRva2VuID0gdGhpcy5jb29raWVTZXJ2aWNlLmdldCh0aGlzLkFDQ0VTU19UT0tFTl9DT09LSUVfTkFNRSk7XG4gICAgbGV0IGRlY29kZWRUb2tlbiA9IHRoaXMuZGVjb2RlVG9rZW4oZW5jb2RlZFRva2VuKTtcbiAgICBpZiAodGhpcy5pc1ZhbGlkVG9rZW4oZGVjb2RlZFRva2VuKSkge1xuICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGRlY29kZWRUb2tlbjtcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4kLm5leHQoZGVjb2RlZFRva2VuKTtcbiAgICAgIHJldHVybiBvZih0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVBY2Nlc3NUb2tlbkZyb21Db29raWUoKTtcbiAgICB9XG5cbiAgICAvLyBsb29rIGZvciBhIHJlZnJlc2ggdG9rZW4gaW4gY29va2llXG4gICAgbGV0IHJlZnJlc2hUb2tlbjogVG9rZW47XG4gICAgaWYgKHRoaXMucmVmcmVzaFRva2VuKSB7XG4gICAgICByZWZyZXNoVG9rZW4gPSB0aGlzLnJlZnJlc2hUb2tlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVmcmVzaFRva2VuID0gdGhpcy5kZWNvZGVUb2tlbih0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KHRoaXMuUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1ZhbGlkVG9rZW4ocmVmcmVzaFRva2VuKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV3VG9rZW5zQnlSZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKS5waXBlKFxuICAgICAgICB0YXAodG9rZW5EYXRhID0+IHtcbiAgICAgICAgICB0aGlzLnNhdmVUb2tlbnModG9rZW5EYXRhKTtcbiAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKHRva2VuRGF0YSA9PiAhIXRva2VuRGF0YSksXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVJlZnJlc2hUb2tlbkZyb21Db29raWUoKTtcbiAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpO1xuICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZVJlZnJlc2hUb2tlbkZyb21Db29raWUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2Vzc1Rva2VuJC5uZXh0KG51bGwpO1xuICAgIHJldHVybiBvZihmYWxzZSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUNvZGVQYXJhbUFuZE5hdmlnYXRlVG9UaGVTYW1lUGFnZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBsZXQgcXVlcnlQYXJhbXM6IGFueSA9IHt9O1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLnJvdXRlLnNuYXBzaG90LnF1ZXJ5UGFyYW1NYXA7XG4gICAgcGFyYW1zLmtleXMuZm9yRWFjaChrID0+IHtcbiAgICAgIGlmIChrICE9PSAnY29kZScpIHtcbiAgICAgICAgcXVlcnlQYXJhbXNba10gPSBwYXJhbXMuZ2V0KGspO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRVcmxQYXRoID0gdGhpcy5nZXRDdXJyZW50VXJsUGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcbiAgICAgIFtjdXJyZW50VXJsUGF0aF0sXG4gICAgICB7XG4gICAgICAgIHJlbGF0aXZlVG86IHRoaXMucm91dGUsXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBxdWVyeVBhcmFtcyxcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZVRvVGhlU2FtZVBhZ2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgbGV0IHF1ZXJ5UGFyYW1zOiBhbnkgPSB7fTtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5xdWVyeVBhcmFtTWFwO1xuICAgIHBhcmFtcy5rZXlzLmZvckVhY2goayA9PiB7XG4gICAgICAgIHF1ZXJ5UGFyYW1zW2tdID0gcGFyYW1zLmdldChrKTtcbiAgICB9KTtcblxuICAgIGxldCBjdXJyZW50VXJsUGF0aCA9IHRoaXMuZ2V0Q3VycmVudFVybFBhdGgoKTtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoXG4gICAgICBbY3VycmVudFVybFBhdGhdLFxuICAgICAge1xuICAgICAgICByZWxhdGl2ZVRvOiB0aGlzLnJvdXRlLFxuICAgICAgICBxdWVyeVBhcmFtczogcXVlcnlQYXJhbXMsXG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2F2ZVRva2Vucyh0b2tlbkRhdGE6IFRva2VuRGF0YSkge1xuICAgIGlmICh0b2tlbkRhdGEpIHtcbiAgICAgIGxldCBkZWNvZGVkQWNjZXNzVG9rZW4gPSB0aGlzLmRlY29kZVRva2VuKHRva2VuRGF0YS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgbGV0IGFjRXhwaXJlRGF0ZSA9IG5ldyBEYXRlKGRlY29kZWRBY2Nlc3NUb2tlbi5leHAgKiAxMDAwKTtcbiAgICAgIHRoaXMuY29va2llU2VydmljZS5zZXQodGhpcy5BQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUsIHRva2VuRGF0YS5hY2Nlc3NfdG9rZW4sIGFjRXhwaXJlRGF0ZSwgdGhpcy5DT09LSUVfUEFUSCwgdGhpcy5jb29raWVEb21haW5OYW1lKTtcbiAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBkZWNvZGVkQWNjZXNzVG9rZW47XG5cbiAgICAgIGxldCBkZWNvZGVkUmVmcmVzaFRva2VuID0gdGhpcy5kZWNvZGVUb2tlbih0b2tlbkRhdGEucmVmcmVzaF90b2tlbik7XG4gICAgICBsZXQgcnRFeHBpcmVEYXRlID0gbmV3IERhdGUoZGVjb2RlZFJlZnJlc2hUb2tlbi5leHAgKiAxMDAwKTtcbiAgICAgIHRoaXMuY29va2llU2VydmljZS5zZXQodGhpcy5SRUZSRVNIX1RPS0VOX0NPT0tJRV9OQU1FLCB0b2tlbkRhdGEucmVmcmVzaF90b2tlbiwgcnRFeHBpcmVEYXRlLCB0aGlzLkNPT0tJRV9QQVRILCB0aGlzLmNvb2tpZURvbWFpbk5hbWUpO1xuICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSB0aGlzLmRlY29kZVRva2VuKHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEN1cnJlbnRVcmxQYXRoKCkge1xuICAgIGxldCB1cmwgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgaWYgKHVybC5pbmRleE9mKCc/JykgPiAwKSB7XG4gICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIHVybC5pbmRleE9mKCc/JykpXG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBwcml2YXRlIGdldE5ld1Rva2Vuc0J5UmVmcmVzaFRva2VuKHJlZnJlc2hUb2tlbjogVG9rZW4pOiBPYnNlcnZhYmxlPFRva2VuRGF0YT4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmFzaWMgJyArIGJ0b2EodGhpcy5jbGllbnRJZCArICc6c2VjcmV0JylcbiAgICB9KTtcblxuICAgIGxldCBib2R5ID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIGJvZHkuc2V0KCdncmFudF90eXBlJywgJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICBib2R5LnNldCgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hUb2tlbi5lbmNvZGVkVG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFRva2VuRGF0YT4odGhpcy5hdXRoU2VydmVyVXJsICsgdGhpcy5BVVRIX1NFUlZFUl9UT0tFTl9FTkRQT0lOVCwgYm9keS50b1N0cmluZygpLCB7aGVhZGVyczogaGVhZGVyc30pO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1ZhbGlkVG9rZW4odG9rZW46IFRva2VuKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgZXhwaXJhdGlvblNlY29uZHMgPSB0b2tlbi5leHA7XG4gICAgcmV0dXJuIGV4cGlyYXRpb25TZWNvbmRzICYmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IGV4cGlyYXRpb25TZWNvbmRzICogMTAwMCk7XG4gIH1cblxuICBwcml2YXRlIGRlbGV0ZVRva2VucygpIHtcbiAgICB0aGlzLnJlbW92ZUFjY2Vzc1Rva2VuRnJvbUNvb2tpZSgpO1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgIHRoaXMucmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpO1xuICAgIHRoaXMucmVmcmVzaFRva2VuID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQWNjZXNzVG9rZW5Gcm9tQ29va2llKCkge1xuICAgIGxldCBjb29raWVWYWx1ZSA9IHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5BQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUpO1xuICAgIGlmIChjb29raWVWYWx1ZSkge1xuICAgICAgbGV0IGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgICAgIHRoaXMuY29va2llU2VydmljZS5zZXQodGhpcy5BQ0NFU1NfVE9LRU5fQ09PS0lFX05BTUUsIGNvb2tpZVZhbHVlLCBleHBpcmVEYXRlLCB0aGlzLkNPT0tJRV9QQVRILCB0aGlzLmNvb2tpZURvbWFpbk5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlUmVmcmVzaFRva2VuRnJvbUNvb2tpZSgpIHtcbiAgICBsZXQgY29va2llVmFsdWUgPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KHRoaXMuUkVGUkVTSF9UT0tFTl9DT09LSUVfTkFNRSk7XG4gICAgaWYgKGNvb2tpZVZhbHVlKSB7XG4gICAgICBsZXQgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgICAgdGhpcy5jb29raWVTZXJ2aWNlLnNldCh0aGlzLlJFRlJFU0hfVE9LRU5fQ09PS0lFX05BTUUsIGNvb2tpZVZhbHVlLCBleHBpcmVEYXRlLCB0aGlzLkNPT0tJRV9QQVRILCB0aGlzLmNvb2tpZURvbWFpbk5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGVjb2RlVG9rZW4oZW5jb2RlZFRva2VuOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKCFlbmNvZGVkVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBkZWNvZGVkVG9rZW4gPSB0aGlzLmp3dEhlbHBlci5kZWNvZGVUb2tlbihlbmNvZGVkVG9rZW4pIGFzIFRva2VuO1xuICAgIGlmIChkZWNvZGVkVG9rZW4pIHtcbiAgICAgIGRlY29kZWRUb2tlbi5lbmNvZGVkVG9rZW4gPSBlbmNvZGVkVG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29kZWRUb2tlbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVkaXJlY3RVcmkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvXihodHRwW3NdPzpcXC9cXC9bYS16QS1aXFxcXC46MC05XSspKFxcLy4qKSQvLCAnJDEnKTtcbiAgfVxuXG59XG4iXX0=