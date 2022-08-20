import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ReactElement, useId } from "react";
import { toast } from "react-toastify";
import Layout from "src/components/Layout";
import { NextPageWithLayout } from "src/types/core";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Router from "next/router";

const validationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be 6 characters or more."),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

const SignUp: NextPageWithLayout = () => {
  const autoId = useId();
  const signUpMutation = trpc.useMutation("auth.signUp", {
    onSuccess(data) {
      if (data.error) {
        toast.error(data.error);
      } else {
        Router.push("/");
      }
    },
    onError() {
      toast.error("An error occurred");
    },
  });

  const { values, errors, handleSubmit, handleBlur, handleChange } = useFormik({
    validationSchema: toFormikValidationSchema(validationSchema),
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ email, password }) => {
      signUpMutation.mutate({
        email,
        password,
      });
    },
  });

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form className="mx-auto flex w-96 flex-col" onSubmit={handleSubmit}>
        <label className="mr-2 mb-1" htmlFor={autoId + "email"}>
          Email:{" "}
        </label>
        <input
          id={autoId + "email"}
          className="rounded border border-gray-300 py-1 px-2 text-gray-900"
          type="email"
          name="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <label className="mr-2 mb-1 mt-4" htmlFor={autoId + "password"}>
          Password:{" "}
        </label>
        <input
          id={autoId + "password"}
          className="rounded border border-gray-300 py-1 px-2 text-gray-900"
          type="password"
          name="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <label className="mr-2 mb-1 mt-4" htmlFor={autoId + "confirmPassword"}>
          Confirm Password:{" "}
        </label>
        <input
          id={autoId + "confirmPassword"}
          className="rounded border border-gray-300 py-1 px-2 text-gray-900"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="mr-4 rounded bg-green-600 px-5 py-1 text-white hover:bg-green-500"
          >
            Sign up
          </button>
          <Link href="/">
            <a
              type="submit"
              className="rounded bg-red-600 px-5 py-1 text-white hover:bg-red-500"
            >
              Back
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

SignUp.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SignUp;
