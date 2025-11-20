import styles from '@/styles/diagram.module.scss';

const Header = (props:any) => {
  const downloadDiagram = () => {
    if(props.diagramRef && props.diagramRef.current) {
      const diagram = props.diagramRef.current.getDiagram();
      diagram.commandHandler.downloadSvg({ name: "mySVGfile.svg" });
    }
    else{
      alert('Diagram download failed!');
    }
  }
  return (
    <header className={styles.header}>
      <h1>Device Monitoring System Architecture</h1>
      <div className={styles.lowerDescription}>Microservices Architecture with Real-time Event Streaming & Configurable Data Sources
        <button onClick={downloadDiagram} className={styles.downloadDiagramBtn}>Download diagram(svg)</button>
      </div>
    </header>
  );
};

export default Header;