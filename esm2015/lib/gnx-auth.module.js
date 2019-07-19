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
export class GnxAuthModule {
    /**
     * @param {?} environment
     * @param {?} translatorService
     * @return {?}
     */
    static forRoot(environment, translatorService) {
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
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGgubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvZ254LWF1dGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRXhELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFtQmxELE1BQU0sT0FBTyxhQUFhOzs7Ozs7SUFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFnQixFQUFFLGlCQUFzQjtRQUU1RCxPQUFPO1lBQ0wsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFO2dCQUNULGNBQWM7Z0JBQ2QsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFDO2dCQUMzRDtvQkFDRSxPQUFPLEVBQUUsS0FBSztvQkFDZCxRQUFRLEVBQUUsV0FBVztpQkFDdEI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7WUEvQkYsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7aUJBQ2pCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxhQUFhO2lCQUNkO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxnQkFBZ0I7aUJBQ2pCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxhQUFhO29CQUNiLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO29CQUM3RSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztpQkFDaEY7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0Jyb3dzZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG4vLyBMaWJDb21wb25lbnRcclxuaW1wb3J0IHtHbnhBdXRoQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZ254LWF1dGguY29tcG9uZW50JztcclxuaW1wb3J0IHtDb29raWVTZXJ2aWNlfSBmcm9tIFwibmd4LWNvb2tpZS1zZXJ2aWNlXCI7XHJcbmltcG9ydCB7SFRUUF9JTlRFUkNFUFRPUlN9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xyXG5pbXBvcnQge0dueEFwcGx5VG9rZW5JbnRlcmNlcHRvcn0gZnJvbSBcIi4vaW50ZXJjZXB0b3JzL2dueC1hcHBseS10b2tlbi1pbnRlcmNlcHRvclwiO1xyXG5pbXBvcnQge0dueFJlZnJlc2hUb2tlbkludGVyY2VwdG9yfSBmcm9tIFwiLi9pbnRlcmNlcHRvcnMvZ254LXJlZnJlc2gtdG9rZW4taW50ZXJjZXB0b3JcIjtcclxuaW1wb3J0IHtHbnhBdXRoU2VydmljZX0gZnJvbSBcIi4vZ254LWF1dGguc2VydmljZVwiO1xyXG5cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBHbnhBdXRoQ29tcG9uZW50XHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBCcm93c2VyTW9kdWxlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgR254QXV0aENvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBDb29raWVTZXJ2aWNlLFxyXG4gICAge3Byb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLCB1c2VDbGFzczogR254QXBwbHlUb2tlbkludGVyY2VwdG9yLCBtdWx0aTogdHJ1ZX0sXHJcbiAgICB7cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsIHVzZUNsYXNzOiBHbnhSZWZyZXNoVG9rZW5JbnRlcmNlcHRvciwgbXVsdGk6IHRydWV9LFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdueEF1dGhNb2R1bGUge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoZW52aXJvbm1lbnQ6IGFueSwgdHJhbnNsYXRvclNlcnZpY2U6IGFueSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBHbnhBdXRoTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBHbnhBdXRoU2VydmljZSxcclxuICAgICAgICB7cHJvdmlkZTogJ1RyYW5zbGF0b3JTZXJ2aWNlJywgdXNlQ2xhc3M6IHRyYW5zbGF0b3JTZXJ2aWNlfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiAnZW52JyxcclxuICAgICAgICAgIHVzZVZhbHVlOiBlbnZpcm9ubWVudFxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19