'use client'
import { marketingConfig } from '@/config/marketing'
import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NavItems = () => {
  const path = usePathname()

  return (
    <div className="flex gap-1.5 h-full items-center justify-center">
      {marketingConfig.mainNav.map((item) => (
        <Button
          asChild
          variant={'link'}
          key={item.title}
          className={cn(
            'text-neutral-600',
            path === item.href ? 'text-neutral-900' : 'text-neutral-600'
          )}
        >
          <Link href={item.href}>{item.title}</Link>
        </Button>
        // Replace 'link-class-name' with your desired class for styling
      ))}
    </div>
  )
}

export default NavItems
