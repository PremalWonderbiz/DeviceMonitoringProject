import styles from "@/styles/scss/PropertyPanel.module.scss";

const TabList = ({ activeTab, setActiveTab }: any) => {
    const tabs = ["Static Tab", "Health Tab"];

    return (
        <ul className={styles.tabListUL}>
            {tabs.map((tab) => (
                <li key={tab}
                    onClick={(event: any) => {
                        event.stopPropagation();
                        setActiveTab(tab)
                    }}
                    className={`${styles.tabListLi} ${activeTab === tab ? styles.tabListLiActive : null}`}
                >
                    {tab}
                </li>
            ))}
        </ul>
    );
}

export default TabList;