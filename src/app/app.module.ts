import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from "./app.component";
import { MatTableModule } from "@angular/material/table";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from "@angular/material/paginator";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ClipboardModule } from '@angular/cdk/clipboard';

import { HomeComponent } from "./home/home.component";
import { NewProfilesComponent } from "./new-profiles/new-profiles.component";

import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { ConfigState } from "./store/config/state";
import { OrgsState } from "./store/orgs/state";
import { ConfigComponent } from "./config/config.component";
import { ListProfilesComponent } from './new-profiles/list-profiles/list-profiles.component';
import { EditOrgComponent } from './new-profiles/edit-org/edit-org.component';
import { FinalReviewComponent } from './new-profiles/final-review/final-review.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewProfilesComponent,
    ConfigComponent,
    ListProfilesComponent,
    EditOrgComponent,
    FinalReviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot([ConfigState, OrgsState]),
    NgxsLoggerPluginModule.forRoot(),
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatStepperModule,
    MatMenuModule,
    ClipboardModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DragDropModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
