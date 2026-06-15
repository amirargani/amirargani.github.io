#!/usr/bin/env python3
"""
Consolidate Translations and Reorganize Duplicate Keys
======================================================
Author: Amir Argani
Description: This script automates translation consolidation by mapping duplicate/replicated
             keys in de.js and en.js to a unified set of shared keys. It also updates
             corresponding references in index.html to maintain rendering consistency.
"""

import os
import re

# Define replacement map: old key -> new shared key

key_replacements = {
    # Categories / Titles
    'cv_exp_1_used_title': 'shared_what_i_used',
    'cv_exp_2_used_title': 'shared_what_i_used',
    'cv_exp_3_used_title': 'shared_what_i_used',
    
    'cv_exp_1_used_cat_lang': 'shared_cat_lang',
    'cv_exp_2_used_cat_lang': 'shared_cat_lang',
    'cv_exp_3_used_cat_lang': 'shared_cat_lang',
    'cv_exp_4_cat_prog': 'shared_cat_lang',
    
    'cv_exp_1_used_cat_frontend': 'shared_cat_frontend',
    'cv_exp_2_used_cat_frontend': 'shared_cat_frontend',
    'cv_exp_3_used_cat_frontend': 'shared_cat_frontend',
    
    'cv_exp_1_used_cat_backend': 'shared_cat_backend',
    'cv_exp_2_used_cat_backend': 'shared_cat_backend',
    'cv_exp_3_used_cat_backend': 'shared_cat_backend',
    'cv_edu_1_cat_backend': 'shared_cat_backend',
    
    'cv_exp_1_used_cat_mobile': 'shared_cat_mobile',
    'cv_exp_2_used_cat_mobile': 'shared_cat_mobile',
    
    'cv_exp_1_used_cat_desktop': 'shared_cat_desktop',
    'cv_exp_3_used_cat_desktop': 'shared_cat_desktop',
    
    'cv_exp_1_used_cat_agile': 'shared_cat_agile',
    'cv_exp_2_used_cat_agile': 'shared_cat_agile',
    'cv_exp_3_used_cat_agile': 'shared_cat_agile',
    'cv_edu_1_cat_agile': 'shared_cat_agile',
    
    'cv_exp_1_used_cat_vcs': 'shared_cat_vcs',
    'cv_exp_2_used_cat_vcs': 'shared_cat_vcs',
    'cv_exp_3_used_cat_vcs': 'shared_cat_vcs',
    'cv_edu_1_cat_vcs': 'shared_cat_vcs',
    
    'cv_exp_1_used_cat_db': 'shared_cat_db',
    'cv_exp_2_used_cat_db': 'shared_cat_db',
    'cv_exp_3_used_cat_db': 'shared_cat_db',
    'cv_edu_1_cat_db': 'shared_cat_db',
    
    'cv_exp_1_used_cat_infra': 'shared_cat_infra',
    'cv_exp_2_used_cat_infra': 'shared_cat_infra',
    'cv_exp_3_used_cat_infra': 'shared_cat_infra',
    
    'cv_exp_1_used_cat_workflow': 'shared_cat_workflow',
    'cv_edu_1_cat_workflow': 'shared_cat_workflow',

    # Tags
    'cv_exp_1_used_tag_csharp': 'shared_tag_csharp',
    'cv_exp_2_used_tag_csharp': 'shared_tag_csharp',
    'cv_exp_3_used_tag_csharp': 'shared_tag_csharp',
    'cv_exp_4_tag_csharp': 'shared_tag_csharp',
    
    'cv_exp_2_used_tag_python': 'shared_tag_python',
    'cv_edu_1_tag_python': 'shared_tag_python',
    
    'cv_exp_1_used_tag_javascript': 'shared_tag_javascript',
    'cv_exp_2_used_tag_javascript': 'shared_tag_javascript',
    'cv_exp_3_used_tag_javascript': 'shared_tag_javascript',
    
    'cv_exp_1_used_tag_html': 'shared_tag_html',
    'cv_exp_2_used_tag_html': 'shared_tag_html',
    'cv_exp_3_used_tag_html': 'shared_tag_html',
    
    'cv_exp_1_used_tag_css': 'shared_tag_css',
    'cv_exp_2_used_tag_css': 'shared_tag_css',
    'cv_exp_3_used_tag_css': 'shared_tag_css',
    
    'cv_exp_1_used_tag_git': 'shared_tag_git',
    'cv_exp_2_used_tag_git': 'shared_tag_git',
    'cv_exp_3_used_tag_git': 'shared_tag_git',
    'cv_edu_1_tag_git': 'shared_tag_git',
    
    'cv_exp_1_used_tag_github': 'shared_tag_github',
    'cv_exp_2_used_tag_github': 'shared_tag_github',
    'cv_exp_3_used_tag_github': 'shared_tag_github',
    'cv_edu_1_tag_github': 'shared_tag_github',
    
    'cv_exp_1_used_tag_sql_server': 'shared_tag_sql_server',
    'cv_exp_2_used_tag_sql_server': 'shared_tag_sql_server',
    'cv_exp_3_used_tag_sql_server': 'shared_tag_sql_server',
    'skill_sql_server': 'shared_tag_sql_server',
    
    'cv_exp_1_used_tag_vps': 'shared_tag_vps',
    'cv_exp_2_used_tag_vps': 'shared_tag_vps',
    'cv_exp_3_used_tag_vps': 'shared_tag_vps',
    
    'cv_exp_1_used_tag_windows_server': 'shared_tag_windows_server',
    'cv_exp_2_used_tag_windows_server': 'shared_tag_windows_server',
    'cv_exp_3_used_tag_windows_server': 'shared_tag_windows_server',
    
    'cv_exp_1_used_tag_linux_server': 'shared_tag_linux_server',
    'cv_exp_2_used_tag_linux_server': 'shared_tag_linux_server',
    'cv_exp_3_used_tag_linux_server': 'shared_tag_linux_server',
    
    'cv_exp_1_used_tag_n8n': 'shared_tag_n8n',
    'cv_edu_1_tag_n8n': 'shared_tag_n8n',
    'skill_n8n': 'shared_tag_n8n',
    
    'cv_exp_1_used_tag_agile': 'shared_tag_agile',
    'cv_exp_2_used_tag_agile': 'shared_tag_agile',
    'cv_exp_3_used_tag_agile': 'shared_tag_agile',
    'cv_edu_1_tag_agile': 'shared_tag_agile',
    
    'cv_exp_1_used_tag_scrum': 'shared_tag_scrum',
    'cv_exp_2_used_tag_scrum': 'shared_tag_scrum',
    'cv_exp_3_used_tag_scrum': 'shared_tag_scrum',
    'cv_edu_1_tag_scrum': 'shared_tag_scrum',
    
    'cv_exp_4_tag_excel': 'shared_tag_excel',
    'cv_edu_1_tag_excel': 'shared_tag_excel',
    'skill_excel': 'shared_tag_excel',
    
    'cv_exp_2_used_tag_bootstrap': 'shared_tag_bootstrap',
    'cv_exp_3_used_tag_bootstrap': 'shared_tag_bootstrap',
    
    'cv_exp_2_used_tag_material_design': 'shared_tag_material_design',
    'cv_exp_3_used_tag_material_design': 'shared_tag_material_design',
    
    'cv_exp_1_used_tag_rest_api': 'shared_tag_rest_api',
    'cv_exp_2_used_tag_rest_api': 'shared_tag_rest_api',
    'cv_exp_3_used_tag_rest_api': 'shared_tag_rest_api',
    
    'cv_exp_1_used_tag_winforms': 'shared_tag_winforms',
    'cv_exp_3_used_tag_winforms': 'shared_tag_winforms',
    
    'cv_exp_1_used_tag_wpf': 'shared_tag_wpf',
    'cv_exp_3_used_tag_wpf': 'shared_tag_wpf',
    
    'skill_sqlite': 'shared_tag_sqlite',
    'cv_edu_1_tag_sqlite': 'shared_tag_sqlite',
    
    'skill_postgresql': 'shared_tag_postgresql',
    'cv_edu_1_tag_postgres': 'shared_tag_postgresql',
    
    'skill_nosql': 'shared_tag_mongodb',
    'cv_edu_1_tag_mongo': 'shared_tag_mongodb',
    
    'skill_spark': 'shared_tag_spark',
    'cv_edu_1_tag_spark': 'shared_tag_spark',
    
    'skill_airflow': 'shared_tag_airflow',
    'cv_edu_1_tag_airflow': 'shared_tag_airflow',
    
    'skill_make': 'shared_tag_make',
    'cv_edu_1_tag_make': 'shared_tag_make',
    
    'skill_tableau': 'shared_tag_tableau',
    'cv_edu_1_tag_tableau': 'shared_tag_tableau',
}

