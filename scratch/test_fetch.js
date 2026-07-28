// Native fetch used

async function test() {
  const url = 'http://127.0.0.1:54321/rest/v1/articulos?select=id,slug,titulo,articulo_categorias(categoria_id,categorias(id,nombre,slug))&estado=eq.publicado&limit=10';
  const headers = {
    'apikey': 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
    'Authorization': 'Bearer sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
  };

  try {
    const res = await globalThis.fetch(url, { headers });
    const data = await res.json();
    console.log(`Fetched ${data.length} articles.`);
    console.log("Returned records IDs:");
    data.forEach((d, idx) => {
      console.log(`[${idx}] ID: ${d.id} | Slug: ${d.slug} | Cats Count: ${d.articulo_categorias?.length}`);
    });
  } catch (err) {
    console.error(err);
  }
}

test();
