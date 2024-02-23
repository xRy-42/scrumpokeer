import { Component } from '@angular/core';
import {Table} from "../../_models/table";
import {PokeerbaseService} from "../../_services/pokeerbase.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  tables: Promise<Table[]> = this.pb.listMyTables();
  tableInput = "";
  usernameInput = "";
  formError: string | null = null;

  constructor(private pb: PokeerbaseService, private router: Router) {
    this.usernameInput = this.pb.username;
  }

  changeUsername() {
    this.pb.changeUsername(this.usernameInput);
  }

  join(tableIdOrName: string) {
    if (tableIdOrName != "") {
      this.pb.joinTable(tableIdOrName).catch(error => {
        this.formError = error.toString()
      }).then(resp => {
        if (resp) {
          this.formError = null;
          this.tables = this.pb.listMyTables();
        }
      });
    }
  }

  create(tableIdOrName: string) {
    if (tableIdOrName != "") {
      this.pb.createTable(tableIdOrName).catch(error => {
        this.formError = error.toString()
      }).then(resp => {
        if (resp) {
          this.formError = null;
          this.tables = this.pb.listMyTables();
        }
      });
    }
  }

  leave(tableId: string) {
    this.tables = this.pb.leaveTable(tableId);
  }

  copyToClipboard(id: string) {
    navigator.clipboard.writeText(id).then(
      () => console.log('Id copied to clipboard'),
      (err) => console.error('Failed to copy id: ', err)
    );
  }

  logout() {
    this.pb.logout();
    this.router.navigate(['/login']);
  }
}