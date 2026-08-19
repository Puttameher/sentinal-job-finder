import React from 'react';

/**
 * CustomVectorWordmark — Pure SVG Geometric Display Wordmark
 *
 * Implements the exact modular Bauhaus-inspired industrial vector wordmark from the reference:
 * - Ultra-heavy, wide, block-like geometric glyphs
 * - Uniform mechanical strokes and deliberate rectangular counter cutouts
 * - Tight letter and line spacing forming a dense rectangular silhouette
 * - Flat icy blue-gray (#B7C8D8 to #CFDEEB) with zero bevel, glow, or drop-shadow
 */

export const CustomVectorWordmark: React.FC<{ className?: string }> = ({ className = 'w-full max-w-5xl' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1000 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto object-contain"
      >
        <defs>
          {/* Subtle vertical tonal variation in icy blue-gray */}
          <linearGradient id="wordmarkGrad" x1="500" y1="0" x2="500" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B4C6D8" />
            <stop offset="50%" stopColor="#C0D2E2" />
            <stop offset="100%" stopColor="#D2E3F0" />
          </linearGradient>
        </defs>

        <g fill="url(#wordmarkGrad)">
          {/* ========================================================================= */}
          {/* LINE 1: WHERE (Y: 20 to 220, Height: 200, Total Width: ~820, Centered)    */}
          {/* ========================================================================= */}

          {/* 'W' (X: 100, Width: 180) - 3 Massive vertical stems + 2 deep top slots */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 100 28 C 100 23 104 20 109 20 L 145 20 C 150 20 154 23 154 28 L 154 165 L 168 165 L 168 28 C 168 23 172 20 177 20 L 203 20 C 208 20 212 23 212 28 L 212 165 L 226 165 L 226 28 C 226 23 230 20 235 20 L 271 20 C 276 20 280 23 280 28 L 280 212 C 280 217 276 220 271 220 L 109 220 C 104 220 100 217 100 212 Z"
          />

          {/* 'H' (X: 295, Width: 130) - 2 thick vertical pillars + thick crossbar */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 295 28 C 295 23 299 20 304 20 L 336 20 C 341 20 345 23 345 28 L 345 92 L 380 92 L 380 28 C 380 23 384 20 389 20 L 420 20 C 425 20 429 23 429 28 L 429 212 C 429 217 425 220 420 220 L 389 220 C 384 220 380 217 380 212 L 380 148 L 345 148 L 345 212 C 345 217 341 220 336 220 L 304 220 C 299 220 295 217 295 212 Z"
          />

          {/* 'E' (X: 444, Width: 125) - Heavy spine + 3 thick arms with 2 open rectangular slots */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 444 28 C 444 23 448 20 453 20 L 564 20 C 569 20 573 23 573 28 L 573 75 C 573 80 569 83 564 83 L 496 83 L 496 95 L 552 95 C 557 95 561 98 561 103 L 561 137 C 561 142 557 145 552 145 L 496 145 L 496 157 L 564 157 C 569 157 573 160 573 165 L 573 212 C 573 217 569 220 564 220 L 453 220 C 448 220 444 217 444 212 Z"
          />

          {/* 'R' (X: 588, Width: 145) - Thick spine + top loop with rectangular counter + heavy kick leg */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 588 28 C 588 23 592 20 597 20 L 712 20 C 725 20 733 28 733 41 L 733 107 C 733 118 726 125 715 127 L 733 212 C 733 217 729 220 724 220 L 684 220 C 680 220 676 217 675 213 L 658 135 L 638 135 L 638 212 C 638 217 634 220 629 220 L 597 220 C 592 220 588 217 588 212 Z M 638 72 L 678 72 C 683 72 686 75 686 80 L 686 85 C 686 90 683 93 678 93 L 638 93 Z"
          />

          {/* 'E' (X: 748, Width: 125) - Second E */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 748 28 C 748 23 752 20 757 20 L 868 20 C 873 20 877 23 877 28 L 877 75 C 877 80 873 83 868 83 L 800 83 L 800 95 L 856 95 C 861 95 865 98 865 103 L 865 137 C 865 142 861 145 856 145 L 800 145 L 800 157 L 868 157 C 873 157 877 160 877 165 L 877 212 C 877 217 873 220 868 220 L 757 220 C 752 220 748 217 748 212 Z"
          />

          {/* ========================================================================= */}
          {/* LINE 2: YOUR JOBS (Y: 240 to 440, Height: 200, Widest Line, Full Span)    */}
          {/* ========================================================================= */}

          {/* 'Y' (X: 50, Width: 105) - Heavy top diagonal arms with center vertical drop */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 50 248 C 50 243 54 240 59 240 L 92 240 C 97 240 101 243 103 247 L 103 318 L 103 318 L 103 247 C 105 243 109 240 114 240 L 147 240 C 152 240 156 243 156 248 L 156 325 C 156 345 145 358 130 363 L 130 432 C 130 437 126 440 121 440 L 85 440 C 80 440 76 437 76 432 L 76 363 C 61 358 50 345 50 325 Z M 92 312 L 114 312 L 114 285 L 92 285 Z"
          />

          {/* 'O' (X: 168, Width: 120) - Massive block rounded rect with rectangular center slot */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 168 252 C 168 244 174 240 182 240 L 274 240 C 282 240 288 244 288 252 L 288 428 C 288 436 282 440 274 440 L 182 440 C 174 440 168 436 168 428 Z M 218 298 L 238 298 C 242 298 245 301 245 305 L 245 375 C 245 379 242 382 238 382 L 218 382 C 214 382 211 379 211 375 L 211 305 C 211 301 214 298 218 298 Z"
          />

          {/* 'U' (X: 300, Width: 120) - Heavy U with deep slot cutout from top */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 300 248 C 300 243 304 240 309 240 L 341 240 C 346 240 350 243 350 248 L 350 376 L 370 376 L 370 248 C 370 243 374 240 379 240 L 411 240 C 416 240 420 243 420 248 L 420 428 C 420 436 414 440 406 440 L 314 440 C 306 440 300 436 300 428 Z"
          />

          {/* 'R' (X: 432, Width: 125) - Second R */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 432 248 C 432 243 436 240 441 240 L 536 240 C 548 240 557 248 557 261 L 557 327 C 557 338 550 345 539 347 L 557 432 C 557 437 553 440 548 440 L 508 440 C 504 440 500 437 499 433 L 482 355 L 472 355 L 472 432 C 472 437 468 440 463 440 L 441 440 C 436 440 432 437 432 432 Z M 472 292 L 508 292 C 513 292 516 295 516 300 L 516 305 C 516 310 513 313 508 313 L 472 313 Z"
          />

          {/* SPACE (Width: 40px) */}

          {/* 'J' (X: 600, Width: 105) - Vertical right pillar hooking into wide bottom foot */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 655 248 C 655 243 659 240 664 240 L 696 240 C 701 240 705 243 705 248 L 705 426 C 705 435 699 440 690 440 L 610 440 C 602 440 596 434 596 426 L 596 370 C 596 365 600 362 605 362 L 640 362 C 645 362 649 365 649 370 L 649 384 L 655 384 Z"
          />

          {/* 'O' (X: 717, Width: 115) - Third O */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 717 252 C 717 244 723 240 731 240 L 819 240 C 827 240 833 244 833 252 L 833 428 C 833 436 827 440 819 440 L 731 440 C 723 440 717 436 717 428 Z M 764 298 L 784 298 C 788 298 791 301 791 305 L 791 375 C 791 379 788 382 784 382 L 764 382 C 760 382 757 379 757 375 L 757 305 C 757 301 760 298 764 298 Z"
          />

          {/* 'B' (X: 845, Width: 120) - Double rectangular counter geometric B */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 845 248 C 845 243 849 240 854 240 L 945 240 C 957 240 965 247 965 258 L 965 318 C 965 328 958 335 948 337 C 959 339 967 347 967 358 L 967 422 C 967 433 958 440 945 440 L 854 440 C 849 440 845 437 845 432 Z M 890 286 L 918 286 C 923 286 926 289 926 294 L 926 302 C 926 307 923 310 918 310 L 890 310 Z M 890 360 L 920 360 C 925 360 928 363 928 368 L 928 386 C 928 391 925 394 920 394 L 890 394 Z"
          />

          {/* 'S' (X: 977, Width: 110, Adjusted to fit line 2 proportionally) */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 977 418 C 977 431 987 440 1000 440 L 1070 440 C 1083 440 1092 431 1092 418 L 1092 368 C 1092 355 1083 346 1070 346 L 1022 346 L 1022 300 L 1082 300 C 1087 300 1091 297 1091 292 L 1091 248 C 1091 243 1087 240 1082 240 L 1000 240 C 987 240 977 249 977 262 L 977 312 C 977 325 987 334 1000 334 L 1048 334 L 1048 380 L 987 380 C 982 380 978 383 978 388 Z"
            transform="translate(-108, 0)"
          />

          {/* ========================================================================= */}
          {/* LINE 3: LIVES (Y: 460 to 660, Height: 200, Centered)                     */}
          {/* ========================================================================= */}

          {/* 'L' (X: 180, Width: 120) - Vertical pillar with solid bottom arm */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 180 468 C 180 463 184 460 189 460 L 225 460 C 230 460 234 463 234 468 L 234 597 L 290 597 C 295 597 299 600 299 605 L 299 652 C 299 657 295 660 290 660 L 189 660 C 184 660 180 657 180 652 Z"
          />

          {/* 'I' (X: 312, Width: 60) - Solid monolithic pillar */}
          <path
            d="M 312 468 C 312 463 316 460 321 460 L 363 460 C 368 460 372 463 372 468 L 372 652 C 372 657 368 660 363 660 L 321 660 C 316 660 312 657 312 652 Z"
          />

          {/* 'V' (X: 384, Width: 145) - Modular deep downward chevron with center notch */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 384 468 C 384 463 388 460 393 460 L 434 460 C 439 460 443 463 445 468 L 457 580 L 457 580 L 469 468 C 471 463 475 460 480 460 L 521 460 C 526 460 530 463 530 468 L 488 652 C 486 657 481 660 476 660 L 438 660 C 433 660 428 657 426 652 Z"
          />

          {/* 'E' (X: 540, Width: 125) - Fourth E */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 540 468 C 540 463 544 460 549 460 L 660 460 C 665 460 669 463 669 468 L 669 515 C 669 520 665 523 660 523 L 592 523 L 592 535 L 648 535 C 653 535 657 538 657 543 L 657 577 C 657 582 653 585 648 585 L 592 585 L 592 597 L 660 597 C 665 597 669 600 669 605 L 669 652 C 669 657 665 660 660 660 L 549 660 C 544 660 540 657 540 652 Z"
          />

          {/* 'S' (X: 680, Width: 135) - Final S */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 680 638 C 680 651 690 660 703 660 L 790 660 C 803 660 812 651 812 638 L 812 588 C 812 575 803 566 790 566 L 734 566 L 734 520 L 802 520 C 807 520 811 517 811 512 L 811 468 C 811 463 807 460 802 460 L 703 460 C 690 460 680 469 680 482 L 680 532 C 680 545 690 554 703 554 L 758 554 L 758 600 L 690 600 C 685 600 681 603 681 608 Z"
          />
        </g>
      </svg>
    </div>
  );
};
