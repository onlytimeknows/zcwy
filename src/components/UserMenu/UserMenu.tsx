import Avatar from '@douyinfe/semi-ui/lib/es/avatar';
import Dropdown from '@douyinfe/semi-ui/lib/es/dropdown';
import Modal from '@douyinfe/semi-ui/lib/es/modal';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconExit from '@douyinfe/semi-icons/lib/es/icons/IconExit';
import IconRefresh from '@douyinfe/semi-icons/lib/es/icons/IconRefresh';
import IconSetting from '@douyinfe/semi-icons/lib/es/icons/IconSetting';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import styles from './UserMenu.module.css';

const roleDetails = {
  student: {
    name: '林知夏',
    label: '学生演示身份',
    workspace: '/student',
    icon: <IconUser size="large" />,
  },
  enterprise: {
    name: '青创校园文化有限公司',
    label: '企业演示身份',
    workspace: '/enterprise',
    icon: <IconApartment size="large" />,
  },
} as const;

export function UserMenu({
  showScenarioControls = false,
  displayRole,
}: {
  showScenarioControls?: boolean;
  displayRole?: DemoRole;
}) {
  const navigate = useNavigate();
  const { role, logout } = useDemoAuth();
  const { resetScenario } = useDemoScenario();
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);

  if (!role) {
    return null;
  }

  const currentRole = roleDetails[displayRole ?? role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Dropdown
      trigger="hover"
      position="bottomRight"
      mouseEnterDelay={80}
      mouseLeaveDelay={160}
      contentClassName={styles.dropdown}
      render={(
        <div className={styles.menuPanel} aria-label="账号设置">
          <div className={styles.identity}>
            <span className={styles.identityIcon}>{currentRole.icon}</span>
            <span className={styles.identityCopy}>
              <strong>{currentRole.name}</strong>
              <span>{currentRole.label}</span>
            </span>
            <IconSetting className={styles.settingIcon} aria-hidden="true" />
          </div>
          <Dropdown.Menu>
            <Dropdown.Item
              icon={<IconArrowRight />}
              onClick={() => navigate(currentRole.workspace)}
            >
              进入当前工作台
            </Dropdown.Item>
            <Dropdown.Item icon={<IconRefresh />} onClick={() => navigate('/auth')}>
              切换演示身份
            </Dropdown.Item>
            {showScenarioControls && (
              <Dropdown.Item icon={<IconRefresh />} onClick={() => setResetConfirmVisible(true)}>
                重置完整演示
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item type="danger" icon={<IconExit />} onClick={handleLogout}>
              退出演示登录
            </Dropdown.Item>
          </Dropdown.Menu>
        </div>
      )}
    >
      <button
        className={styles.avatarButton}
        type="button"
        aria-label={`${currentRole.label}，打开账号设置`}
        title={`${currentRole.label} · 账号设置`}
      >
        <span className={styles.avatarFrame} aria-hidden="true">
          <Avatar className={styles.avatar} size="36px" color="light-blue" shape="circle">
            {currentRole.icon}
          </Avatar>
        </span>
      </button>
      </Dropdown>
      <Modal
        title="重置完整演示？"
        visible={resetConfirmVisible}
        okText="确认重置"
        cancelText="取消"
        onOk={() => {
          resetScenario();
          setResetConfirmVisible(false);
        }}
        onCancel={() => setResetConfirmVisible(false)}
        closeOnEsc
      >
        任务将恢复到成果未提交、进度 6 / 10 的初始状态。
      </Modal>
    </>
  );
}
