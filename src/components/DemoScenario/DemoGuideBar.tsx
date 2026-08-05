import Button from '@douyinfe/semi-ui/lib/es/button';
import Modal from '@douyinfe/semi-ui/lib/es/modal';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconRefresh from '@douyinfe/semi-icons/lib/es/icons/IconRefresh';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import styles from './DemoGuideBar.module.css';

const { Text } = Typography;

export function DemoGuideBar() {
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, view, resetScenario } = useDemoScenario();
  const showCrossRoleAction = view.guide.actionRoute && view.guide.actionRoute !== location.pathname;

  const confirmReset = () => {
    resetScenario();
    setResetConfirmVisible(false);
  };

  return (
    <section className={`${styles.guide} ${styles[state.stage]}`} aria-label="演示导览" aria-live="polite">
      <div className={styles.copy}>
        <span className={`${styles.statusDot} ${state.stage === 'settling' ? styles.processing : ''}`} />
        <div>
          <Text className={styles.step}>{view.guide.stepLabel}</Text>
          <strong>{view.guide.hint}</strong>
        </div>
      </div>
      <div className={styles.actions}>
        {showCrossRoleAction && (
          <Button
            theme="light"
            type="primary"
            icon={<IconArrowRight />}
            iconPosition="right"
            onClick={() => navigate(view.guide.actionRoute!)}
          >
            {view.guide.actionLabel}
          </Button>
        )}
        <Button theme="borderless" icon={<IconRefresh />} onClick={() => setResetConfirmVisible(true)}>
          重置演示
        </Button>
      </div>
      <Modal
        title="重置完整演示？"
        visible={resetConfirmVisible}
        okText="确认重置"
        cancelText="取消"
        onOk={confirmReset}
        onCancel={() => setResetConfirmVisible(false)}
        closeOnEsc
      >
        任务将恢复到成果未提交、进度 6 / 10 的初始状态。
      </Modal>
    </section>
  );
}
