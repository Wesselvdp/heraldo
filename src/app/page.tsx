import CredentialsForm from "@/components/CredentialsForm";
import { login } from "@/actions";
export default async function Home() {
  return (
    <div className="flex justify-center items-center w-full h-[100vh] flex-col text-center">
      <h3 className="text-2xl bold mb-2">Welcome stranger</h3>
      <CredentialsForm login={login} />
    </div>
  );
}
