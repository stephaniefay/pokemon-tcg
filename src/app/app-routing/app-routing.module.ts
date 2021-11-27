import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ExportComponent} from "../private/export/export.component";
import {CollectionComponent} from "../public/collection/collection.component";
import {NotFoundComponent} from "../public/not-found/not-found.component";
import {PrivateComponent} from "../private/private.component";
import {PublicComponent} from "../public/public.component";
import {LigaPokemonComponent} from "../public/ligapokemon/liga-pokemon.component";
import {FetchApiComponent} from "../private/fetch-api/fetch-api.component";
import {OverallStatusComponent} from "../public/overall-status/overall-status.component";
import {DecksComponent} from "../public/decks/decks.component";
import {FetchSomeApiComponent} from "../private/fetch-some-api/fetch-some-api.component";
import {CardManagementComponent} from "../private/card-management/card-management.component";
import {WishlistComponent} from "../public/wishlist/wishlist.component";
import {VerifyCollectionComponent} from "../public/verify-collection/verify-collection.component";
import {AboutComponent} from "../public/about/about.component";
import {ConfigurationsComponent} from "../private/configurations/configurations.component";

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
        path: 'collectionByPokemon',
        component: VerifyCollectionComponent
      },
      {
        path: 'ligapokemon',
        component: LigaPokemonComponent
      },
      {
        path: 'status',
        component: OverallStatusComponent
      },
      {
        path: 'decks',
        component: DecksComponent
      },
      {
        path: 'wishlist',
        component: WishlistComponent
      },
      {
        path: 'about',
        component: AboutComponent
      }
    ]
  },
  {
    path: 'private',
    component: PrivateComponent,
    children: [
      {
        path: 'export',
        component: ExportComponent,
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'clean-import',
        component: FetchApiComponent,
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'import',
        component: FetchSomeApiComponent,
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'cardmanagement',
        component: CardManagementComponent
      },
      {
        path: 'config',
        component: ConfigurationsComponent
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
