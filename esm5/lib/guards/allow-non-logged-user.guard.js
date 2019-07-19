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
var AllowNonLoggedUserGuard = /** @class */ (function () {
    function AllowNonLoggedUserGuard(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    /**
     * @return {?}
     */
    AllowNonLoggedUserGuard.prototype.canActivate = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return of(null).pipe(switchMap((/**
         * @return {?}
         */
        function () { return _this.auth.getToken(); })), map((/**
         * @param {?} token
         * @return {?}
         */
        function (token) {
            return true;
        })) // always returns true, needed to try to get token from cookie
        );
    };
    AllowNonLoggedUserGuard.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    /** @nocollapse */
    AllowNonLoggedUserGuard.ctorParameters = function () { return [
        { type: GnxAuthService },
        { type: Router }
    ]; };
    /** @nocollapse */ AllowNonLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function AllowNonLoggedUserGuard_Factory() { return new AllowNonLoggedUserGuard(i0.inject(i1.GnxAuthService), i0.inject(i2.Router)); }, token: AllowNonLoggedUserGuard, providedIn: "root" });
    return AllowNonLoggedUserGuard;
}());
export { AllowNonLoggedUserGuard };
if (false) {
    /** @type {?} */
    AllowNonLoggedUserGuard.prototype.auth;
    /** @type {?} */
    AllowNonLoggedUserGuard.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb3ctbm9uLWxvZ2dlZC11c2VyLmd1YXJkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvZ3VhcmRzL2FsbG93LW5vbi1sb2dnZWQtdXNlci5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQWMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUU5QztJQUlFLGlDQUFtQixJQUFvQixFQUFTLE1BQWM7UUFBM0MsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQzs7OztJQUNsRSw2Q0FBVzs7O0lBQVg7UUFBQSxpQkFPQztRQU5DLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDbEIsU0FBUzs7O1FBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQXBCLENBQW9CLEVBQUMsRUFDckMsR0FBRzs7OztRQUFDLFVBQUEsS0FBSztZQUNQLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxFQUFDLENBQUMsOERBQThEO1NBQ2xFLENBQUM7SUFDSixDQUFDOztnQkFaRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQU5PLGNBQWM7Z0JBREQsTUFBTTs7O2tDQUQzQjtDQW1CQyxBQWJELElBYUM7U0FWWSx1QkFBdUI7OztJQUN0Qix1Q0FBMkI7O0lBQUUseUNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge0NhbkFjdGl2YXRlLCBSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHtHbnhBdXRoU2VydmljZX0gZnJvbSBcIi4uL2dueC1hdXRoLnNlcnZpY2VcIjtcclxuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHttYXAsIHN3aXRjaE1hcH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWxsb3dOb25Mb2dnZWRVc2VyR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGF1dGg6IEdueEF1dGhTZXJ2aWNlLCBwdWJsaWMgcm91dGVyOiBSb3V0ZXIpIHt9XHJcbiAgY2FuQWN0aXZhdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gb2YobnVsbCkucGlwZShcclxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMuYXV0aC5nZXRUb2tlbigpKSxcclxuICAgICAgbWFwKHRva2VuID0+IHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSkgLy8gYWx3YXlzIHJldHVybnMgdHJ1ZSwgbmVlZGVkIHRvIHRyeSB0byBnZXQgdG9rZW4gZnJvbSBjb29raWVcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==