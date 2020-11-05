import { logger } from '../config/logger.config';
import {
  NOTIFICATION_CREATION_FAILED,
  NOTIFICATION_NOT_FOUND,
  SERVER_ERROR
} from '../constants/error.constants';
import { Notification } from '../entity/Notification';
import { User } from '../entity/User';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { MyContext } from 'src/MyContext';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';

@Resolver()
export class NotificationResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async createNotification(@Ctx() { payload }: MyContext, @Arg('message') message: string) {
    try {
      const user = await User.findOne({ where: { id: payload?.userId } });
      await Notification.insert({ message, read: false, user });
      return true;
    } catch (e) {
      logger.error(e);
      throw new Error(NOTIFICATION_CREATION_FAILED);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async markNotificationAsRead(@Ctx() { payload }: MyContext, @Arg('id') id: number) {
    try {
      const notification = await Notification.findOne({ where: { user: payload?.userId, id } });
      if (notification) {
        await getConnection()
          .createQueryBuilder()
          .update(Notification)
          .set({ read: true })
          .where('id = :id', { id })
          .execute();
        return true;
      }
      throw new Error(NOTIFICATION_NOT_FOUND);
    } catch (e) {
      logger.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async deleteNotification(@Ctx() { payload }: MyContext, @Arg('id') id: number) {
    try {
      const notification = await Notification.findOne({ where: { user: payload?.userId, id } });
      if (notification) {
        await Notification.remove(notification);
        return true;
      }
      throw new Error(NOTIFICATION_NOT_FOUND);
    } catch (e) {
      logger.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  @Query(() => Notification)
  @UseMiddleware(isAuthMiddleware)
  async getNotificationById(@Ctx() { payload }: MyContext, @Arg('id') id: number) {
    try {
      const notification = await Notification.findOne({ where: { user: payload?.userId, id } });
      if (notification) {
        return notification;
      }
      throw new Error(NOTIFICATION_NOT_FOUND);
    } catch (e) {
      logger.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  @Query(() => [Notification])
  @UseMiddleware(isAuthMiddleware)
  async getUserNotifications(@Ctx() { payload }: MyContext) {
    try {
      const notifications = await Notification.find({ where: { user: payload?.userId } });
      if (notifications) {
        return [...notifications.slice(Math.max(notifications.length - 5, 1))];
      }
      throw new Error(NOTIFICATION_NOT_FOUND);
    } catch (e) {
      logger.error(e);
      throw new Error(SERVER_ERROR);
    }
  }
}
