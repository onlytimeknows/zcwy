import Typography from '@douyinfe/semi-ui/lib/es/typography';
import IconCreditCardStroked from '@douyinfe/semi-icons/lib/es/icons/IconCreditCardStroked';
import IconTick from '@douyinfe/semi-icons/lib/es/icons/IconTick';
import { formatCurrency } from '../../demo/demoScenarioData';
import { useDemoScenario } from '../../demo/DemoScenarioContext';
import { getEscrowFlow } from '../../demo/demoScenarioVisualization';
import styles from './EscrowFlowChart.module.css';

const { Title, Text } = Typography;

export function EscrowFlowChart({ perspective = 'student' }: { perspective?: 'student' | 'enterprise' }) {
  const { state } = useDemoScenario();
  const nodes = getEscrowFlow(state);
  const activeNode = nodes.find((node) => node.status === 'active');
  const isSettled = state.settlement.status === 'paid';

  return (
    <section className={styles.panel} id="escrow-flow" aria-labelledby={`escrow-flow-${perspective}`}>
      <div className={styles.heading}>
        <div className={styles.headingCopy}>
          <span className={`${styles.icon} ${isSettled ? styles.successIcon : ''}`}>
            <IconCreditCardStroked size="extra-large" />
          </span>
          <div>
            <Text className={styles.eyebrow}>{perspective === 'student' ? '薪资保障' : '结算保障'}</Text>
            <Title heading={4} id={`escrow-flow-${perspective}`}>薪资保障流转</Title>
          </div>
        </div>
        <div className={styles.amountRow}>
          <span>{isSettled ? '已到账' : activeNode?.label ?? '流转完成'}</span>
          <strong className={isSettled ? styles.settledAmount : undefined}>
            {formatCurrency(state.escrow.amount)}
          </strong>
        </div>
      </div>

      <ol className={styles.flow} aria-label="企业保证金到实践证书的保障流转">
        {nodes.map((node, index) => (
          <li className={styles[node.status]} key={node.id}>
            <span className={styles.marker} aria-hidden="true">
              {node.status === 'complete' ? <IconTick /> : String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <strong>{node.label}</strong>
              <small>{node.detail}</small>
            </div>
            <span className={styles.nodeState}>
              {node.status === 'complete' ? '已完成' : node.status === 'active' ? '当前' : '待处理'}
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.footerRow}>
        <div className={styles.footer}>
          <span>托管凭证</span>
          <code>{state.task.escrowReceiptId}</code>
        </div>
        <Text className={styles.notice}>模拟链上环境 · 概念演示数据</Text>
      </div>
    </section>
  );
}
