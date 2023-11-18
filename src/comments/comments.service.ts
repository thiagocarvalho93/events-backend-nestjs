import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OutputDto } from 'src/prisma/prisma/dto/output.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/prisma/prisma/dto/paginated-output.dto';
import { CommentQueryDto } from './dto/comment-query.dto';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async create({
    event_id,
    text,
    user_id,
  }: CreateCommentDto): Promise<OutputDto<CommentResponseDto>> {
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
    const page_size = parseInt(limit, 10);
    const current_page = parseInt(page, 10);

    // TODO: query, sorting
    const [data, total_records] = await Promise.all([
      this.prismaService.comment.findMany({
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.comment.count(),
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
  ): Promise<OutputDto<CommentResponseDto>> {
    await this.prismaService.comment.findFirstOrThrow({
      where: { comment_id },
    });

    const data = await this.prismaService.comment.update({
      where: { comment_id },
      data: updateCommentDto,
    });

    return { data };
  }

  async remove(comment_id: number): Promise<OutputDto<CommentResponseDto>> {
    await this.prismaService.comment.findFirstOrThrow({
      where: { comment_id },
    });

    const data = await this.prismaService.comment.delete({
      where: { comment_id },
    });

    return { data };
  }
}
