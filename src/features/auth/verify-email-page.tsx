import { parseApiError } from '@/api/errors'
import { verifyEmailAuthVerifyEmailGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { FormError } from '@/components/form-parts'
import { buttonVariants } from '@/components/ui/button'
import { ids } from '@/lib/photos'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import { AuthLayout } from './auth-layout'

const route = getRouteApi('/auth/verify-email')

function Result({ token }: { token: string | undefined }) {
  const { isPending, isSuccess, error } = useQuery({
    ...verifyEmailAuthVerifyEmailGetOptions({ query: { token: token ?? '' } }),
    enabled: !!token,
    retry: false,
  })

  if (token && isPending) {
    return <LoaderCircle className="text-primary size-12 animate-spin" aria-label="Đang xác nhận" />
  }
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <CircleCheck className="text-primary size-12" aria-hidden />
        <p className="text-lg font-medium">Email đã được xác nhận</p>
        <Link to="/login" className={buttonVariants({ className: 'h-11 px-4' })}>
          Đăng nhập
        </Link>
      </div>
    )
  }
  return (
    <FormError
      message={error ? parseApiError(error).message : 'Liên kết xác nhận email không hợp lệ.'}
    />
  )
}

export function VerifyEmailPage() {
  const { token } = route.useSearch()
  return (
    <AuthLayout
      title="Xác nhận email"
      hint="Nếu liên kết hết hạn, hãy yêu cầu gửi lại email xác nhận trong ứng dụng."
      headline="Một bước nữa là tài khoản của bạn sẵn sàng."
      photo={{ id: ids.bowl, alt: 'Tô cơm cá hồi, trứng và rau củ' }}
    >
      <Result token={token} />
    </AuthLayout>
  )
}
