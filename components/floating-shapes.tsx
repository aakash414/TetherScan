"use client"

import { motion } from "framer-motion"

const shapes = [
  {
    id: 1,
    style: "w-24 h-24 rounded-full bg-[#006D77]/10",
    initial: { x: "-10vw", y: "20vh", scale: 0.8 },
    animate: { x: "10vw", y: "-20vh", scale: 1.2 },
    transition: { duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
  {
    id: 2,
    style: "w-32 h-32 rounded-xl bg-[#83C5BE]/10",
    initial: { x: "80vw", y: "10vh", rotate: 45 },
    animate: { x: "60vw", y: "50vh", rotate: 0 },
    transition: { duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
  {
    id: 3,
    style: "w-16 h-16 rounded-lg bg-[#E29578]/10",
    initial: { x: "5vw", y: "70vh", scale: 1.1 },
    animate: { x: "25vw", y: "50vh", scale: 0.9 },
    transition: { duration: 28, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
  {
    id: 4,
    style: "w-40 h-40 rounded-full bg-[#FFDDD2]/10",
    initial: { x: "90vw", y: "80vh", scale: 1 },
    animate: { x: "70vw", y: "60vh", scale: 1.3 },
    transition: { duration: 35, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
] as const

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.style}`}
          initial={shape.initial}
          animate={shape.animate}
          transition={shape.transition}
        />
      ))}
    </div>
  )
}
