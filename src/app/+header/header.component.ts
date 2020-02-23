import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CONSTANTS } from '../app.constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public hasData: boolean = false;
  @Output() public importClosed = new EventEmitter<boolean>();

  public importName = CONSTANTS.appId;
  public importMethods = CONSTANTS.importMethods;

  public onImportClosed(imported: boolean): void {
    this.importClosed.emit(imported);
  }
}
