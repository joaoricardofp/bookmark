import AuthLayout from '@/layout/auth-layout';
import { Link } from '@/components/ui/typography';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description={
        <>
          Don't have an account? <Link href="/register">Sign up</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
