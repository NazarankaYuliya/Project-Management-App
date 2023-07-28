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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from './services/modal.service';
import { ConfirmationModalComponent } from './modal/confirmation/confirmation-modal.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { BoardComponent } from './board/board.component';
import { AddColumnModalComponent } from './modal/add-column-modal/add-column-modal.component';
import { AddTaskModalComponent } from './modal/add-task-modal/add-task-modal.component';
import { UpdateColumnModalComponent } from './modal/update-column-modal/update-column-modal.component';
import { ColumnComponent } from './board/column/column.component';
import { TaskComponent } from './board/task/task.component';
import { UpdateTaskModalComponent } from './modal/update-task-modal/update-task-modal.component';

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
    ConfirmationModalComponent,
    ProfileComponent,
    BoardComponent,
    AddColumnModalComponent,
    AddTaskModalComponent,
    UpdateColumnModalComponent,
    ColumnComponent,
    TaskComponent,
    UpdateTaskModalComponent,
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
