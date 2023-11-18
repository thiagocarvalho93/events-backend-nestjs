import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/user-query.dto';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users based on filters.' })
  @ApiBearerAuth()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find the user by id.' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the user information.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user with the id.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
