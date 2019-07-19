/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { GnxAuthService } from "../gnx-auth.service";
import { first, map, switchMap } from "rxjs/operators";
export class GnxApplyTokenInterceptor {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    GnxApplyTokenInterceptor.prototype.gnxAuthService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWFwcGx5LXRva2VuLWludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvaW50ZXJjZXB0b3JzL2dueC1hcHBseS10b2tlbi1pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUl6QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHckQsTUFBTSxPQUFPLHdCQUF3Qjs7OztJQUVuQyxZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFDbEQsQ0FBQzs7Ozs7O0lBRUQsU0FBUyxDQUFDLEdBQXFCLEVBQUUsSUFBaUI7UUFDaEQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUN4QyxLQUFLLEVBQUUsRUFDUCxHQUFHOzs7O1lBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDO3dCQUNmLFVBQVUsRUFBRTs0QkFDVixhQUFhLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZO3lCQUM5QztxQkFDRixDQUFDLENBQUE7aUJBQ0g7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7WUFDYixDQUFDLEVBQ0YsRUFDRCxTQUFTOzs7O1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQzNDLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7WUF6QkYsVUFBVTs7OztZQUhILGNBQWM7Ozs7Ozs7SUFNUixrREFBc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBFdmVudCwgSHR0cEhhbmRsZXIsIEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3R9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7R254QXV0aFNlcnZpY2V9IGZyb20gXCIuLi9nbngtYXV0aC5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7Zmlyc3QsIG1hcCwgc3dpdGNoTWFwfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEdueEFwcGx5VG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZ254QXV0aFNlcnZpY2U6IEdueEF1dGhTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBpbnRlcmNlcHQocmVxOiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcclxuICAgIGlmIChyZXEudXJsLmluZGV4T2YoJy9hcGkvJykgPiAtMSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nbnhBdXRoU2VydmljZS5nZXRUb2tlbigpLnBpcGUoXHJcbiAgICAgICAgZmlyc3QoKSxcclxuICAgICAgICBtYXAodG9rZW4gPT4ge1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVxLmNsb25lKHtcclxuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4uZW5jb2RlZFRva2VuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICksXHJcbiAgICAgICAgc3dpdGNoTWFwKHJlcXVlc3QgPT4gbmV4dC5oYW5kbGUocmVxdWVzdCkpLFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==