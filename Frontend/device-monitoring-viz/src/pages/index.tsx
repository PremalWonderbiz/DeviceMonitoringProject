// adding comment to test pipeline v2
// comment to test sonarqube check v2
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/diagram.module.scss';

// Dynamic import to avoid SSR issues with GoJS
const SystemArchitectureDiagram = dynamic(
  () => import('@/components/diagrams/SystemArchitectureDiagram'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Device Monitoring System - Architecture</title>
        <meta name="description" content="Device Monitoring System Architecture Visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.contentArea}>
          <SystemArchitectureDiagram />
        </main>
        <Footer />
      </div>
    </>
  );
}
