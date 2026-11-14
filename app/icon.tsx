import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { theme } from "@/content/theme";
import { pad } from "@/lib/utils";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.livery,
          color: "#fff",
          fontSize: 36,
          fontWeight: 900,
          fontStyle: "italic",
          borderRadius: 10,
          letterSpacing: -1,
        }}
      >
        {pad(profile.driverNumber)}
      </div>
    ),
    size,
  );
}
