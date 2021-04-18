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
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['/public/collection']
      },
      {
        label: 'LigaPokemon datatable',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/public/ligapokemon']
      },
      {
        label: 'Login',
        icon: 'pi pi-fw pi-user',
        command: (event: Event) => {
          this.show()
        }
      }
    ]

    this.itemsLogged = [
      {
        label: 'Card Management',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Import',
            icon: 'pi pi-fw pi-arrow-circle-down',
            routerLink: ['/private/import']
          },
          {
            icon: 'pi pi-fw pi-arrow-circle-up',
            label: 'Export',
            routerLink: ['/private/export']
          },
          {
            label: 'Fetch from API',
            icon: 'pi pi-fw pi-link',
            routerLink: ['/private/api']
          }
        ]
      },
      {
        label: 'Collection',
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['/public/collection']
      },
      {
        label: 'LigaPokemon datatable',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/public/ligapokemon']
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
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
