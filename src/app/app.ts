import { Component } from '@angular/core';
import { BpmnComponent } from './bpmn/bpmn';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BpmnComponent],
  templateUrl: './app.html',
  styleUrls: []
})
export class App {}
