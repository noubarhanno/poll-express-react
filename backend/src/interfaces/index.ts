export interface IResponsePayload<TData> {
  success: boolean;
  error?: string;
  data?: TData;
  message?: string;
  status: number;
}

export interface IRequestHeaders extends Record<string, string> {
  email: string;
}
