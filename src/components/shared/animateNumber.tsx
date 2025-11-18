"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedNumber = ({
  value,
  duration = 1.2,
}: {
  value: number;
  duration?: number;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop; // cleanup
  }, [value, duration, count]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedNumber;
