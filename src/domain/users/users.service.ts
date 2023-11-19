import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginatedOutputDto } from 'src/common/dto/paginated-output.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { OutputDto } from 'src/common/dto/output.dto';
import { InvalidOperationError } from 'src/common/errors/invalid-operation-error';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<OutputDto<UserResponseDto>> {
    const { email, password, username } = createUserDto;

    const exists = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new InvalidOperationError('This email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        username,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...data } = user;

    return { data };
  }

  async findAll(
    query: UserQueryDto,
  ): Promise<PaginatedOutputDto<UserResponseDto>> {
    const { page = '1', limit = '10', username, order_by, sort_by } = query;
    const page_size = parseInt(limit, 10);
    const current_page = parseInt(page, 10);

    const where = { ...(username ? { username: { contains: username } } : {}) };

    const orderByKeys = ['username', 'user_id'];
    const isValidOrderBy = sort_by && orderByKeys.includes(sort_by);
    const orderBy = isValidOrderBy ? { [sort_by]: order_by || 'asc' } : {};

    const [users, total_records] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy,
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.user.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = users.map(({ password_hash, ...rest }) => rest);

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

  async findOne(user_id: number): Promise<OutputDto<UserResponseDto>> {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { user_id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...data } = user;

    return { data };
  }

  // This method does NOT hide the password hash
  // It's used only for authentication, DONT EXPOSE it on controller
  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });

    return user;
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
    request: any,
  ): Promise<OutputDto<UserResponseDto>> {
    this._validateUserToken(user_id, request);

    let hashedPassword = '';
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    const update = {
      ...(updateUserDto.email ? { email: updateUserDto.email } : {}),
      ...(updateUserDto.password ? { password_hash: hashedPassword } : {}),
      ...(updateUserDto.username ? { username: updateUserDto.username } : {}),
    };
    const updatedUser = await this.prismaService.user.update({
      where: { user_id },
      data: update,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...data } = updatedUser;

    return { data };
  }

  async remove(user_id: number, request: any): Promise<any> {
    this._validateUserToken(user_id, request);

    const response = await this.prismaService.user.delete({
      where: { user_id },
    });

    return response;
  }

  _validateUserToken(id: number, request: any) {
    if (request?.user?.sub != id) {
      throw new InvalidOperationError(
        'You are not allowed to do this operation.',
      );
    }
  }
}
