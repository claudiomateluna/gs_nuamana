import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE4MDAwMDAwMDB9.YF4mOPaN5QYx2t3coJeABqOg3_tyQ36YjtJ4NpVNHng"
url = 'https://api-supabase.nuamana.cl/rest/v1/articulos?select=slug,imagen_destacada'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0',
    'apikey': anon_key,
    'Authorization': f'Bearer {anon_key}'
})
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        arts = json.loads(response.read().decode('utf-8'))
        print(f"Total articles in DB: {len(arts)}")
        for a in arts:
            slug = a.get('slug', '')
            img = a.get('imagen_destacada', '')
            if any(k in slug for k in ['mis-nuevos', 'rescate', 'capturar', 'caza-globos', 'pogotron', 'vampiro', 'matamoscas']):
                print(f"{slug:<35}: {img}")
except Exception as e:
    print(f"Error: {e}")
