import Avatar from '@douyinfe/semi-ui/lib/es/avatar';
import Dropdown from '@douyinfe/semi-ui/lib/es/dropdown';
import IconApartment from '@douyinfe/semi-icons/lib/es/icons/IconApartment';
import IconArrowRight from '@douyinfe/semi-icons/lib/es/icons/IconArrowRight';
import IconBellStroked from '@douyinfe/semi-icons/lib/es/icons/IconBellStroked';
import IconExit from '@douyinfe/semi-icons/lib/es/icons/IconExit';
import IconHelpCircle from '@douyinfe/semi-icons/lib/es/icons/IconHelpCircle';
import IconLock from '@douyinfe/semi-icons/lib/es/icons/IconLock';
import IconSetting from '@douyinfe/semi-icons/lib/es/icons/IconSetting';
import IconUser from '@douyinfe/semi-icons/lib/es/icons/IconUser';
import { useNavigate } from 'react-router-dom';
import { useDemoAuth, type DemoRole } from '../../auth/DemoAuthContext';
import styles from './UserMenu.module.css';

const roleDetails = {
  student: {
    name: '林知夏',
    label: '学生账户',
    workspace: '/student',
    icon: <IconUser size="large" />,
  },
  enterprise: {
    name: '青创校园文化有限公司',
    label: '企业账户',
    workspace: '/enterprise',
    icon: <IconApartment size="large" />,
  },
} as const;

export function UserMenu({
  displayRole,
}: {
  displayRole?: DemoRole;
}) {
  const navigate = useNavigate();
  const { role, logout } = useDemoAuth();

  if (!role) {
    return null;
  }

  const currentRole = roleDetails[displayRole ?? role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
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
              进入工作台
            </Dropdown.Item>
            <Dropdown.Item icon={<IconUser />}>
              个人资料
            </Dropdown.Item>
            <Dropdown.Item icon={<IconLock />}>
              账号与安全
            </Dropdown.Item>
            <Dropdown.Item icon={<IconBellStroked />}>
              通知设置
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={<IconHelpCircle />} onClick={() => navigate('/help')}>
              帮助与反馈
            </Dropdown.Item>
            <Dropdown.Item type="danger" icon={<IconExit />} onClick={handleLogout}>
              退出登录
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
  );
}
