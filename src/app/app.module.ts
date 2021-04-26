import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {environment} from "../environments/environment";
import { LoginComponent } from './login/login.component';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ImportComponent } from './private/import/import.component';
import { ExportComponent } from './private/export/export.component';
import { CollectionComponent } from './public/collection/collection.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { PrivateComponent } from './private/private.component';
import { PublicComponent } from './public/public.component';
import {HttpClientModule} from "@angular/common/http";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {FileUploadModule} from "primeng/fileupload";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import { LigaPokemonComponent } from './public/ligapokemon/liga-pokemon.component';
import {TableModule} from "primeng/table";
import { FetchApiComponent } from './private/fetch-api/fetch-api.component';
import {MultiSelectModule} from "primeng/multiselect";
import {RippleModule} from "primeng/ripple";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {TooltipModule} from "primeng/tooltip";
import { OverallStatusComponent } from './public/overall-status/overall-status.component';
import {FieldsetModule} from "primeng/fieldset";
import { InfoDialogComponent } from './public/info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ImportComponent,
    ExportComponent,
    CollectionComponent,
    NotFoundComponent,
    PrivateComponent,
    PublicComponent,
    LigaPokemonComponent,
    FetchApiComponent,
    OverallStatusComponent,
    InfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AppRoutingModule,
    FormsModule,
    FileUploadModule,
    DynamicDialogModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    TableModule,
    HttpClientModule,
    RippleModule,
    DataViewModule,
    DropdownModule,
    TooltipModule,
    FieldsetModule,
  ],
  providers: [],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
