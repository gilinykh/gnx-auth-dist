/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { GnxAuthService } from "../gnx-auth.service";
import { map } from "rxjs/operators";
import * as i0 from "@angular/core";
import * as i1 from "../gnx-auth.service";
import * as i2 from "@angular/router";
var RequireLoggedUserGuard = /** @class */ (function () {
    function RequireLoggedUserGuard(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    /**
     * @return {?}
     */
    RequireLoggedUserGuard.prototype.canActivate = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.auth.getToken().pipe(map((/**
         * @param {?} token
         * @return {?}
         */
        function (token) {
            if (!token) {
                _this.auth.redirectToLoginPage();
                return false;
            }
            return true;
        })));
    };
    RequireLoggedUserGuard.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    /** @nocollapse */
    RequireLoggedUserGuard.ctorParameters = function () { return [
        { type: GnxAuthService },
        { type: Router }
    ]; };
    /** @nocollapse */ RequireLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function RequireLoggedUserGuard_Factory() { return new RequireLoggedUserGuard(i0.inject(i1.GnxAuthService), i0.inject(i2.Router)); }, token: RequireLoggedUserGuard, providedIn: "root" });
    return RequireLoggedUserGuard;
}());
export { RequireLoggedUserGuard };
if (false) {
    /** @type {?} */
    RequireLoggedUserGuard.prototype.auth;
    /** @type {?} */
    RequireLoggedUserGuard.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1sb2dnZWQtdXNlci5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2dueC1hdXRoLyIsInNvdXJjZXMiOlsibGliL2d1YXJkcy9yZXF1aXJlLWxvZ2dlZC11c2VyLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBYyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0FBRW5DO0lBSUUsZ0NBQW1CLElBQW9CLEVBQVMsTUFBYztRQUEzQyxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDOzs7O0lBQ2xFLDRDQUFXOzs7SUFBWDtRQUFBLGlCQVVDO1FBVEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FDOUIsR0FBRzs7OztRQUFDLFVBQUEsS0FBSztZQUNQLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsS0FBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUNoQyxPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLEVBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7Z0JBZkYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFOTyxjQUFjO2dCQURELE1BQU07OztpQ0FEM0I7Q0FzQkMsQUFoQkQsSUFnQkM7U0FiWSxzQkFBc0I7OztJQUNyQixzQ0FBMkI7O0lBQUUsd0NBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtDYW5BY3RpdmF0ZSwgUm91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQge0dueEF1dGhTZXJ2aWNlfSBmcm9tIFwiLi4vZ254LWF1dGguc2VydmljZVwiO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHttYXB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZUxvZ2dlZFVzZXJHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgY29uc3RydWN0b3IocHVibGljIGF1dGg6IEdueEF1dGhTZXJ2aWNlLCBwdWJsaWMgcm91dGVyOiBSb3V0ZXIpIHt9XG4gIGNhbkFjdGl2YXRlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmF1dGguZ2V0VG9rZW4oKS5waXBlKFxuICAgICAgbWFwKHRva2VuID0+IHtcbiAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgIHRoaXMuYXV0aC5yZWRpcmVjdFRvTG9naW5QYWdlKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxufVxuIl19