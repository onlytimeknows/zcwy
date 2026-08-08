import { useEffect, useRef, useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconCheckCircleStroked from '@douyinfe/semi-icons/lib/es/icons/IconCheckCircleStroked';
import IconClockStroked from '@douyinfe/semi-icons/lib/es/icons/IconClockStroked';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import IconTick from '@douyinfe/semi-icons/lib/es/icons/IconTick';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CurrentTaskCard } from '../../components/DemoScenario/CurrentTaskCard';
import { TaskProgressTimeline } from '../../components/DemoScenario/TaskProgressTimeline';
import { EscrowFlowChart } from '../../components/DashboardVisualization/EscrowFlowChart';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { acceptanceTone } from '../../components/SemanticStatus/statusToneMap';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import {
  deliverableDescription,
  deliverableFiles,
  formatCurrency,
  formatScenarioTime,
  settlementReceipt,
  settlementSteps,
} from '../../demo/demoScenarioData';
import styles from './EnterpriseDashboardPage.module.css';

const { Title, Paragraph, Text } = Typography;

export function EnterpriseDashboardPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const executionTimers = useRef<number[]>([]);
  const { state, startSettlement, completeSettlement } = useDemoScenario();
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    executionTimers.current.forEach((timer) => window.clearTimeout(timer));
    executionTimers.current = [];

    if (state.stage !== 'settling') {
      setActiveStep(state.stage === 'settled' ? settlementSteps.length : -1);
      return undefined;
    }

    setActiveStep(0);
    const stepDuration = reduceMotion ? 0 : 320;

    if (!reduceMotion) {
      settlementSteps.slice(1).forEach((_, index) => {
        const timer = window.setTimeout(() => setActiveStep(index + 1), (index + 1) * stepDuration);
        executionTimers.current.push(timer);
      });
    }

    const completionTimer = window.setTimeout(
      completeSettlement,
      reduceMotion ? 180 : settlementSteps.length * stepDuration + 160,
    );
    executionTimers.current.push(completionTimer);

    return () => {
      executionTimers.current.forEach((timer) => window.clearTimeout(timer));
      executionTimers.current = [];
    };
  }, [state.stage, reduceMotion, completeSettlement]);

  const pendingCount = state.stage === 'submitted' ? 1 : 0;

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.pageHeader} id="workspace-overview">
        <div>
          <Title heading={1}>企业工作台</Title>
          <Paragraph>{state.enterprise.name} · 企业演示身份</Paragraph>
          <Text className={styles.contextNote}>1 项进行中的任务 · {pendingCount ? '1 项成果待验收' : '当前无待验收成果'}</Text>
        </div>
        <div className={styles.headerActions}>
          <SemanticStatusTag tone="success" size="large" prefixIcon={<IconShieldStroked />}>企业认证已通过</SemanticStatusTag>
          <Button theme="borderless" onClick={() => navigate('/auth')}>切换演示身份</Button>
        </div>
      </header>

      <div className={styles.topGrid}>
        <CurrentTaskCard tone="enterprise" />
        <TaskProgressTimeline />
      </div>

      <section className={styles.metrics} aria-label="企业履约概览">
        <article><span>进行中任务</span><strong>1</strong><small>同一演示任务</small></article>
        <article className={pendingCount ? styles.metricValue : undefined}><span>待验收成果</span><strong>{pendingCount}</strong><small>{pendingCount ? '请及时处理' : '当前无待办'}</small></article>
        <article className={state.escrow.status === 'held' ? styles.metricValue : styles.metricSuccess}><span>托管金额</span><strong>{formatCurrency(state.task.amount)}</strong><small>{state.escrow.status === 'held' ? '资金保障中' : '已完成结算'}</small></article>
        <article><span>本月履约率</span><strong>{state.enterprise.monthlyFulfillmentRate}%</strong><small>概念演示数据</small></article>
      </section>

      <EscrowFlowChart perspective="enterprise" />

      <div className={styles.detailColumn}>
          <section className={styles.acceptancePanel} id="acceptance-section" aria-labelledby="acceptance-title" aria-live="polite">
            <div className={styles.sectionHeading}>
              <div>
                <Text className={styles.sectionLabel}>成果验收</Text>
                <Title heading={3} id="acceptance-title">
                  {state.stage === 'working' ? '等待学生提交成果' : state.stage === 'submitted' ? '待验收成果 #01' : '成果验收记录'}
                </Title>
              </div>
              <SemanticStatusTag tone={acceptanceTone(state)}>
                {state.stage === 'working' ? '尚未收到' : state.stage === 'submitted' ? '待处理' : '已验收'}
              </SemanticStatusTag>
            </div>

            {state.stage === 'working' ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}><IconClockStroked size="extra-large" /></span>
                <div>
                  <strong>尚未收到学生成果</strong>
                  <p>请先切换到学生端提交示例成果，演示状态会自动同步。</p>
                </div>
                <Button
                  theme="light"
                  type="primary"
                  icon={<IconArrowRight />}
                  iconPosition="right"
                  onClick={() => navigate('/student')}
                >
                  切换到学生端
                </Button>
              </div>
            ) : (
              <>
                <div className={styles.studentSummary}>
                  <div className={styles.studentIdentity}>
                    <span>林</span>
                    <div><strong>{state.student.name}</strong><small>实践信用 · {state.student.creditLevel}</small></div>
                  </div>
                  <dl>
                    <div><dt>出勤状态</dt><dd>已完成</dd></div>
                    <div><dt>打卡记录</dt><dd>5 / 5</dd></div>
                    <div><dt>工作记录</dt><dd>6 条</dd></div>
                    <div><dt>提交时间</dt><dd>{formatScenarioTime(state.deliverable.submittedAt)}</dd></div>
                  </dl>
                </div>

                <div className={styles.deliverableSummary}>
                  <div>
                    <IconFile />
                    <div><strong>{deliverableFiles.join(' · ')}</strong><span>{deliverableDescription}</span></div>
                  </div>
                  <code>{state.deliverable.evidenceId}</code>
                </div>

                {state.stage === 'submitted' && (
                  <div className={styles.acceptanceAction}>
                    <div>
                      <strong>验收通过后将立即启动模拟结算</strong>
                      <span>本次演示不提供驳回或纠纷分支。</span>
                    </div>
                    <Button
                      size="large"
                      theme="solid"
                      type="primary"
                      icon={<IconArrowRight />}
                      iconPosition="right"
                      onClick={startSettlement}
                    >
                      验收通过并触发结算
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>

          <AnimatePresence mode="wait">
            {state.stage === 'settling' && (
              <motion.section
                className={styles.executionPanel}
                key="execution"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-labelledby="execution-title"
                aria-live="polite"
              >
                <div className={styles.executionHeading}>
                  <span className={styles.executionIcon}><IconChainStroked size="extra-large" /></span>
                  <div>
                    <Text className={styles.sectionLabel}>SMART CONTRACT SIMULATION</Text>
                    <Title heading={3} id="execution-title">智能合约正在执行</Title>
                  </div>
                  <strong>{Math.min(activeStep + 1, settlementSteps.length)} / {settlementSteps.length}</strong>
                </div>
                <div className={styles.executionProgress}>
                  <motion.span animate={{ scaleX: (activeStep + 1) / settlementSteps.length }} />
                </div>
                <ol className={styles.executionSteps}>
                  {settlementSteps.map((step, index) => {
                    const complete = index < activeStep;
                    const active = index === activeStep;
                    return (
                      <motion.li
                        className={complete ? styles.stepComplete : active ? styles.stepActive : ''}
                        key={step}
                        animate={{ opacity: complete || active ? 1 : 0.45 }}
                      >
                        <span>{complete ? <IconTick /> : String(index + 1).padStart(2, '0')}</span>
                        <strong>{step}</strong>
                        <small>{complete ? '校验通过' : active ? '执行中' : '等待执行'}</small>
                      </motion.li>
                    );
                  })}
                </ol>
                <Text className={styles.executionNotice}>模拟链上环境 · 未连接真实支付或区块链节点</Text>
              </motion.section>
            )}

            {state.stage === 'settled' && (
              <motion.section
                className={styles.receiptCard}
                key="receipt"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                aria-labelledby="receipt-title"
              >
                <div className={styles.receiptHeading}>
                  <span><IconCheckCircleStroked size="extra-large" /></span>
                  <div className={styles.receiptTitle}>
                    <Text className={styles.sectionLabel}>SETTLEMENT RECEIPT</Text>
                    <Title heading={3} id="receipt-title">智能合约执行成功</Title>
                  </div>
                  <SemanticStatusTag tone="success">4 / 4 节点确认</SemanticStatusTag>
                </div>
                <dl>
                  <div><dt>结算金额</dt><dd>{formatCurrency(state.task.amount)}</dd></div>
                  <div><dt>收款方</dt><dd>{state.student.name}</dd></div>
                  <div><dt>托管凭证</dt><dd>{state.task.escrowReceiptId}</dd></div>
                  <div><dt>交易编号</dt><dd>{state.settlement.transactionId}</dd></div>
                  <div><dt>执行时间</dt><dd>{formatScenarioTime(state.settlement.settledAt)}</dd></div>
                  <div><dt>联盟节点确认</dt><dd>{settlementReceipt.allianceConfirmations}</dd></div>
                </dl>
                <code>{state.settlement.transactionHash}</code>
                <div className={styles.receiptFooter}>
                  <Text>模拟链上环境 · 概念演示数据</Text>
                  <Button
                    theme="solid"
                    type="primary"
                    icon={<IconArrowRight />}
                    iconPosition="right"
                    onClick={() => navigate('/student')}
                  >
                    切换到学生端查看到账与证书
                  </Button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
      </div>
    </motion.main>
  );
}
