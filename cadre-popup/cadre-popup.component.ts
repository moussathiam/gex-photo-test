import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-cadre-popup',
  templateUrl: './cadre-popup.component.html',
  styleUrls: ['./cadre-popup.component.scss']
})
export class CadrePopupComponent implements OnInit {
  @Input() titre:any = 'apload';
  @Output() close = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
  }

  closePopup(propag : any) {
    this.close.emit();
    propag.stopPropagation();
  }

}
