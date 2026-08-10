import { useEffect, useRef, useState } from 'react';
import Button from '@douyinfe/semi-ui/lib/es/button';
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
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo';
import styles from './AuthPage.module.css';

const { Title, Text } = Typography;

type AuthMode = 'login' | 'register';

const roleOptions = {
  student: {
    label: '学生身份',
    account: 'student@zcwy.cn',
    target: '/student',
    icon: <IconUser />,
  },
  enterprise: {
    label: '企业身份',
    account: 'enterprise@zcwy.cn',
    target: '/enterprise',
    icon: <IconApartment />,
  },
} satisfies Record<DemoRole, {
  label: string;
  account: string;
  target: string;
  icon: React.ReactNode;
}>;

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useDemoAuth();
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
      login(role);
      navigate(selectedRole.target);
    }, reduceMotion ? 0 : 450);
  };

  return (
    <main className={styles.page}>
      <header className={styles.authHeader}>
        <button className={styles.logoButton} type="button" onClick={() => navigate('/')}>
          <BrandLogo compact />
        </button>
        <Button
          className={styles.backButton}
          theme="borderless"
          icon={<IconArrowLeft />}
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </header>

      <div className={styles.authBody}>
        <motion.section
          className={styles.brandPanel}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
        >
          <Text className={styles.eyebrow}>大学生兼职权益保护平台</Text>
          <Title heading={1}>安心兼职，从可信开始</Title>
          <p>岗位、履约与薪资状态，都有清晰可查的记录。</p>
        </motion.section>

        <motion.section
          className={styles.authPanel}
          aria-label={mode === 'login' ? '登录平台' : '注册账号'}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.26, delay: 0.04, ease: 'easeOut' }}
        >
          <div className={styles.modeTabs} role="tablist" aria-label="登录或注册">
            <button
              className={mode === 'login' ? styles.modeActive : undefined}
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => setMode('login')}
            >
              登录
            </button>
            <button
              className={mode === 'register' ? styles.modeActive : undefined}
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => setMode('register')}
            >
              注册
            </button>
          </div>

          <fieldset className={styles.roleFieldset}>
            <legend>登录身份</legend>
            <div className={styles.roleSegment}>
              {(Object.keys(roleOptions) as DemoRole[]).map((roleId) => {
                const option = roleOptions[roleId];
                const isSelected = role === roleId;

                return (
                  <button
                    className={`${styles.roleOption} ${isSelected ? styles.roleSelected : ''}`}
                    type="button"
                    key={roleId}
                    aria-pressed={isSelected}
                    onClick={() => setRole(roleId)}
                  >
                    <span aria-hidden="true">{option.icon}</span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <motion.div
            className={styles.fields}
            key={`${mode}-${role}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16 }}
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
            icon={<IconArrowRight />}
            iconPosition="right"
            loading={isEntering}
            disabled={isEntering}
            onClick={enterPlatform}
          >
            {isEntering
              ? '正在进入平台'
              : mode === 'login'
                ? '登录进入平台'
                : '创建账号并进入平台'}
          </Button>

          <Text className={styles.disclaimer} type="tertiary" size="small">
            概念演示 · 账号数据仅前端模拟，不保存个人信息
          </Text>
        </motion.section>
      </div>
    </main>
  );
}
