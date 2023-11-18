export class PaginatedOutputDto<T> {
  data: T[];
  pagination: {
    total_records: number;
    current_page: number;
    page_size: number;
    total_pages: number;
  };
}
