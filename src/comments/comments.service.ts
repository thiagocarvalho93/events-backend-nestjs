import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OutputDto } from 'src/prisma/dto/output.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/prisma/dto/paginated-output.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { InvalidOperationError } from 'src/errors/invalid-operation-error';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async create({
    event_id,
    text,
    user_id,
  }: CreateCommentDto): Promise<OutputDto<CommentResponseDto>> {
    await this._checkEventAndOrUser(event_id, user_id);

    const data = await this.prismaService.comment.create({
      data: {
        text,
        event_id,
        user_id,
      },
    });

    return { data };
  }

  async findAll(
    query: CommentQueryDto,
  ): Promise<PaginatedOutputDto<CommentResponseDto>> {
    const { page = '1', limit = '10' } = query;
    const page_size = +limit;
    const current_page = +page;
    let { event_id, user_id } = query;
    event_id = +event_id;
    user_id = +user_id;

    await this._checkEventAndOrUser(event_id, user_id);

    const where = {
      ...(event_id ? { event_id } : {}),
      ...(user_id ? { user_id } : {}),
    };

    const [data, total_records] = await Promise.all([
      this.prismaService.comment.findMany({
        where,
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.comment.count({ where }),
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

  async findOne(comment_id: number): Promise<OutputDto<CommentResponseDto>> {
    const data = await this.prismaService.comment.findFirstOrThrow({
      where: { comment_id },
    });

    return { data };
  }

  async update(
    comment_id: number,
    updateCommentDto: UpdateCommentDto,
    request: any,
  ): Promise<OutputDto<CommentResponseDto>> {
    const comment = await this.prismaService.comment.findFirstOrThrow({
      where: { comment_id },
    });

    this._validateUserToken(comment.user_id, request);

    const data = await this.prismaService.comment.update({
      where: { comment_id },
      data: updateCommentDto,
    });

    return { data };
  }

  async remove(
    comment_id: number,
    request: any,
  ): Promise<OutputDto<CommentResponseDto>> {
    const comment = await this.prismaService.comment.findFirstOrThrow({
      where: { comment_id },
    });

    this._validateUserToken(comment.user_id, request);

    const data = await this.prismaService.comment.delete({
      where: { comment_id },
    });

    return { data };
  }

  async _checkEventAndOrUser(event_id: number, user_id: number) {
    const promises = [
      event_id &&
        this.prismaService.event.findFirstOrThrow({ where: { event_id } }),
      user_id &&
        this.prismaService.user.findFirstOrThrow({ where: { user_id } }),
    ].filter(Boolean); // Remove falsy values (null or undefined)

    await Promise.all(promises);
  }

  _validateUserToken(id: number, request: any) {
    if (request?.user?.sub != id) {
      throw new InvalidOperationError(
        'You are not allowed to do this operation.',
      );
    }
  }
}
