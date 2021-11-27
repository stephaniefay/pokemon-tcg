import {Component, Inject} from '@angular/core';
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {AngularFireAuth} from "@angular/fire/auth";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {LoginComponent} from "./login/login.component";
import {ConfigurationService} from "./services/configuration.service";
import {DOCUMENT} from "@angular/common";
import {AngularFireStorage} from "@angular/fire/storage";

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
  theme: any;
  logo: any;

  constructor(private primengConfig: PrimeNGConfig,
              public auth: AngularFireAuth,
              public config: ConfigurationService,
              public dialogService: DialogService,
              private storage: AngularFireStorage,
              @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.loadTheme();
    this.loadLogo()

    this.items = [
      {
        label: 'Collection',
        icon: 'fas fa-dragon',
        items: [
          {
            label: 'All cards in Collection',
            icon: 'fas fa-bahai',
            routerLink: ['/public/collection']
          },
          {
            label: 'Cards by Type',
            icon: 'fas fa-bahai',
            routerLink: ['/public/collectionByPokemon']
          }
        ]
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
        icon: 'far fa-heart',
        routerLink: ['/public/wishlist']
      },
      {
        label: 'About',
        icon: 'fa-solid fa-circle-info',
        routerLink: ['/public/about']
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
            label: 'Clean & Import',
            icon: 'fas fa-file-import',
            routerLink: ['/private/clean-import']
          },
          {
            label: 'Import & Add',
            icon: 'fas fa-file-medical',
            routerLink: ['/private/import']
          },
          {
            icon: 'fas fa-file-export',
            label: 'Export',
            routerLink: ['/private/export']
          },
          {
            label: 'Add & Edit Cards',
            icon: 'fas fa-table',
            routerLink: ['/private/cardmanagement']
          }
        ]
      },
      {
        label: 'Collection',
        icon: 'fas fa-dragon',
        items: [
          {
            label: 'All cards in Collection',
            icon: 'fas fa-bahai',
            routerLink: ['/public/collection']
          },
          {
            label: 'Cards by Type',
            icon: 'fas fa-bahai',
            routerLink: ['/public/collectionByPokemon']
          }
        ]
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
        icon: 'far fa-heart',
        routerLink: ['/public/wishlist']
      },
      {
        label: 'Profile',
        icon: 'fa-solid fa-circle-info',
        items: [
          {
            label: 'About',
            icon: 'fa-solid fa-circle-info',
            routerLink: ['/public/about'],
          },
          {
            label: 'Configurations',
            icon: 'fa-solid fa-gear',
            routerLink: ['/private/config']
          }
        ]
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

  loadTheme () {
    this.config.loadTheme().subscribe(result => {
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
      themeLink.href = result + '.css';
    });
  }

  async loadLogo() {
    this.config.loadLogo().subscribe(async path => {
      this.logo = await this.storage.ref(<string>path).getDownloadURL().toPromise();
    })
  }
}
