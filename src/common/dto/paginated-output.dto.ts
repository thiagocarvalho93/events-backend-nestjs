import { PaginationMetadataDto } from './pagination-metadata.dto';

export class PaginatedOutputDto<T> {
  data: T[];
  pagination: PaginationMetadataDto;
}
