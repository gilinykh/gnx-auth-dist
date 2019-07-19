/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { GnxAuthService } from "../gnx-auth.service";
import { of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import * as i0 from "@angular/core";
import * as i1 from "../gnx-auth.service";
import * as i2 from "@angular/router";
export class AllowNonLoggedUserGuard {
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
/** @nocollapse */ AllowNonLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function AllowNonLoggedUserGuard_Factory() { return new AllowNonLoggedUserGuard(i0.inject(i1.GnxAuthService), i0.inject(i2.Router)); }, token: AllowNonLoggedUserGuard, providedIn: "root" });
if (false) {
    /** @type {?} */
    AllowNonLoggedUserGuard.prototype.auth;
    /** @type {?} */
    AllowNonLoggedUserGuard.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb3ctbm9uLWxvZ2dlZC11c2VyLmd1YXJkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvZ3VhcmRzL2FsbG93LW5vbi1sb2dnZWQtdXNlci5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQWMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUs5QyxNQUFNLE9BQU8sdUJBQXVCOzs7OztJQUNsQyxZQUFtQixJQUFvQixFQUFTLE1BQWM7UUFBM0MsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQzs7OztJQUNsRSxXQUFXO1FBQ1QsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUNsQixTQUFTOzs7UUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLEVBQ3JDLEdBQUc7Ozs7UUFBQyxLQUFLLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxFQUFDLENBQUMsOERBQThEO1NBQ2xFLENBQUM7SUFDSixDQUFDOzs7WUFaRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFOTyxjQUFjO1lBREQsTUFBTTs7Ozs7SUFTYix1Q0FBMkI7O0lBQUUseUNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtDYW5BY3RpdmF0ZSwgUm91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQge0dueEF1dGhTZXJ2aWNlfSBmcm9tIFwiLi4vZ254LWF1dGguc2VydmljZVwiO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgQWxsb3dOb25Mb2dnZWRVc2VyR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhdXRoOiBHbnhBdXRoU2VydmljZSwgcHVibGljIHJvdXRlcjogUm91dGVyKSB7fVxuICBjYW5BY3RpdmF0ZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gb2YobnVsbCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLmF1dGguZ2V0VG9rZW4oKSksXG4gICAgICBtYXAodG9rZW4gPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pIC8vIGFsd2F5cyByZXR1cm5zIHRydWUsIG5lZWRlZCB0byB0cnkgdG8gZ2V0IHRva2VuIGZyb20gY29va2llXG4gICAgKTtcbiAgfVxufVxuIl19