// Modules
import { AppRoutingModule } from './Modules/AppRoutingModule';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
// Component
import { AppComponent } from './Controllers/app.component';
import { ConversationsComponent } from './Controllers/conversations.component';
import { FriendsComponent } from './Controllers/friends.component';
import { AddFriendComponent } from './Controllers/add-friend.component';
import { SettingsComponent } from './Controllers/settings.component';
import { FriendRequestsComponent } from './Controllers/friendrequests.component';
import { TalkingComponent } from './Controllers/talking.component';
import { DiscoverComponent } from './Controllers/discover.component';
import { SignInComponent } from './Controllers/signin.component';
import { RegisterComponent } from './Controllers/register.component';
import { NavComponent } from './Controllers/nav.component';
import { HeaderComponent } from './Controllers/header.component';
import { UserComponent } from './Controllers/user.component';
import { AboutComponent } from './Controllers/about.component';
import { UserDetailComponent } from './Controllers/userDetail.component';
import { GroupComponent } from './Controllers/group.component';
import { ChangePasswordComponent } from './Controllers/changePassword.component';
import { DevicesComponent } from './Controllers/devices.component';
import { ThemeComponent } from './Controllers/theme.component';
import { AdvancedSettingComponent } from './Controllers/advanced-setting.component';
import { ManageGroupComponent } from './Controllers/manageGroup.component';
import { HomeComponent } from './Controllers/home.component';
import { ShareComponent } from './Controllers/share.component';
// Services
import { ApiService } from './Services/ApiService';
import { ParamService } from './Services/ParamService';
import { CacheService } from './Services/CacheService';
import { CheckService } from './Services/CheckService';
import { UploadService } from './Services/UploadService';
import { AuthApiService } from './Services/AuthApiService';
import { ConversationApiService } from './Services/ConversationApiService';
import { FilesApiService } from './Services/FilesApiService';
import { FriendsApiService } from './Services/FriendsApiService';
import { GroupsApiService } from './Services/GroupsApiService';
import { MessageService } from './Services/MessageService';
import { InitService } from './Services/InitService';
import { DevicesApiService } from './Services/DevicesApiService';
import { ThemeService } from './Services/ThemeService';
import { TimerService } from './Services/TimerService';
import { HomeService } from './Services/HomeService';
import { FriendshipService } from './Services/FriendshipService';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgxElectronModule
    ],
    declarations: [
        AboutComponent,
        AppComponent,
        ConversationsComponent,
        FriendsComponent,
        AddFriendComponent,
        SettingsComponent,
        FriendRequestsComponent,
        TalkingComponent,
        DiscoverComponent,
        SignInComponent,
        RegisterComponent,
        NavComponent,
        HeaderComponent,
        UserComponent,
        UserDetailComponent,
        GroupComponent,
        ChangePasswordComponent,
        DevicesComponent,
        ThemeComponent,
        AdvancedSettingComponent,
        ManageGroupComponent,
        HomeComponent,
        ShareComponent
    ],
    providers: [
        ApiService,
        ParamService,
        CacheService,
        UploadService,
        CheckService,
        AuthApiService,
        ConversationApiService,
        FilesApiService,
        FriendsApiService,
        GroupsApiService,
        MessageService,
        InitService,
        DevicesApiService,
        ThemeService,
        TimerService,
        HomeService,
        FriendshipService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

 // platformBrowserDynamic().bootstrapModule(AppModule);
