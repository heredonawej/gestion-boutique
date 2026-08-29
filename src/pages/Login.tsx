import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStore,
  FaArrowRight,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [chargement, setChargement] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !motDePasse) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setChargement(true);

      const data = await login(
        email,
        motDePasse
      );

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "utilisateur",
          JSON.stringify(data.utilisateur)
        );

        navigate("/dashboard");

      } else {

        alert(
          data.message ||
          "Identifiants incorrects."
        );

      }

    } catch (error) {

      console.error(
        "Erreur connexion :",
        error
      );

      alert(
        "Impossible de contacter le serveur."
      );

    } finally {

      setChargement(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center p-6">

      {/* Effets lumineux */}

      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Conteneur principal */}

      <div className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

        <div className="grid md:grid-cols-2">

          {/* ================================= */}
          {/* PARTIE GAUCHE */}
          {/* ================================= */}

          <div className="hidden md:flex flex-col justify-center p-12 text-white">

            {/* Logo */}

            <div className="mb-10">

              <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">

                <FaStore className="text-4xl text-blue-300" />

              </div>

            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">

              Gestion
              <br />

              <span className="text-blue-300">
                Boutique
              </span>

            </h1>

            <p className="text-lg text-blue-100/80 max-w-md leading-relaxed">

              Gérez facilement vos produits,
              vos ventes, vos commandes et
              votre stock depuis une seule
              plateforme.

            </p>

            {/* Petites informations */}

            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3 text-blue-100">

                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  📦
                </div>

                Gestion des produits

              </div>

              <div className="flex items-center gap-3 text-blue-100">

                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  🛒
                </div>

                Gestion des ventes

              </div>

              <div className="flex items-center gap-3 text-blue-100">

                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  📊
                </div>

                Suivi de votre activité

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* PARTIE DROITE : CONNEXION */}
          {/* ================================= */}

          <div className="bg-white p-8 sm:p-12">

            {/* Logo mobile */}

            <div className="md:hidden flex justify-center mb-6">

              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">

                <FaStore className="text-3xl text-white" />

              </div>

            </div>

            {/* Titre */}

            <div className="mb-8">

              <p className="text-blue-600 font-semibold text-sm mb-2">
                ESPACE PROFESSIONNEL
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                Bienvenue
              </h2>

              <p className="text-gray-500 mt-2">
                Connectez-vous pour accéder à votre espace.
              </p>

            </div>

            {/* Formulaire */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse e-mail
                </label>

                <div className="relative">

                  <FaEnvelope
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    className="
                      w-full
                      border
                      border-gray-200
                      bg-gray-50
                      rounded-xl
                      py-3.5
                      pl-11
                      pr-4
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* Mot de passe */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>

                <div className="relative">

                  <FaLock
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type={
                      voirMotDePasse
                        ? "text"
                        : "password"
                    }
                    placeholder="Votre mot de passe"
                    className="
                      w-full
                      border
                      border-gray-200
                      bg-gray-50
                      rounded-xl
                      py-3.5
                      pl-11
                      pr-12
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                    value={motDePasse}
                    onChange={(e) =>
                      setMotDePasse(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setVoirMotDePasse(
                        !voirMotDePasse
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-blue-600
                    "
                  >

                    {voirMotDePasse ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>

                </div>

              </div>

              {/* Connexion */}

              <button
                type="submit"
                disabled={chargement}
                className="
                  w-full
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  hover:from-blue-700
                  hover:to-indigo-700
                  text-white
                  py-4
                  rounded-xl
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-3
                  shadow-lg
                  shadow-blue-500/20
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {chargement ? (
                  "Connexion en cours..."
                ) : (
                  <>
                    Se connecter
                    <FaArrowRight />
                  </>
                )}

              </button>

            </form>

            {/* Footer */}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">

              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Gestion Boutique
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Système de gestion commerciale
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;