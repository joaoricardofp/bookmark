import AuthLayout from '@/layout/auth-layout';
import { Link } from '@/components/ui/typography';
import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description={
        <>
          Already have an account? <Link href="/login">Sign in</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
