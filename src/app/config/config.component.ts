import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Config } from '../store/config/model';

@Component({
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  supportedBrowsers = ['chrome', 'chromium'];

  configForm: any;

  constructor(
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Config
  ) {
    this.configForm = fb.group({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      browser: ['chrome', Validators.required],
      // eslint-disable-next-line @typescript-eslint/unbound-method
      pwd: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data !== undefined && this.data !== null) {
      this.configForm.setValue({
        browser: this.data.browser,
        pwd: this.data.defaultPassword
      });
    }
  }
}
