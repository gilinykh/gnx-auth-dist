import { Observable } from "rxjs";
export declare class Token {
    user_name: string;
    exp: number;
    scope: string[];
    authorities: string[];
    jti: string;
    email: string;
    client_id: string;
    encodedToken: string;
}
export declare class TokenData {
    jti: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
}
export interface Translateable {
    translate: {
        instant: (key: string) => string | any;
        onLangChange: Observable<{
            lang: string;
        }>;
    };
    getCurrentLang: () => string;
    useLanguage: (lang: string) => void;
    getAvailableLanguages: () => {
        code: string;
        text: string;
    }[];
}
