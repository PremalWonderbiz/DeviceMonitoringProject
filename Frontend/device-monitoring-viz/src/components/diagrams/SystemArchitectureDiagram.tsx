import React from 'react';
import { ReactDiagram } from 'gojs-react';
import { initDiagram } from '@/utils/diagramTemplates';
import { nodeDataArray, linkDataArray } from '@/utils/diagramConfig';
import styles from '@/styles/diagram.module.scss';

const SystemArchitectureDiagram: React.FC = () => {
  return (
    <div className={styles.diagramContainer}>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="gojs-diagram"
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
      />
    </div>
  );
};

export default SystemArchitectureDiagram;