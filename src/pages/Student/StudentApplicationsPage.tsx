import Button from '@douyinfe/semi-ui/lib/es/button';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconChevronDown from '@douyinfe/semi-icons/lib/es/icons/IconChevronDown';
import IconChevronUp from '@douyinfe/semi-icons/lib/es/icons/IconChevronUp';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import styles from './StudentApplicationsPage.module.css';

const applicationId = 'APP-2026-0812';
const steps = [
  { label: '已投递', detail: '08月08日 14:20', complete: true },
  { label: '企业查看', detail: '08月09日 09:46', complete: true },
  { label: '初筛通过', detail: '今天 10:24', complete: true },
  { label: '沟通邀约', detail: '预计 1 个工作日内', complete: false },
];

export function StudentApplicationsPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  return (
    <motion.main className={styles.overviewPage} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header><div><h1>我的投递</h1><p>2 项 · 1 个新进展</p></div><Button theme="light" type="primary" onClick={() => navigate('/student/opportunities')}>继续找工作</Button></header>
      <section className={styles.applicationList} aria-label="投递记录">
        <button type="button" onClick={() => navigate(`/student/applications/${applicationId}`)}>
          <span className={styles.itemIcon}><IconBriefcaseStroked /></span>
          <span><strong>校园短视频运营助理</strong><small>青禾数字传媒有限公司 · 今天 10:24 更新</small></span>
          <span className={styles.listResult}><SemanticStatusTag tone="success" size="small">初筛通过</SemanticStatusTag><small>企业已通过简历初筛</small></span>
          <IconArrowRight />
        </button>
        <button type="button" onClick={() => navigate('/student/tasks/JOB-2026-0801')}>
          <span className={styles.itemIcon}><IconBriefcaseStroked /></span>
          <span><strong>校园品牌活动协助</strong><small>青创校园文化有限公司 · 8月1日投递</small></span>
          <span className={styles.listResult}><SemanticStatusTag tone="brand" size="small">已录用</SemanticStatusTag><small>任务履约中</small></span>
          <IconArrowRight />
        </button>
      </section>
    </motion.main>
  );
}

export function StudentApplicationDetailPage() {
  const navigate = useNavigate();
  const { applicationId: routeId } = useParams();
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (section: string) => setExpanded((current) => current === section ? null : section);

  return (
    <motion.main className={styles.detailPage} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className={styles.detailHeader}>
        <Button theme="borderless" onClick={() => navigate('/student/applications')}>返回投递列表</Button>
        <div><span>投递编号 · {routeId ?? applicationId}</span><h1>校园短视频运营助理</h1><p>青禾数字传媒有限公司 · 远程协作 · 120–150 元/天</p></div>
        <SemanticStatusTag tone="success">初筛通过</SemanticStatusTag>
      </header>

      <div className={styles.detailGrid}>
        <section className={styles.mainResult}>
          <span>最新反馈 · 今天 10:24</span>
          <h2>企业已通过简历初筛</h2>
          <p>岗位负责人预计在 1 个工作日内与你沟通可参与时间。</p>
          <div className={styles.nextAction}><div><span>下一步</span><strong>准备课程安排与相关作品链接</strong></div><div><Button theme="light" icon={<IconCommentStroked />} onClick={() => navigate('/student/messages')}>联系企业</Button><Button theme="solid" type="primary" onClick={() => navigate('/student/resume')}>优化投递资料</Button></div></div>
        </section>

        <aside className={styles.summary}>
          <dl>
            <div><dt>使用简历</dt><dd>学生实践简历 · 2026 夏季版</dd></div>
            <div><dt>权益状态</dt><dd>岗位与企业信息已核验</dd></div>
            <div><dt>投递时间</dt><dd>2026年8月8日 14:20</dd></div>
          </dl>
        </aside>
      </div>

      <section className={styles.disclosures} aria-label="投递详细信息">
        <div>
          <button type="button" aria-expanded={expanded === 'timeline'} onClick={() => toggle('timeline')}><span><strong>完整投递时间线</strong><small>当前：初筛通过</small></span>{expanded === 'timeline' ? <IconChevronUp /> : <IconChevronDown />}</button>
          {expanded === 'timeline' && <div className={styles.timeline}>{steps.map((step) => <div className={step.complete ? styles.complete : undefined} key={step.label}><span>{step.complete ? <IconTickCircle /> : '4'}</span><strong>{step.label}</strong><small>{step.detail}</small></div>)}</div>}
        </div>
        <div>
          <button type="button" aria-expanded={expanded === 'verification'} onClick={() => toggle('verification')}><span><strong>企业认证与权益信息</strong><small>企业、岗位与薪资规则已核验</small></span>{expanded === 'verification' ? <IconChevronUp /> : <IconChevronDown />}</button>
          {expanded === 'verification' && <dl className={styles.expandedMeta}><div><dt>企业认证</dt><dd>已通过平台模拟核验</dd></div><div><dt>岗位风险</dt><dd>未发现异常条款</dd></div><div><dt>薪资规则</dt><dd>120–150 元/天，录用后签署协议</dd></div></dl>}
        </div>
        <div>
          <button type="button" aria-expanded={expanded === 'materials'} onClick={() => toggle('materials')}><span><strong>投递材料</strong><small>简历 1 份 · 作品链接待补充</small></span>{expanded === 'materials' ? <IconChevronUp /> : <IconChevronDown />}</button>
          {expanded === 'materials' && <div className={styles.materials}><span>学生实践简历 · 2026 夏季版</span><Button theme="borderless" onClick={() => navigate('/student/resume')}>查看简历</Button></div>}
        </div>
      </section>
    </motion.main>
  );
}
