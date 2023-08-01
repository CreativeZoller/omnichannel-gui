import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vt-adminlayout',
  templateUrl: './adminlayout.component.html',
  styleUrls: ['./adminlayout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  navParentClass: boolean;
  constructor() { }

  ngOnInit(): void {
  }


  toggleReceive($event) {
    this.navParentClass = $event;
  }
}
