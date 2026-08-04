import { useEffect, useRef, useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
import ButtonGroup from '@douyinfe/semi-ui/lib/es/button/buttonGroup';
import Input from '@douyinfe/semi-ui/lib/es/input';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowLeft from '@douyinfe/semi-icons/lib/es/icons/IconArrowLeft';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconIdCard from '@douyinfe/semi-icons/lib/es/icons/IconIdCard';
import IconLock from '@douyinfe/semi-icons/lib/es/icons/IconLock';
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
    description: '求职、履约与薪资',
    account: 'student@zcwy.cn',
    target: '/student',
    icon: <IconUser size="extra-large" />,
  },
  enterprise: {
    label: '企业身份',
    description: '招聘、验收与结算',
    account: 'enterprise@zcwy.cn',
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
  '认证企业与岗位信息',
  '薪资托管与履约状态清晰可查',
  '协议、工作与结算过程连续留痕',
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
        <Text className={styles.eyebrow}>大学生兼职权益保护平台</Text>
        <div className={styles.introCopy}>
          <Title heading={1}>安心兼职，从可信开始</Title>
          <Paragraph>
            连接学生与可信企业，让岗位、协议、履约和结算都拥有清晰可查的记录。
          </Paragraph>
        </div>

        <div className={styles.trustList}>
          {trustPoints.map((point, index) => (
            <div key={point}>
              <span className={styles.pointIndex}>0{index + 1}</span>
              <span>{point}</span>
            </div>
          ))}
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
        </div>

        <div className={styles.cardHeading}>
          <span className={styles.lockIcon}><IconLock size="large" /></span>
          <div>
            <Text type="tertiary">欢迎进入职此无忧</Text>
            <Title id="auth-title" heading={2}>
              {mode === 'login' ? '登录平台' : '创建账号'}
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
            登录
          </Button>
          <Button
            className={mode === 'register' ? styles.modeActive : undefined}
            theme={mode === 'register' ? 'light' : 'borderless'}
            type={mode === 'register' ? 'primary' : 'tertiary'}
            onClick={() => setMode('register')}
          >
            注册
          </Button>
        </ButtonGroup>

        <fieldset className={styles.roleFieldset}>
          <legend>选择身份</legend>
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
          className={styles.fields}
          key={`${mode}-${role}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <label className={styles.field}>
            <span>账号</span>
            <Input
              size="large"
              prefix={<IconIdCard />}
              defaultValue={mode === 'login' ? selectedRole.account : ''}
              placeholder="请输入邮箱或手机号"
              aria-label="账号"
            />
          </label>
          <label className={styles.field}>
            <span>密码</span>
            <Input
              size="large"
              mode="password"
              prefix={<IconLock />}
              defaultValue={mode === 'login' ? 'zcwy2026' : ''}
              placeholder={mode === 'login' ? '请输入密码' : '请设置密码'}
              aria-label="密码"
            />
          </label>
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
            ? '正在进入平台'
            : mode === 'login'
              ? '登录并进入平台'
              : '注册并进入平台'}
        </Button>
      </motion.section>

      <Text className={styles.disclaimer} type="tertiary" size="small">
        概念演示页面：登录、注册及账号数据均由前端模拟，不会保存个人信息。
      </Text>
    </main>
  );
}
