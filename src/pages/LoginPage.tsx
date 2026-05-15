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
    <section className="login-page">
      <div className="login-stage">
        <div className="login-card">
          <p className="brand-eyebrow">Acesso Seguro</p>
          <h2>Entre no Meu Guia do Super</h2>
          <p>
            Seu painel de compras agora é guiado por rota. Faça login para montar a sequência de
            corredores e acompanhar cada parada durante a compra.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Fabio"
              required
            />
            {errorMessage ? <small className="login-error">{errorMessage}</small> : null}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar no guia'}
            </button>
          </form>
        </div>

        <img src={heroImage} alt="Visão do supermercado" className="login-overlay-hero" />
      </div>
    </section>
  );
}

export default LoginPage;