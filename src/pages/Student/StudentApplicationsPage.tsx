import Button from '@douyinfe/semi-ui/lib/es/button';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconBriefcaseStroked from '@douyinfe/semi-icons/lib/es/icons/IconBriefcaseStroked';
import IconCommentStroked from '@douyinfe/semi-icons/lib/es/icons/IconCommentStroked';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag } from '../../components/SemanticStatus/SemanticStatusTag';
import styles from './StudentApplicationsPage.module.css';

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
    <motion.main className={styles.page} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className={styles.header}>
        <div><span>求职进展</span><h1>我的投递</h1><p>集中查看企业反馈与下一步安排。</p></div>
        <Button theme="light" type="primary" onClick={() => navigate('/student/opportunities')}>继续找工作</Button>
      </header>

      <div className={styles.layout}>
        <aside className={styles.list} aria-label="投递记录">
          <button className={styles.activeItem} type="button">
            <span className={styles.itemIcon}><IconBriefcaseStroked /></span>
            <span><strong>校园短视频运营助理</strong><small>青禾数字传媒有限公司</small></span>
            <SemanticStatusTag tone="success" size="small">初筛通过</SemanticStatusTag>
          </button>
          <button type="button">
            <span className={styles.itemIcon}><IconBriefcaseStroked /></span>
            <span><strong>校园品牌活动协助</strong><small>青创校园文化有限公司</small></span>
            <SemanticStatusTag tone="brand" size="small">已录用</SemanticStatusTag>
          </button>
        </aside>

        <section className={styles.detail} aria-labelledby="application-detail-title">
          <div className={styles.detailHeading}>
            <div><span>投递编号 · APP-2026-0812</span><h2 id="application-detail-title">校园短视频运营助理</h2><p>青禾数字传媒有限公司 · 远程协作 · 120–150 元/天</p></div>
            <SemanticStatusTag tone="success">简历初筛已通过</SemanticStatusTag>
          </div>

          <div className={styles.timeline}>
            {steps.map((step) => (
              <div className={step.complete ? styles.complete : undefined} key={step.label}>
                <span>{step.complete ? <IconTickCircle /> : '4'}</span>
                <strong>{step.label}</strong>
                <small>{step.detail}</small>
              </div>
            ))}
          </div>

          <div className={styles.result}>
            <div><span>最新结果</span><strong>企业已通过简历初筛</strong><p>岗位负责人将在 1 个工作日内与你沟通可参与时间。建议提前准备课程安排与相关作品链接。</p></div>
            <div className={styles.resultActions}>
              <Button theme="light" icon={<IconCommentStroked />} onClick={() => navigate('/student/messages')}>联系企业</Button>
              <Button theme="solid" type="primary" icon={<IconArrowRight />} iconPosition="right" onClick={() => navigate('/student/resume')}>优化投递资料</Button>
            </div>
          </div>

          <dl className={styles.meta}>
            <div><dt>投递时间</dt><dd>2026年8月8日 14:20</dd></div>
            <div><dt>使用简历</dt><dd>学生实践简历 · 2026 夏季版</dd></div>
            <div><dt>权益状态</dt><dd>岗位与企业信息已核验</dd></div>
          </dl>
        </section>
      </div>
    </motion.main>
  );
}
