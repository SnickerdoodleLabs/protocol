/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface ICarouselProps {
  visibleItemCount?: number;
  children: React.ReactNode;
  gutter?: number;
}
export const Carousel: FC<ICarouselProps> = ({
  children,
  visibleItemCount = 2,
  gutter = 20,
}: ICarouselProps) => {
  const childrenArray = React.Children.toArray(children).map((item) =>
    React.cloneElement(item as React.ReactElement, {
      draggable: false,
      style: {
        ...((item as React.ReactElement).props.style || {}),
        width: "100%",
      },
    }),
  );
  const totalItems = childrenArray.length;

  const xValue = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isDragging = React.useRef(false);
  const activeIndexRef = React.useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [constraint, setConstraint] = useState(0);

  const handlePrev = () => {
    if (totalItems && activeIndexRef.current === 0) return;
    const newIndex = activeIndexRef.current - 1;
    navigateTo(newIndex);
  };
  const handleNext = () => {
    if (totalItems && activeIndexRef.current === totalItems - 1) return;
    const newIndex = activeIndexRef.current + 1;
    navigateTo(newIndex);
  };

  const debounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number,
  ) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise((resolve) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const result = func(...args);
          resolve(result);
        }, delay);
      });
  };
  const navigateTo = (index: number) => {
    const itemWidth =
      ((containerRef.current?.offsetWidth ?? 0) + gutter) / visibleItemCount;
    animate(xValue, -index * itemWidth, { duration: 0.25 });
    setActiveIndex(index);
  };

  useEffect(() => {
    if (activeIndex === activeIndexRef.current) return;
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const debouncedCalcConstraint = debounce(() => {
      const itemWidth =
        ((containerRef.current?.offsetWidth ?? 0) + gutter) / visibleItemCount;
      setConstraint(itemWidth * (totalItems - 1));
    }, 300);

    const handleResize = () => {
      debouncedCalcConstraint();
      const itemWidth =
        ((containerRef.current?.offsetWidth ?? 0) + gutter) / visibleItemCount;
      xValue.set(-activeIndexRef.current * itemWidth);
    };

    debouncedCalcConstraint();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleChildClick = (event: MouseEvent) => {
      if (isDragging.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    container.addEventListener("click", handleChildClick);

    return () => {
      container.removeEventListener("click", handleChildClick);
    };
  }, [containerRef]);

  const handleDragEnd = () => {
    isDragging.current = false;
    const itemWidth =
      (containerRef?.current?.offsetWidth ?? 0) / visibleItemCount +
      gutter / visibleItemCount;
    const snapIndex = Math.round(Math.abs(xValue.get() / (itemWidth || 1)));
    if (activeIndexRef.current !== snapIndex) {
      setActiveIndex(snapIndex);
      animate(xValue, -snapIndex * itemWidth, { duration: 0.3 });
    } else {
      animate(xValue, -snapIndex * itemWidth, { duration: 0.3 });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ overflow: "hidden" }}>
        <motion.div
          drag="x"
          style={{
            x: xValue,
            display: "flex",
            overflow: "display",
            marginLeft: -gutter / 2,
            marginRight: -gutter / 2,
          }}
          dragConstraints={{ right: 0, left: -constraint }}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={handleDragEnd}
          dragElastic={0}
          dragMomentum={false}
        >
          {childrenArray.map((item, index) => {
            return (
              <div
                style={{
                  width: `calc(${100 / visibleItemCount}% - ${gutter}px)`,
                  flexShrink: 0,
                  display: "flex",
                  marginLeft: gutter / 2,
                  marginRight: gutter / 2,
                }}
                key={index}
              >
                {item}
              </div>
            );
          })}
        </motion.div>
      </div>
      {activeIndex != 0 && (
        <motion.div
          {...animationProperties}
          style={{
            ...navButtonStyle,
            left: -10,
            background:
              "linear-gradient(to right, #dddddd80, #dddddd50, #dddddd10)",
          }}
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </motion.div>
      )}
      {totalItems > 0 && activeIndex !== totalItems - 1 && (
        <motion.div
          {...animationProperties}
          style={{
            ...navButtonStyle,
            right: -10,
            background:
              "linear-gradient(to left,  #dddddd, #dddddd80, #dddddd40)",
          }}
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

const navButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: `translateY(-50%)`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
};

const animationProperties = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    type: "linear",
    duration: 0.4,
  },
};
