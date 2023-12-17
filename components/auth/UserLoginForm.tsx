'use client'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'
import {
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
} from '../../app/auth/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/signin-credentials-validator'
import { Icons } from '../Icons'
import OAuthForm from './OAuthForm'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  function onSubmit(data: TAuthCredentialsValidator) {
    setIsLoading(async () => {
      const result = await signInWithEmailAndPassword(data)
      const { error } = JSON.parse(result)

      if (error?.message) {
        toast.error(error.message)
      } else {
        toast.success('successfuly Login')
      }
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email')}
              className={cn({ 'focus-visible:ring-red-500': errors.email })}
              id="email"
              placeholder="you@example.com"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-1 py-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register('password')}
              className={cn({ 'focus-visible:ring-red-500': errors.password })}
              id="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <OAuthForm />
    </div>
  )
}
