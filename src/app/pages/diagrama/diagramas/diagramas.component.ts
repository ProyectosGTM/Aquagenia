import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramasComponent implements AfterViewInit  {
  
  @ViewChild('myDiagramDiv', { static: true }) diagramDiv!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    const $ = go.GraphObject.make;
    const myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true // enable undo & redo
    });

    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 },
          new go.Binding('fill', 'color')),
        $(go.TextBlock, { margin: 8, editable: true },
          new go.Binding('text', 'key').makeTwoWay())
      );

    myDiagram.model = new go.GraphLinksModel(
      [
        { key: 'Pump', color: 'lightblue' },
        { key: 'Valve', color: 'lightgreen' },
        { key: 'Pipe', color: 'lightyellow' },
        { key: 'Tank', color: 'lightcoral' }
      ],
      [
        { from: 'Pump', to: 'Valve' },
        { from: 'Valve', to: 'Pipe' },
        { from: 'Pipe', to: 'Tank' }
      ]);
  }
}
