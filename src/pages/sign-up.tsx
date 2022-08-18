import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ReactElement, useId } from "react";
import { toast } from "react-toastify";
import Layout from "src/components/Layout";
import { NextPageWithLayout } from "src/types/core";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const SignUp: NextPageWithLayout = () => {
  const autoId = useId();
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
    <div className="w-screen h-screen flex items-center justify-center">
      <form className="flex flex-col w-96 mx-auto" onSubmit={handleSubmit}>
        <label className="mr-2 mb-1" htmlFor={autoId + "email"}>Email: </label>
        <input
          id={autoId + "email"}
          className="border border-gray-300 rounded py-1 px-2 text-gray-900"
          type="email"
          name="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <label className="mr-2 mb-1 mt-4" htmlFor={autoId + "password"}>Password: </label>
        <input
          id={autoId + "password"}
          className="border border-gray-300 rounded py-1 px-2 text-gray-900"
          type="password"
          name="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <label className="mr-2 mb-1 mt-4" htmlFor={autoId + "confirmPassword"}>Confirm Password: </label>
        <input
          id={autoId + "confirmPassword"}
          className="border border-gray-300 rounded py-1 px-2 text-gray-900"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
        <div className="flex justify-center mt-4">
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white rounded px-5 py-1 mr-4">Sign up</button>
        <Link href="/">
        <a type="submit" className="bg-red-600 hover:bg-red-500 text-white rounded px-5 py-1">Back</a>
        </Link>
        </div>
      </form>
    </div>
  );
};

SignUp.getLayout = (page: ReactElement) => <Layout >{page}</Layout>;
export default SignUp;
