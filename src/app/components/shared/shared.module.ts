import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { RouterModule } from '@angular/router';
import { CountdownModule } from 'ngx-countdown';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, FooterComponent, MessageFormComponent, ConfirmDialogComponent, ScrollToTopComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    RouterModule,
    CountdownModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmDialogComponent],
  exports: [SidebarComponent, NavbarComponent, FooterComponent, MessageFormComponent, ConfirmDialogComponent],
})
export class SharedModule {}
