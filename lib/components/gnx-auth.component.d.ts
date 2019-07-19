import { OnInit } from '@angular/core';
import { GnxAuthService } from "../gnx-auth.service";
import { Translateable } from "../gnx-models";
export declare class GnxAuthComponent implements OnInit {
    private service;
    translatorService: Translateable;
    env: any;
    redirectToLoginPageIfUserNotLoggedIn: boolean;
    isLoggedIn: boolean;
    userName: string;
    initialized: boolean;
    constructor(service: GnxAuthService, translatorService: Translateable, env: any);
    ngOnInit(): void;
    login(): void;
    signUp(): void;
    logout(): void;
    translate(text: string): string;
}
