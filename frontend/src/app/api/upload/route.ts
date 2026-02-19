export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert to buffer properly
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadData = new FormData();
    uploadData.append("file", new Blob([fileBuffer]), file.name);

    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: uploadData,
      }
    );

    const result = await pinataResponse.json();

    console.log("Pinata response:", result);

    if (!pinataResponse.ok) {
      return NextResponse.json({ error: result }, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
