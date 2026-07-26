import os

slugs = [
    'cuatro-esquinas',
    'los-submarinos',
    'el-arbol-y-el-viento',
    'el-matamoscas',
    'el-juego-del-vampiro'
]

combined_sql = ["SET client_encoding = 'UTF8';\n"]

for slug in slugs:
    local_sql_path = f"supabase/import_{slug.replace('-', '_')}.sql"
    if not os.path.exists(local_sql_path):
        # Try alternate names
        if slug == 'cuatro-esquinas':
            local_sql_path = "supabase/import_cuatro_esquinas.sql"
        elif slug == 'los-submarinos':
            local_sql_path = "supabase/import_los_submarinos.sql"
        elif slug == 'el-arbol-y-el-viento':
            local_sql_path = "supabase/import_arbol_viento.sql"
        elif slug == 'el-matamoscas':
            local_sql_path = "supabase/import_matamoscas.sql"
        elif slug == 'el-juego-del-vampiro':
            local_sql_path = "supabase/import_vampiro.sql"

    with open(local_sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # Save to supabase/scripts/production_insert_{slug}.sql
    prod_path = f"supabase/scripts/production_insert_{slug}.sql"
    with open(prod_path, "w", encoding="utf-8") as f:
        f.write(sql_content)
    
    print(f"Generated {prod_path}")
    combined_sql.append(f"-- ==============================================\n-- ARTICLE: {slug}\n-- ==============================================\n" + sql_content + "\n\n")

master_path = "supabase/scripts/deploy_production_session_2026-07-25.sql"
with open(master_path, "w", encoding="utf-8") as f:
    f.write("\n".join(combined_sql))

print(f"\nGenerated master deployment script: {master_path}")
