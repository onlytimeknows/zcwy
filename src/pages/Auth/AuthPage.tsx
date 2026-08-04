import { useEffect, useRef, useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import ButtonGroup from '@douyinfe/semi-ui/lib/es/button/buttonGroup';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowLeft from '@douyinfe/semi-icons/lib/es/icons/IconArrowLeft';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconIdCard from '@douyinfe/semi-icons/lib/es/icons/IconIdCard';
import IconLock from '@douyinfe/semi-icons/lib/es/icons/IconLock';
import IconShield from '@douyinfe/semi-icons/lib/es/icons/IconShield';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

const { Title, Paragraph, Text } = Typography;

type AuthMode = 'login' | 'register';
type DemoRole = 'student' | 'enterprise';

const roleOptions = {
  student: {
    label: '学生身份',
    description: '发现可信岗位，管理协议、工作记录与薪资进度',
    account: 'student.demo@zcwy.local',
    target: '/student',
    icon: <IconUser size="extra-large" />,
  },
  enterprise: {
    label: '企业身份',
    description: '发布岗位，处理录用、成果验收与模拟结算',
    account: 'enterprise.demo@zcwy.local',
    target: '/enterprise',
    icon: <IconApartment size="extra-large" />,
  },
} satisfies Record<DemoRole, {
  label: string;
  description: string;
  account: string;
  target: string;
  icon: React.ReactNode;
}>;

const trustPoints = [
  '演示账号已经预置完整 Mock 数据',
  '身份切换不会产生真实注册记录',
  '所有链上、支付与认证状态均为模拟',
];

export function AuthPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<number | null>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<DemoRole>('student');
  const [isEntering, setIsEntering] = useState(false);
  const selectedRole = roleOptions[role];

  useEffect(() => () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  const enterPlatform = () => {
    setIsEntering(true);
    timerRef.current = window.setTimeout(() => {
      navigate(selectedRole.target);
    }, reduceMotion ? 0 : 650);
  };

  return (
    <main className={styles.page}>
      <motion.section
        className={styles.introduction}
        initial={reduceMotion ? false : { opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <Tag className={styles.eyebrow} color="blue" size="large">
          概念演示入口
        </Tag>
        <div className={styles.introCopy}>
          <Title heading={1}>选择你的身份，进入可信兼职流程</Title>
          <Paragraph>
            从岗位发现到履约结算，以学生或企业视角体验“事前认证、事中存证、事后保障”。
          </Paragraph>
        </div>

        <div className={styles.trustList}>
          {trustPoints.map((point) => (
            <div key={point}>
              <IconTickCircle />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className={styles.environmentNote}>
          <span className={styles.environmentIcon}><IconShield /></span>
          <div>
            <strong>模拟链上环境</strong>
            <span>无需真实账号，不连接支付与外部认证系统</span>
          </div>
        </div>
      </motion.section>

      <motion.section
        className={styles.authCard}
        aria-labelledby="auth-title"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, delay: 0.06, ease: 'easeOut' }}
      >
        <div className={styles.cardTopline}>
          <Button
            theme="borderless"
            icon={<IconArrowLeft />}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
          <Tag color="green">无需真实登录</Tag>
        </div>

        <div className={styles.cardHeading}>
          <span className={styles.lockIcon}><IconLock size="large" /></span>
          <div>
            <Text type="tertiary">欢迎进入职此无忧</Text>
            <Title id="auth-title" heading={2}>
              {mode === 'login' ? '登录演示账号' : '创建演示身份'}
            </Title>
          </div>
        </div>

        <ButtonGroup className={styles.modeSwitch} aria-label="登录或注册体验">
          <Button
            className={mode === 'login' ? styles.modeActive : undefined}
            theme={mode === 'login' ? 'light' : 'borderless'}
            type={mode === 'login' ? 'primary' : 'tertiary'}
            onClick={() => setMode('login')}
          >
            登录体验
          </Button>
          <Button
            className={mode === 'register' ? styles.modeActive : undefined}
            theme={mode === 'register' ? 'light' : 'borderless'}
            type={mode === 'register' ? 'primary' : 'tertiary'}
            onClick={() => setMode('register')}
          >
            注册体验
          </Button>
        </ButtonGroup>

        <fieldset className={styles.roleFieldset}>
          <legend>选择体验身份</legend>
          <div className={styles.roleGrid}>
            {(Object.keys(roleOptions) as DemoRole[]).map((roleId) => {
              const option = roleOptions[roleId];
              const isSelected = role === roleId;

              return (
                <button
                  className={`${styles.roleCard} ${isSelected ? styles.roleSelected : ''}`}
                  type="button"
                  key={roleId}
                  aria-pressed={isSelected}
                  onClick={() => setRole(roleId)}
                >
                  <span className={styles.roleIcon}>{option.icon}</span>
                  <span className={styles.roleCopy}>
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </span>
                  <span className={styles.selectionDot} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </fieldset>

        <motion.div
          className={styles.accountPreview}
          key={`${mode}-${role}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <span className={styles.accountIcon}><IconIdCard /></span>
          <div>
            <Text type="tertiary" size="small">
              {mode === 'login' ? '已为你填入演示账号' : '将为你创建本地演示身份'}
            </Text>
            <strong>{mode === 'login' ? selectedRole.account : `新的${selectedRole.label} · 仅本次演示`}</strong>
          </div>
        </motion.div>

        <Button
          className={styles.enterButton}
          size="large"
          theme="solid"
          type="primary"
          icon={<IconArrowRight />}
          iconPosition="right"
          loading={isEntering}
          disabled={isEntering}
          onClick={enterPlatform}
        >
          {isEntering
            ? '正在载入演示身份'
            : mode === 'login'
              ? '一键登录并体验'
              : '创建并进入平台'}
        </Button>

        <Text className={styles.disclaimer} type="tertiary" size="small">
          此页面仅模拟登录与注册体验，不会保存个人信息或创建真实平台账号。
        </Text>
      </motion.section>
    </main>
  );
}
