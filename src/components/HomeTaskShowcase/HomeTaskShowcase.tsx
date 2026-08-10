import { useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconChevronLeft from '@douyinfe/semi-icons/lib/es/icons/IconChevronLeft';
import IconChevronRight from '@douyinfe/semi-icons/lib/es/icons/IconChevronRight';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SemanticStatusTag, type SemanticTone } from '../SemanticStatus/SemanticStatusTag';
import { scenarioStageTone } from '../SemanticStatus/statusToneMap';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import type { DemoScenarioStage } from '../../demo/demoScenarioTypes';
import styles from './HomeTaskShowcase.module.css';

const { Title, Text } = Typography;

interface SceneStatus {
  label: string;
  value: string;
  tone: SemanticTone;
  quiet?: boolean;
}

interface ShowcaseScene {
  id: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  tag: string;
  tagTone: SemanticTone;
  progressLabel: string;
  progress: number;
  progressTotal: number;
  statuses: SceneStatus[];
  receiptLabel: string;
  receiptId: string;
  hashLabel: string;
  hashValue: string;
  notice: string;
  actionLabel: string;
  actionRoute: string;
}

const toneClass: Record<SemanticTone, string> = {
  neutral: styles.toneNeutral,
  brand: styles.toneBrand,
  success: styles.toneSuccess,
  value: styles.toneValue,
  record: styles.toneRecord,
  attention: styles.toneAttention,
};

const protectionProgress: Record<DemoScenarioStage, number> = {
  working: 2,
  submitted: 2,
  settling: 3,
  settled: 4,
};

