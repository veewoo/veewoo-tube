import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { ReactElement } from "react";
import { toast } from "react-toastify";
import Layout from "src/components/Layout";
import { NextPageWithLayout } from "src/types/core";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const SignUp: NextPageWithLayout = () => {
  const signUpMutation = trpc.useMutation("auth.signUp", {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { values, errors, handleSubmit, handleBlur, handleChange } = useFormik({
    validationSchema: toFormikValidationSchema(
      z
        .object({
          email: z.string().email("Invalid email address"),
          password: z.string().min(6, "Password must be 6 characters or more."),
          confirmPassword: z.string(),
        })
        .refine(
          ({ password, confirmPassword }) => password === confirmPassword,
          {
            message: "Passwords must match.",
            path: ["confirmPassword"],
          }
        )
    ),
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ email, password }) => {
      try {
        signUpMutation.mutate({
          email,
          password,
        });
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className="mr-2">Email: </label>
        <input
          className="border"
          type="email"
          name="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <label className="mr-2">Password: </label>
        <input
          className="border"
          type="password"
          name="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <label className="mr-2">Confirm Password: </label>
        <input
          className="border"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
        <button className="ml-4">Sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
