import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn("animate-spin rounded-full border-4 border-t-blue-600 border-gray-200", className)}
      {...props}
    />
  );
};