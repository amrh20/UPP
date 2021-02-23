import { Component, OnInit, Input } from '@angular/core';
import { Section } from './../../../core/models/form';
import { I18nService } from '../../../core/services/i18n.service';
import { ResetPropagationService } from '../../../core/services/reset-propagation.service';
import { ProfileRequestorService } from '../../services/profile-requestor.service';
import { StateMachineService } from '../../../core/services/state-machine.service';
import * as Constants from "../../constants/constants";

@Component({
  selector: 'app-data-log',
  templateUrl: './data-log.component.html',
  styleUrls: ['./data-log.component.css']
})
export class DataLogComponent implements OnInit {

  isReadOnly: boolean = true;
  @Input() section: Section;
  @Input() lov: any;

  constructor(public i18n: I18nService,
    public resetPropagator: ResetPropagationService,
    public profileRequestorService: ProfileRequestorService,
    public stateMachine: StateMachineService) { }
  tableCellTextAlign() {
    return {
      "control-cells-ar":
        this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }
  ngOnInit() {
  }

}
