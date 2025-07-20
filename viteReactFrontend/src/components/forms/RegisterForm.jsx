import { useForm } from "react-hook-form";
import { useRegisterUserMutation } from "../../store/apiSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function RegisterForm() {
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data) => {
  try {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("fullName", data.fullName);
    formData.append("password", data.password);

    if (data.avatar[0]) formData.append("avatar", data.avatar[0]);
    if (data.CoverImage[0]) formData.append("coverImage", data.CoverImage[0]);

    await registerUser(formData).unwrap();
    alert("Registered successfully!");
    reset();
  } catch (err) {
    console.error(err);
    alert("Registration failed");
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input {...register("username")} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register("email")} />
      </div>
       <div>
        <Label htmlFor="fullName">Fullname</Label>
        <Input {...register("fullName")} />
      </div>
       <div>
        <Label htmlFor="avatar">Avatar</Label>
        <Input type="file" {...register("avatar")} />
      </div>
       <div>
              <Label htmlFor="coverImage">CoverImage</Label>
              <Input type="file" {...register("CoverImage")} />
            </div>
      
         <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register("password")} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
