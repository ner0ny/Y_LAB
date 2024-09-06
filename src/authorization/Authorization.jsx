import { useEffect, useState } from "react";
import "./Authorization.css";
import LoginValidation from "./LoginValidation";

const mockFetch = (url, options) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "/auth" && options.method === "POST") {
        const values = JSON.parse(options.body);
        if (
          values.email === "test@gmail.com" &&
          values.password === "12345678"
        ) {
          resolve({
            ok: true,
            json: () =>
              Promise.resolve({ message: "Authentication successful" }),
          });
        } else {
          reject(new Error("The email address or password is incorrect"));
        }
      } else {
        reject(new Error("Failed to authenticate"));
      }
    }, 1000);
  });
};

const Authorization = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({});

  const [authError, setAuthError] = useState("");

  const handleLoginInput = (e) => {
    setLoginValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    setLoginErrors(LoginValidation(loginValues));
  };

  useEffect(() => {
    if (loginErrors.email === "" && loginErrors.password === "") {
      setIsLoading(true);

      mockFetch("/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginValues.email,
          password: loginValues.password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          setAuthError(error);
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [loginErrors]);

  return (
    <section className="authorization">
      <div className="authorization__container">
        <h1 className="authorization__title">Авторизация</h1>

        <form
          className="authorization__form"
          onSubmit={handleLoginSubmit}
          noValidate
        >
          <div className="authorization__group">
            <input
              className="authorization__input"
              onChange={handleLoginInput}
              name="email"
              type="email"
              placeholder="Почта"
            />
            <p className="authorization__error">
              {loginErrors.email && <span>{loginErrors.email}</span>}
            </p>
          </div>
          <div className="authorization__group">
            <input
              className="authorization__input"
              onChange={handleLoginInput}
              name="password"
              type="password"
              placeholder="Пароль"
            />
            <p className="authorization__error">
              {loginErrors.password && <span>{loginErrors.password}</span>}
            </p>
          </div>
          <p className="authorization__error">
            {authError && <span>{authError.toString()}</span>}
          </p>
          <button className="authorization__button" type="submit">
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Authorization;
