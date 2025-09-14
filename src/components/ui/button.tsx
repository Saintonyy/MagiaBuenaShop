import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-glass text-sm font-medium ring-offset-background transition-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95",
        outline: "border border-glass-border/30 bg-glass/20 backdrop-blur-subtle text-foreground hover:bg-glass/40 hover:border-primary/40 hover:scale-105 hover:shadow-glass active:scale-95",
        secondary: "bg-gradient-glass backdrop-blur-glass border border-glass-border/30 text-foreground hover:bg-glass/60 hover:border-primary/30 hover:scale-105 hover:shadow-glass active:scale-95",
        ghost: "hover:bg-glass/30 hover:backdrop-blur-subtle hover:scale-105 text-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        glass: "bg-gradient-primary backdrop-blur-glass border border-primary/40 text-primary-foreground hover:shadow-glow hover:scale-110 hover:border-primary/60 active:scale-95 glass-shine-effect",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
