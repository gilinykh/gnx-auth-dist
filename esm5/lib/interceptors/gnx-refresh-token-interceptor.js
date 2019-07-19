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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nbngtYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9pbnRlcmNlcHRvcnMvZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUF1RCxNQUFNLHNCQUFzQixDQUFDO0FBRTdHLE9BQU8sRUFBYSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRW5EO0lBS0ksb0NBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUY1QyxnQkFBVyxHQUFHLElBQUksQ0FBQztJQUd6QixDQUFDOzs7Ozs7SUFFRCw4Q0FBUzs7Ozs7SUFBVCxVQUFVLEdBQXFCLEVBQUUsSUFBaUI7UUFBbEQsaUJBa0NDO1FBakNDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDMUIsVUFBVTs7OztZQUFDLFVBQUEsR0FBRztnQkFDWixJQUFJLEdBQUcsWUFBWSxpQkFBaUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxFQUFFLDJFQUEyRTtvQkFDdkksSUFBSSxLQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzt3QkFDekIsT0FBTyxLQUFJLENBQUMsY0FBYyxDQUFDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxDQUM1RCxLQUFLLEVBQUUsRUFDUCxTQUFTOzs7O3dCQUFDLFVBQUEsS0FBSzs0QkFDYixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs0QkFDeEIsSUFBSSxLQUFLLEVBQUU7O29DQUNMLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO29DQUN6QixVQUFVLEVBQUU7d0NBQ1YsYUFBYSxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUMsWUFBWTtxQ0FDOUM7aUNBQ0YsQ0FBQztnQ0FDRixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQ2hDOzRCQUNELEtBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzt3QkFDNUMsQ0FBQyxFQUFDLENBQ0gsQ0FBQztxQkFDSDt5QkFBTTt3QkFDTCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3FCQUMzQztpQkFDRjtxQkFBTTtvQkFDTCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEI7WUFDSCxDQUFDLEVBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Z0JBMUNKLFVBQVU7Ozs7Z0JBRkgsY0FBYzs7SUE2Q3RCLGlDQUFDO0NBQUEsQUEzQ0QsSUEyQ0M7U0ExQ1ksMEJBQTBCOzs7Ozs7SUFFckMsaURBQTJCOzs7OztJQUViLG9EQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cEVycm9yUmVzcG9uc2UsIEh0dHBFdmVudCwgSHR0cEhhbmRsZXIsIEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3R9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZmlyc3QsIHN3aXRjaE1hcH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcbmltcG9ydCB7R254QXV0aFNlcnZpY2V9IGZyb20gXCIuLi9nbngtYXV0aC5zZXJ2aWNlXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBHbnhSZWZyZXNoVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gIHByaXZhdGUgbm90VHJpZWRZZXQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ254QXV0aFNlcnZpY2U6IEdueEF1dGhTZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgIGlmIChyZXEudXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxKS5waXBlKFxyXG4gICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UgJiYgZXJyLnN0YXR1cyA9PT0gNDAxKSB7IC8vIGl0IHNlZW1zIGFjY2VzcyB0b2tlbiBocyBleHBpcmVkLCB0cnkgdG8gZ2V0IG5ldyB0b2tlbnMgYnkgcmVmcmVzaCB0b2tlblxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLm5vdFRyaWVkWWV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nbnhBdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbkJ5UmVmcmVzaFRva2VuKCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgZmlyc3QoKSxcclxuICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKHRva2VuID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdSZXF1ZXN0ID0gcmVxLmNsb25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuLmVuY29kZWRUb2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShuZXdSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbnhBdXRoU2VydmljZS5yZWRpcmVjdFRvTG9naW5QYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==