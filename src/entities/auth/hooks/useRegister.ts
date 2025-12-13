// features/auth/hooks/useRegister.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const registerUser = useAuthStore((s) => s.register);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      toast.success("Аккаунт успешно создан!");

      router.push("/dashboard");
      
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Ошибка регистрации");
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isLoading: form.formState.isSubmitting };
};