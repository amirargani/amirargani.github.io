import os
import urllib.request
from PIL import Image

# Define paths relative to the script's location to ensure portability
script_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.abspath(os.path.join(script_dir, "../.."))
out_dir = os.path.join(workspace_dir, "src/fav")
os.makedirs(out_dir, exist_ok=True)

# URL of the avatar and temporary storage path
avatar_url = "https://github.com/amirargani.png"
temp_img_path = os.path.join(out_dir, "temp_avatar.png")

print(f"Downloading avatar from {avatar_url}...")
try:
    req = urllib.request.Request(
        avatar_url, 
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    )
    with urllib.request.urlopen(req) as response:
        with open(temp_img_path, 'wb') as f:
            f.write(response.read())
except Exception as e:
    print(f"Urllib failed: {e}. Falling back to system curl command...")
    import subprocess
    subprocess.run(["curl", "-L", "-o", temp_img_path, avatar_url], check=True)

if not os.path.exists(temp_img_path):
    raise FileNotFoundError(f"Expected to find temp_avatar.png at {temp_img_path} but it was missing!")

print("Opening image...")
img = Image.open(temp_img_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# 1. Save favicon.ico with multiple sizes (16x16, 32x32, 48x48)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_path = os.path.join(out_dir, "favicon.ico")
print(f"Saving favicon.ico to {ico_path}...")
img.save(ico_path, format="ICO", sizes=ico_sizes)

# 2. Save favicon-32x32.png
png_32_path = os.path.join(out_dir, "favicon-32x32.png")
print(f"Saving favicon-32x32.png to {png_32_path}...")
img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
img_32.save(png_32_path, format="PNG")

# 3. Save favicon-16x16.png
png_16_path = os.path.join(out_dir, "favicon-16x16.png")
print(f"Saving favicon-16x16.png to {png_16_path}...")
img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
img_16.save(png_16_path, format="PNG")

# 4. Save apple-touch-icon.png (180x180)
apple_path = os.path.join(out_dir, "apple-touch-icon.png")
print(f"Saving apple-touch-icon.png to {apple_path}...")
img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
img_180.save(apple_path, format="PNG")

# Clean up temp file
if os.path.exists(temp_img_path):
    os.remove(temp_img_path)
print("Finished generating favicons successfully!")
