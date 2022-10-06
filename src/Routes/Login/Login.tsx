import { ReactComponent as Logo } from "@/assets/logo.svg";

export default function Login() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      <Logo className="w-[200px]" />
      <div className="mt-12 flex flex-col">
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered input-primary w-full max-w-md"
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-4 input input-bordered input-primary w-full max-w-md"
        />
        <div className="mt-8 flex w-full">
          <button className="btn btn-primary w-full">Button</button>
        </div>
      </div>
    </div>
  );
}
