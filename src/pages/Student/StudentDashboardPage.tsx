import { useEffect, useRef, useState, type ReactNode } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconChevronDown from '@douyinfe/semi-icons/lib/es/icons/IconChevronDown';
import IconChevronUp from '@douyinfe/semi-icons/lib/es/icons/IconChevronUp';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconIdCard from '@douyinfe/semi-icons/lib/es/icons/IconIdCard';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { EscrowFlowChart } from '../../components/DashboardVisualization/EscrowFlowChart';
import { TaskProgressTrendChart } from '../../components/DashboardVisualization/TaskProgressTrendChart';
import { TaskProgressTimeline } from '../../components/DemoScenario/TaskProgressTimeline';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { deliverableTone } from '../../components/SemanticStatus/statusToneMap';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { certificateDetails, deliverableDescription, deliverableFiles, formatCurrency, formatScenarioTime } from '../../demo/demoScenarioData';
import type { DemoScenarioStage } from '../../demo/demoScenarioTypes';
import styles from './StudentDashboardPage.module.css';

type SectionId = 'progress' | 'deliverable' | 'evidence' | 'settlement' | 'certificate';

const defaultSection: Record<DemoScenarioStage, SectionId> = {
  working: 'deliverable',
  submitted: 'deliverable',
  settling: 'settlement',
  settled: 'certificate',
};

