export type T = (key: string) => string;

export type GuestType = "client" | "lawyer";

export type AuthFormActionsResponse<T> =
  | {
      success: true;
      token?: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof T, string>>;
    };
