import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramasComponent implements AfterViewInit {
  
  @ViewChild('myDiagramDiv', { static: true }) diagramDiv!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true // enable undo & redo
    });

    // Define the node template
    myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle",
        { fill: "#FFF8DC", stroke: "#708090", strokeWidth: 2 },
        new go.Binding("figure", "shape")),
      $(go.TextBlock,
        { margin: 8, font: "bold 12px sans-serif" },
        new go.Binding("text", "key"))
    );

    // Set the background grid
    myDiagram.grid = $(go.Panel, 'Grid',
      { gridCellSize: new go.Size(20, 20) },
      $(go.Shape, 'LineH', { stroke: 'black', strokeWidth: 0.5 }),
      $(go.Shape, 'LineV', { stroke: 'black', strokeWidth: 0.5 })
    );

    // Set the background color
    this.diagramDiv.nativeElement.style.background = 'white';

    // Create the model data
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
      ]
    );
  }
}
