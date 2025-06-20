import { Component, AfterViewInit } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';

@Component({
  selector: 'app-bpmn',
  standalone: true,
  templateUrl: './bpmn.html',
  styleUrls: ['./bpmn.css'],
})
export class BpmnComponent implements AfterViewInit {
  private modeler!: Modeler;

  ngAfterViewInit(): void {
    this.modeler = new Modeler({
      container: '#bpmn-container',
      keyboard: { bindTo: window }
    });

    this.newDiagram();
  }

newDiagram(): void {
  const processId = `Process_${Date.now()}`;
  const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_${processId}"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${processId}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_${processId}">
    <bpmndi:BPMNPlane id="BPMNPlane_${processId}" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="100" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

  this.modeler.importXML(diagramXML).then(() => {
    const canvas = this.modeler.get('canvas') as any;
    canvas.zoom('fit-viewport');
  }).catch(err => {
    console.error('Failed to load new diagram:', err);
  });
}


  downloadXML(): void {
    this.modeler.saveXML({ format: true }).then(({ xml }) => {
      if (!xml) {
        console.error('No XML to save');
        return;
      }
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.bpmn';
      a.click();
      URL.revokeObjectURL(url);
    }).catch(err => {
      console.error('Download failed:', err);
    });
  }

  uploadXML(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const xml = reader.result?.toString();
      if (!xml) {
        console.error('File read error');
        return;
      }

      this.modeler.importXML(xml).then(() => {
        const canvas = this.modeler.get('canvas') as any;
        canvas.zoom('fit-viewport');
      }).catch(err => {
        console.error('Import failed:', err);
      });
    };
    reader.readAsText(file);
  }
}
