import * as go from 'gojs';
import { createServiceIcon, createFrontendIcon, createDatabaseIcon } from './diagramConfig';

export function initDiagram(): go.Diagram {
  const $ = go.GraphObject.make;

  const diagram = $(go.Diagram, {
    'undoManager.isEnabled': true,
    layout: $(go.LayeredDigraphLayout, {
      direction: 0,
      layerSpacing: 100,
      columnSpacing: 60,
      setsPortSpots: false
    }),
    'grid.visible': true,
    'grid.gridCellSize': new go.Size(10, 10),
    allowMove: true,
    allowCopy: true,
    allowDelete: true, 
    model: new go.GraphLinksModel({
      linkKeyProperty: 'key'
    })
  });

  // Service node template
  diagram.nodeTemplateMap.add('service',
    $(go.Node, 'Auto',
      { 
        locationSpot: go.Spot.Center, 
        selectable: true, 
        cursor: 'pointer' 
      },
      $(go.Shape, 'RoundedRectangle',
        {
          fill: '#4A90E2',
          stroke: '#2E5C8A',
          strokeWidth: 2,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          cursor: 'pointer'
        },
        new go.Binding('fill', 'color')
      ),
      $(go.Panel, 'Horizontal',
        { margin: 12 },
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 16px Arial',
              stroke: 'white',
              margin: new go.Margin(0, 0, 5, 0)
            },
            new go.Binding('text', 'title')
          ),
          $(go.Panel, 'Vertical',
            { margin: new go.Margin(5, 0, 0, 0) },
            new go.Binding('itemArray', 'features'),
            {
              itemTemplate: $(go.Panel,
                $(go.TextBlock,
                  {
                    font: '12px Arial',
                    stroke: 'rgba(255,255,255,0.9)',
                    margin: 2
                  },
                  new go.Binding('text', '')
                )
              )
            }
          )
        )
      )
    )
  );

  // Frontend node template
  diagram.nodeTemplateMap.add('frontend',
    $(go.Node, 'Auto',
      { 
        locationSpot: go.Spot.Center, 
        selectable: true 
      },
      $(go.Shape, 'RoundedRectangle',
        {
          fill: '#50C878',
          stroke: '#2E7D57',
          strokeWidth: 2,
          portId: '',
          fromLinkable: true,
          toLinkable: true
        }
      ),
      $(go.Panel, 'Horizontal',
        { margin: 12 },
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 16px Arial',
              stroke: 'white',
              margin: new go.Margin(0, 0, 5, 0)
            },
            new go.Binding('text', 'title')
          ),
          $(go.Panel, 'Vertical',
            { margin: new go.Margin(5, 0, 0, 0) },
            new go.Binding('itemArray', 'features'),
            {
              itemTemplate: $(go.Panel,
                $(go.TextBlock,
                  {
                    font: '12px Arial',
                    stroke: 'rgba(255,255,255,0.9)',
                    margin: 2
                  },
                  new go.Binding('text', '')
                )
              )
            }
          )
        )
      )
    )
  );

  // Data source node template (JSON Files)
  diagram.nodeTemplateMap.add('data',
    $(go.Node, 'Auto',
      { 
        locationSpot: go.Spot.Center, 
        selectable: true 
      },
      $(go.Shape, 'Ellipse',
        {
          fill: '#F39C12',
          stroke: '#D68910',
          strokeWidth: 2,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          width: 120,
          height: 100
        }
      ),
      $(go.Panel, 'Vertical',
        $(go.TextBlock,
          { 
            font: 'bold 16px Arial', 
            stroke: 'white', 
            margin: 8 
          },
          new go.Binding('text', 'title')
        ),
        $(go.TextBlock,
          { 
            font: '12px Arial', 
            stroke: 'rgba(255,255,255,0.8)', 
            margin: 2 
          },
          new go.Binding('text', 'subtitle')
        )
      )
    )
  );

  // Database node template (SQLite)
  diagram.nodeTemplateMap.add('database',
    $(go.Node, 'Auto',
      { 
        locationSpot: go.Spot.Center, 
        selectable: true 
      },
      $(go.Shape, 'RoundedRectangle',
        {
          fill: '#2ECC71',
          stroke: '#27AE60',
          strokeWidth: 2,
          portId: '',
          fromLinkable: true,
          toLinkable: true
        }
      ),
      $(go.Panel, 'Horizontal',
        { margin: 12 },
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            { 
              font: 'bold 16px Arial', 
              stroke: 'white', 
              margin: new go.Margin(0, 0, 5, 0)
            },
            new go.Binding('text', 'title')
          ),
          $(go.TextBlock,
            { 
              font: '10px Arial', 
              stroke: 'rgba(255,255,255,0.8)', 
              margin: new go.Margin(0, 0, 5, 0)
            },
            new go.Binding('text', 'subtitle')
          ),
          $(go.Panel, 'Vertical',
            { margin: new go.Margin(5, 0, 0, 0) },
            new go.Binding('itemArray', 'features'),
            {
              itemTemplate: $(go.Panel,
                $(go.TextBlock,
                  {
                    font: '12px Arial',
                    stroke: 'rgba(255,255,255,0.9)',
                    margin: 1
                  },
                  new go.Binding('text', '')
                )
              )
            }
          )
        )
      )
    )
  );

  // Link template
  diagram.linkTemplate =
    $(go.Link,
      { 
        routing: go.Link.AvoidsNodes, 
        corner: 10, 
        curve: go.Link.JumpOver 
      },
      $(go.Shape, 
        { 
          strokeWidth: 2.5, 
          stroke: '#95A5A6' 
        }
      ),
      $(go.Shape, 
        { 
          toArrow: 'Standard', 
          fill: '#95A5A6', 
          stroke: '#95A5A6', 
          scale: 1.6 
        }
      ),
      $(go.TextBlock,
        {
          font: 'bold 12px Arial',
          segmentOffset: new go.Point(0, -12),
          segmentOrientation: go.Link.OrientUpright,
          background: 'white',
          margin: 4
        },
        new go.Binding('text', 'label')
      )
    );

  return diagram;
}