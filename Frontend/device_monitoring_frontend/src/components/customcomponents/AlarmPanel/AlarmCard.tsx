import { useRef, useState } from "react";
import { FilePenLine } from "lucide-react";
import styles from "@/styles/scss/AlarmPanel.module.scss";
import CustomModal from "./CustomModal";
import { formatRelativeTime } from "@/utils/helperfunctions";
import Badge from "../Badge";
import { Tooltip } from "@/components/ui/tooltip";

const severityColors: Record<string, { bg: string; color: string }> = {
    Critical: { bg: 'criticalAlarm', color: 'light' },
    Warning: { bg: 'warningAlarm', color: 'dark' },
    Information: { bg: 'infoAlarm', color: 'light' },
};

const AlarmCard = ({ alarm, acknowledgeAlarm, resolveAlarm }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isResolveCommentModalOpen, setIsResolveCommentModalOpen] = useState(false);
    const [alarmComment, setAlarmComment] = useState<string>("");
    

    return (
        <div className={styles.alarmCardContainer} onClick={() => { setIsExpanded(prev => !prev); setIsResolveCommentModalOpen(false); }}>
            <CustomModal
                setAlarmComment={setAlarmComment}
                title={"Add comment"}
                isOpen={isResolveCommentModalOpen}
                setIsOpen={setIsResolveCommentModalOpen}
            />

            <div className={styles.alarmCardDiv}>
                <div>
                    <p className={styles.message}>{alarm.message}</p>
                    <span className={styles.time}>{formatRelativeTime(alarm.raisedAt)}</span>
                </div>
                <div className={styles.rightSide}>
                    <Badge
                        label={alarm.severity}
                        bgColor={severityColors[alarm.severity].bg}
                        textColor={severityColors[alarm.severity].color}
                    />
                </div>
            </div>

            <div className={`${styles.expandedContent} ${isExpanded ? styles.show : ""}`}>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        acknowledgeAlarm(alarm.id);
                    }}
                    className={styles.ackBtn}
                >
                    Mark as Investigating
                </button>

                <button
                    onClick={(event) => {event.stopPropagation(); resolveAlarm(alarm.id, alarmComment) }}
                    className={`${styles.ackBtn} ${styles.resolveBtn}`}
                >
                    Mark as Resolved
                    <Tooltip openDelay={100} closeDelay={150} content={<span>Add comment (optional)</span>}>
                        <FilePenLine
                            size={20}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsResolveCommentModalOpen(true);
                            }}
                            className={styles.resolveCommentIcon}
                        />
                    </Tooltip>
                </button>

                <button
                    onClick={(event) => event.stopPropagation()}
                    className={styles.ackBtn}
                >
                    Ignore
                </button>
            </div>
        </div>
    );
};

export default AlarmCard;
