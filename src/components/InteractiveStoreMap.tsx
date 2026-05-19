import { useMemo, useState } from 'react';
import { Box, MapPin, Menu, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { MapPoint, RouteStep } from '../lib/clientRoute';

type PointOfInterest = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone: 'entry' | 'info' | 'danger';
};

type InteractiveStoreMapProps = {
  entrance: MapPoint;
  routeComputed: boolean;
  routePoints: MapPoint[];
  steps: RouteStep[];
  highlightedItemName?: string;
  marketName: string;
};

type SectionLabel = {
  name: string;
  aisle: string;
  x: number;
  y: number;
};

type ShelfBlock = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  section: string;
};

const pois: PointOfInterest[] = [
  { id: 'entrada', label: 'Entrada principal', x: 8, y: 92, tone: 'entry' },
  { id: 'caixas', label: 'Area de caixas', x: 90, y: 88, tone: 'info' },
  { id: 'padaria', label: 'Padaria', x: 24, y: 24, tone: 'info' },
  { id: 'frios', label: 'Frios e laticinios', x: 24, y: 64, tone: 'info' },
  { id: 'atendimento', label: 'Atendimento', x: 80, y: 22, tone: 'danger' },
];

const sectionLabels: SectionLabel[] = [
  { name: 'Hortifruti', aisle: 'A1', x: 10, y: 12 },
  { name: 'Padaria', aisle: 'A2', x: 31, y: 11 },
  { name: 'Mercearia', aisle: 'A3', x: 52, y: 12 },
  { name: 'Laticinios', aisle: 'B1', x: 11, y: 45 },
  { name: 'Higiene', aisle: 'B2', x: 44, y: 47 },
  { name: 'Limpeza', aisle: 'B3', x: 71, y: 48 },
];

