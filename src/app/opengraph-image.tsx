import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { accentHex } from "@/lib/accent";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#08080a",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accentHex(),
        }}
      >
        {site.role} · {site.location}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 66,
          lineHeight: 1.05,
          color: "#fafafa",
          letterSpacing: "-0.02em",
          maxWidth: "90%",
        }}
      >
        I build software for problems where a confidently wrong answer is the
        expensive one.
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 26,
          color: "#8a8a90",
        }}
      >
        <span>{site.name}</span>
        <span style={{ color: accentHex() }}>{site.focus}</span>
      </div>
    </div>,
    size,
  );
}
