import { Injectable } from '@nestjs/common';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { UserEventQueryDto } from './dto/user-event-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvalidOperationError } from 'src/errors/invalid-operation-error';

// TODO: enum for status
@Injectable()
export class UserEventsService {
  constructor(private prismaService: PrismaService) {}

  async addUserToEvent({ event_id, user_id, status }: CreateUserEventDto) {
    await this.checkEventAndOrUser(event_id, user_id);

    const isAlreadyAdded = await this.prismaService.userEvent.findFirst({
      where: { event_id, user_id },
    });

    if (isAlreadyAdded) {
      throw new InvalidOperationError('User already added to event.');
    }

    const data = await this.prismaService.userEvent.create({
      data: {
        event: { connect: { event_id } },
        user: { connect: { user_id } },
        status,
      },
    });

    return { data };
  }

  async findAll(query: UserEventQueryDto) {
    const { page = '1', limit = '10' } = query;
    const page_size = +limit;
    const current_page = +page;

    let { event_id, user_id } = query;
    event_id = +event_id;
    user_id = +user_id;

    await this.checkEventAndOrUser(event_id, user_id);

    const where = {
      ...(event_id ? { event_id } : {}),
      ...(user_id ? { user_id } : {}),
    };
    const [data, total_records] = await Promise.all([
      this.prismaService.userEvent.findMany({
        where,
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.userEvent.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total_records,
        current_page,
        page_size,
        total_pages: Math.ceil(total_records / page_size),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} userEvent`;
  }

  async removeUserFromEvent({ event_id, user_id }: CreateUserEventDto) {
    await this.checkEventAndOrUser(event_id, user_id);

    const { id } = await this.prismaService.userEvent.findFirst({
      where: { event_id, user_id },
    });

    if (!id) {
      throw new InvalidOperationError('User not added to event.');
    }

    const data = await this.prismaService.userEvent.delete({
      where: { id },
    });

    return { data };
  }

  async updateStatus({ event_id, status, user_id }: CreateUserEventDto) {
    await this.checkEventAndOrUser(event_id, user_id);

    const participation = await this.prismaService.userEvent.findFirst({
      where: { event_id, user_id },
    });

    if (!participation) {
      throw new InvalidOperationError('User not added to event.');
    }

    if (status === participation.status) {
      throw new InvalidOperationError(`Status already ${status}.`);
    }

    const data = await this.prismaService.userEvent.update({
      where: { id: participation.id },
      data: { event_id, user_id, status },
    });

    return { data };
  }

  async checkEventAndOrUser(event_id: number, user_id: number) {
    const promises = [
      event_id &&
        this.prismaService.event.findFirstOrThrow({ where: { event_id } }),
      user_id &&
        this.prismaService.user.findFirstOrThrow({ where: { user_id } }),
    ].filter(Boolean); // Remove falsy values (null or undefined)

    await Promise.all(promises);
  }
}
