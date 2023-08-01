import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vt-pagenotfound-page',
  templateUrl: './pagenotfound-page.component.html',
  styleUrls: ['./pagenotfound-page.component.scss']
})
export class PageNotFoundPageComponent implements OnInit {
  pageTitle: any;
  navParentClass: boolean;

  constructor(
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedroute.data.subscribe(data => {
      this.pageTitle = data.pageTitle;
    });
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }

}
