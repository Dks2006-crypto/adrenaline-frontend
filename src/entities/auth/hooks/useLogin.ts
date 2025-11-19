// features/auth/hooks/useLogin.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      toast.success("Добро пожаловать!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Ошибка входа");
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isLoading: form.formState.isSubmitting };
};