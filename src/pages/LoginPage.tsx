import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/supermercado-demo.png';

function LoginPage() {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const redirectTo = location.state?.from || '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(name, 'shopper');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível autenticar.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center px-4 py-8">
      <div className="relative w-full max-w-5xl rounded-3xl border border-amber-100 bg-white p-6 shadow-[0_24px_42px_rgba(15,23,42,0.14)] sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">Acesso Seguro</p>
          <h2 className="mt-2 font-['Fraunces'] text-4xl font-semibold text-slate-900">Entre no Meu Guia do Super</h2>
          <p className="mt-3 text-slate-600">
            Seu painel de compras agora é guiado por rota. Faça login para montar a sequência de
            corredores e acompanhar cada parada durante a compra.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Fabio"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            {errorMessage ? (
              <small className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700">
                {errorMessage}
              </small>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar no guia'}
            </button>
          </form>
        </div>

        <img
          src={heroImage}
          alt="Visao do supermercado"
          className="mt-6 h-52 w-full rounded-2xl border border-slate-200 object-cover md:absolute md:right-6 md:top-8 md:mt-0 md:h-[340px] md:w-[38%]"
        />
      </div>
    </section>
  );
}

export default LoginPage;