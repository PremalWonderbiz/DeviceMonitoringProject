// adding comment to test pipeline v2
//adding comment to test sonarqube in pipeline v2
//tesing for sonarqube and coverity in pipeline v2
//tesing for generic pipeline pipeline v13
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/diagram.module.scss';
import { useRef } from 'react';
import { ReactDiagram } from 'gojs-react';
import SystemArchitectureDiagram from '@/components/diagrams/SystemArchitectureDiagram';



export default function Home() {
  const diagramRef = useRef<ReactDiagram>(null);
  return (
    <>
      <Head>
        <title>Device Monitoring System - Architecture</title>
        <meta name="description" content="Device Monitoring System Architecture Visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageWrapper}>
        <Header diagramRef={diagramRef}/>
        <main className={styles.contentArea}>
          <SystemArchitectureDiagram diagramRef={diagramRef} />
        </main>
        <Footer />
      </div>
    </>
  );
}