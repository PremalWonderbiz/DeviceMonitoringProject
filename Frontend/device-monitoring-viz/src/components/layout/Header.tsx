import React from 'react';
import styles from '@/styles/diagram.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>Device Monitoring System Architecture</h1>
      <p>Microservices Architecture with Real-time Event Streaming & Configurable Data Sources</p>
    </header>
  );
};

export default Header;