export function HomeTaskShowcase() {
  const [activeScene, setActiveScene] = useState(0);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state, view } = useDemoScenario();

  const settlementStatus: SceneStatus = state.stage === 'settled'
    ? { label: '薪资结算', value: '已到账', tone: 'success' }
    : state.stage === 'settling'
      ? { label: '薪资结算', value: '执行中', tone: 'brand' }
      : { label: '薪资结算', value: '待验收触发', tone: 'neutral', quiet: true };

  const certificateStatus: SceneStatus = state.certificate.status === 'generated'
    ? { label: '实践证书', value: '已生成', tone: 'success' }
    : { label: '实践证书', value: '待生成', tone: 'neutral', quiet: true };

  const scenes: ShowcaseScene[] = [
    {
      id: 'fulfillment',
      shortLabel: '履约留痕',
      eyebrow: '功能场景 01 · 全过程可信履约',
      title: state.task.title,
      tag: view.home.taskStatus,
      tagTone: scenarioStageTone[state.stage],
      progressLabel: '流程进度',
      progress: view.progress,
      progressTotal: 10,
      statuses: [
        { label: '企业与岗位', value: '已认证', tone: 'success' },
        {
          label: '薪资保证金',
          value: state.escrow.status === 'held' ? '已托管' : '已结算',
          tone: state.escrow.status === 'held' ? 'value' : 'success',
        },
        {
          label: '工作成果',
          value: view.home.workResultStatus,
          tone: state.stage === 'working' ? 'neutral' : state.stage === 'submitted' ? 'value' : 'success',
          quiet: state.stage === 'working',
        },
        {
          label: '智能合约',
          value: view.home.contractStatus,
          tone: state.stage === 'settling' ? 'brand' : state.stage === 'settled' ? 'success' : 'neutral',
          quiet: state.stage === 'working' || state.stage === 'submitted',
        },
      ],
      receiptLabel: '最近一次存证',
      receiptId: state.latestEvidence.id,
      hashLabel: '交易哈希',
      hashValue: state.latestEvidence.hash,
      notice: '概念演示数据 · 未连接真实区块链',
      actionLabel: '继续当前任务',
      actionRoute: view.home.nextRoute,
    },
    {
      id: 'verification',
      shortLabel: '可信准入',
      eyebrow: '功能场景 02 · 企业与岗位可信准入',
      title: '校园短视频运营助理',
      tag: '初筛通过',
      tagTone: 'success',
      progressLabel: '可信准入校验',
      progress: 3,
      progressTotal: 3,
      statuses: [
        { label: '企业资质', value: '已核验', tone: 'success' },
        { label: '岗位风险', value: '已扫描', tone: 'success' },
        { label: '招聘信息', value: '已存证', tone: 'record' },
        { label: '简历结果', value: '初筛通过', tone: 'success' },
      ],
      receiptLabel: '可信准入凭证',
      receiptId: '岗位认证 #01',
      hashLabel: '联盟节点',
      hashValue: '4 / 4 已确认',
      notice: '企业与岗位信息均为虚构 Mock 数据',
      actionLabel: '查看投递进展',
      actionRoute: '/student/applications/APP-2026-0810',
    },
    {
      id: 'settlement',
      shortLabel: '薪资保障',
      eyebrow: '功能场景 03 · 薪资托管与自动结算',
      title: state.task.title,
      tag: state.stage === 'settled' ? '已到账' : '薪资已托管',
      tagTone: state.stage === 'settled' ? 'success' : 'value',
      progressLabel: '权益保障进度',
      progress: protectionProgress[state.stage],
      progressTotal: 4,
      statuses: [
        { label: '薪资保证金', value: '¥1,260 已托管', tone: 'value' },
        {
          label: '智能合约',
          value: state.contract.status === 'success' ? '执行成功' : state.contract.status === 'executing' ? '执行中' : '待验收触发',
          tone: state.contract.status === 'success' ? 'success' : state.contract.status === 'executing' ? 'brand' : 'neutral',
          quiet: state.contract.status === 'pending',
        },
        settlementStatus,
        certificateStatus,
      ],
      receiptLabel: state.stage === 'settled' ? '模拟结算凭证' : '薪资托管凭证',
      receiptId: state.stage === 'settled' ? 'TX-2026-0801' : state.task.escrowReceiptId,
      hashLabel: state.stage === 'settled' ? '节点确认' : '托管金额',
      hashValue: state.stage === 'settled' ? '4 / 4 已确认' : '¥1,260',
      notice: '模拟链上环境 · 不连接真实支付系统',
      actionLabel: state.stage === 'settled' ? '查看到账与证书' : '查看结算保障',
      actionRoute: state.stage === 'settled' ? `/student/tasks/${state.task.id}` : '/enterprise/settlement',
    },
  ];

  const selectPrevious = () => setActiveScene((current) => (current + scenes.length - 1) % scenes.length);
  const selectNext = () => setActiveScene((current) => (current + 1) % scenes.length);

  return (
    <motion.div
      className={styles.showcase}
      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08, ease: 'easeOut' }}
    >
      <div className={styles.stackStage} aria-live="polite">
        {scenes.map((scene, index) => {
          const position = (index - activeScene + scenes.length) % scenes.length;
          const isActive = position === 0;

          return (
            <motion.article
              key={scene.id}
              className={styles.sceneCard}
              data-position={position}
              aria-current={isActive ? 'true' : undefined}
              animate={{
                x: `${position * -5}%`,
                y: position * 14,
                rotate: position * -1.8,
                scale: 1 - position * 0.02,
                opacity: 1 - position * 0.08,
              }}
              transition={reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 340, damping: 32, mass: 0.8 }}
              style={{ zIndex: scenes.length - position }}
            >
              <div className={styles.cardContent} aria-hidden={!isActive}>
              <div className={styles.panelHeader}>
                <div>
                  <Text type="tertiary" size="small">{scene.eyebrow}</Text>
                  <Title heading={4}>{scene.title}</Title>
                </div>
                <SemanticStatusTag className={styles.taskStatusTag} tone={scene.tagTone}>
                  {scene.tag}
                </SemanticStatusTag>
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressMeta}>
                  <span>{scene.progressLabel}</span>
                  <strong>{scene.progress} / {scene.progressTotal}</strong>
                </div>
                <div
                  className={styles.progressTrack}
                  aria-label={`${scene.progressLabel} ${scene.progress} / ${scene.progressTotal}`}
                >
                  <motion.span
                    animate={{ scaleX: scene.progress / scene.progressTotal }}
                    transition={{ duration: reduceMotion ? 0 : 0.4 }}
                  />
                </div>
              </div>

              <div className={styles.statusList}>
                {scene.statuses.map((status, statusIndex) => (
                  <div
                    className={`${styles.statusItem} ${toneClass[status.tone]} ${status.quiet ? styles.statusQuiet : ''}`}
                    key={status.label}
                  >
                    <span className={styles.statusDot} />
                    <div>
                      <span>{status.label}</span>
                      <strong>{status.value}</strong>
                    </div>
                    <span className={styles.statusIndex}>0{statusIndex + 1}</span>
                  </div>
                ))}
              </div>

              <div className={styles.chainReceipt}>
                <div>
                  <span>{scene.receiptLabel}</span>
                  <strong>{scene.receiptId}</strong>
                </div>
                <div className={styles.hashBlock}>
                  <span>{scene.hashLabel}</span>
                  <code title={scene.hashValue}>{scene.hashValue}</code>
                </div>
              </div>

              <div className={styles.panelFooter}>
                <Text className={styles.demoNotice} type="tertiary" size="small">
                  {scene.notice}
                </Text>
                <Button
                  className={styles.taskAction}
                  theme="light"
                  type="primary"
                  icon={<IconArrowRight />}
                  iconPosition="right"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => navigate(scene.actionRoute)}
                >
                  {scene.actionLabel}
                </Button>
              </div>
              </div>
              {!isActive && (
                <button
                  className={styles.cardSwitchTarget}
                  type="button"
                  aria-label={`切换到${scene.eyebrow}`}
                  onClick={() => setActiveScene(index)}
                />
              )}
            </motion.article>
          );
        })}
      </div>

      <div className={styles.switcher} aria-label="切换功能场景">
        <Button
          className={styles.switchButton}
          theme="borderless"
          icon={<IconChevronLeft />}
          aria-label="上一个功能场景"
          onClick={selectPrevious}
        />
        <div className={styles.sceneTabs} role="tablist" aria-label="功能场景">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={`${styles.sceneTab} ${index === activeScene ? styles.sceneTabActive : ''}`}
              type="button"
              role="tab"
              aria-selected={index === activeScene}
              onClick={() => setActiveScene(index)}
            >
              <span>0{index + 1}</span>
              {scene.shortLabel}
            </button>
          ))}
        </div>
        <Button
          className={styles.switchButton}
          theme="borderless"
          icon={<IconChevronRight />}
          aria-label="下一个功能场景"
          onClick={selectNext}
        />
      </div>
    </motion.div>
  );
}
