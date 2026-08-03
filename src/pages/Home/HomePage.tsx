import Card from '@douyinfe/semi-ui/lib/es/card';
import Tag from '@douyinfe/semi-ui/lib/es/tag';
import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconChainStroked from '@douyinfe/semi-icons/lib/es/icons/IconChainStroked';
import IconShield from '@douyinfe/semi-icons/lib/es/icons/IconShield';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import { motion } from 'framer-motion';
import { platformCapabilities } from '../../mock/platformCapabilities';
import type { CapabilityIcon } from '../../types/platform';
import styles from './HomePage.module.css';

const { Title, Paragraph, Text } = Typography;

const icons: Record<CapabilityIcon, React.ReactNode> = {
  shield: <IconShield size="extra-large" />,
  chain: <IconChainStroked size="extra-large" />,
  settlement: <IconTickCircle size="extra-large" />,
};

export function HomePage() {
  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <section className={styles.hero}>
        <Tag color="blue" size="large">前端环境已就绪</Tag>
        <Title heading={1} className={styles.title}>
          让每一份大学生兼职，都有可信的权益凭证
        </Title>
        <Paragraph className={styles.subtitle}>
          围绕可信岗位、全过程存证与薪资托管结算，构建“事前认证、事中存证、事后保障”的演示闭环。
        </Paragraph>
        <Text type="tertiary" size="small">
          当前为概念演示数据，未接入真实区块链、支付系统或外部服务。
        </Text>
      </section>

      <section className={styles.capabilities} aria-label="平台核心能力">
        {platformCapabilities.map((item) => (
          <Card key={item.id} className={styles.card} shadows="hover">
            <span className={styles.icon} aria-hidden="true">{icons[item.icon]}</span>
            <Title heading={5}>{item.title}</Title>
            <Paragraph className={styles.description}>{item.description}</Paragraph>
          </Card>
        ))}
      </section>
    </motion.main>
  );
}
