import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://nuamana.cl/blog/actividades/juegos/cualquier-cosa'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8')
        print(f"Status: {response.status}")
        print(f"HTML snippet: {html[:500]}")
        print("Contains EXPLORANDO:", "EXPLORANDO" in html.upper())
        print("Contains Aventura Perdida:", "Aventura Perdida" in html or "404" in html)
except Exception as e:
    print(f"Error: {e}")
