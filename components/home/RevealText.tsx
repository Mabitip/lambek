"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StatsCounter({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-border/60 bg-card/50 p-8 text-center shadow-sm backdrop-blur-sm"
    >
      <p className="font-serif text-3xl uppercase tracking-wider text-primary md:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-foreground/60">{label}</p>
    </motion.div>
  );
}
