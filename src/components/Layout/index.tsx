import { ReactNode } from "react";
import Header from "./Header";

type Props = {
  hasHeader?: boolean;
  children: ReactNode;
};

function Layout({ hasHeader, children }: Props) {
  return (
    <div className=" text-black">
      {hasHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
