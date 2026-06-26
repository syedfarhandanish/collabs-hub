'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({ value, suffix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}