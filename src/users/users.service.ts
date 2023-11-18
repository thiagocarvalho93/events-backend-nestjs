import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginatedOutputDto } from 'src/prisma/dto/paginated-output.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { OutputDto } from 'src/prisma/dto/output.dto';
import { InvalidOperationError } from 'src/errors/invalid-operation-error';

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
    const { page = '1', limit = '10', username } = query;
    const page_size = parseInt(limit, 10);
    const current_page = parseInt(page, 10);

    const where = { ...(username ? { username: { contains: username } } : {}) };
    // TODO: sorting
    const [users, total_records] = await Promise.all([
      this.prismaService.user.findMany({
        where,
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
  ): Promise<OutputDto<UserResponseDto>> {
    // TODO: get the user from token
    // only the user himself can change his data
    const updatedUser = await this.prismaService.user.update({
      where: { user_id },
      data: updateUserDto,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...data } = updatedUser;

    return { data };
  }

  async remove(user_id: number): Promise<any> {
    const response = await this.prismaService.user.delete({
      where: { user_id },
    });

    return response;
  }
}
