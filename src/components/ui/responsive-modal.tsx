import { AnimatePresence, MotionConfig, Variants } from "motion/react";
import { MotionModal, MotionModalOverlay } from "../motion-component-wrappers";
import { twMerge as cn } from "tailwind-merge";
import { ReactNode } from "react";
import { Dialog } from "react-aria-components";

type ResponsiveModalProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  children: ReactNode;
};

function ResponsiveModal({ open, setOpen, children }: ResponsiveModalProps) {
  const overlayVariants: Variants = {
    closed: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      backdropFilter: "blur(0px)",
    },
    open: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(2px)",
    },
  };

  const modalVariants: Variants = {
    closed: {
      opacity: 0,
      scale: "var(--scale-from, 1)",
      transition: {
        duration: 0.1,
      },
    },
    open: {
      opacity: 1,
      scale: "var(--scale-to, 1)",
    },
  };

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
      <AnimatePresence>
        {open && (
          <MotionModalOverlay
            isOpen
            onOpenChange={setOpen}
            isDismissable
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center",
              // we use CSS variables to change animation values based on media queries
              "sm:[--scale-from:95%] sm:[--scale-to:100%]",
            )}
          >
            <MotionModal
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "bg-card overflow-y-scroll",
                "sm:max-w-lg sm:min-w-96 sm:rounded-lg sm:border sm:shadow-lg",
                "max-sm:h-[calc(var(--visual-viewport-height))] max-sm:w-full",
              )}
            >
              <Dialog className="outline-none">{children}</Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

export { ResponsiveModal };
