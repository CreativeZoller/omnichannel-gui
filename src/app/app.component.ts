import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations/index';

@Component({
  selector: 'vt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInAnimation],
})
export class AppComponent implements OnInit {
  title: string;

  constructor() {}

  async ngOnInit() {
    this.title = 'Omnichannel Communication GUI';
  }
}
