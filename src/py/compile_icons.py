"""
Icon Compilation Script
=======================
Author: Amir Argani
Description: This script parses individual SVG icon files, cleanses them of Adobe Illustrator 
             and other metadata bloat, converts solid colors dynamically to 'currentColor' 
             for modern CSS variables support, and compiles them directly into a javascript dictionary 
             block inside `src/js/app.js` under `const skillIcons`.
"""

import os
import re
import xml.etree.ElementTree as ET

# Define paths relative to the script's location to ensure portability across environments
script_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.abspath(os.path.join(script_dir, "../.."))
icon_dir = os.path.join(workspace_dir, "src/icon")
app_js_path = os.path.join(workspace_dir, "src/js/app.js")

# Mapping from SVG filename to the JS dictionary key
svg_to_skill = {
    "al.svg": "AL Programming Language",
    "apacheairflow.svg": "Apache Airflow",
    "apachespark.svg": "Apache Spark",
    "aspnet.svg": "ASP.NET CORE MVC",
    "aws.svg": "AWS",
    "azure.svg": "Azure",
    "azure-devops.svg": "Azure DevOps",
    "c-plus-plus.svg": "C++",
    "csharp.svg": "C#",
    "css3.svg": "CSS3",
    "docker.svg": "Docker",
    "eda.svg": "Exploratory Data Analysis",
    "flutter.svg": "Flutter & Dart",
    "git.svg": "Git",
    "github.svg": "GitHub",
    "google-cloud.svg": "GCP",
    "hasura.svg": "hasura.io",
    "html5.svg": "HTML5",
    "java.svg": "Java",
    "javascript.svg": "JavaScript",
    "make.svg": "Make",
    "ml.svg": "Machine Learning",
    "mongodb.svg": "MongoDB",
    "mysql.svg": "MySQL",
    "n8n.svg": "n8n",
    "node-js.svg": "Node.js",
    "postgresql.svg": "PostgreSQL",
    "powerbi.svg": "Power BI",
    "react.svg": "React",
    "sqlite.svg": "SQLite",
    "sqlserver.svg": "SQL Server",
    "streamlit.svg": "Streamlit",
    "swift.svg": "Swift",
    "tableau.svg": "Tableau",
    "typescript.svg": "TypeScript",
    "vb.svg": "Visual Basic"
}

def clean_svg_content(svg_path):
    """
    Reads an SVG file, extracts its viewBox and inner elements,
    and returns a clean inline SVG string.
    """
    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Register namespaces to avoid ns0 prefixing
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    
    # Parse XML
    try:
        # Remove any DOCTYPE or XML declarations that might confuse ElementTree
        xml_content = re.sub(r'<\?xml[^>]*\?>', '', content)
        xml_content = re.sub(r'<!DOCTYPE[^>]*>', '', xml_content)
        root = ET.fromstring(xml_content)
    except Exception as e:
        print(f"Error parsing {svg_path}: {e}")
        return None
        
    viewbox = root.attrib.get('viewBox', '0 0 24 24')
    
    # We want to extract the inner tags as strings
    inner_parts = []
    
    def serialize_element(elem):
        """
        Recursively serializes an XML element to an SVG string, stripping namespaces,
        handling black fill transformations, and ignoring transparent Illustrator backgrounds.
        """
        # We strip namespaces from tag names
        tag = elem.tag.split('}')[-1]
        
        # Skip style, title, metadata
        if tag in ('style', 'title', 'metadata'):
            return
            
        # For Machine Learning icon: ignore illustrator transparent bounding box rect
        if tag == 'rect' and elem.attrib.get('class') == 'cls-1':
            return

        attribs = []
        for k, v in elem.attrib.items():
            attr_name = k.split('}')[-1]
            
            # Skip height/width on inner elements
            if attr_name in ('width', 'height') and tag == 'svg':
                continue
                
            # Replace black fill colors with currentColor for dynamic theme mapping
            if attr_name == 'fill':
                if v.lower() in ('#000000', 'black', '#0f121b'):
                    v = 'currentColor'
            elif attr_name == 'style':
                # Convert fill:#000000 or fill:black to fill:currentColor
                v = re.sub(r'fill\s*:\s*(#000000|black|#0f121b)', 'fill:currentColor', v)
                
            attribs.append(f'{attr_name}="{v}"')
            
        attrib_str = " " + " ".join(attribs) if attribs else ""
        
        # Serialize children
        children_str = ""
        for child in elem:
            child_res = serialize_element(child)
            if child_res:
                children_str += child_res
                
        if children_str:
            return f'<{tag}{attrib_str}>{children_str}</{tag}>'
        else:
            if elem.text and elem.text.strip():
                return f'<{tag}{attrib_str}>{elem.text.strip()}</{tag}>'
            else:
                return f'<{tag}{attrib_str} />'

    for child in root:
        res = serialize_element(child)
        if res:
            inner_parts.append(res)
            
    inner_svg = "".join(inner_parts)
    # Ensure viewBox, fill, width, height are set on outer SVG
    return f'<svg viewBox="{viewbox}" fill="currentColor" width="18" height="18">{inner_svg}</svg>'

