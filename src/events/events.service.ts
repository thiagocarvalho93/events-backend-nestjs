import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/prisma/dto/paginated-output.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { OutputDto } from 'src/prisma/dto/output.dto';

// TODO: put up a better way to deal with incoming dates!
@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { creator_id, date, description, location, title } = createEventDto;
    return await this.prismaService.event.create({
      data: {
        creator: { connect: { user_id: creator_id } },
        date,
        description,
        location,
        title,
      },
    });
  }

  async findAll(
    query: EventQueryDto,
  ): Promise<PaginatedOutputDto<EventResponseDto>> {
    const { page = '1', limit = '10', location, title } = query;
    const page_size = +limit;
    const current_page = +page;

    let { creator_id } = query;
    creator_id = +creator_id;

    if (creator_id) {
      await this.prismaService.user.findFirstOrThrow({
        where: { user_id: creator_id },
      });
    }

    const where = {
      ...(creator_id ? { creator_id } : {}),
      ...(title ? { title: { contains: title } } : {}),
      ...(location ? { title: { equals: location } } : {}),
    };
    const [events, total_records] = await Promise.all([
      this.prismaService.event.findMany({
        where,
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.event.count({ where }),
    ]);

    return {
      data: events,
      pagination: {
        total_records,
        current_page,
        page_size,
        total_pages: Math.ceil(total_records / page_size),
      },
    };
  }

  async findOne(id: number): Promise<OutputDto<EventResponseDto>> {
    const data = await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });
    return { data };
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<OutputDto<EventResponseDto>> {
    await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });

    const data = await this.prismaService.event.update({
      where: { event_id: id },
      data: updateEventDto,
    });

    return { data };
  }

  async remove(id: number): Promise<OutputDto<EventResponseDto>> {
    await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });

    const data = await this.prismaService.event.delete({
      where: { event_id: id },
    });

    return { data };
  }
}
