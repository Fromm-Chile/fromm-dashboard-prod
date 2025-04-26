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
          className={`p-4 rounded-xl ${
            whiteButton
              ? "bg-white text-gray-400 hover:bg-red-500 hover:text-white"
              : "bg-red-500 text-white hover:bg-white hover:text-red-500"
          } text-lg border-2 hover:border-2 hover:border-red-500 transition-color ease-in-out duration-500 ${className}`}
        >
          {children}
        </div>
      </Link>
    </div>
  );
};