function DisclosureSection({ id, title, summary, open, onToggle, children }: { id: SectionId; title: string; summary: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className={styles.disclosure}>
      <button type="button" aria-expanded={open} aria-controls={`task-section-${id}`} onClick={onToggle}>
        <span><strong>{title}</strong><small>{summary}</small></span>
        {open ? <IconChevronUp /> : <IconChevronDown />}
      </button>
      {open && <div className={styles.disclosureBody} id={`task-section-${id}`}>{children}</div>}
    </section>
  );
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const reduceMotion = useReducedMotion();
  const submitTimer = useRef<number | null>(null);
  const { state, view, submitDeliverable } = useDemoScenario();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(defaultSection[state.stage]);

  useEffect(() => () => { if (submitTimer.current !== null) window.clearTimeout(submitTimer.current); }, []);
  useEffect(() => setOpenSection(defaultSection[state.stage]), [state.stage]);

  const handleSubmit = () => {
    if (state.stage !== 'working' || isSubmitting) return;
    setIsSubmitting(true);
    submitTimer.current = window.setTimeout(() => {
      submitDeliverable();
      setIsSubmitting(false);
      submitTimer.current = null;
    }, reduceMotion ? 120 : 680);
  };

  const toggle = (id: SectionId) => setOpenSection((current) => current === id ? null : id);
  const deliverableStatus = state.deliverable.status === 'not-submitted' ? '待提交' : state.deliverable.status === 'accepted' ? '已验收' : '已提交';
  const settlementStatus = state.settlement.status === 'paid' ? '已到账' : state.settlement.status === 'processing' ? '执行中' : `${formatCurrency(state.task.amount)} 已托管`;

  return (
    <motion.main className={styles.page} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
      <header className={styles.taskHeader}>
        <Button theme="borderless" onClick={() => navigate('/student')}>返回工作台</Button>
        <div className={styles.taskTitle}>
          <span>{taskId ?? state.task.id} · {state.task.enterpriseName}</span>
          <h1>{state.task.title}</h1>
          <SemanticStatusTag tone={state.stage === 'settled' ? 'success' : state.stage === 'submitted' ? 'value' : 'brand'}>{view.stageLabel}</SemanticStatusTag>
        </div>
        <div className={styles.headerActions}>
          <Button theme="light" onClick={() => navigate('/student/messages')}>联系企业</Button>
          {(state.stage === 'submitted' || state.stage === 'settling') && <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate('/enterprise/task')}>前往企业端</Button>}
        </div>
      </header>

      <section className={styles.taskOverview} aria-label="任务概览">
        <div><span>当前进度</span><strong>{state.progress} / 10</strong></div>
        <div><span>薪资保障</span><strong>{formatCurrency(state.task.amount)} {state.escrow.status === 'held' ? '已托管' : '已到账'}</strong></div>
        <div><span>工作周期</span><strong>{state.task.period.replace('2026年', '')}</strong></div>
        <div><span>最近存证</span><strong>{state.latestEvidence.id}</strong></div>
      </section>

      <div className={styles.sections}>
        <DisclosureSection id="progress" title="履约进展" summary={`${state.progress} / 10 · ${view.stageLabel}`} open={openSection === 'progress'} onToggle={() => toggle('progress')}>
          <TaskProgressTrendChart />
        </DisclosureSection>

        <DisclosureSection id="deliverable" title="工作成果" summary={`${deliverableStatus}${state.deliverable.evidenceId ? ` · ${state.deliverable.evidenceId}` : ''}`} open={openSection === 'deliverable'} onToggle={() => toggle('deliverable')}>
          <div className={styles.deliverablePanel} aria-live="polite">
            <div className={styles.sectionHeading}><div><span>成果文件</span><h2>{state.deliverable.status === 'not-submitted' ? '提交本次工作成果' : '成果提交凭证'}</h2></div><SemanticStatusTag tone={deliverableTone(state)}>{deliverableStatus}</SemanticStatusTag></div>
            <div className={styles.fileList}>{deliverableFiles.map((file) => <div key={file}><IconFile /><span>{file}</span><small>示例文件</small></div>)}</div>
            <div className={styles.workNote}><span>工作说明</span><p>{deliverableDescription}</p></div>
            {state.deliverable.status === 'not-submitted' ? (
              <div className={styles.submitArea}><span>{isSubmitting ? '正在生成成果存证' : '确认内容后生成模拟存证'}</span><Button theme="solid" type="primary" loading={isSubmitting} disabled={isSubmitting} onClick={handleSubmit}>提交示例成果</Button></div>
            ) : (
              <dl className={styles.credential}><div><dt>提交时间</dt><dd>{formatScenarioTime(state.deliverable.submittedAt)}</dd></div><div><dt>成果存证</dt><dd>{state.deliverable.evidenceId}</dd></div></dl>
            )}
          </div>
        </DisclosureSection>

        <DisclosureSection id="evidence" title="证据链" summary={`${state.stage === 'working' ? '5' : state.stage === 'submitted' ? '6' : state.stage === 'settling' ? '6' : '7'} / 7 · ${state.latestEvidence.id}`} open={openSection === 'evidence'} onToggle={() => toggle('evidence')}>
          <TaskProgressTimeline />
        </DisclosureSection>

        <DisclosureSection id="settlement" title="薪资与结算" summary={settlementStatus} open={openSection === 'settlement'} onToggle={() => toggle('settlement')}>
          <EscrowFlowChart />
          {state.settlement.status === 'paid' && <dl className={styles.settlementMeta}><div><dt>交易编号</dt><dd>{state.settlement.transactionId}</dd></div><div><dt>执行时间</dt><dd>{formatScenarioTime(state.settlement.settledAt)}</dd></div></dl>}
        </DisclosureSection>

        <DisclosureSection id="certificate" title="实践证书" summary={state.certificate.status === 'generated' ? `${state.certificate.id} · 已生成` : '待生成'} open={openSection === 'certificate'} onToggle={() => toggle('certificate')}>
          {state.certificate.status === 'generated' ? (
            <div className={styles.certificateBody}>
              <div className={styles.certificateHeading}><IconIdCard /><div><span>大学生兼职实践证书</span><h2>{state.task.title}</h2></div><SemanticStatusTag tone="success">已生成</SemanticStatusTag></div>
              <dl><div><dt>学生</dt><dd>{state.student.name}</dd></div><div><dt>企业</dt><dd>{state.task.enterpriseName}</dd></div><div><dt>企业评价</dt><dd>{certificateDetails.evaluation}</dd></div><div><dt>实践信用</dt><dd>{certificateDetails.credit}</dd></div><div><dt>证书编号</dt><dd>{state.certificate.id}</dd></div></dl>
              <code>{state.certificate.hash}</code>
            </div>
          ) : <p className={styles.pendingCopy}>完成企业验收与薪资结算后自动生成。</p>}
        </DisclosureSection>
      </div>
    </motion.main>
  );
}
