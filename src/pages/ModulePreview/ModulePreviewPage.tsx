import Button from '@douyinfe/semi-ui/lib/es/button';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconHome from '@douyinfe/semi-icons/lib/es/icons/IconHome';
import IconPlayCircle from '@douyinfe/semi-icons/lib/es/icons/IconPlayCircle';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './ModulePreviewPage.module.css';

const { Title, Paragraph, Text } = Typography;

type PreviewId = 'demo' | 'student' | 'enterprise' | 'help';

interface PreviewConfig {
  label: string;
  title: string;
  description: string;
  tone: PreviewId;
  icon: React.ReactNode;
  tagColor: 'blue' | 'purple' | 'yellow' | 'green';
  stats: Array<{ label: string; value: string; hint: string }>;
  steps: string[];
}

const previews: Record<PreviewId, PreviewConfig> = {
  demo: {
    label: '完整流程演示',
    title: '一条主线，看懂兼职权益如何被保护',
    description: '演示引导和跨角色状态将在下一阶段接入。当前页面用于确认整体结构与视觉方向。',
    tone: 'demo',
    icon: <IconPlayCircle size="extra-large" />,
    tagColor: 'green',
    stats: [
      { label: '演示步骤', value: '10', hint: '从岗位到证书' },
      { label: '参与视角', value: '2', hint: '学生与企业' },
      { label: '外部接口', value: '0', hint: '全部本地模拟' },
    ],
    steps: ['学生查看可信岗位并投递', '企业录用并预存薪资保证金', '双方履约、验收并生成实践证书'],
  },
  student: {
    label: '学生工作台',
    title: '每一步进展，都清清楚楚',
    description: '学生端将集中管理岗位、申请、协议、工作记录、薪资状态和实践信用。',
    tone: 'student',
    icon: <IconUser size="extra-large" />,
    tagColor: 'blue',
    stats: [
      { label: '已投递', value: '3', hint: '1 个等待确认' },
      { label: '进行中', value: '1', hint: '今日已完成打卡' },
      { label: '待结算', value: '¥1,260', hint: '薪资已托管' },
    ],
    steps: ['发现可信岗位', '查看协议与工作进度', '领取薪资并生成实践证书'],
  },
  enterprise: {
    label: '企业工作台',
    title: '招聘、履约与结算，在一处完成',
    description: '企业端将覆盖岗位发布、学生筛选、保证金托管、成果验收和模拟合约结算。',
    tone: 'enterprise',
    icon: <IconApartment size="extra-large" />,
    tagColor: 'yellow',
    stats: [
      { label: '开放岗位', value: '4', hint: '本周新增 2 个' },
      { label: '待处理申请', value: '12', hint: '3 位高信用学生' },
      { label: '托管金额', value: '¥8,400', hint: '模拟保证金账户' },
    ],
    steps: ['发布认证岗位', '录用学生并确认协议', '验收成果并触发结算'],
  },
  help: {
    label: '权益保障中心',
    title: '发生争议时，证据不会散落各处',
    description: '帮助中心将整合风险提示、纠纷申诉、证据时间线、证据包生成和处理进度。',
    tone: 'help',
    icon: <IconHelpCircle size="extra-large" />,
    tagColor: 'purple',
    stats: [
      { label: '存证节点', value: '8', hint: '关键行为连续记录' },
      { label: '证据完整度', value: '96%', hint: '概念演示评分' },
      { label: '申诉进度', value: '处理中', hint: '预计 1 个工作日' },
    ],
    steps: ['识别风险并查看处理建议', '按时间线核对双方证据', '生成证据包并跟踪申诉'],
  },
};

function ModulePreviewPage({ previewId }: { previewId: PreviewId }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const preview = previews[previewId];

  return (
    <motion.main
      className={`${styles.page} ${styles[preview.tone]}`}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className={styles.topline}>
        <Button theme="borderless" icon={<IconHome />} onClick={() => navigate('/#modules')}>
          返回模块入口
        </Button>
        <Tag color={preview.tagColor}>第一阶段预览</Tag>
      </div>

      <section className={styles.hero}>
        <span className={styles.heroIcon}>{preview.icon}</span>
        <div className={styles.heroCopy}>
          <Text className={styles.label}>{preview.label}</Text>
          <Title heading={1}>{preview.title}</Title>
          <Paragraph>{preview.description}</Paragraph>
        </div>
        <Button
          size="large"
          theme="solid"
          type="primary"
          icon={<IconArrowRight />}
          iconPosition="right"
          onClick={() => navigate('/#modules')}
        >
          查看其他模块
        </Button>
      </section>

      <section className={styles.stats} aria-label={`${preview.label}概览`}>
        {preview.stats.map((stat) => (
          <article className={styles.statCard} key={stat.label}>
            <Text type="tertiary">{stat.label}</Text>
            <strong>{stat.value}</strong>
            <span>{stat.hint}</span>
          </article>
        ))}
      </section>

      <section className={styles.roadmap}>
        <div className={styles.roadmapHeading}>
          <div>
            <Text className={styles.label}>下一阶段交互主线</Text>
            <Title heading={3}>这个模块会怎样被使用</Title>
          </div>
          <Text type="tertiary">所有数据均为本地 Mock</Text>
        </div>
        <div className={styles.stepList}>
          {preview.steps.map((step, index) => (
            <div className={styles.step} key={step}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <strong>{step}</strong>
              <IconTickCircle />
            </div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

export function DemoPreviewPage() {
  return <ModulePreviewPage previewId="demo" />;
}

export function StudentPreviewPage() {
  return <ModulePreviewPage previewId="student" />;
}

export function EnterprisePreviewPage() {
  return <ModulePreviewPage previewId="enterprise" />;
}

export function HelpPreviewPage() {
  return <ModulePreviewPage previewId="help" />;
}
