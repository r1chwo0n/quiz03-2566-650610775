import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Nawawan Thaichim",
    studentId: "650610775",
  });
};
