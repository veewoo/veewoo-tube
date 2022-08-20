import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ImYoutube, ImShare } from "react-icons/im";
import Link from "next/link";

function Header() {
  const { data, status } = useSession();

  const {
    isSubmitting,
    values,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
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
          const code = response?.error;

          switch (code) {
            case "USER_NOT_FOUND":
              toast.error("User not found");
              break;

            case "INVALID_PASSWORD":
              toast.error("Invalid password");
              break;

            default:
              toast.error("An error occurred");
              break;
          }
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/">
          <a className="inline-flex items-center text-4xl">
            <ImYoutube className="mr-2 text-red-600" size={48} />
            VeewooTube
          </a>
        </Link>
        <div className="flex">
          {status !== "loading" &&
            (status == "authenticated" && data ? (
              <div className="flex divide-x-2">
                <Link href="/share">
                  <a className="mr-4 flex items-center border-2 border-black py-2 px-4 text-black hover:bg-black hover:text-white">
                    <ImShare className="mr-2" size={24} /> Share
                  </a>
                </Link>
                <div className="pl-4">
                  <p className="mr-4">Hello {data.user?.email}</p>
                  <button className="text-red-400" onClick={() => signOut()}>
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form className="flex" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      className="mr-4 rounded border border-gray-300 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-white"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <p className="absolute left-1 bottom-[-18px] text-sm text-red-500">
                      {errors.email}
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      className="rounded border border-gray-300 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-white"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <p className="absolute left-1 bottom-[-18px] whitespace-nowrap text-sm text-red-500">
                      {errors.password}
                    </p>
                  </div>
                  <button
                    className="ml-4 rounded border border-blue-600 px-5 py-1 text-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </form>
                <Link href="/sign-up">
                  <a
                    className="ml-4 rounded bg-green-600 px-5 py-1 text-white hover:bg-green-500"
                    type="submit"
                  >
                    Sign up
                  </a>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
