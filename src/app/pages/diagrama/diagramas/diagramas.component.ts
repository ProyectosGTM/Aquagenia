import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramasComponent implements OnInit {
  private myDiagram: go.Diagram | null = null;
  savedModel: string = ''; // Ahora savedModel está declarado como una propiedad pública

  constructor() {}

  ngOnInit(): void {
    this.initDiagram();
  }

  initDiagram(): void {
    const $ = go.GraphObject.make;

    this.myDiagram = $(go.Diagram, "myDiagramDiv", {
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(30, 20),
      "draggingTool.isGridSnapEnabled": true,
      "resizingTool.isGridSnapEnabled": true,
      "rotatingTool.snapAngleMultiple": 90,
      "rotatingTool.snapAngleEpsilon": 45,
      "undoManager.isEnabled": true,
      "ModelChanged": e => {
        if (e.isTransactionFinished) this.updateAnimation();
      }
    });

    // Define el template de nodo y enlace aquí
    this.myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Rectangle", { fill: "lightblue" }),
        $(go.TextBlock, { margin: 8 }, new go.Binding("text", "key"))
      );

    this.myDiagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true, toShortLength: 7 },
        new go.Binding("points").makeTwoWay(),
        // mark each Shape to get the link geometry with isPanelMain: true
        $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 7 }),
        $(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 5 }),
        $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [10, 10] }),
        $(go.Shape, { toArrow: "Triangle", scale: 1.3, fill: "gray", stroke: null })
      );

    this.load();
  }

  updateAnimation(): void {
    // Implementa la lógica de actualización de animación aquí
  }

  save(): void {
    if (this.myDiagram) {
      this.savedModel = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    }
  }

  load(): void {
    const sampleData = {
      "class": "go.GraphLinksModel",
      "nodeDataArray": [
        {"key":"P1", "category":"Process", "pos":"150 120", "text":"Process"},
        {"key":"P2", "category":"Process", "pos":"330 320", "text":"Tank"},
        {"key":"V1", "category":"Valve", "pos":"270 120", "text":"V1"},
        {"key":"P3", "category":"Process", "pos":"150 420", "text":"Pump"},
        {"key":"V2", "category":"Valve", "pos":"150 280", "text":"VM", "angle":270},
        {"key":"V3", "category":"Valve", "pos":"270 420", "text":"V2", "angle":180},
        {"key":"P4", "category":"Process", "pos":"450 140", "text":"Reserve Tank"},
        {"key":"V4", "category":"Valve", "pos":"390 60", "text":"VA"},
        {"key":"V5", "category":"Valve", "pos":"450 260", "text":"VB", "angle":90}
      ],
      "linkDataArray": [
        {"from":"P1", "to":"V1"},
        {"from":"P3", "to":"V2"},
        {"from":"V2", "to":"P1"},
        {"from":"P2", "to":"V3"},
        {"from":"V3", "to":"P3"},
        {"from":"V1", "to":"V4"},
        {"from":"V4", "to":"P4"},
        {"from":"V1", "to":"P2"},
        {"from":"P4", "to":"V5"},
        {"from":"V5", "to":"P2"}
      ]
    };
    if (this.myDiagram) {
      this.myDiagram.model = go.Model.fromJson(sampleData);
    }
  }

  isDiagramModified(): boolean {
    return !!this.myDiagram && this.myDiagram.isModified;
  }
}
