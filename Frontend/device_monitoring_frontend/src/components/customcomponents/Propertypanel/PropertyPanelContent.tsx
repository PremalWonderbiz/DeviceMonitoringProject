import React from "react";
import Accordion from "../Accordion";
import styles from "@/styles/scss/PropertyPanel.module.scss";

export const StaticTabContent = React.memo(({ staticProps }: { staticProps: any }) => {
    console.log("Rendering StaticTabContent with staticProps:", staticProps);
    return (
        <div className={`${styles.propertyPanelTabContent}`}>
            {Object.entries(staticProps).map(([key, value]: any) => {
                if (typeof value === "object" && value !== null)
                    return renderObject(key, value);
                else
                    return (
                        <div className={styles.keyValueSection} key={key}>
                            {renderKeyValueSection(key, value, 0)}
                        </div>
                    );
            })}
        </div>
    );
});

export const HealthTabContent = React.memo(({ dynamicProps }: { dynamicProps: any }) => {
    console.log("Rendering DynamicTabContent with staticProps:", dynamicProps);
    return (
        <div className={`${styles.propertyPanelTabContent}`}>
            {Object.entries(dynamicProps).map(([key, value]: any) => {
                if (typeof value === "object" && value !== null)
                    return renderObject(key, value);
                else
                    return (
                        <div className={styles.keyValueSection} key={key}>
                            {renderKeyValueSection(key, value, 0)}
                        </div>
                    );
            })}
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.dynamicProps === nextProps.dynamicProps;
});


export const renderKeyValueSection = (key: any, value: any, depth: any) => {
    if (typeof value === "boolean") 
        value = value ? "Yes" : "No";
    
    return (
        <div className={styles.kvRow}>
            <span className={`${styles.kvKey} ${styles[`depth-${depth}`]}`}>{key}</span>
            <span className={styles.kvValue}> {value} </span>
        </div>)
}

export const renderObject = (key: any, data: any, depth = 1) => {
    if (!data || Object.keys(data).length === 0)
        return null;

    if (Array.isArray(data))
        return renderArray(key, data, depth);

    return (<Accordion title={<span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]}`}>{key}</span>} defaultOpen={true} bgColor='white'>
        <div className={styles.keyValueSection}>
            {Object.entries(data).map(([key, value]: any) => {
                if (typeof value === 'object' && value !== null) {
                    return renderObject(key, value, depth + 1);
                } else {
                    return renderKeyValueSection(key, value, depth + 1);
                }
            })}
        </div>
    </Accordion>)
}

export const renderArray = (key: any, data: any, depth: any) => {
    if (!data || data.length === 0)
        return null;

    let counter = 1;
    return (<Accordion title={<span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]}`}>{key}</span>} defaultOpen={true} bgColor='white'>
        <div className={styles.keyValueSection}>
            {data.map((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    return renderObject(`${key} ${counter++}`, item, depth + 1);
                } else {
                    return renderKeyValueSection(`${key} ${counter++}`, item, depth + 1);
                }
            })}
        </div>
    </Accordion>)
}


