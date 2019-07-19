import { CanActivate, Router } from "@angular/router";
import { GnxAuthService } from "../gnx-auth.service";
import { Observable } from "rxjs";
export declare class RequireLoggedUserGuard implements CanActivate {
    auth: GnxAuthService;
    router: Router;
    constructor(auth: GnxAuthService, router: Router);
    canActivate(): Observable<boolean>;
}
