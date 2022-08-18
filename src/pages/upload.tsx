import axios, { AxiosError } from "axios";
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

const validationSchema = z.object({
  url: z.string().url(),
});

const SignUp: NextPageWithLayout = () => {
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
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className="mr-2">Url: </label>
        <input
          className="border"
          type="text"
          name="url"
          value={values.url}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.url && <p className="text-red-500">{errors.url}</p>}
        <button className="mt-2" type="submit" disabled={!isValid}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default SignUp;