def clean_translation_file(filepath, replacements, lang):
    """
    Cleans up a single localization dictionary file by:
    1. Finding the value string for each mapping key from the existing file.
    2. Deleting the old duplicate keys.
    3. Defining a group of unified shared translation keys at the top of the dictionary.
    
    Args:
        filepath (str): Path to the de.js or en.js file.
        replacements (dict): Mapping of old keys to the new shared keys.
        lang (str): Language code ('de' or 'en') matching the variable name.
    """
    filename = os.path.basename(filepath)
    if not os.path.exists(filepath):
        print(f"Error: {filepath} does not exist.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse key-value dictionary to get values for shared keys
    # Match pattern: key: "value",
    pattern = r'^\s*([a-zA-Z0-9_-]+)\s*:\s*(["\'`])(.*?)\2\s*,'
    matches = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
    val_map = {k: v for k, q, v in matches}

    # Determine values for the new shared keys based on the values of the old keys being replaced
    shared_values = {}
    for old_k, new_k in replacements.items():
        if old_k in val_map:
            shared_values[new_k] = val_map[old_k]

    # Remove the old duplicate keys from the file content
    new_content = content
    for old_k in replacements.keys():
        # Regex to match key line including leading space and trailing comma
        # Matches: "  key: \"value\",\n" or "  key: `value`,\n" or "  key: 'value',\n"
        reg = rf'^\s*{old_k}\s*:\s*(["\'`]).*?\1\s*,\r?\n'
        new_content = re.sub(reg, '', new_content, flags=re.MULTILINE | re.DOTALL)

    # Construct the shared definitions block
    shared_lines = ["\n  // Shared Translations & Tags (Unified duplicates)"]
    for k in sorted(shared_values.keys()):
        val = shared_values[k]
        # Wrap in quotes, handle single/double/backtick appropriately
        if '"' in val:
            shared_lines.append(f'  {k}: `{val}`,')
        else:
            shared_lines.append(f'  {k}: "{val}",')
    shared_lines.append("")
    
    shared_block = "\n".join(shared_lines)

    # Insert shared block right after the opening brace `var de = {` or `var en = {`
    brace_reg = rf'(var\s+{lang}\s*=\s*\{{\r?\n)'
    new_content = re.sub(brace_reg, r'\1' + shared_block, new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Processed translation dictionary: {filename}")

def clean_index_html(filepath, replacements):
    """
    Scans index.html and replaces all references to duplicate i18n keys
    with the new unified shared translation keys.
    
    Args:
        filepath (str): Path to the index.html file.
        replacements (dict): Mapping of old duplicate keys to the new shared keys.
    """
    filename = os.path.basename(filepath)
    if not os.path.exists(filepath):
        print(f"Error: {filepath} does not exist.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace keys in index.html attributes like: data-i18n="key"
    new_content = content
    for old_k, new_k in replacements.items():
        new_content = new_content.replace(f'data-i18n="{old_k}"', f'data-i18n="{new_k}"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Processed HTML file: {filename}")

if __name__ == '__main__':
    # Determine the script directory dynamically to resolve paths relatively
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Resolve translation paths relative to src/py/
    de_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'de.js')
    en_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'en.js')
    index_html = os.path.join(SCRIPT_DIR, '..', '..', 'index.html')
    
    # Execute the cleanup and consolidation processes
    clean_translation_file(de_translation, key_replacements, 'de')
    clean_translation_file(en_translation, key_replacements, 'en')
    clean_index_html(index_html, key_replacements)

