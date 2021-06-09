import { Component } from '@angular/core';
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {AngularFireAuth} from "@angular/fire/auth";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {LoginComponent} from "./login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService]
})
export class AppComponent {
  title = 'pokemon-tcg';
  itemsLogged: MenuItem[];
  items: MenuItem[];
  ref: DynamicDialogRef;

  constructor(private primengConfig: PrimeNGConfig,
              public auth: AngularFireAuth,
              public dialogService: DialogService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.items = [
      {
        label: 'Collection',
        icon: 'fas fa-dragon',
        routerLink: ['/public/collection']
      },
      {
        label: 'LigaPokemon datatable',
        icon: 'fas fa-table',
        routerLink: ['/public/ligapokemon']
      },
      {
        label: 'Overall Status',
        icon: 'fas fa-chart-line',
        routerLink: ['/public/status']
      },
      {
        label: 'Decks',
        icon: 'fas fa-journal-whills',
        routerLink: ['/public/decks']
      },
      {
        label: 'Wishlist',
        icon: 'far fa-star',
        routerLink: ['/public/wishlist']
      },
      {
        label: 'Login',
        icon: 'fas fa-user-circle',
        command: (event: Event) => {
          this.show()
        }
      }
    ]

    this.itemsLogged = [
      {
        label: 'Card Management',
        icon: 'fas fa-terminal',
        items: [
          {
            label: 'Import All',
            icon: 'fas fa-file-import',
            routerLink: ['/private/import']
          },
          {
            label: 'Import Some',
            icon: 'fas fa-file-medical',
            routerLink: ['/private/add-import']
          },
          {
            label: 'Fetch all from API',
            icon: 'fas fa-link',
            routerLink: ['/private/api']
          },
          {
            label: 'Fetch some from API',
            icon: 'fas fa-plus-circle',
            routerLink: ['/private/add-api']
          },
          {
            icon: 'fas fa-file-export',
            label: 'Export',
            routerLink: ['/private/export']
          },
          {
            label: 'Edit Cards',
            icon: 'fas fa-table',
            routerLink: ['/private/cardmanagement']
          }
        ]
      },
      {
        label: 'Collection',
        icon: 'fas fa-dragon',
        routerLink: ['/public/collection']
      },
      {
        label: 'LigaPokemon datatable',
        icon: 'fas fa-table',
        routerLink: ['/public/ligapokemon']
      },
      {
        label: 'Overall Status',
        icon: 'fas fa-chart-line',
        routerLink: ['/public/status']
      },
      {
        label: 'Decks',
        icon: 'fas fa-journal-whills',
        routerLink: ['/public/decks']
      },
      {
        label: 'Wishlist',
        icon: 'far fa-star',
        routerLink: ['/public/wishlist']
      },
      {
        label: 'Logout',
        icon: 'fas fa-sign-out-alt',
        command: (event: Event) => {
          this.auth.signOut()
        }
      }
    ];
  }

  show() {
    this.ref = this.dialogService.open(LoginComponent, {
      header: 'Login',
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000
    });
  }

  async isUserLoggedIn() {
    this.auth.authState.subscribe(value => {
      return value != null;
    });
  }
}
