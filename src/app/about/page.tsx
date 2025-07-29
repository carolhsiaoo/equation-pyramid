"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Block } from "@/components/Block";
import { Typography } from "@/components/Typography";
import { useButtonSound } from "@/hooks/useButtonSound";

export default function AboutPage() {
  const router = useRouter();
  const { playButtonSound } = useButtonSound();

  const handleCancelClick = () => {
    playButtonSound();
    router.back();
  };

  return (
    <div className="h-full flex flex-col items-center justify-start px-6 pt-2 pb-4 relative">
      {/* Cancel Button */}
      <button
        onClick={handleCancelClick}
        className="fixed top-4 md:top-6 right-4 md:right-6 z-50 w-12 h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity cursor-pointer"
        title="Go back"
        aria-label="Cancel"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="w-12 h-12"
        >
          <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.1"/>
          <path 
            d="M30 18L18 30M18 18L30 30" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Content */}
      <div className="flex flex-col items-center gap-10 max-w-4xl w-full">
        {/* Title */}
        <Typography variant="h1" className="text-white text-center">
          About
        </Typography>

        {/* Content Sections */}
        <div className="flex flex-col gap-6 w-full">
          {/* Inspiration Section */}
          <Block>
            <Typography variant="h2" className="text-white text-center mb-4">
              Inspiration
            </Typography>
            <Typography variant="p2" className="text-white text-left">
              This is a game inspired by The Devil&apos;s Plan season 2 on
              Netflix. We played this game along with the participants in the
              show and really enjoyed it. So we decided to make it possible to
              let more people enjoy this game. Hope you like it :)
            </Typography>
          </Block>

          {/* Contributors Section */}
          <Block>
            <Typography variant="h2" className="text-white text-center mb-4">
              Contributors
            </Typography>
            <Typography variant="p2" className="text-white text-left mb-4">
              Hi there~ Thank you for playing Equation Pyramid! We are the
              engineer and designer who built this game together. Feel free to
              visit our LinkedIn or website below!
            </Typography>

            {/* Contributors List */}
            <div className="flex flex-wrap gap-10 justify-center">
              {/* Carol */}
              <div className="flex items-center gap-4">
                <Image
                  src="/images/avatars/carol.jpeg"
                  alt="Carol Hsiao"
                  width={72}
                  height={72}
                  className="w-18 h-18 rounded-full object-cover"
                />
                <div className="flex flex-col justify-center gap-2">
                  <Typography variant="p2" className="text-white text-center">
                    Carol Hsiao
                  </Typography>
                  <div className="flex gap-2">
                    <a
                      href="https://www.carolhsiao.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Website"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>Website</title>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/carol-hsiao-5779a1158/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="LinkedIn"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>LinkedIn</title>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/carolhsiaoo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="GitHub"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>GitHub</title>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://x.com/CarolXiaoo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Twitter"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>Twitter</title>
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Eason */}
              <div className="flex items-center gap-4">
                <Image
                  src="/images/avatars/eason.jpg"
                  alt="Eason Chang"
                  width={72}
                  height={72}
                  className="w-18 h-18 rounded-full object-cover"
                />
                <div className="flex flex-col justify-center gap-2">
                  <Typography variant="p2" className="text-white text-center">
                    Eason Chang
                  </Typography>
                  <div className="flex gap-2">
                    <a
                      href="https://easonchang.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Website"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>Website</title>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/easonchang101/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="LinkedIn"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>LinkedIn</title>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/eason-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="GitHub"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>GitHub</title>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/EasonChang_me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Twitter"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <title>Twitter</title>
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Block>

          {/* Project Section */}
          <Block>
            <Typography variant="h2" className="text-white text-center mb-4">
              Project
            </Typography>
            <Typography variant="p2" className="text-white text-left mb-4">
              This is an open-source project! You can find the source code,
              contribute to the project, or report issues on GitHub.
            </Typography>
            <div className="flex justify-center">
              <a
                href="https://github.com/carolhsiaoo/equation-pyramid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-lg transition-colors border border-white border-opacity-20"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <title>GitHub</title>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <Typography variant="p2" className="text-white">
                  View on GitHub
                </Typography>
              </a>
            </div>
          </Block>
        </div>
      </div>
    </div>
  );
}
