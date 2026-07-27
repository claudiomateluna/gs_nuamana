import subprocess
import sys

def insert_sql_file_utf8(sql_file_path, container_name="supabase_db_nuamana-local"):
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    cmd = ['docker', 'exec', '-i', container_name, 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1']
    
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate(input=sql_content.encode('utf-8'))
    
    print("STDOUT:", stdout.decode('utf-8', errors='replace'))
    print("STDERR:", stderr.decode('utf-8', errors='replace'))

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "supabase/migrations/20260726020000_insert_rescate_prisionero.sql"
    container = sys.argv[2] if len(sys.argv) > 2 else "supabase_db_nuamana-local"
    insert_sql_file_utf8(filepath, container)
