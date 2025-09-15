import { useEffect, useState } from 'react';
import { fetchProductos } from '../services/store';

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio_unidad?: number;
  precio_gramo?: number;
  precio_media_onza?: number;
  precio_onza?: number;
  foto_url?: string | null;
}

export default function StoreGrid({ categoria }: { categoria?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchProductos({ categoria });
        setItems(rows);
      } catch (e: unknown) {
        console.error('Error fetching products:', e);
        setErr((e as Error)?.message ?? 'Error desconocido');
      }
    })();
  }, [categoria]);

  if (err) return <p className="text-red-600">{err}</p>;
  if (items.length === 0) return <p className="text-slate-500">Sin productos.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {items.map(p => (
        <article key={p.id} className="rounded-xl bg-white shadow p-3">
          <h3 className="font-semibold">{p.nombre}</h3>
          <p className="text-sm text-slate-500">{p.categoria}</p>
          <div className="mt-2 text-sm">
            {p.precio_unidad ? <div>Unidad: ${p.precio_unidad}</div> : null}
            {p.precio_gramo ? <div>Gramo: ${p.precio_gramo}</div> : null}
            {p.precio_media_onza ? <div>1/2 oz: ${p.precio_media_onza}</div> : null}
            {p.precio_onza ? <div>Onza: ${p.precio_onza}</div> : null}
          </div>
        </article>
      ))}
    </div>
  );
}