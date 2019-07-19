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
export class RequireLoggedUserGuard {
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
        return this.auth.getToken().pipe(map((/**
         * @param {?} token
         * @return {?}
         */
        token => {
            if (!token) {
                this.auth.redirectToLoginPage();
                return false;
            }
            return true;
        })));
    }
}
RequireLoggedUserGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
/** @nocollapse */
RequireLoggedUserGuard.ctorParameters = () => [
    { type: GnxAuthService },
    { type: Router }
];
/** @nocollapse */ RequireLoggedUserGuard.ngInjectableDef = i0.defineInjectable({ factory: function RequireLoggedUserGuard_Factory() { return new RequireLoggedUserGuard(i0.inject(i1.GnxAuthService), i0.inject(i2.Router)); }, token: RequireLoggedUserGuard, providedIn: "root" });
if (false) {
    /** @type {?} */
    RequireLoggedUserGuard.prototype.auth;
    /** @type {?} */
    RequireLoggedUserGuard.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1sb2dnZWQtdXNlci5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2dueC1hdXRoLyIsInNvdXJjZXMiOlsibGliL2d1YXJkcy9yZXF1aXJlLWxvZ2dlZC11c2VyLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBYyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0FBS25DLE1BQU0sT0FBTyxzQkFBc0I7Ozs7O0lBQ2pDLFlBQW1CLElBQW9CLEVBQVMsTUFBYztRQUEzQyxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDOzs7O0lBQ2xFLFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUM5QixHQUFHOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDaEMsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxFQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7OztZQWZGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQU5PLGNBQWM7WUFERCxNQUFNOzs7OztJQVNiLHNDQUEyQjs7SUFBRSx3Q0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0NhbkFjdGl2YXRlLCBSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7R254QXV0aFNlcnZpY2V9IGZyb20gXCIuLi9nbngtYXV0aC5zZXJ2aWNlXCI7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQge21hcH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBSZXF1aXJlTG9nZ2VkVXNlckd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXV0aDogR254QXV0aFNlcnZpY2UsIHB1YmxpYyByb3V0ZXI6IFJvdXRlcikge31cbiAgY2FuQWN0aXZhdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aC5nZXRUb2tlbigpLnBpcGUoXG4gICAgICBtYXAodG9rZW4gPT4ge1xuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgdGhpcy5hdXRoLnJlZGlyZWN0VG9Mb2dpblBhZ2UoKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG59XG4iXX0=