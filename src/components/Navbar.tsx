import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";
type Props = {};

const Navbar = async(props: Props) => {
    const session = await getAuthSession()
    return (
        <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
            <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
              <Link href="/" className="items-center hidden gap-2 sm:flex">
                    <p className="rounded-lg border-2 border-b-4 border-r-4 border-blue px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
                        SmartLearnX
                    </p>
              </Link>
              <div className="flex items-center">
                  {session?.user && (
                    <>
                        <Link href="/dashboard" className="mr-3">
                            Dashboard
                        </Link>
                        <Link href="/create" className="mr-3">
                            Create Course
                        </Link>
                    </>
                  )}
                  <ThemeToggle className="mr-3"  />
                  <div className="flex items-center">
                  {session?.user ? <UserAccountNav user={session.user} /> : <SignInButton/>}
                  </div>
                    
                    
              </div>
            </div>
        </nav>

    );
};

export default Navbar;