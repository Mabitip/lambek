import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { code: string; message: string };
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, {
    status,
  });
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } } satisfies ApiError,
    { status },
  );
}
