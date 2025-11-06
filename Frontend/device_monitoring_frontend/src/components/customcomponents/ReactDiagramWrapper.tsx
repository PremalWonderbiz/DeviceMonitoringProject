import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useEffect, useRef } from 'react';
import { ReactDiagram as GoDiagram } from 'gojs-react';

// TypeScript JSX type cast workaround
const Diagram = GoDiagram as unknown as React.FC<any>;

interface DiagramProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
    /** New: external customizer for diagram setup */
    onInitDiagram?: (diagram: go.Diagram) => void;
}

export const ReactDiagramWrapper = (props: DiagramProps) => {
    console.log("rerendered ReactDiagramWrapper");

    const diagramRef = useRef<ReactDiagram>(null);

    // Add/remove listeners
    useEffect(() => {
        if (!diagramRef.current) return;
        const diagram = diagramRef.current.getDiagram();

        if (diagram instanceof go.Diagram) {
            diagram.addDiagramListener('ChangedSelection', props.onDiagramEvent);
        }
        return () => {
            if (diagram instanceof go.Diagram) {
                diagram.removeDiagramListener('ChangedSelection', props.onDiagramEvent);
            }
        };
    }, []);


    /** Main initDiagram function used by ReactDiagram */
    const initDiagram = (): go.Diagram => {
        const diagram = new go.Diagram({
            "undoManager.isEnabled": true,
            "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
            allowHorizontalScroll: false,
            allowVerticalScroll: true,
            autoScrollRegion: 0, // disables auto-scrolling when dragging near edges
            model: new go.GraphLinksModel({
                linkKeyProperty: "key",
                // 👇 tell GoJS to use "parent" property for grouping
                nodeGroupKeyProperty: "parent",
                // 👇 also enable groups in model
                nodeIsGroupProperty: "isGroup",
            }),
        });

        // Wait until layout completes so viewport bounds are correct
        diagram.addDiagramListener("InitialLayoutCompleted", () => {
            diagram.nodes.each(node => {
                node.dragComputation = (part, newLoc) => {
                    const vb = diagram.viewportBounds.copy(); // visible area in document coords
                    const nb = part.actualBounds;

                    // Clamp so node stays fully inside visible area
                    const clampedX = Math.max(vb.x, Math.min(newLoc.x, vb.right - nb.width));
                    const clampedY = Math.max(vb.y, Math.min(newLoc.y, vb.bottom - nb.height));

                    return new go.Point(clampedX, clampedY);
                };
            });
        });

        // 👇 Allow external customization (layouts, templates, etc.)
        if (props.onInitDiagram) {
            props.onInitDiagram(diagram);
        }
        else {
            // Default fallback template (if none provided)
            diagram.nodeTemplate = new go.Node('Auto')
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape('RoundedRectangle', {
                        name: 'SHAPE',
                        fill: 'white',
                        strokeWidth: 1,
                        portId: '',
                        fromLinkable: true,
                        toLinkable: true,
                        cursor: 'pointer',
                    }).bind('fill', 'color'),
                    new go.TextBlock({
                        margin: 8,
                        editable: true,
                        font: '400 .875rem Roboto, sans-serif',
                    }).bindTwoWay('text')
                );

            diagram.linkTemplate = new go.Link()
                .add(new go.Shape(), new go.Shape({ toArrow: 'Standard' }));
        }

        return diagram;
    };


    return (
        <Diagram
            ref={diagramRef}
            divClassName="diagram-component"
            initDiagram={initDiagram}
            nodeDataArray={props.nodeDataArray}
            linkDataArray={props.linkDataArray}
            modelData={props.modelData}
            onModelChange={props.onModelChange}
            skipsDiagramUpdate={props.skipsDiagramUpdate}
            ondia
        />
    );
};
