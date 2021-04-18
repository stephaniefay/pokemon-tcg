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
  items: MenuItem[];
  ref: DynamicDialogRef;

  constructor(private primengConfig: PrimeNGConfig,
              public auth: AngularFireAuth,
              public dialogService: DialogService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.items = [
      {
        label: 'Restricted Area',
        icon: 'pi pi-fw pi-ban',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-user',
            visible:  (event: Event) => {
              this.isUserLoggedIn()
            },
            command: (event: Event) => { this.show() }
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-logout',
            visible: this.isUserLoggedIn(),
            command: (event: Event) => { this.auth.signOut() }
          },
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
              }
            ]
          }
        ]
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

  isUserLoggedIn () {
    var status;
    this.auth.authState.subscribe(value => {
      if (value == null) status = false;
      status = true;
    });
    return status;
  }
}
