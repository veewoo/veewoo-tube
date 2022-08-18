import axios, { AxiosError } from "axios";
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

const validationSchema = z.object({
  url: z.string().url(),
});

const SignUp: NextPageWithLayout = () => {
  const autoId = useId();
  const signUpMutation = trpc.useMutation("auth.signUp", {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { values, errors, isValid, handleSubmit, handleBlur, handleChange } =
    useFormik({
      validationSchema: toFormikValidationSchema(validationSchema),
      initialValues: {
        url: "",
      },
      onSubmit: async ({ url }) => {
        try {
          console.log({ url });
          const response = await axios.get(
            `https://www.youtube.com/oembed?url=${url}&format=json`
          );

          console.log({ response });
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status == 404) {
            toast.error("Invalid URL");
          } else {
            toast.error((error as Error).message);
          }
        }
      },
    });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form className="flex flex-col w-96 mx-auto" onSubmit={handleSubmit}>
        <label className="mr-2 mb-1" htmlFor={autoId + "url"}>Url: </label>
        <input
          id={autoId + "url"}
          className="border border-gray-300 rounded py-1 px-2 text-gray-900"
          type="text"
          name="url"
          value={values.url}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.url && <p className="text-red-500">{errors.url}</p>}
        <div className="flex justify-center mt-4">
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white rounded px-5 py-1 mr-4">Share</button>
        <Link href="/">
        <a type="submit" className="bg-red-600 hover:bg-red-500 text-white rounded px-5 py-1">Back</a>
        </Link>
        </div>
      </form>
    </div>
  );
};

SignUp.getLayout = (page: ReactElement) => <Layout hasHeader>{page}</Layout>;
export default SignUp;
