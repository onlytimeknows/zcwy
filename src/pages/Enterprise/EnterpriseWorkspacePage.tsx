import Button from '@douyinfe/semi-ui/lib/es/button';
import Progress from '@douyinfe/semi-ui/lib/es/progress';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconFile from '@douyinfe/semi-icons/lib/es/icons/IconFile';
import IconShieldStroked from '@douyinfe/semi-icons/lib/es/icons/IconShieldStroked';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { deliverableFiles, formatCurrency, formatScenarioTime } from '../../demo/demoScenarioData';
import styles from './EnterpriseWorkspacePage.module.css';

const stageCopy = {
  working: { label: '等待学生提交', note: '尚未收到本次任务成果', action: '查看任务详情' },
  submitted: { label: '成果待验收', note: '林知夏已提交成果，请完成验收', action: '开始验收' },
  settling: { label: '结算执行中', note: '智能合约正在核验并划转薪资', action: '查看结算' },
  settled: { label: '履约已完成', note: '薪资已结算，实践证书已生成', action: '查看凭证' },
} as const;

export function EnterpriseWorkspacePage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state } = useDemoScenario();
  const stage = stageCopy[state.stage];
  const pendingCount = state.stage === 'submitted' ? 1 : 0;

  return (
    <motion.main
      className={styles.page}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <header className={styles.contextHeader}>
        <div>
          <span className={styles.eyebrow}>企业工作台</span>
          <h1>{state.enterprise.name}</h1>
          <p>{pendingCount ? '你有 1 项成果等待验收。' : '当前 1 项兼职任务正在履约。'}</p>
        </div>
        <SemanticStatusTag tone="success" size="large" prefixIcon={<IconShieldStroked />}>企业认证已通过</SemanticStatusTag>
      </header>

      <div className={styles.workspaceGrid}>
        <section className={styles.primaryPanel} aria-labelledby="enterprise-task-title">
          <div className={styles.panelTopline}>
            <div>
              <span className={styles.eyebrow}>当前任务 · {state.task.id}</span>
              <h2 id="enterprise-task-title">{state.task.title}</h2>
              <p>{state.task.workType} · {state.task.period}</p>
            </div>
            <SemanticStatusTag tone={state.stage === 'submitted' ? 'value' : state.stage === 'settled' ? 'success' : 'brand'}>{stage.label}</SemanticStatusTag>
          </div>

          <div className={styles.focusArea}>
            <div className={styles.studentBlock}>
              <span>林</span>
              <div><strong>{state.student.name}</strong><small>实践信用 · {state.student.creditLevel}</small></div>
            </div>
            <div className={styles.focusCopy}>
              <span>当前需要处理</span>
              <strong>{stage.note}</strong>
              <small>{state.deliverable.status === 'not-submitted' ? '成果提交后会自动同步到企业端' : `${deliverableFiles.length} 类成果 · 提交于 ${formatScenarioTime(state.deliverable.submittedAt)}`}</small>
            </div>
            <Button size="large" theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate('/enterprise/task')}>
              {stage.action}
            </Button>
          </div>

          <div className={styles.progressArea}>
            <div><span>任务履约进度</span><strong>{state.progress} / 10</strong></div>
            <Progress percent={state.progress * 10} showInfo={false} stroke="var(--color-brand-primary)" />
          </div>

          <dl className={styles.taskFacts}>
            <div><dt>托管薪资</dt><dd>{formatCurrency(state.task.amount)}</dd></div>
            <div><dt>打卡记录</dt><dd>5 / 5</dd></div>
            <div><dt>工作记录</dt><dd>6 条</dd></div>
            <div><dt>本月履约率</dt><dd>{state.enterprise.monthlyFulfillmentRate}%</dd></div>
          </dl>
        </section>

        <aside className={styles.sideRail}>
          <section className={styles.queue}>
            <div className={styles.railHeading}>
              <div><span className={styles.eyebrow}>处理队列</span><h2>需要关注</h2></div>
              <span>{pendingCount ? '1 项待办' : '暂无积压'}</span>
            </div>
            <button type="button" onClick={() => navigate('/enterprise/task')}>
              <span className={styles.fileIcon}><IconFile /></span>
              <span><strong>{state.deliverable.status === 'not-submitted' ? '等待成果提交' : '成果提交 #01'}</strong><small>{state.deliverable.status === 'not-submitted' ? '学生尚未提交' : deliverableFiles.join(' · ')}</small></span>
              <IconArrowRight />
            </button>
          </section>

          <section className={styles.assurance}>
            <div className={styles.railHeading}>
              <div><span className={styles.eyebrow}>资金与履约</span><h2>保障概览</h2></div>
              <IconTickCircle />
            </div>
            <dl>
              <div><dt>保证金</dt><dd>{formatCurrency(state.escrow.amount)} {state.escrow.status === 'held' ? '托管中' : '已结算'}</dd></div>
              <div><dt>企业验收</dt><dd>{state.acceptance.status === 'accepted' ? '已通过' : '待完成'}</dd></div>
              <div><dt>智能合约</dt><dd>{state.contract.status === 'success' ? '执行成功' : state.contract.status === 'executing' ? '执行中' : '待触发'}</dd></div>
            </dl>
            <button type="button" onClick={() => navigate('/enterprise/task')}>进入结算管理 <IconArrowRight /></button>
          </section>
        </aside>
      </div>
    </motion.main>
  );
}
