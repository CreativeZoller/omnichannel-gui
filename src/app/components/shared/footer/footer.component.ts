import { Component } from '@angular/core';
import { UserClaim } from '@models/UserClaim';
import { PersistService } from '@services/persist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vt-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public usr: UserClaim;
  public copyrightYear: Date = new Date();
  public currentApplicationVersion: number = environment.appVersion;
  public currentApplicationName: string = environment.appTitle;
  public extraFooterText: string = '';

  constructor(private store: PersistService) {
    this.usr = this.store.get<UserClaim>('user');
    if (this.usr.VT_Employee) {
      this.extraFooterText = ' - version ' + this.currentApplicationVersion;
      if (this.currentApplicationName != '') {
         this.extraFooterText = ' - version ' + this.currentApplicationVersion + ', ' + this.currentApplicationName;
       }
    }
  }
}