const shelfBlocks: ShelfBlock[] = [
  { id: 's-01', x: 8, y: 20, width: 18, height: 7.4, section: 'Hortifruti' },
  { id: 's-02', x: 29, y: 20, width: 18, height: 7.4, section: 'Padaria' },
  { id: 's-03', x: 50, y: 20, width: 18, height: 7.4, section: 'Mercearia' },
  { id: 's-04', x: 71, y: 20, width: 18, height: 7.4, section: 'Mercearia' },
  { id: 's-05', x: 12, y: 33.5, width: 16, height: 7.4, section: 'Hortifruti' },
  { id: 's-06', x: 31, y: 33.5, width: 16, height: 7.4, section: 'Padaria' },
  { id: 's-07', x: 50, y: 33.5, width: 16, height: 7.4, section: 'Mercearia' },
  { id: 's-08', x: 69, y: 33.5, width: 16, height: 7.4, section: 'Mercearia' },
  { id: 's-09', x: 12, y: 49.5, width: 16, height: 7.4, section: 'Laticinios' },
  { id: 's-10', x: 31, y: 49.5, width: 16, height: 7.4, section: 'Higiene' },
  { id: 's-11', x: 50, y: 49.5, width: 16, height: 7.4, section: 'Limpeza' },
  { id: 's-12', x: 69, y: 49.5, width: 16, height: 7.4, section: 'Limpeza' },
  { id: 's-13', x: 18, y: 66, width: 14, height: 7.4, section: 'Laticinios' },
  { id: 's-14', x: 35, y: 66, width: 14, height: 7.4, section: 'Higiene' },
  { id: 's-15', x: 52, y: 66, width: 14, height: 7.4, section: 'Limpeza' },
  { id: 's-16', x: 69, y: 66, width: 14, height: 7.4, section: 'Limpeza' },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function poiColor(tone: PointOfInterest['tone']) {
  if (tone === 'entry') {
    return '#10b981';
  }
  if (tone === 'danger') {
    return '#ef4444';
  }
  return '#0284c7';
}

export default function InteractiveStoreMap({
  entrance,
  routeComputed,
  routePoints,
  steps,
  highlightedItemName,
  marketName,
}: InteractiveStoreMapProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [is3DMode, setIs3DMode] = useState(true);
  const [activePoiId, setActivePoiId] = useState<string>('entrada');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(shelfBlocks.map((shelf) => shelf.section)))],
    []
  );

  const highlightedStep = useMemo(
    () => steps.find((step) => step.itemName === highlightedItemName),
    [steps, highlightedItemName]
  );

  const transform = `translate(50 50) scale(${zoom}) rotate(${rotation}) translate(-50 -50)`;

  const onZoomIn = () => setZoom((current) => clamp(current + 0.1, 0.8, 2.2));
  const onZoomOut = () => setZoom((current) => clamp(current - 0.1, 0.8, 2.2));
  const onReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7" role="toolbar" aria-label="Controles do mapa">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Aumentar zoom"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ZoomIn size={15} /> Zoom +
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Reduzir zoom"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ZoomOut size={15} /> Zoom -
        </button>
        <button
          type="button"
          onClick={() => setRotation((current) => current - 12)}
          aria-label="Girar mapa para a esquerda"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={15} /> Girar
        </button>
        <button
          type="button"
          onClick={() => setRotation((current) => current + 12)}
          aria-label="Girar mapa para a direita"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCw size={15} /> Girar
        </button>
        <button
          type="button"
          onClick={() => setIs3DMode((current) => !current)}
          aria-pressed={is3DMode}
          className={[
            'inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition',
            is3DMode
              ? 'border-indigo-300 bg-indigo-100 text-indigo-800'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          ].join(' ')}
        >
          <Box size={15} /> {is3DMode ? 'Modo 2D' : 'Modo 3D'}
        </button>
        <button
          type="button"
          onClick={() => setIsCategoryMenuOpen((current) => !current)}
          aria-expanded={isCategoryMenuOpen}
          aria-controls="map-categories-menu"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {isCategoryMenuOpen ? <X size={15} /> : <Menu size={15} />} Categorias
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Resetar visualizacao do mapa"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Resetar
        </button>
      </div>

      {isCategoryMenuOpen ? (
        <aside
          id="map-categories-menu"
          className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Categorias de prateleiras"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                className={[
                  'rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition',
                  isActive
                    ? 'border-rose-300 bg-rose-100 text-rose-800'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
                ].join(' ')}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </aside>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.7fr_0.7fr]">
        <div
          className={[
            'rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]',
            is3DMode ? 'shadow-[0_22px_42px_rgba(30,41,59,0.2)]' : '',
          ].join(' ')}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-[340px] w-full rounded-2xl bg-[radial-gradient(circle_at_20%_20%,#f8fafc_0%,#eef2ff_55%,#e2e8f0_100%)] sm:h-[540px]"
            role="img"
            aria-label={`Mapa interativo da loja ${marketName}. Use os controles para zoom, rotacao e modo 3D.`}
          >
            <defs>
              <linearGradient id="shelfFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="shelfTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="shelfSide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            <g transform={transform}>
              <rect x="3" y="5" width="94" height="89" rx="5" fill="#0f172a" opacity="0.08" />
              <rect x="2.7" y="4.7" width="94.6" height="89.6" rx="5.3" fill="none" stroke="#94a3b8" strokeWidth="0.45" />

              {[30, 44, 60, 76].map((y) => (
                <path key={y} d={`M7 ${y} H94`} stroke="#bfdbfe" strokeWidth="1.9" strokeDasharray="4 2.5" opacity="0.8" />
              ))}

              {shelfBlocks.map((shelf) => {
                const dimmed = activeCategory !== 'Todas' && activeCategory !== shelf.section;
                const opacity = dimmed ? 0.22 : 1;
                return (
                  <g key={shelf.id} opacity={opacity}>
                    <ellipse
                      cx={shelf.x + shelf.width / 2 + 0.65}
                      cy={shelf.y + shelf.height + 1.2}
                      rx={shelf.width / 2 + 0.9}
                      ry="1.2"
                      fill="#0f172a"
                      opacity="0.3"
                    />
                    <rect x={shelf.x} y={shelf.y} width={shelf.width} height={shelf.height} rx="0.7" fill="url(#shelfFace)" />
                    <rect x={shelf.x + shelf.width - 1.15} y={shelf.y + 0.8} width="1.15" height={shelf.height - 1.4} rx="0.2" fill="url(#shelfSide)" />
                    <rect x={shelf.x} y={shelf.y - 1.55} width={shelf.width} height="1.95" rx="0.45" fill="url(#shelfTop)" />

                    {Array.from({ length: 6 }).map((_, index) => {
                      const slotX = shelf.x + (index + 1) * (shelf.width / 7);
                      return (
                        <line
                          key={`${shelf.id}-slot-${index}`}
                          x1={slotX}
                          y1={shelf.y + 0.85}
                          x2={slotX}
                          y2={shelf.y + shelf.height - 0.75}
                          stroke="#64748b"
                          strokeWidth="0.28"
                          opacity="0.85"
                        />
                      );
                    })}

                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                      <line
                        key={`${shelf.id}-row-${rowIndex}`}
                        x1={shelf.x + 0.7}
                        y1={shelf.y + 1.25 + rowIndex * ((shelf.height - 2.4) / 4)}
                        x2={shelf.x + shelf.width - 1.3}
                        y2={shelf.y + 1.25 + rowIndex * ((shelf.height - 2.4) / 4)}
                        stroke="#94a3b8"
                        strokeWidth="0.25"
                        opacity="0.65"
                      />
                    ))}

                    {Array.from({ length: 7 }).map((_, dotIndex) => (
                      <circle
                        key={`${shelf.id}-prod-${dotIndex}`}
                        cx={shelf.x + 1 + dotIndex * ((shelf.width - 2) / 6)}
                        cy={shelf.y + shelf.height - 1.05}
                        r="0.22"
                        fill="#f8fafc"
                        opacity="0.75"
                      />
                    ))}
                  </g>
                );
              })}

              <circle cx={entrance.x} cy={entrance.y} r="1.8" fill="#16a34a" stroke="#14532d" strokeWidth="0.45" />

              {routeComputed && routePoints.length > 1 ? (
                <polyline
                  points={routePoints.map((point) => `${point.x},${point.y}`).join(' ')}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1.4 0.9"
                />
              ) : null}

              {routeComputed
                ? steps.map((step) => {
                    const isActive = step.itemName === highlightedItemName;
                    return (
                      <g key={`${step.step}-${step.itemName}`}>
                        <circle
                          cx={step.point.x}
                          cy={step.point.y}
                          r={isActive ? '2.8' : '2.1'}
                          fill={isActive ? '#f59e0b' : '#fb7185'}
                          stroke={isActive ? '#b45309' : '#9f1239'}
                          strokeWidth="0.4"
                        />
                        <text
                          x={step.point.x + 1.7}
                          y={step.point.y - 1.75}
                          fontSize="1.25"
                          fontWeight="700"
                          fill="#0f172a"
                        >
                          {step.step}
                        </text>
                      </g>
                    );
                  })
                : null}

              {highlightedStep ? (
                <circle
                  cx={highlightedStep.point.x}
                  cy={highlightedStep.point.y}
                  r="4"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1"
                />
              ) : null}

              {pois.map((poi) => (
                <circle
                  key={poi.id}
                  cx={poi.x}
                  cy={poi.y}
                  r={activePoiId === poi.id ? '2.25' : '1.45'}
                  fill={poiColor(poi.tone)}
                  stroke="#0f172a"
                  strokeWidth="0.35"
                />
              ))}

              {sectionLabels.map((label) => (
                <text
                  key={`${label.aisle}-${label.name}`}
                  x={label.x}
                  y={label.y}
                  fontSize="1.4"
                  fontWeight="700"
                  fill="#1e293b"
                >
                  {label.aisle} {label.name}
                </text>
              ))}
            </g>
          </svg>
          <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-600">
            Layout de prateleiras com mais profundidade visual e foco em navegacao do cliente
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]" aria-label="Pontos de interesse">
          <h4 className="inline-flex items-center gap-2 font-['Fraunces'] text-2xl font-semibold text-slate-900">
            <MapPin size={16} /> Pontos de interesse
          </h4>
          <ul className="mt-3 space-y-2">
            {pois.map((poi) => (
              <li key={poi.id} className="list-none">
                <button
                  type="button"
                  className={[
                    'w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                    activePoiId === poi.id
                      ? 'border-sky-300 bg-sky-100 text-sky-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                  ].join(' ')}
                  onClick={() => setActivePoiId(poi.id)}
                >
                  {poi.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 sm:grid-cols-2 xl:grid-cols-4" aria-label="Legenda de mapa">
        <span className="inline-flex items-center gap-2">
          <i className="h-3.5 w-3.5 rounded-sm bg-sky-200" /> Corredores
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="h-3.5 w-3.5 rounded-sm bg-slate-700" /> Prateleiras
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="h-3.5 w-3.5 rounded-full bg-rose-500" /> Paradas da rota
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="h-3.5 w-3.5 rounded-full bg-sky-500" /> Pontos de interesse
        </span>
      </div>
    </div>
  );
}
