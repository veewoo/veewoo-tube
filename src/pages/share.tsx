import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ReactElement, useId } from "react";
import { toast } from "react-toastify";
import Layout from "src/components/Layout";
import youtubeService from "src/services/youtubeService";
import { NextPageWithLayout } from "src/types/core";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({
  url: z.string().url(),
});

const SignUp: NextPageWithLayout = () => {
  const autoId = useId();
  const addVideoMutation = trpc.useMutation("video.add", {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { values, errors, handleSubmit, handleBlur, handleChange } = useFormik({
    validationSchema: toFormikValidationSchema(validationSchema),
    initialValues: {
      url: "",
    },
    onSubmit: async ({ url }) => {
      try {
        youtubeService.getVideoInfo(url);
        addVideoMutation.mutate({ url });
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
    <div className="flex h-screen w-screen items-center justify-center">
      <form className="mx-auto flex w-96 flex-col" onSubmit={handleSubmit}>
        <label className="mr-2 mb-1" htmlFor={autoId + "url"}>
          Url:{" "}
        </label>
        <input
          id={autoId + "url"}
          className="rounded border border-gray-300 py-1 px-2 text-gray-900"
          type="text"
          name="url"
          value={values.url}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {errors.url && <p className="text-red-500">{errors.url}</p>}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="mr-4 rounded bg-green-600 px-5 py-1 text-white hover:bg-green-500"
          >
            Share
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

SignUp.getLayout = (page: ReactElement) => <Layout hasHeader>{page}</Layout>;
export default SignUp;
