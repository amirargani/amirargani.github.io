#!/usr/bin/env python3
"""
Find Duplicate Values Analyzer
==============================
Author: Amir Argani
Description: This script scans the local translation files (de.js, en.js)
             and reports if different keys map to the exact same value string.
             This helps identify opportunities for translation reuse.
"""

import os
import re
from collections import defaultdict

def find_duplicate_values(filepath):
    """
    Scans a Javascript translation file for identical translated values
    defined under different keys.
    
    Args:
        filepath (str): Absolute or relative path to the translation js file.
    """
    filename = os.path.basename(filepath)
    print(f"Analyzing {filename} for duplicate translation values...")
    
    if not os.path.exists(filepath):
        print(f"Error: File {filepath} does not exist.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches key: "value", or key: `value`, or key: 'value'
    # Handles single/double/backtick quotes and multiline strings
    pattern = r'^\s*([a-zA-Z0-9_-]+)\s*:\s*(["\'`])(.*?)\2\s*,'
    matches = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
    
    value_to_keys = defaultdict(list)
    for key, quote, val in matches:
        # Strip whitespaces and handle basic newlines
        clean_val = val.strip().replace('\n', ' ')
        value_to_keys[clean_val].append(key)
        
    duplicates = {val: keys for val, keys in value_to_keys.items() if len(keys) > 1}
    
    if duplicates:
        print(f"Found {len(duplicates)} values defined under multiple keys:")
        # Sort by number of occurrences descending
        sorted_dupes = sorted(duplicates.items(), key=lambda x: len(x[1]), reverse=True)
        for val, keys in sorted_dupes:
            print(f"  - Value: \"{val}\"")
            print(f"    Keys ({len(keys)}): {', '.join(keys)}")
    else:
        print("No duplicate values found.")

if __name__ == '__main__':
    # Determine the script directory dynamically to resolve paths relatively
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Resolve translation paths relative to src/py/
    de_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'de.js')
    en_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'en.js')
    
    find_duplicate_values(de_translation)
    find_duplicate_values(en_translation)

