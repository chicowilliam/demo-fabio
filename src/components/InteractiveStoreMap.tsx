import { useMemo, useState } from 'react';
import { Box, MapPin, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
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

const pois: PointOfInterest[] = [
  { id: 'entrada', label: 'Entrada principal', x: 8, y: 92, tone: 'entry' },
  { id: 'caixas', label: 'Área de caixas', x: 90, y: 88, tone: 'info' },
  { id: 'padaria', label: 'Padaria', x: 24, y: 24, tone: 'info' },
  { id: 'frios', label: 'Frios e laticínios', x: 24, y: 64, tone: 'info' },
  { id: 'atendimento', label: 'Atendimento', x: 80, y: 22, tone: 'danger' },
];

const sectionLabels: SectionLabel[] = [
  { name: 'Hortifruti', aisle: 'A1', x: 11, y: 13 },
  { name: 'Acougue', aisle: 'A2', x: 41, y: 11 },
  { name: 'Mercearia', aisle: 'A3', x: 68, y: 17 },
  { name: 'Laticinios', aisle: 'B1', x: 16, y: 46 },
  { name: 'Higiene', aisle: 'B2', x: 45, y: 50 },
  { name: 'Limpeza', aisle: 'B3', x: 69, y: 54 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPoiClass(tone: PointOfInterest['tone']) {
  if (tone === 'entry') return 'map-poi map-poi-entry';
  if (tone === 'danger') return 'map-poi map-poi-danger';
  return 'map-poi map-poi-info';
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
  const [is3DMode, setIs3DMode] = useState(false);
  const [activePoiId, setActivePoiId] = useState<string>('entrada');

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
    <div className="interactive-map-shell">
      <div className="interactive-map-toolbar" role="toolbar" aria-label="Controles do mapa">
        <button type="button" onClick={onZoomIn} aria-label="Aumentar zoom">
          <ZoomIn size={15} /> Zoom +
        </button>
        <button type="button" onClick={onZoomOut} aria-label="Reduzir zoom">
          <ZoomOut size={15} /> Zoom -
        </button>
        <button
          type="button"
          onClick={() => setRotation((current) => current - 12)}
          aria-label="Girar mapa para a esquerda"
        >
          <RotateCcw size={15} /> Girar
        </button>
        <button
          type="button"
          onClick={() => setRotation((current) => current + 12)}
          aria-label="Girar mapa para a direita"
        >
          <RotateCw size={15} /> Girar
        </button>
        <button type="button" onClick={() => setIs3DMode((current) => !current)} aria-pressed={is3DMode}>
          <Box size={15} /> {is3DMode ? 'Modo 2D' : 'Modo 3D'}
        </button>
        <button type="button" onClick={onReset} aria-label="Resetar visualização do mapa">
          Resetar
        </button>
      </div>

      <div className="interactive-map-layout">
        <div className={`route-map-stage ${is3DMode ? 'map-stage-3d' : ''}`}>
          <svg
            viewBox="0 0 100 100"
            className="route-map-svg"
            role="img"
            aria-label={`Mapa interativo da loja ${marketName}. Use os controles para zoom, rotação e modo 3D.`}
          >
            <g transform={transform}>
              <rect x="4" y="6" width="92" height="86" rx="4" className="map-wall" />
              <path d="M8 41 H92" className="map-corridor" />
              <path d="M37 12 V88" className="map-corridor" />
              <path d="M65 12 V88" className="map-corridor" />
              <rect x="9" y="15" width="24" height="18" className="map-block" />
              <rect x="40" y="13" width="20" height="18" className="map-block" />
              <rect x="67" y="19" width="20" height="18" className="map-block" />
              <rect x="15" y="48" width="20" height="20" className="map-block" />
              <rect x="44" y="52" width="19" height="18" className="map-block" />
              <rect x="70" y="56" width="18" height="16" className="map-block" />

              <rect x="9" y="12" width="24" height="3" className="map-shelf" />
              <rect x="40" y="10" width="20" height="3" className="map-shelf" />
              <rect x="67" y="16" width="20" height="3" className="map-shelf" />
              <rect x="15" y="45" width="20" height="3" className="map-shelf" />
              <rect x="44" y="49" width="19" height="3" className="map-shelf" />
              <rect x="70" y="53" width="18" height="3" className="map-shelf" />

              <circle cx={entrance.x} cy={entrance.y} r="1.8" className="map-entry" />

              {routeComputed && routePoints.length > 1 ? (
                <polyline
                  points={routePoints.map((point) => `${point.x},${point.y}`).join(' ')}
                  className="map-route"
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
                          className={isActive ? 'map-stop map-stop-active' : 'map-stop'}
                        />
                        <text x={step.point.x + 1.8} y={step.point.y - 1.8} className="map-stop-label">
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
                  className="map-highlight-ring"
                />
              ) : null}

              {pois.map((poi) => (
                <circle
                  key={poi.id}
                  cx={poi.x}
                  cy={poi.y}
                  r={activePoiId === poi.id ? '2.2' : '1.4'}
                  className={getPoiClass(poi.tone)}
                />
              ))}

              {sectionLabels.map((label) => (
                <text key={`${label.aisle}-${label.name}`} x={label.x} y={label.y} className="map-section-label">
                  {label.aisle} {label.name}
                </text>
              ))}
            </g>
          </svg>
          <div className="map-caption">Entrada principal e setores estratégicos</div>
        </div>

        <aside className="map-poi-panel" aria-label="Pontos de interesse">
          <h4>
            <MapPin size={16} /> Pontos de interesse
          </h4>
          <ul>
            {pois.map((poi) => (
              <li key={poi.id}>
                <button
                  type="button"
                  className={activePoiId === poi.id ? 'active' : ''}
                  onClick={() => setActivePoiId(poi.id)}
                >
                  {poi.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="map-legend" aria-label="Legenda de mapa">
        <span><i className="legend-box legend-corridor" /> Corredores</span>
        <span><i className="legend-box legend-shelf" /> Prateleiras</span>
        <span><i className="legend-dot legend-stop" /> Paradas da rota</span>
        <span><i className="legend-dot legend-poi" /> Pontos de interesse</span>
      </div>
    </div>
  );
}
