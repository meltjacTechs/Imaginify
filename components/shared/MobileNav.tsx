import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
  

const MobileNav = () => {
  return (
   <header className="header">
    <Link href="/" className="flex item-center gap-2 md:py-2">
      <Image
        src='/assets/images/logo-text.svg'
        alt='logo'
        width={180}
        height={28}
       />
    </Link>

    <nav className="flex gap-2">
        <SignedIn>
            <UserButton afterSignOutUrl="/" />
        </SignedIn>
    </nav>
   </header>
  );
}

export default MobileNav;
