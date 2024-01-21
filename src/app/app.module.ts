import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng-lts/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { HomeComponent } from './home/home.component';
import {MenubarModule} from 'primeng-lts/menubar';
import {MenuItem, MessageService} from 'primeng-lts/api';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {GalleriaModule} from 'primeng-lts/galleria';
import { DialogModule } from 'primeng-lts/dialog';
import {FileUploadModule} from 'primeng-lts/fileupload';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    HttpClientModule,
    MenubarModule,    
    MessageModule,
    MessagesModule,
    GalleriaModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
