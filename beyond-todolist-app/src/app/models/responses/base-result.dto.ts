export interface BaseResultDto<T> {
  errorMessage?: string;
  data: T;
}