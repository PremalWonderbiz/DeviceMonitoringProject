import React from 'react';
import styles from '@/styles/diagram.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.statusIndicators}>
          <div className={styles.indicator}>
            <div className={styles.statusDot}></div>
            <span>Real-time Event Flow</span>
          </div>
          <span className={styles.separator}>|</span>
          <span className={styles.indicator}>WebSocket Communication</span>
          <span className={styles.separator}>|</span>
          <span className={styles.indicator}>Microservices Pattern</span>
        </div>
        <div className={styles.helpText}>
          Click nodes to interact • Hover for details
        </div>
      </div>
    </footer>
  );
};

export default Footer;  