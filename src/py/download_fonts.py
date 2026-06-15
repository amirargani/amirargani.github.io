"""
Fonts Downloader Script
=======================
Author: Amir Argani
Description: This script fetches the Google Fonts stylesheet using a Chrome UA
             that returns individual static woff2 font files, parses the URLs
             for the 'latin' subset of Inter and Outfit, and downloads them
             locally to `src/font/` with clean weight-based filenames.
"""

import os
import re
import urllib.request
import ssl

# Define paths relative to script location
script_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.abspath(os.path.join(script_dir, "../.."))
font_dir = os.path.join(workspace_dir, "src/font")

# Mapping of weights to clean file suffixes
weight_to_suffix = {
    "Inter": {
        "300": "Light",
        "400": "Regular",
        "500": "Medium",
        "600": "SemiBold"
    },
    "Outfit": {
        "400": "Regular",
        "500": "Medium",
        "600": "SemiBold",
        "700": "Bold",
        "800": "ExtraBold"
    }
}

def download_fonts():
    """
    Downloads static woff2 font files from Google Fonts and saves them locally.
    """
    url = "https://fonts.googleapis.com/css?family=Inter:300,400,500,600|Outfit:400,500,600,700,800"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    }

    # Bypassing SSL verification to ensure the script runs smoothly in all local development setups
    ssl_context = ssl._create_unverified_context()

    print(f"Fetching Google Fonts stylesheet from: {url}")
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, context=ssl_context) as response:
            css_content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching Google Fonts stylesheet: {e}")
        return

    # Find all @font-face blocks with their preceding subset comments
    # e.g., /* latin */ @font-face { ... }
    blocks = re.findall(r'(/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{[^}]+\})', css_content)
    
    # Ensure font target directory exists
    os.makedirs(font_dir, exist_ok=True)
    
    downloaded_count = 0
    
    for block_text, subset in blocks:
        # We only want the latin subset files to keep the payload size small
        if subset != 'latin':
            continue
            
        # Extract family
        fam_match = re.search(r"font-family:\s*'([^']+)'", block_text)
        if not fam_match:
            fam_match = re.search(r'font-family:\s*"([^"]+)"', block_text)
        if not fam_match:
            continue
        family = fam_match.group(1)
        
        # Extract weight
        weight_match = re.search(r"font-weight:\s*(\d+)", block_text)
        if not weight_match:
            continue
        weight = weight_match.group(1)
        
        # Extract source URL
        url_match = re.search(r"url\(([^)]+)\)", block_text)
        if not url_match:
            continue
        font_url = url_match.group(1)
        
        # Check if this font & weight combination is requested
        if family in weight_to_suffix and weight in weight_to_suffix[family]:
            suffix = weight_to_suffix[family][weight]
            dest_filename = f"{family}-{suffix}.woff2"
            dest_path = os.path.join(font_dir, dest_filename)
            
            print(f"Downloading {family} {weight} (latin) -> {dest_filename}...")
            
            try:
                font_req = urllib.request.Request(font_url, headers=headers)
                with urllib.request.urlopen(font_req, context=ssl_context) as font_res:
                    with open(dest_path, 'wb') as font_file:
                        font_file.write(font_res.read())
                print(f"  Successfully saved to: src/font/{dest_filename}")
                downloaded_count += 1
            except Exception as ex:
                print(f"  Error downloading font file {dest_filename}: {ex}")
                
    print(f"\nFont download process complete. Downloaded {downloaded_count} font files successfully.")

if __name__ == "__main__":
    download_fonts()
