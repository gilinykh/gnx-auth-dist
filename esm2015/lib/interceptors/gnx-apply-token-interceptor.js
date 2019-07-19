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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWFwcGx5LXRva2VuLWludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvaW50ZXJjZXB0b3JzL2dueC1hcHBseS10b2tlbi1pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUl6QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHckQsTUFBTSxPQUFPLHdCQUF3Qjs7OztJQUVuQyxZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFDbEQsQ0FBQzs7Ozs7O0lBRUQsU0FBUyxDQUFDLEdBQXFCLEVBQUUsSUFBaUI7UUFDaEQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUN4QyxLQUFLLEVBQUUsRUFDUCxHQUFHOzs7O1lBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDO3dCQUNmLFVBQVUsRUFBRTs0QkFDVixhQUFhLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZO3lCQUM5QztxQkFDRixDQUFDLENBQUE7aUJBQ0g7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7WUFDYixDQUFDLEVBQ0YsRUFDRCxTQUFTOzs7O1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQzNDLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7WUF6QkYsVUFBVTs7OztZQUhILGNBQWM7Ozs7Ozs7SUFNUixrREFBc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwRXZlbnQsIEh0dHBIYW5kbGVyLCBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0dueEF1dGhTZXJ2aWNlfSBmcm9tIFwiLi4vZ254LWF1dGguc2VydmljZVwiO1xuaW1wb3J0IHtmaXJzdCwgbWFwLCBzd2l0Y2hNYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR254QXBwbHlUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdueEF1dGhTZXJ2aWNlOiBHbnhBdXRoU2VydmljZSkge1xuICB9XG5cbiAgaW50ZXJjZXB0KHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgaWYgKHJlcS51cmwuaW5kZXhPZignL2FwaS8nKSA+IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5nbnhBdXRoU2VydmljZS5nZXRUb2tlbigpLnBpcGUoXG4gICAgICAgIGZpcnN0KCksXG4gICAgICAgIG1hcCh0b2tlbiA9PiB7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcS5jbG9uZSh7XG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4uZW5jb2RlZFRva2VuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIHN3aXRjaE1hcChyZXF1ZXN0ID0+IG5leHQuaGFuZGxlKHJlcXVlc3QpKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xuICB9XG59XG4iXX0=