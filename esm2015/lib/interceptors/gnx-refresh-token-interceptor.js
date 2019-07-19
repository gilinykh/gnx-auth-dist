/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, first, switchMap } from "rxjs/operators";
import { GnxAuthService } from "../gnx-auth.service";
export class GnxRefreshTokenInterceptor {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    GnxRefreshTokenInterceptor.prototype.notTriedYet;
    /**
     * @type {?}
     * @private
     */
    GnxRefreshTokenInterceptor.prototype.gnxAuthService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nbngtYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9pbnRlcmNlcHRvcnMvZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUF1RCxNQUFNLHNCQUFzQixDQUFDO0FBRTdHLE9BQU8sRUFBYSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBR25ELE1BQU0sT0FBTywwQkFBMEI7Ozs7SUFJbkMsWUFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRjVDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO0lBR3pCLENBQUM7Ozs7OztJQUVELFNBQVMsQ0FBQyxHQUFxQixFQUFFLElBQWlCO1FBQ2hELElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDMUIsVUFBVTs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNmLElBQUksR0FBRyxZQUFZLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLEVBQUUsMkVBQTJFO29CQUN2SSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO3dCQUN6QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxJQUFJLENBQzVELEtBQUssRUFBRSxFQUNQLFNBQVM7Ozs7d0JBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzRCQUN4QixJQUFJLEtBQUssRUFBRTs7b0NBQ0wsVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0NBQ3pCLFVBQVUsRUFBRTt3Q0FDVixhQUFhLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZO3FDQUM5QztpQ0FDRixDQUFDO2dDQUNGLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs2QkFDaEM7NEJBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3dCQUM1QyxDQUFDLEVBQUMsQ0FDSCxDQUFDO3FCQUNIO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUM7cUJBQzNDO2lCQUNGO3FCQUFNO29CQUNMLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjtZQUNILENBQUMsRUFBQyxDQUNILENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7WUExQ0osVUFBVTs7OztZQUZILGNBQWM7Ozs7Ozs7SUFLcEIsaURBQTJCOzs7OztJQUViLG9EQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBFcnJvclJlc3BvbnNlLCBIdHRwRXZlbnQsIEh0dHBIYW5kbGVyLCBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpcnN0LCBzd2l0Y2hNYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuaW1wb3J0IHtHbnhBdXRoU2VydmljZX0gZnJvbSBcIi4uL2dueC1hdXRoLnNlcnZpY2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdueFJlZnJlc2hUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICBwcml2YXRlIG5vdFRyaWVkWWV0ID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ254QXV0aFNlcnZpY2U6IEdueEF1dGhTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICBpZiAocmVxLnVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpLnBpcGUoXG4gICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlICYmIGVyci5zdGF0dXMgPT09IDQwMSkgeyAvLyBpdCBzZWVtcyBhY2Nlc3MgdG9rZW4gaHMgZXhwaXJlZCwgdHJ5IHRvIGdldCBuZXcgdG9rZW5zIGJ5IHJlZnJlc2ggdG9rZW5cbiAgICAgICAgICAgICAgaWYgKHRoaXMubm90VHJpZWRZZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ254QXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW5CeVJlZnJlc2hUb2tlbigpLnBpcGUoXG4gICAgICAgICAgICAgICAgICBmaXJzdCgpLFxuICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RUcmllZFlldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdSZXF1ZXN0ID0gcmVxLmNsb25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4uZW5jb2RlZFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKG5ld1JlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm90VHJpZWRZZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xuICAgIH1cbn1cbiJdfQ==