import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GnxAuthService } from "../gnx-auth.service";
export declare class GnxApplyTokenInterceptor implements HttpInterceptor {
    private gnxAuthService;
    constructor(gnxAuthService: GnxAuthService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
