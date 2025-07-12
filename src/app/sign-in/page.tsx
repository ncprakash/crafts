'use client';

import React, { useEffect, Suspense } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import SignInForm from '@/components/SignInForm';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(MotionPathPlugin);

function SigninPageContent() {
  const pathname = usePathname();

  useEffect(() => {
    // Kill old animations if any
    for (let i = 1; i <= 7; i++) {
      gsap.killTweensOf(`#logo${i}`);
    }

    // Start animations
    const animations = Array.from({ length: 7 }).map((_, i) =>
      gsap.to(`#logo${i + 1}`, {
        duration: 6 + i * 2,
        ease: 'power1.inOut',
        motionPath: {
          path: `#diagonalPath${i + 1}`,
          align: `#diagonalPath${i + 1}`,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
        repeat: -1,
      })
    );

    return () => animations.forEach(anim => anim.kill());
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#f9f5f0] flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Motion Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {Array.from({ length: 7 }).map((_, i) => {
          const offset = i * 100;
          return (
            <path
              key={i}
              id={`diagonalPath${i + 1}`}
              d={`M ${-100 + offset} -100 L ${1400 + offset} 1400`}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </svg>

      {/* Your same animated SVG logos (unchanged) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <svg
  key={i}
  id={`logo${i + 1}`}
  xmlns="http://www.w3.org/2000/svg"
  width="90"
  height="90"
  viewBox="0 0 166 174"
  className="absolute opacity-100 z-10"
>
  <g id="Group 1">
      <path
        id="c"
        d="M55.0307 54.8419C57.4599 53.4394 59.8828 52.8052 62.2995 52.9394C64.7162 53.0736 66.978 53.8746 69.0849 55.3422C71.1919 56.8099 72.992 58.837 74.4854 61.4237C76.0048 64.0553 76.862 66.6568 77.0571 69.2283C77.2474 71.8175 76.7989 74.1832 75.7115 76.3255C74.6194 78.4855 72.9037 80.2408 70.5645 81.5913C68.7426 82.6432 66.9059 83.2538 65.0543 83.4231C63.2027 83.5924 61.4596 83.3393 59.8249 82.6636C58.1902 81.9879 56.7929 80.9053 55.633 79.4157L59.6142 77.1172C60.5996 78.1227 61.8782 78.779 63.45 79.0861C65.0171 79.411 66.6778 79.0669 68.4322 78.054C69.9842 77.158 71.1113 75.9675 71.8134 74.4825C72.5107 73.0152 72.7635 71.3623 72.5717 69.5237C72.3751 67.7028 71.712 65.814 70.5822 63.8571C69.4264 61.8553 68.1051 60.294 66.6182 59.1731C65.1201 58.0587 63.5549 57.4254 61.9226 57.2732C60.279 57.1275 58.6699 57.5091 57.0955 58.4182C56.0608 59.0155 55.2257 59.7376 54.59 60.5845C53.9543 61.4313 53.5388 62.361 53.3436 63.3734C53.1484 64.3858 53.1998 65.4357 53.4978 66.5233L49.5166 68.8218C48.8585 67.1624 48.6198 65.4634 48.8005 63.7246C48.9764 62.0036 49.582 60.3644 50.6172 58.807C51.6477 57.2674 53.1188 55.9457 55.0307 54.8419Z"
        fill="#FFD700"
      />
      <path
        id="c_2"
        d="M84.3132 69.7614C81.884 71.1639 79.4611 71.798 77.0444 71.6638C74.6277 71.5296 72.3659 70.7287 70.2589 69.261C68.152 67.7934 66.3519 65.7662 64.8585 63.1796C63.3391 60.548 62.4819 57.9465 62.2868 55.375C62.0965 52.7858 62.545 50.42 63.6324 48.2778C64.7245 46.1177 66.4402 44.3625 68.7794 43.0119C70.6013 41.9601 72.438 41.3495 74.2896 41.1801C76.1412 41.0108 77.8843 41.264 79.519 41.9397C81.1537 42.6153 82.551 43.698 83.7109 45.1876L79.7297 47.4861C78.7443 46.4806 77.4657 45.8242 75.8939 45.5171C74.3268 45.1923 72.666 45.5363 70.9116 46.5493C69.3597 47.4453 68.2326 48.6358 67.5305 50.1208C66.8331 51.5881 66.5804 53.241 66.7722 55.0796C66.9687 56.9004 67.6319 58.7893 68.7617 60.7461C69.9175 62.748 71.2388 64.3093 72.7256 65.4302C74.2237 66.5446 75.789 67.1779 77.4213 67.3301C79.0649 67.4758 80.6739 67.0941 82.2484 66.1851C83.283 65.5878 84.1182 64.8657 84.7539 64.0188C85.3896 63.1719 85.8051 62.2423 86.0003 61.2299C86.1955 60.2175 86.1441 59.1675 85.8461 58.08L89.8273 55.7815C90.4854 57.4408 90.7241 59.1399 90.5434 60.8787C90.3674 62.5997 89.7618 64.2389 88.7266 65.7963C87.6962 67.3359 86.225 68.6576 84.3132 69.7614Z"
        fill="#FFD700"
      />
    </g>

  {/* Optional background rectangles — dimmed for clarity */}
  <rect
    x="27.797"
    y="104.667"
    width="50"
    height="33"
    transform="rotate(-30 27.797 104.667)"
    fill="#0A1D44"
  opacity="1"
  />
  <rect
    x="50.9612"
    y="144.788"
    width="50"
    height="33"
    transform="rotate(-30 50.9612 144.788)"
    fill="#0A1D44"
    opacity="1"
  />
  <rect
    x="105.527"
    y="113.285"
    width="50"
    height="33"
    transform="rotate(-30 105.527 113.285)"
    fill="#0A1D44"
     opacity="1"
  />
  <rect
    x="82.5596"
    y="73.5181"
    width="50"
    height="33"
    transform="rotate(-30 82.5596 73.5181)"
    fill="#0A1D44"
   opacity="1"
  />
</svg>

      ))}

      {/* Your Form */}
   <div className="z-20 relative">
    <SignInForm />
  </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <SigninPageContent />
    </Suspense>
  );
}


