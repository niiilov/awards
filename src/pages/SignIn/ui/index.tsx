import { SignInForm } from "@features/auth/sign-in";

export const SignIn = () => {
  return (
    <div className="h-screen -mt-22 sm:mt-0 flex justify-center w-full items-center">
      <SignInForm />
    </div>
  );
};
