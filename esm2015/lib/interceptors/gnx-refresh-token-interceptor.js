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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nbngtYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9pbnRlcmNlcHRvcnMvZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUF1RCxNQUFNLHNCQUFzQixDQUFDO0FBRTdHLE9BQU8sRUFBYSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBR25ELE1BQU0sT0FBTywwQkFBMEI7Ozs7SUFJbkMsWUFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRjVDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO0lBR3pCLENBQUM7Ozs7OztJQUVELFNBQVMsQ0FBQyxHQUFxQixFQUFFLElBQWlCO1FBQ2hELElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDMUIsVUFBVTs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNmLElBQUksR0FBRyxZQUFZLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLEVBQUUsMkVBQTJFO29CQUN2SSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO3dCQUN6QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxJQUFJLENBQzVELEtBQUssRUFBRSxFQUNQLFNBQVM7Ozs7d0JBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzRCQUN4QixJQUFJLEtBQUssRUFBRTs7b0NBQ0wsVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0NBQ3pCLFVBQVUsRUFBRTt3Q0FDVixhQUFhLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZO3FDQUM5QztpQ0FDRixDQUFDO2dDQUNGLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs2QkFDaEM7NEJBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO3dCQUM1QyxDQUFDLEVBQUMsQ0FDSCxDQUFDO3FCQUNIO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUM7cUJBQzNDO2lCQUNGO3FCQUFNO29CQUNMLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjtZQUNILENBQUMsRUFBQyxDQUNILENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7WUExQ0osVUFBVTs7OztZQUZILGNBQWM7Ozs7Ozs7SUFLcEIsaURBQTJCOzs7OztJQUViLG9EQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cEVycm9yUmVzcG9uc2UsIEh0dHBFdmVudCwgSHR0cEhhbmRsZXIsIEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3R9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZmlyc3QsIHN3aXRjaE1hcH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcbmltcG9ydCB7R254QXV0aFNlcnZpY2V9IGZyb20gXCIuLi9nbngtYXV0aC5zZXJ2aWNlXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBHbnhSZWZyZXNoVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gIHByaXZhdGUgbm90VHJpZWRZZXQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ254QXV0aFNlcnZpY2U6IEdueEF1dGhTZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgIGlmIChyZXEudXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxKS5waXBlKFxyXG4gICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UgJiYgZXJyLnN0YXR1cyA9PT0gNDAxKSB7IC8vIGl0IHNlZW1zIGFjY2VzcyB0b2tlbiBocyBleHBpcmVkLCB0cnkgdG8gZ2V0IG5ldyB0b2tlbnMgYnkgcmVmcmVzaCB0b2tlblxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLm5vdFRyaWVkWWV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nbnhBdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbkJ5UmVmcmVzaFRva2VuKCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgZmlyc3QoKSxcclxuICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKHRva2VuID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdSZXF1ZXN0ID0gcmVxLmNsb25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuLmVuY29kZWRUb2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShuZXdSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbnhBdXRoU2VydmljZS5yZWRpcmVjdFRvTG9naW5QYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdFRyaWVkWWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ254QXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luUGFnZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==