import os
from PIL import Image

# Busca archivos .jpeg y .jpg en la carpeta
files = [f for f in os.listdir('.') if f.endswith(('.jpeg', '.jpg'))]

if not files:
    print("❌ No encontré imágenes .jpg o .jpeg en esta carpeta.")
else:
    print(f"📂 Encontré {len(files)} imágenes. Convirtiendo...")

for file in files:
    try:
        img = Image.open(file)
        # Crea el nombre nuevo con extensión .webp
        new_name = os.path.splitext(file)[0] + ".webp"
        # Guarda optimizado
        img.save(new_name, "webp", quality=85)
        print(f"✅ Listo: {new_name}")
    except Exception as e:
        print(f"⚠️ Error con {file}: {e}")