def main():
    """
    Main function that orchestrates reading all SVG icons, cleaning them up,
    grouping them into categories, and compiling them into `src/js/app.js`.
    """
    print("Compiling SVG icons from workspace...")
    
    # Read current app.js
    with open(app_js_path, 'r', encoding='utf-8') as f:
        app_js = f.read()
        
    # Build dictionary of compiled SVGs
    compiled_icons = {}
    for filename, skill_name in svg_to_skill.items():
        svg_path = os.path.join(icon_dir, filename)
        if os.path.exists(svg_path):
            clean_svg = clean_svg_content(svg_path)
            if clean_svg:
                compiled_icons[skill_name] = clean_svg
                print(f"Loaded and optimized: {filename} -> {skill_name}")
        else:
            print(f"Warning: SVG file not found: {svg_path}")
            
    # Load Excel, Word, PowerPoint from the current file since they are not in the folder
    fallback_icons = {
        "Excel": """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="10" y1="3" x2="10" y2="21"></line></svg>""",
        "Word": """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>""",
        "PowerPoint": """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>"""
    }
    
    # Merge
    for k, v in fallback_icons.items():
        if k not in compiled_icons:
            compiled_icons[k] = v
            print(f"Using fallback: {k}")

    # Build the Javascript code block for const skillIcons
    js_lines = ["  const skillIcons = {"]
    
    # Group items logically to match original visual order
    categories = [
        ("Data Analysis & BI Tools", ["Exploratory Data Analysis", "Machine Learning", "Streamlit", "Power BI", "Tableau", "Apache Spark"]),
        ("Programming", ["Python", "C#", "AL Programming Language", "Visual Basic", "C++", "HTML5", "CSS3", "React", "Node.js", "JavaScript", "TypeScript", "ASP.NET CORE MVC"]),
        ("App Development", ["Swift", "Java", "Flutter & Dart"]),
        ("Cloud Computing", ["AWS", "Azure", "GCP"]),
        ("Databases", ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB"]),
        ("Automation & ETL", ["Make", "n8n", "Apache Airflow"]),
        ("Tools & DevOps", ["Git", "GitHub", "hasura.io", "Docker", "Azure DevOps"]),
        ("Office 365", ["Excel", "Word", "PowerPoint"])
    ]
    
    # Keep track of written keys
    written_keys = set()
    
    for cat_name, keys in categories:
        js_lines.append(f"    // {cat_name}")
        for key in keys:
            if key in compiled_icons:
                # Escape backticks if any
                val = compiled_icons[key].replace('`', '\\`')
                js_lines.append(f"    \"{key}\": `{val}`,")
                written_keys.add(key)
        js_lines.append("") # Empty line between categories

    # Add any remaining keys
    remaining = [k for k in compiled_icons.keys() if k not in written_keys]
    if remaining:
        js_lines.append("    // Other Icons")
        for key in remaining:
            val = compiled_icons[key].replace('`', '\\`')
            js_lines.append(f"    \"{key}\": `{val}`,")
            
    # Clean up last comma
    if js_lines[-1].endswith(','):
        js_lines[-1] = js_lines[-1][:-1]
        
    js_lines.append("  };")
    
    skill_icons_block = "\n".join(js_lines)
    
    # Locate const skillIcons in app.js and replace it
    pattern = r'const\s+skillIcons\s*=\s*\{.*?\};'
    app_js_new, count = re.subn(pattern, skill_icons_block, app_js, flags=re.DOTALL)
    
    if count > 0:
        with open(app_js_path, 'w', encoding='utf-8') as f:
            f.write(app_js_new)
        print(f"Successfully updated {app_js_path} with {len(compiled_icons)} compiled icons!")
    else:
        print("Error: Could not find skillIcons block in app.js using regex.")

if __name__ == "__main__":
    main()
