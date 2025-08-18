import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SignIn Dashboard | RailNova"
        description="This is SignIn Dashboard page for RailNova"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
