import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ImportComponent} from "../private/import/import.component";
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ExportComponent} from "../private/export/export.component";
import {CollectionComponent} from "../public/collection/collection.component";
import {NotFoundComponent} from "../public/not-found/not-found.component";
import {PrivateComponent} from "../private/private.component";
import {PublicComponent} from "../public/public.component";
import {LigaPokemonComponent} from "../public/ligapokemon/liga-pokemon.component";
import {FetchApiComponent} from "../private/fetch-api/fetch-api.component";
import {OverallStatusComponent} from "../public/overall-status/overall-status.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

const routes: Routes = [
  {
    path: '',   redirectTo: '/public/collection', pathMatch: 'full'
  },
  {
    path: 'public',
    component: PublicComponent,
    children: [
      {
        path: 'collection',
        component: CollectionComponent
      },
      {
        path: 'ligapokemon',
        component: LigaPokemonComponent
      },
      {
        path: 'status',
        component: OverallStatusComponent
      }
    ]
  },
  { path: 'private',
    component: PrivateComponent,
    children: [
      {
        path: 'import',
        component: ImportComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: 'export',
        component: ExportComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: 'api',
        component: FetchApiComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      }
    ]
  },
  { path: '**', component:  NotFoundComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
