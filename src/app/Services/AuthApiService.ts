import { Injectable } from '@angular/core';
import { AiurValue } from '../Models/AiurValue';
import { KahlaUser } from '../Models/KahlaUser';
import { Observable } from 'rxjs/';
import { AiurProtocal } from '../Models/AiurProtocal';
import { InitPusherViewModel } from '../Models/ApiModels/InitPusherViewModel';
import { VersionViewModel } from '../Models/VersionViewModel';
import { ApiService } from './ApiService';

@Injectable()
export class AuthApiService {
    private static serverPath = '/auth';

    constructor(
        private apiService: ApiService
    ) {}

    public Version(): Observable<VersionViewModel> {
        return this.apiService.Get(AuthApiService.serverPath + '/Version');
    }

    public AuthByPassword(email: string, password: string): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/AuthByPassword', {
            email: email,
            password: password
        });
    }

    public RegisterKahla(email: string, password: string, confirmPassword: string): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/RegisterKahla', {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });
    }

    public SignInStatus(): Observable<AiurValue<boolean>> {
        return this.apiService.Get(AuthApiService.serverPath + '/SignInStatus');
    }

    public Me(): Observable<AiurValue<KahlaUser>> {
        return this.apiService.Get(AuthApiService.serverPath + '/Me');
    }

    public UpdateInfo(nickName: string, bio: string, headIconPath: string, hideMyEmail: boolean): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/UpdateInfo', {
            nickName: nickName,
            bio: bio,
            headIconPath: headIconPath,
            hideMyEmail: hideMyEmail
        });
    }

    public UpdateClientSetting(themeId: number, enableEmailNotification: boolean): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/UpdateClientSetting', {
            ThemeId: themeId,
            EnableEmailNotification: enableEmailNotification
        });
    }

    public ChangePassword(oldPassword: string, newPassword: string, repeatPassword: string): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/ChangePassword', {
            OldPassword: oldPassword,
            NewPassword: newPassword,
            RepeatPassword: repeatPassword
        });
    }

    public InitPusher(): Observable<InitPusherViewModel> {
        return this.apiService.Get(AuthApiService.serverPath + '/InitPusher');
    }

    public LogOff(deviceID: number): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/LogOff', {deviceID: deviceID});
    }

    public SendMail(email: string): Observable<AiurProtocal> {
        return this.apiService.Post(AuthApiService.serverPath + '/SendEmail', {email: email});
    }
}
