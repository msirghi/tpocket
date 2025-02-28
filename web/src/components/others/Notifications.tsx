import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsNone';
import {
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation
} from '../../generated/graphql';
import { INotification } from '../../interfaces/INotification';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import Tooltip from '@material-ui/core/Tooltip';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';

export const Notifications = () => {
  const [notificationMenuOpen, setNotificationMenuOpen] = useState<null | HTMLElement>(null);
  const notificationsQuery = useGetUserNotificationsQuery();
  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<null | number>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data.getUserNotifications);
      setUnreadNotifications(
        notificationsQuery.data.getUserNotifications.filter((e) => !e.read).length
      );
    }
  }, [notificationsQuery.data]);

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const response = await markAsReadMutation({
        variables: {
          id: notificationId
        }
      });
      if (response && response.data) {
        notificationsQuery.refetch();
      }
    } catch (e) {}
  };

  if (!notificationsQuery.data) {
    return <div />;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationMenuOpen(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationMenuOpen(null);
  };

  return (
    <>
      <IconButton aria-label='show 11 new notifications' onClick={handleClick}>
        <Tooltip title={`${unreadNotifications} ${t('notifications.newNotifications')}`}>
          <Badge badgeContent={unreadNotifications} color='primary'>
            <NotificationsIcon />
          </Badge>
        </Tooltip>
      </IconButton>

      <Menu
        id='simple-menu'
        anchorEl={notificationMenuOpen}
        keepMounted
        open={Boolean(notificationMenuOpen)}
        onClose={handleClose}
      >
        <List component='nav' aria-label='main mailbox folders'>
          {notifications &&
            notifications.map((notification) => {
              return (
                <ListItem
                  button
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <ListItemIcon>
                    {notification.read ? (
                      <InboxIcon />
                    ) : (
                      <Tooltip
                        title={String(t('notifications.markAsReadTooltip'))}
                        aria-label='add'
                      >
                        <FiberNewIcon color={'primary'} />
                      </Tooltip>
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={dateFormat(notification.createdAt, 'mmmm dS, h:MM TT')}
                  />
                </ListItem>
              );
            })}
        </List>
      </Menu>
    </>
  );
};
