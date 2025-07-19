import { AnimatePresence, motion } from 'framer-motion'

interface PropsTypes {
  children: JSX.Element | string
  duration?: number | undefined
  initialDelay?: number | undefined
  is: boolean
}

export default function Fade({ children, duration = 0.3, initialDelay = 0, is }: PropsTypes) {
  const variants = {
    exit: { opacity: 0, transition: { duration } },
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: initialDelay
      }
    }
  }

  return (
    <AnimatePresence>
      {is && (
        <motion.div
          animate="visible"
          exit="exit"
          // initial="hidden"
          // initial={{ opacity: 0, transition: { delay: 0.5 } }}
          initial="hidden"
          variants={variants}
          // transition={{ duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
