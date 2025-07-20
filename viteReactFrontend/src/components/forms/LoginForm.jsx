import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../../store/apiSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux"; // ✅ new
import { setCredentials } from "../../store/authSlice"; // ✅ new
import { useNavigate } from "react-router-dom"; // ✅ optional redirect

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch(); // ✅ setup dispatch
  const navigate = useNavigate(); // ✅ optional for redirect

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();

      // ✅ Set the user and token in Redux
      dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));

      alert("Logged in!");
      navigate("/users/current-user"); // ✅ redirect after login
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register("email")} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register("password")} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
