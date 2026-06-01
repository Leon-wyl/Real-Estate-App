import { IsString } from 'class-validator';

export class SavePostDto {
  @IsString()
  postId: string;
}
