import { useEffect, useRef } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconPlayCircle from '@douyinfe/semi-icons/lib/es/icons/IconPlayCircle';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import trustNetworkImage from '../../assets/trust-network-hemisphere.png';
import { ProtectionLogicSection } from '../../components/ProtectionLogic/ProtectionLogicSection';
import { SemanticStatusTag, type SemanticTone } from '../../components/SemanticStatus/SemanticStatusTag';
import { scenarioStageTone } from '../../components/SemanticStatus/statusToneMap';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { homeModules } from '../../mock/platformCapabilities';
import type { ModuleIcon } from '../../types/platform';
import styles from './HomePage.module.css';

const { Title, Paragraph, Text } = Typography;

const moduleIcons: Record<ModuleIcon, React.ReactNode> = {
  play: <IconPlayCircle size="extra-large" />,
  student: <IconUser size="extra-large" />,
  enterprise: <IconApartment size="extra-large" />,
  help: <IconHelpCircle size="extra-large" />,
};

const statusToneClass: Record<SemanticTone, string> = {
  neutral: styles.statusNeutral,
  brand: styles.statusBrand,
  success: styles.statusSuccess,
  value: styles.statusValue,
  record: styles.statusRecord,
  attention: styles.statusAttention,
};

export function HomePage() {
  const storyRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { state, view } = useDemoScenario();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: journeyScrollProgress } = useScroll({
    target: journeyRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const hemisphereY = useTransform(
    storyScrollProgress,
    [0, 0.42, 0.78, 1],
    [0, 300, 620, 620],
  );
  const hemisphereOpacity = useTransform(
    storyScrollProgress,
    [0, 0.22, 0.64, 0.82, 1],
    [0.16, 0.28, 0.82, 1, 1],
  );
  const storyGrayOpacity = useTransform(journeyScrollProgress, [0, 0.4, 0.6], [0, 0, 1]);
  const revealInitial = reduceMotion ? false : { opacity: 0, y: 28 };
  const journeyStatuses = [
    { label: '企业与岗位', value: '已认证', tone: 'success' as const },
    { label: '薪资保证金', value: state.escrow.status === 'held' ? '已托管' : '已结算', tone: state.escrow.status === 'held' ? 'value' as const : 'success' as const },
    { label: '工作成果', value: view.home.workResultStatus, tone: state.stage === 'working' ? 'neutral' as const : state.stage === 'submitted' ? 'value' as const : 'success' as const },
    { label: '智能合约', value: view.home.contractStatus, tone: state.stage === 'settling' ? 'brand' as const : state.stage === 'settled' ? 'success' as const : 'neutral' as const },
  ];

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const scrollToJourney = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: smoothProgress }} />

      <div className={styles.storyFlow} ref={storyRef}>
        <motion.div
          className={styles.storyGrayLayer}
          style={{ opacity: storyGrayOpacity }}
          aria-hidden="true"
        />
        <motion.img
          className={styles.storyHemisphere}
          src={trustNetworkImage}
          alt=""
          aria-hidden="true"
          style={reduceMotion ? { opacity: 0.86, y: 620 } : { opacity: hemisphereOpacity, y: hemisphereY }}
        />
        <div className={styles.hemisphereFade} aria-hidden="true" />

        <section className={styles.hero}>
          <motion.div
            className={styles.heroCopy}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
          <Title heading={1} className={styles.title}>
            让每一份兼职，
            <span>都有可信的权益凭证</span>
          </Title>
          <Paragraph className={styles.subtitle}>
            从企业认证、薪资托管到履约结算，把容易说不清的兼职过程，变成一条双方都能看见的可信轨迹。
          </Paragraph>

          <div className={styles.heroActions}>
            <Button
              size="large"
              theme="solid"
              type="primary"
              icon={<IconArrowRight />}
              iconPosition="right"
              onClick={() => navigate('/auth')}
            >
              进入平台
            </Button>
            <Button size="large" theme="light" onClick={scrollToJourney}>
              了解保障流程
            </Button>
          </div>

          <div className={styles.trustNotes} aria-label="演示说明">
            <span><IconTickCircle />全流程本地 Mock</span>
            <span><IconTickCircle />模拟链上环境</span>
            <span><IconTickCircle />无真实支付接口</span>
          </div>
          </motion.div>

          <motion.div
            className={styles.statusPanel}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
          >
          <div className={styles.panelHeader}>
            <div>
              <Text type="tertiary" size="small">当前演示任务</Text>
              <Title heading={4}>{state.task.title}</Title>
            </div>
            <SemanticStatusTag className={styles.taskStatusTag} tone={scenarioStageTone[state.stage]}>
              {view.home.taskStatus}
            </SemanticStatusTag>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressMeta}>
              <span>流程进度</span>
              <strong>{view.progress} / 10</strong>
            </div>
            <div className={styles.progressTrack} aria-label={`流程进度 ${view.progress} / 10`}>
              <motion.span
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: view.progress / 10 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.15 }}
              />
            </div>
          </div>

          <div className={styles.statusList}>
            {journeyStatuses.map((status, index) => (
              <div
                className={`${styles.statusItem} ${statusToneClass[status.tone]} ${status.label === '工作成果' ? styles.statusQuiet : ''}`}
                key={status.label}
              >
                <span className={styles.statusDot} />
                <div>
                  <span>{status.label}</span>
                  <strong>{status.value}</strong>
                </div>
                <span className={styles.statusIndex}>0{index + 1}</span>
              </div>
            ))}
          </div>

          <div className={styles.chainReceipt}>
            <div>
              <span>最近一次存证</span>
              <strong>{state.latestEvidence.id}</strong>
            </div>
            <div className={styles.hashBlock}>
              <span>交易哈希</span>
              <code title={state.latestEvidence.hash}>{state.latestEvidence.hash}</code>
            </div>
          </div>
          <div className={styles.panelFooter}>
            <Text className={styles.demoNotice} type="tertiary" size="small">
              概念演示数据 · 未连接真实区块链
            </Text>
            <Button
              className={styles.taskAction}
              theme="light"
              type="primary"
              icon={<IconArrowRight />}
              iconPosition="right"
              onClick={() => navigate(view.home.nextRoute)}
            >
              继续当前任务
            </Button>
          </div>
          </motion.div>
        </section>

        <div className={styles.journeyTransition} ref={journeyRef}>
          <ProtectionLogicSection />
        </div>
      </div>

      <motion.section
        id="modules"
        className={styles.moduleSection}
        initial={revealInitial}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.moduleHeading}>
          <div>
            <Text className={styles.sectionLabel}>选择一个入口</Text>
            <Title heading={2}>从你最关心的视角开始</Title>
          </div>
          <Paragraph>学生端与企业端已接入同一份演示状态，其他模块将在后续阶段继续完善。</Paragraph>
        </div>

        <div className={styles.moduleGrid}>
          {homeModules.map((module, index) => (
            <motion.div
              key={module.id}
              className={`${styles.moduleCell} ${styles[`module${module.tone}`]}`}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <Link className={styles.moduleLink} to={module.path}>
                <div className={styles.moduleTopline}>
                  <span className={styles.moduleIcon}>{moduleIcons[module.icon]}</span>
                  <span className={styles.moduleLabel}>{module.label}</span>
                </div>
                <div className={styles.moduleCopy}>
                  <Title heading={3}>{module.title}</Title>
                  <Paragraph>{module.description}</Paragraph>
                </div>
                <span className={styles.moduleAction}>
                  {module.action}<IconArrowRight />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
