import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from '@/components/Icons'
import NavItems from './NavItems'
import MobileNav from './MobileNav'
import { UserNav } from './UserNav'
import readUserSession from '@/lib/actions'

const Navbar = async () => {
  const { data } = await readUserSession()
  if (data.session) {
    return (
      <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
        <header className="relative bg-white">
          <MaxWidthWrapper>
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center">
                <MobileNav />

                <div className="ml-4 flex lg:ml-0">
                  <Link href="/">
                    <Icons.logo className="h-7 w-7" />
                  </Link>
                </div>

                <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                  <NavItems />
                </div>

                <div className="ml-auto flex items-center">
                  <UserNav />
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </header>
      </div>
    )
  }
}

export default Navbar
