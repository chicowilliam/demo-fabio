import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Download, LayoutGrid, Package, PlusCircle, Sparkles, Store } from 'lucide-react';
import { supermarkets } from '../data/supermarkets';

type AdminShelf = {
  id: string;
  name: string;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  shelfId: string;
  quantity: number;
};

const initialShelves: AdminShelf[] = [
  { id: 'sh-1', name: 'Gondola 01', section: 'Hortifruti', x: 8, y: 14, width: 24, height: 14, color: '#2a9d8f' },
  { id: 'sh-2', name: 'Gondola 02', section: 'Mercearia', x: 38, y: 18, width: 24, height: 14, color: '#1d3557' },
  { id: 'sh-3', name: 'Gondola 03', section: 'Laticinios', x: 68, y: 14, width: 24, height: 14, color: '#457b9d' },
  { id: 'sh-4', name: 'Gondola 04', section: 'Limpeza', x: 26, y: 44, width: 24, height: 14, color: '#6d597a' },
];

function AdminPage() {
  const [selectedMarketId, setSelectedMarketId] = useState(supermarkets[0]?.id ?? '');
  const [shelves, setShelves] = useState<AdminShelf[]>(initialShelves);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [shelfForm, setShelfForm] = useState({
    name: '',
    section: '',
    x: 20,
    y: 20,
    width: 20,
    height: 12,
    color: '#2a9d8f',
  });
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: '',
    shelfId: '',
    quantity: 10,
  });

  const selectedMarket = useMemo(
    () => supermarkets.find((market) => market.id === selectedMarketId) ?? null,
    [selectedMarketId]
  );

  const density = useMemo(() => {
    if (shelves.length === 0) {
      return 0;
    }

    return Number((products.length / shelves.length).toFixed(1));
  }, [products.length, shelves.length]);

  const productsByShelfId = useMemo(() => {
    const countByShelfId = new Map<string, number>();
    products.forEach((product) => {
      countByShelfId.set(product.shelfId, (countByShelfId.get(product.shelfId) ?? 0) + 1);
    });
    return countByShelfId;
  }, [products]);

  const onCreateShelf = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newShelf: AdminShelf = {
      id: `sh-${Date.now()}`,
      name: shelfForm.name || `Gondola ${shelves.length + 1}`,
      section: shelfForm.section || 'Geral',
      x: shelfForm.x,
      y: shelfForm.y,
      width: shelfForm.width,
      height: shelfForm.height,
      color: shelfForm.color,
    };

    setShelves((previous) => [...previous, newShelf]);
    setShelfForm((previous) => ({ ...previous, name: '', section: '' }));
  };

  const onCreateProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productForm.shelfId) {
      return;
    }

    const newProduct: AdminProduct = {
      id: `prd-${Date.now()}`,
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      shelfId: productForm.shelfId,
      quantity: productForm.quantity,
    };

    setProducts((previous) => [...previous, newProduct]);
    setProductForm((previous) => ({ ...previous, name: '', brand: '', category: '', quantity: 10 }));
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-[0_14px_34px_rgba(15,23,42,0.09)]">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">Painel Admin</p>
          <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold text-slate-900 sm:text-4xl">
            Centro de controle de layout e estoque
          </h2>
          <p className="mt-3 text-slate-600">
            Visualize o mapa da loja, cadastre novas estantes e organize o catalogo de produtos em
            uma unica operacao.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Voltar ao dashboard
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <Download size={16} /> Exportar layout
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores do painel">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Store size={14} /> Loja ativa
          </span>
          <strong className="mt-2 block text-lg font-semibold text-slate-900">
            {selectedMarket ? selectedMarket.name : 'Nao selecionada'}
          </strong>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <LayoutGrid size={14} /> Estantes
          </span>
          <strong className="mt-2 block text-3xl font-black text-slate-900">{shelves.length}</strong>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Package size={14} /> Produtos
          </span>
          <strong className="mt-2 block text-3xl font-black text-slate-900">{products.length}</strong>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles size={14} /> Densidade
          </span>
          <strong className="mt-2 block text-3xl font-black text-slate-900">{density}</strong>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.4fr_0.95fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Ferramentas</p>
          <h3 className="mt-1 font-['Fraunces'] text-2xl font-semibold text-slate-900">Nova estante</h3>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="admin-market">
            Supermercado
          </label>
          <select
            id="admin-market"
            value={selectedMarketId}
            onChange={(event) => setSelectedMarketId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            {supermarkets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.name} - {market.city}
              </option>
            ))}
          </select>

          <form className="mt-4 space-y-2" onSubmit={onCreateShelf}>
            <input
              type="text"
              value={shelfForm.name}
              onChange={(event) => setShelfForm((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="Nome da estante"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <input
              type="text"
              value={shelfForm.section}
              onChange={(event) => setShelfForm((previous) => ({ ...previous, section: event.target.value }))}
              placeholder="Setor"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={shelfForm.x}
                onChange={(event) => setShelfForm((previous) => ({ ...previous, x: Number(event.target.value) }))}
                placeholder="X"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <input
                type="number"
                value={shelfForm.y}
                onChange={(event) => setShelfForm((previous) => ({ ...previous, y: Number(event.target.value) }))}
                placeholder="Y"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <input
                type="number"
                value={shelfForm.width}
                onChange={(event) => setShelfForm((previous) => ({ ...previous, width: Number(event.target.value) }))}
                placeholder="Largura"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <input
                type="number"
                value={shelfForm.height}
                onChange={(event) => setShelfForm((previous) => ({ ...previous, height: Number(event.target.value) }))}
                placeholder="Altura"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="shelf-color">
              Cor da estante
            </label>
            <input
              id="shelf-color"
              type="color"
              value={shelfForm.color}
              onChange={(event) => setShelfForm((previous) => ({ ...previous, color: event.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white p-1"
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
            >
              <PlusCircle size={16} /> Criar estante
            </button>
          </form>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <header>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Mapa operacional</p>
            <h3 className="mt-1 font-['Fraunces'] text-2xl font-semibold text-slate-900">Layout visual da loja</h3>
          </header>

          <div className="relative mt-3 h-[440px] rounded-2xl border border-slate-200 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:18px_18px]">
            {shelves.map((shelf) => (
              <div
                key={shelf.id}
                className="absolute rounded-xl border border-white/40 p-2 text-[11px] font-semibold text-white shadow-[0_10px_18px_rgba(15,23,42,0.28)]"
                style={{
                  left: `${shelf.x}%`,
                  top: `${shelf.y}%`,
                  width: `${shelf.width}%`,
                  height: `${shelf.height}%`,
                  background: shelf.color,
                }}
              >
                <strong className="block truncate">{shelf.section}</strong>
                <small className="block truncate">{shelf.name}</small>
                <span className="mt-1 inline-flex rounded-full bg-black/25 px-1.5 py-0.5 text-[10px]">
                  {productsByShelfId.get(shelf.id) ?? 0} itens
                </span>
              </div>
            ))}
            <div className="absolute bottom-3 left-3 rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
              Entrada
            </div>
          </div>

          <footer className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
              <Box size={14} /> Arraste virtual do layout em progresso
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
              <LayoutGrid size={14} /> Grade de leitura ativa
            </span>
          </footer>
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Produtos</p>
          <h3 className="mt-1 font-['Fraunces'] text-2xl font-semibold text-slate-900">Novo produto</h3>

          <form className="mt-4 space-y-2" onSubmit={onCreateProduct}>
            <input
              type="text"
              value={productForm.name}
              onChange={(event) => setProductForm((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="Nome do produto"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <input
              type="text"
              value={productForm.brand}
              onChange={(event) => setProductForm((previous) => ({ ...previous, brand: event.target.value }))}
              placeholder="Marca"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <input
              type="text"
              value={productForm.category}
              onChange={(event) => setProductForm((previous) => ({ ...previous, category: event.target.value }))}
              placeholder="Categoria"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />

            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="product-shelf">
              Estante
            </label>
            <select
              id="product-shelf"
              value={productForm.shelfId}
              onChange={(event) => setProductForm((previous) => ({ ...previous, shelfId: event.target.value }))}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Selecione a estante</option>
              {shelves.map((shelf) => (
                <option key={shelf.id} value={shelf.id}>
                  {shelf.section} - {shelf.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              value={productForm.quantity}
              onChange={(event) => setProductForm((previous) => ({ ...previous, quantity: Number(event.target.value) }))}
              placeholder="Quantidade"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <Package size={16} /> Criar produto
            </button>
          </form>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            Cadastro local para prototipo visual. Se quiser, conecto este painel ao backend na
            proxima etapa.
          </div>
        </aside>
      </div>
    </section>
  );
}

export default AdminPage;
