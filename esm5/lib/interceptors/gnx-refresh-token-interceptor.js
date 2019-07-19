/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, first, switchMap } from "rxjs/operators";
import { GnxAuthService } from "../gnx-auth.service";
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
            return next.handle(req).pipe(catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                if (err instanceof HttpErrorResponse && err.status === 401) { // it seems access token hs expired, try to get new tokens by refresh token
                    if (_this.notTriedYet) {
                        _this.notTriedYet = false;
                        return _this.gnxAuthService.getAccessTokenByRefreshToken().pipe(first(), switchMap((/**
                         * @param {?} token
                         * @return {?}
                         */
                        function (token) {
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
                    return throwError(err);
                }
            })));
        }
        return next.handle(req);
    };
    GnxRefreshTokenInterceptor.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GnxRefreshTokenInterceptor.ctorParameters = function () { return [
        { type: GnxAuthService }
    ]; };
    return GnxRefreshTokenInterceptor;
}());
export { GnxRefreshTokenInterceptor };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nbngtYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9pbnRlcmNlcHRvcnMvZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUF1RCxNQUFNLHNCQUFzQixDQUFDO0FBRTdHLE9BQU8sRUFBYSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRW5EO0lBS0ksb0NBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUY1QyxnQkFBVyxHQUFHLElBQUksQ0FBQztJQUd6QixDQUFDOzs7Ozs7SUFFRCw4Q0FBUzs7Ozs7SUFBVCxVQUFVLEdBQXFCLEVBQUUsSUFBaUI7UUFBbEQsaUJBa0NDO1FBakNDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDMUIsVUFBVTs7OztZQUFDLFVBQUEsR0FBRztnQkFDWixJQUFJLEdBQUcsWUFBWSxpQkFBaUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxFQUFFLDJFQUEyRTtvQkFDdkksSUFBSSxLQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzt3QkFDekIsT0FBTyxLQUFJLENBQUMsY0FBYyxDQUFDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxDQUM1RCxLQUFLLEVBQUUsRUFDUCxTQUFTOzs7O3dCQUFDLFVBQUEsS0FBSzs0QkFDYixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs0QkFDeEIsSUFBSSxLQUFLLEVBQUU7O29DQUNMLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO29DQUN6QixVQUFVLEVBQUU7d0NBQ1YsYUFBYSxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUMsWUFBWTtxQ0FDOUM7aUNBQ0YsQ0FBQztnQ0FDRixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQ2hDOzRCQUNELEtBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzt3QkFDNUMsQ0FBQyxFQUFDLENBQ0gsQ0FBQztxQkFDSDt5QkFBTTt3QkFDTCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3FCQUMzQztpQkFDRjtxQkFBTTtvQkFDTCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEI7WUFDSCxDQUFDLEVBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Z0JBMUNKLFVBQVU7Ozs7Z0JBRkgsY0FBYzs7SUE2Q3RCLGlDQUFDO0NBQUEsQUEzQ0QsSUEyQ0M7U0ExQ1ksMEJBQTBCOzs7Ozs7SUFFckMsaURBQTJCOzs7OztJQUViLG9EQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBFcnJvclJlc3BvbnNlLCBIdHRwRXZlbnQsIEh0dHBIYW5kbGVyLCBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpcnN0LCBzd2l0Y2hNYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuaW1wb3J0IHtHbnhBdXRoU2VydmljZX0gZnJvbSBcIi4uL2dueC1hdXRoLnNlcnZpY2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdueFJlZnJlc2hUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICBwcml2YXRlIG5vdFRyaWVkWWV0ID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ254QXV0aFNlcnZpY2U6IEdueEF1dGhTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICBpZiAocmVxLnVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpLnBpcGUoXG4gICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlICYmIGVyci5zdGF0dXMgPT09IDQwMSkgeyAvLyBpdCBzZWVtcyBhY2Nlc3MgdG9rZW4gaHMgZXhwaXJlZCwgdHJ5IHRvIGdldCBuZXcgdG9rZW5zIGJ5IHJlZnJlc2ggdG9rZW5cbiAgICAgICAgICAgICAgaWYgKHRoaXMubm90VHJpZWRZZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ254QXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW5CeVJlZnJlc2hUb2tlbigpLnBpcGUoXG4gICAgICAgICAgICAgICAgICBmaXJzdCgpLFxuICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RUcmllZFlldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdSZXF1ZXN0ID0gcmVxLmNsb25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4uZW5jb2RlZFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKG5ld1JlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm90VHJpZWRZZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xuICAgIH1cbn1cbiJdfQ==