import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonProps = PropsWithChildren<{
  link: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  className?: string;
  whiteButton?: boolean;
}>;

export const Button = ({
  children,
  link,
  onClick,
  className,
  whiteButton,
}: ButtonProps) => {
  return (
    <div className="w-fit m-auto">
      <Link to={link} onClick={onClick}>
        <div
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${
            whiteButton
              ? "border border-border bg-background text-foreground hover:border-red-500 hover:text-red-500 hover:bg-red-500/5"
              : "bg-red-500 text-white hover:bg-red-600 shadow-sm"
          } transition-all ease-in-out duration-200 ${className}`}
        >
          {children}
        </div>
      </Link>
    </div>
  );
};
