import { useForm } from "react-hook-form";
import { useUpdateAccountMutation } from "../../store/apiSlice";
import { useDispatch } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { setCredentials } from "../../store/authSlice";

export default function AccountForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  const onSubmit = async (data) => {
    try {
      const response = await updateAccount(data).unwrap();
      dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
      alert("Account updated");
      reset();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update account");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...register("fullName")} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Account"}
      </Button>
    </form>
  );
}
