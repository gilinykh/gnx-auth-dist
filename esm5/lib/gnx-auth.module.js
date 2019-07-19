/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// LibComponent
import { GnxAuthComponent } from './components/gnx-auth.component';
import { CookieService } from "ngx-cookie-service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { GnxApplyTokenInterceptor } from "./interceptors/gnx-apply-token-interceptor";
import { GnxRefreshTokenInterceptor } from "./interceptors/gnx-refresh-token-interceptor";
import { GnxAuthService } from "./gnx-auth.service";
var GnxAuthModule = /** @class */ (function () {
    function GnxAuthModule() {
    }
    /**
     * @param {?} environment
     * @param {?} translatorService
     * @return {?}
     */
    GnxAuthModule.forRoot = /**
     * @param {?} environment
     * @param {?} translatorService
     * @return {?}
     */
    function (environment, translatorService) {
        return {
            ngModule: GnxAuthModule,
            providers: [
                GnxAuthService,
                { provide: 'TranslatorService', useClass: translatorService },
                {
                    provide: 'env',
                    useValue: environment
                }
            ]
        };
    };
    GnxAuthModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        GnxAuthComponent
                    ],
                    imports: [
                        BrowserModule,
                    ],
                    exports: [
                        GnxAuthComponent
                    ],
                    providers: [
                        CookieService,
                        { provide: HTTP_INTERCEPTORS, useClass: GnxApplyTokenInterceptor, multi: true },
                        { provide: HTTP_INTERCEPTORS, useClass: GnxRefreshTokenInterceptor, multi: true },
                    ]
                },] }
    ];
    return GnxAuthModule;
}());
export { GnxAuthModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGgubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvZ254LWF1dGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRXhELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbEQ7SUFBQTtJQWdDQSxDQUFDOzs7Ozs7SUFkZSxxQkFBTzs7Ozs7SUFBckIsVUFBc0IsV0FBZ0IsRUFBRSxpQkFBc0I7UUFFNUQsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxjQUFjO2dCQUNkLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQztnQkFDM0Q7b0JBQ0UsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Z0JBL0JGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osZ0JBQWdCO3FCQUNqQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTtxQkFDZDtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsZ0JBQWdCO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsYUFBYTt3QkFDYixFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQzt3QkFDN0UsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7cUJBQ2hGO2lCQUNGOztJQWlCRCxvQkFBQztDQUFBLEFBaENELElBZ0NDO1NBaEJZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QnJvd3Nlck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4vLyBMaWJDb21wb25lbnRcbmltcG9ydCB7R254QXV0aENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2dueC1hdXRoLmNvbXBvbmVudCc7XG5pbXBvcnQge0Nvb2tpZVNlcnZpY2V9IGZyb20gXCJuZ3gtY29va2llLXNlcnZpY2VcIjtcbmltcG9ydCB7SFRUUF9JTlRFUkNFUFRPUlN9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xuaW1wb3J0IHtHbnhBcHBseVRva2VuSW50ZXJjZXB0b3J9IGZyb20gXCIuL2ludGVyY2VwdG9ycy9nbngtYXBwbHktdG9rZW4taW50ZXJjZXB0b3JcIjtcbmltcG9ydCB7R254UmVmcmVzaFRva2VuSW50ZXJjZXB0b3J9IGZyb20gXCIuL2ludGVyY2VwdG9ycy9nbngtcmVmcmVzaC10b2tlbi1pbnRlcmNlcHRvclwiO1xuaW1wb3J0IHtHbnhBdXRoU2VydmljZX0gZnJvbSBcIi4vZ254LWF1dGguc2VydmljZVwiO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEdueEF1dGhDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBHbnhBdXRoQ29tcG9uZW50XG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIENvb2tpZVNlcnZpY2UsXG4gICAge3Byb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLCB1c2VDbGFzczogR254QXBwbHlUb2tlbkludGVyY2VwdG9yLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLCB1c2VDbGFzczogR254UmVmcmVzaFRva2VuSW50ZXJjZXB0b3IsIG11bHRpOiB0cnVlfSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBHbnhBdXRoTW9kdWxlIHtcblxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoZW52aXJvbm1lbnQ6IGFueSwgdHJhbnNsYXRvclNlcnZpY2U6IGFueSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBHbnhBdXRoTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIEdueEF1dGhTZXJ2aWNlLFxuICAgICAgICB7cHJvdmlkZTogJ1RyYW5zbGF0b3JTZXJ2aWNlJywgdXNlQ2xhc3M6IHRyYW5zbGF0b3JTZXJ2aWNlfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6ICdlbnYnLFxuICAgICAgICAgIHVzZVZhbHVlOiBlbnZpcm9ubWVudFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19