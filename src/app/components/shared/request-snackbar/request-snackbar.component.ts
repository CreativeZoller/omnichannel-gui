import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'vt-request-snackbar',
  templateUrl: './request-snackbar.component.html',
  styleUrls: ['./request-snackbar.component.scss']
})
export class RequestSnackbarComponent implements OnInit {

  constructor (
    private snackBarRef: MatSnackBarRef<RequestSnackbarComponent>,
    public router: Router,
  ) { }

  public close() {
    this.snackBarRef.dismiss();
  }
  
  ngOnInit(): void {
  }

}
