import styles from "@/styles/scss/Table.module.scss";

const DeviceDiagramView = ({ currentDeviceId, sorting, setSorting, refreshDeviceDataKey, updatedFieldsMap, currentPage, setCurrentPage, totalPages, pageSize, setPageSize, data, setIsPropertyPanelOpen }: any) => {
    if (!data || data.length === 0)
        return <p className="px-2">No data available.</p>;

    return (
        <>
            {/* <div
                style={{
                    width: "full",
                    height: "100%",
                }}> 

                <ReactDiagramWrapper
                    nodeDataArray={state.nodeDataArray}
                    linkDataArray={state.linkDataArray}
                    modelData={state.modelData}
                    skipsDiagramUpdate={state.skipsDiagramUpdate}
                    onModelChange={handleModelChange}
                    onInitDiagram={createDiagram}
                    onDiagramEvent={(e: go.DiagramEvent) => {
                        const name = e.name;
                        switch (name) {
                            case 'ChangedSelection': {
                                const sel = e.subject.first();
                                if (sel instanceof go.Node) {
                                    const data = sel.data;

                                    // Example conditions — adjust based on your model
                                    if (data?.macId) {
                                        console.log('Device node selected:', data);
                                        // openPropertypanel(data.macId);
                                    }
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    }}

                />
            </div> */}
        </>
    );
};

export default DeviceDiagramView;
