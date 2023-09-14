import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let totalRooms = 0;
  const rooms = DB.rooms;
  for (const room of DB.rooms) {
    totalRooms = totalRooms + 1;
  }
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  let role = null;
  if (!payload)
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  role = payload.role;
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    readDB();
    const body = await request.json();
    const { roomName } = body;
    const foundRoom = DB.rooms.find((x) => x.roomName === roomName);
    if (foundRoom)
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${roomName} already exists`,
        },
        { status: 400 }
      );
    const roomId = nanoid();
    DB.rooms.push({
      roomId,
      roomName,
    });

    //call writeDB after modifying Database
    writeDB();

    return NextResponse.json({
      ok: true,
      roomId,
      message: `Room ${roomName} has been created`,
    });
  }
};
