import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  event_id: number;
}
