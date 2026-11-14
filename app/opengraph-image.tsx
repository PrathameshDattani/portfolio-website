import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { theme } from "@/content/theme";
import { pad } from "@/lib/utils";

export const alt = `${profile.fullName} · ${profile.roleTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic OG image: driver number + name on a livery background. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0A0A0B",
          color: "#F4F4F5",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 0,
            bottom: 0,
            width: 640,
            background: theme.livery,
            transform: "skewX(-12deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 540,
            top: 0,
            bottom: 0,
            width: 36,
            background: theme.livery2,
            transform: "skewX(-12deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 60,
            fontSize: 400,
            fontWeight: 900,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: -10,
            display: "flex",
          }}
        >
          {pad(profile.driverNumber)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, gap: 18 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#9CA3AF", textTransform: "uppercase" }}>
            {profile.shortName} · {profile.teamName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 900,
              fontStyle: "italic",
              textTransform: "uppercase",
              lineHeight: 0.95,
              maxWidth: 640,
            }}
          >
            {profile.fullName}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#D4D4D8", textTransform: "uppercase", letterSpacing: 3 }}>
            {profile.roleTitle}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
