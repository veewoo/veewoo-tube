import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { ImYoutube, ImShare } from "react-icons/im";
import Link from "next/link";

function Header() {
  const { data, status } = useSession();

  const { values, handleSubmit, handleBlur, handleChange } = useFormik({
    validationSchema: toFormikValidationSchema(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be 6 characters or more."),
      })
    ),
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ email, password }) => {
      try {
        const response = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (!response?.ok) {
          console.log({ response: response?.error });
          toast.error(response?.error);
        }

        const session = await getSession();
        console.log({ session });
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  useEffect(() => {
    console.log({ status, data });
  }, [status, data]);

  return (
    <header className="border-b fixed top-0 w-full">
      <div className="container mx-auto flex items-center justify-between p-4">
      <Link href="/">
        <a className="inline-flex items-center text-4xl">
          <ImYoutube className="text-red-600 mr-2" size={48} />
          VeewooTube
        </a>
      </Link>
        <div className="flex">
      {status == "authenticated" && data ? (
        <div className="flex divide-x-2">
          <Link href="/share">
          <a className="border-2 border-black text-black hover:bg-black hover:text-white mr-4 py-2 px-4 flex items-center">
            <ImShare className="mr-2" size={24} /> Share
            </a>
            </Link>
          <div className="pl-4">
            <p className="mr-4">Hello {data.user?.email}</p>
            <button className="text-red-400" onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
      ) : (
        <>
        <form onSubmit={handleSubmit}>
          <label className="mr-2">User name: </label>
          <input
            className="border border-gray-300 bg-white mr-4 px-2 py-1 rounded"
            type="email"
            name="email"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <label className="mr-2">Password: </label>
          <input
            className="border border-gray-300 bg-white px-2 py-1 rounded"
            type="password"
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded ml-4 px-5 py-1" type="submit" >
            Login
          </button>
        </form>
        <Link href="/sign-up">
         <a className="bg-green-600 hover:bg-green-500 text-white rounded ml-4 px-5 py-1" type="submit" >
         Sign up
       </a>
       </Link>
       </>
      )}
        </div>
        </div>
    </header>
  );
}

export default Header;
