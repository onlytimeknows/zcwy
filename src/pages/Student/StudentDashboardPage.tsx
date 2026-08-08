import { useEffect, useRef, useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconCheckCircleStroked from '@douyinfe/semi-icons/lib/es/icons/IconCheckCircleStroked';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconIdCard from '@douyinfe/semi-icons/lib/es/icons/IconIdCard';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CurrentTaskCard } from '../../components/DemoScenario/CurrentTaskCard';
import { TaskProgressTimeline } from '../../components/DemoScenario/TaskProgressTimeline';
import { EscrowFlowChart } from '../../components/DashboardVisualization/EscrowFlowChart';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { deliverableTone } from '../../components/SemanticStatus/statusToneMap';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import {
  certificateDetails,
  deliverableDescription,
  deliverableFiles,
  formatCurrency,
  formatScenarioTime,
} from '../../demo/demoScenarioData';
import styles from './StudentDashboardPage.module.css';

const { Title, Paragraph, Text } = Typography;

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const submitTimer = useRef<number | null>(null);
  const { state, submitDeliverable } = useDemoScenario();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  useEffect(() => () => {
    if (submitTimer.current !== null) {
      window.clearTimeout(submitTimer.current);
    }
  }, []);

  useEffect(() => {
    if (state.stage === 'settled') {
      setCertificateOpen(true);
    }
  }, [state.stage]);

  const handleSubmit = () => {
    if (state.stage !== 'working' || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    submitTimer.current = window.setTimeout(() => {
      submitDeliverable();
      setIsSubmitting(false);
      submitTimer.current = null;
    }, reduceMotion ? 120 : 680);
  };

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.pageHeader} id="workspace-overview">
        <div>
          <Title heading={1}>学生工作台</Title>
          <Paragraph>{state.student.name} · 学生演示身份</Paragraph>
          <Text className={styles.contextNote}>1 项进行中的兼职任务</Text>
        </div>
        <div className={styles.headerActions}>
          <Button theme="borderless" onClick={() => navigate('/auth')}>切换演示身份</Button>
        </div>
      </header>

      <div className={styles.topGrid}>
        <CurrentTaskCard />
        <TaskProgressTimeline />
      </div>

      <EscrowFlowChart />

      <div className={styles.detailColumn}>

          <section className={styles.deliverablePanel} id="deliverable-section" aria-labelledby="deliverable-title" aria-live="polite">
            <div className={styles.sectionHeading}>
              <div>
                <Text className={styles.sectionLabel}>工作成果</Text>
                <Title heading={3} id="deliverable-title">
                  {state.deliverable.status === 'not-submitted' ? '提交本次工作成果' : '成果提交凭证'}
                </Title>
              </div>
              <SemanticStatusTag tone={deliverableTone(state)}>
                {state.deliverable.status === 'not-submitted' ? '待提交' : state.deliverable.status === 'accepted' ? '已验收' : '已存证'}
              </SemanticStatusTag>
            </div>

            <div className={styles.fileList}>
              {deliverableFiles.map((file) => (
                <div key={file}><IconFile /><span>{file}</span><Text type="tertiary">示例文件</Text></div>
              ))}
            </div>
            <div className={styles.workNote}>
              <span>工作说明</span>
              <p>{deliverableDescription}</p>
            </div>

            {state.deliverable.status === 'not-submitted' ? (
              <div className={styles.submitArea}>
                <div>
                  <strong>{isSubmitting ? '正在生成成果存证' : '确认内容后即可生成模拟存证'}</strong>
                  <span>不进行真实文件上传，页面仅保存演示阶段与时间。</span>
                </div>
                <Button
                  size="large"
                  theme="solid"
                  type="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? '正在生成成果存证' : '提交示例成果'}
                </Button>
              </div>
            ) : (
              <div className={styles.credential}>
                <div><span>提交时间</span><strong>{formatScenarioTime(state.deliverable.submittedAt)}</strong></div>
                <div><span>成果存证编号</span><strong>{state.deliverable.evidenceId}</strong></div>
                <Button
                  theme="light"
                  type="primary"
                  icon={<IconArrowRight />}
                  iconPosition="right"
                  onClick={() => navigate('/enterprise')}
                  disabled={state.stage === 'settling'}
                >
                  {state.stage === 'settled' ? '前往企业端查看结算' : '切换到企业端验收'}
                </Button>
              </div>
            )}
          </section>

          <AnimatePresence>
            {state.stage === 'settled' && (
              <motion.section
                className={styles.successPanel}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.successIcon}><IconCheckCircleStroked size="extra-large" /></div>
                <div>
                  <Text className={styles.sectionLabel}>结算反馈</Text>
                  <Title heading={3}>薪资已到账，实践履历已更新</Title>
                  <Paragraph>模拟智能合约执行成功，本次履约已沉淀为可核验的实践记录。</Paragraph>
                </div>
                <div className={styles.successFacts}>
                  <div><span>到账金额</span><strong>{formatCurrency(state.task.amount)}</strong></div>
                  <div><span>信用积分</span><strong>+{state.student.creditPointsEarned}</strong></div>
                  <div><span>实践证书</span><strong>已生成</strong></div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {state.certificate.status === 'generated' && (
            <section className={styles.certificateCard} aria-labelledby="certificate-title">
              <div className={styles.certificateHeading}>
                <span className={styles.certificateIcon}><IconIdCard size="extra-large" /></span>
                <div>
                  <Text className={styles.sectionLabel}>ON-CHAIN PRACTICE RECORD</Text>
                  <Title heading={3} id="certificate-title">大学生兼职实践证书</Title>
                </div>
                <SemanticStatusTag>概念演示凭证</SemanticStatusTag>
              </div>
              <Button theme="borderless" onClick={() => setCertificateOpen((open) => !open)}>
                {certificateOpen ? '收起证书详情' : '展开证书详情'}
              </Button>
              <AnimatePresence initial={false}>
                {certificateOpen && (
                  <motion.div
                    className={styles.certificateBody}
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <dl>
                      <div><dt>学生</dt><dd>{state.student.name}</dd></div>
                      <div><dt>岗位</dt><dd>{state.task.title}</dd></div>
                      <div><dt>企业</dt><dd>{state.task.enterpriseName}</dd></div>
                      <div><dt>工作周期</dt><dd>{state.task.period}</dd></div>
                      <div><dt>企业评价</dt><dd>{certificateDetails.evaluation}</dd></div>
                      <div><dt>实践信用</dt><dd>{certificateDetails.credit}</dd></div>
                      <div><dt>证书编号</dt><dd>{state.certificate.id}</dd></div>
                    </dl>
                    <code>{state.certificate.hash}</code>
                    <Text>模拟链上环境 · 验证码仅用于概念演示</Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
      </div>
    </motion.main>
  );
}
