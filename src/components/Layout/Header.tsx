import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect } from "react";

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
    <header className="flex p-4">
      {status == "authenticated" && data ? (
        <div>
          <span className="mr-4">Hello {data.user?.email}</span>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="mr-2">User name: </label>
          <input
            className="mr-4"
            type="email"
            name="email"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <label className="mr-2">Password: </label>
          <input
            type="password"
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <button type="submit" className="ml-4">
            Login
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;
