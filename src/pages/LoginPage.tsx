import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/supermercado-demo.png.png';

function LoginPage() {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const redirectTo = location.state?.from || '/';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(name);
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <img src={heroImage} alt="Visão do supermercado" className="login-hero" />
        <p className="brand-eyebrow">Acesso Seguro</p>
        <h2>Meu Guia do Super</h2>
        <p>
          Entre com seu nome para abrir o roteiro inteligente do supermercado e navegar por
          setores com mais eficiência.
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
          <button type="submit">Entrar no guia</button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;