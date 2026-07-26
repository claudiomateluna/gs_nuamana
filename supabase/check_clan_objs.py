import subprocess

def get_clan_objs(term_like):
    sql = f"""
    SELECT po.id, po.texto_infantil, po.rango_edad, pa.nombre as area
    FROM progresion_objetivos po
    JOIN progresion_areas pa ON po.area_id = pa.id
    JOIN unidades u ON po.unidad_id = u.id
    WHERE po.texto_terminal ILIKE '%{term_like}%'
      AND u.nombre = 'Clan';
    """
    cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    print(f"=== CLAN OBJS FOR '{term_like}' ===")
    print(res.stdout.strip())

get_clan_objs("libertad de un modo solidario")
get_clan_objs("sentido del humor")
get_clan_objs("actividades deportivas y recreativas")
