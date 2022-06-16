export type PasswordResponse = {
    encryptedPassword: string;
}

export type ErrorMessageResponse = {
    message: string;
}

export type RESTDataResponse = {
    data: any;
}

export type MessageResponse = {
    message: string;
}

export type UserConfigSetting = {
    mediaDisplaySetting: string;
}

export type PasswordEncryptRequest = {
    password: string;
}

export interface JWTHasura {
    sub: string;
    name: string;
    admin: boolean;
    iat: string;
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": Array<string>;
      "x-hasura-default-role": string;
    };
}
