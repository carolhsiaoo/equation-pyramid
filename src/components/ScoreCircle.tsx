"use client";

import { Typography } from "./Typography";

interface ScoreCircleProps {
  score: number;
  showCrown?: boolean;
}

export function ScoreCircle({ score, showCrown = false }: ScoreCircleProps) {
  return (
    <div className="relative">
      {/* Crown for winner */}
      {showCrown && (
        <div className="absolute -top-5 md:-top-6 lg:-top-7 right-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 z-10">
          {/* Crown SVG - using Crown.svg with -35 degree tilt */}
          <svg
            className="w-full h-full"
            viewBox="0 0 57 57"
            fill="none"
            style={{ transform: "rotate(30deg)" }}
          >
            <title>Winner Crown</title>
            <path
              d="M28.8716 15.8705C29.2222 15.8705 29.5648 15.9759 29.8552 16.173C30.1456 16.3701 30.3705 16.6499 30.5009 16.9763C31.3296 19.0565 32.3572 20.3689 33.4036 21.1977C34.443 22.0265 35.5853 22.4421 36.7511 22.5923C39.1552 22.9046 41.6225 22.0946 43.1464 21.4208L43.1862 21.4043C43.4039 21.3081 43.6473 21.2001 43.8557 21.1226H43.8674C44.2777 20.9654 44.7239 20.9271 45.1549 21.0122C45.4643 21.0811 45.7552 21.2162 46.0077 21.4083C46.2602 21.6004 46.4684 21.8449 46.6179 22.1251C46.9082 22.6651 46.8754 23.2098 46.8637 23.3883V23.393C46.8474 23.6137 46.8099 23.8719 46.7795 24.095C46.1661 28.3986 45.5435 32.6998 44.9419 37.0035C44.6375 39.1635 43.4928 40.5088 41.3509 41.131C33.1921 43.4503 24.5512 43.4503 16.3923 41.131C14.2504 40.5088 13.1034 39.1635 12.8014 37.0035C12.1998 32.6998 11.5771 28.3986 10.9638 24.095C10.9269 23.8621 10.8988 23.6279 10.8795 23.393V23.3883C10.8426 22.9525 10.9277 22.515 11.1253 22.1251C11.2749 21.8449 11.4831 21.6004 11.7356 21.4083C11.9881 21.2162 12.279 21.0811 12.5884 21.0122C13.0191 20.9264 13.4653 20.9638 13.8759 21.1202L13.8852 21.1249C14.0959 21.2001 14.3394 21.3081 14.5571 21.4043L14.5969 21.4208C16.1184 22.0946 18.5857 22.9046 20.9875 22.5947C22.213 22.4492 23.3742 21.9656 24.342 21.1977C25.3837 20.3689 26.4113 19.0565 27.2424 16.9763C27.3728 16.6499 27.5977 16.3701 27.8881 16.173C28.1784 15.9759 28.521 15.8705 28.8716 15.8705Z"
              fill="#FAF07F"
              fillOpacity="0.95"
            />
          </svg>
        </div>
      )}

      <div
        className="flex items-center justify-center rounded-full border w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]"
        style={{
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(169, 199, 255, 0.75)",
          boxShadow: "4px 4px 20px 0px rgba(163, 163, 163, 0.15)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <Typography variant="h1" className="text-white text-4xl md:text-5xl lg:text-6xl">
          {score}
        </Typography>
      </div>
    </div>
  );
}
