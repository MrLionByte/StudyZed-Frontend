import { useContext } from 'react';
import { RadiusUpleftOutlined } from '@ant-design/icons';
import { NotificationContext } from '../../../../context/NotificationContext';

const AlertIndicator = () => {
  const { unreadAlerts } = useContext(NotificationContext);
  console.log('This is Working ALert');

  return (
    <div>
      {unreadAlerts > 0 && (
        <RadiusUpleftOutlined style={{ fontSize: '24px', color: 'red' }} />
      )}
    </div>
  );
};

export default AlertIndicator;
