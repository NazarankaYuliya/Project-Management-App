import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRouteComponent } from './main-route/main-route.component';
import { BackendService } from './services/backend.service';
import { AddBoardModalComponent } from './modal/add-board-modal/add-board-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalService } from './services/modal.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WelcomePageComponent,
    LoginComponent,
    SignupComponent,
    MainRouteComponent,
    AddBoardModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [BackendService, ModalService],
  bootstrap: [AppComponent],
})
export class AppModule {}
