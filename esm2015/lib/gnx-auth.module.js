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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ254LWF1dGgubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZ254LWF1dGgvIiwic291cmNlcyI6WyJsaWIvZ254LWF1dGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRXhELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFtQmxELE1BQU0sT0FBTyxhQUFhOzs7Ozs7SUFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFnQixFQUFFLGlCQUFzQjtRQUU1RCxPQUFPO1lBQ0wsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFO2dCQUNULGNBQWM7Z0JBQ2QsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFDO2dCQUMzRDtvQkFDRSxPQUFPLEVBQUUsS0FBSztvQkFDZCxRQUFRLEVBQUUsV0FBVztpQkFDdEI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7WUEvQkYsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7aUJBQ2pCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxhQUFhO2lCQUNkO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxnQkFBZ0I7aUJBQ2pCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxhQUFhO29CQUNiLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO29CQUM3RSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztpQkFDaEY7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCcm93c2VyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbi8vIExpYkNvbXBvbmVudFxuaW1wb3J0IHtHbnhBdXRoQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZ254LWF1dGguY29tcG9uZW50JztcbmltcG9ydCB7Q29va2llU2VydmljZX0gZnJvbSBcIm5neC1jb29raWUtc2VydmljZVwiO1xuaW1wb3J0IHtIVFRQX0lOVEVSQ0VQVE9SU30gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XG5pbXBvcnQge0dueEFwcGx5VG9rZW5JbnRlcmNlcHRvcn0gZnJvbSBcIi4vaW50ZXJjZXB0b3JzL2dueC1hcHBseS10b2tlbi1pbnRlcmNlcHRvclwiO1xuaW1wb3J0IHtHbnhSZWZyZXNoVG9rZW5JbnRlcmNlcHRvcn0gZnJvbSBcIi4vaW50ZXJjZXB0b3JzL2dueC1yZWZyZXNoLXRva2VuLWludGVyY2VwdG9yXCI7XG5pbXBvcnQge0dueEF1dGhTZXJ2aWNlfSBmcm9tIFwiLi9nbngtYXV0aC5zZXJ2aWNlXCI7XG5cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgR254QXV0aENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEdueEF1dGhDb21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ29va2llU2VydmljZSxcbiAgICB7cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsIHVzZUNsYXNzOiBHbnhBcHBseVRva2VuSW50ZXJjZXB0b3IsIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsIHVzZUNsYXNzOiBHbnhSZWZyZXNoVG9rZW5JbnRlcmNlcHRvciwgbXVsdGk6IHRydWV9LFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEdueEF1dGhNb2R1bGUge1xuXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChlbnZpcm9ubWVudDogYW55LCB0cmFuc2xhdG9yU2VydmljZTogYW55KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEdueEF1dGhNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgR254QXV0aFNlcnZpY2UsXG4gICAgICAgIHtwcm92aWRlOiAnVHJhbnNsYXRvclNlcnZpY2UnLCB1c2VDbGFzczogdHJhbnNsYXRvclNlcnZpY2V9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogJ2VudicsXG4gICAgICAgICAgdXNlVmFsdWU6IGVudmlyb25tZW50XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=