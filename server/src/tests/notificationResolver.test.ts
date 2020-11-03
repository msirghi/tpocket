import { GraphQLClient } from 'graphql-request';
import { NOTIFICATION_NOT_FOUND, SERVER_ERROR } from '../constants/error.constants';
import { getClientWithTokenInterceptor } from './utils/getClientWithTokenInterceptor';
import { createNotificationMutation, deleteNotificationMutation, markNotificationAsReadMutation } from './utils/mutations';
import { getNotificationById, getUserNotificationsQuery } from './utils/queries';

export const notificationResolverTest = () => describe('Notification resolver', () => {
  let client: GraphQLClient;
  let createdNotificationId;

  beforeAll(async () => {
    client = await getClientWithTokenInterceptor();
  });

  it('should create notification based on token', async () => {
    const response = await client.request(createNotificationMutation('Notification message'));
    expect(response.createNotification).toBeTruthy();
  });

  it('should get created notification', async () => {
    const response = await client.request(getUserNotificationsQuery());
    expect(response.getUserNotifications[0].message).toBe('Notification message');
    expect(response.getUserNotifications[0].read).toBeFalsy();
    createdNotificationId = response.getUserNotifications[0].id;
  });

  it('should get notification by id', async () => {
    const response = await client.request(getNotificationById(createdNotificationId));
    expect(response.getNotificationById.id).toBe(createdNotificationId);
    expect(response.getNotificationById.read).toBeFalsy();
    expect(response.getNotificationById.message).toBe('Notification message');
  });

  it('should mark notification as read', async () => {
    await client.request(markNotificationAsReadMutation(createdNotificationId));

    const response = await client.request(getUserNotificationsQuery());
    expect(response.getUserNotifications[0].read).toBeTruthy();
  });

  it('should remove notification by id', async () => {
    await client.request(deleteNotificationMutation(createdNotificationId));
    let err;

    try {
      await client.request(getNotificationById(createdNotificationId));
    } catch(e) {
      err = e;
    }
    expect(String(err).includes(SERVER_ERROR)).toBeTruthy();
  });
  
  it('should throw an error if notification was not found', async () => {
    let err;

    try {
      await client.request(getNotificationById(999));
    } catch(e) {
      err = e;
    }
    expect(String(err).includes(SERVER_ERROR)).toBeTruthy();
  });
});
