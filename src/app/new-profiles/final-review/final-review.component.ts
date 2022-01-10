import { Component, Input, OnInit } from '@angular/core';
import { org_model } from '../../store/orgs/model';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent implements OnInit {

  public org : org_model;

  constructor() {
    this.org = new org_model({});
  }

  ngOnInit(): void {
  }

}
