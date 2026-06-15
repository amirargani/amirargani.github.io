#!/usr/bin/env python3
"""
Find Duplicates Key Analyzer
===========================
Author: Amir Argani
Description: This script scans the local translation files (de.js, en.js)
             and reports if any localization key is defined more than once
             within the same file.
"""

import os
import re
from collections import Counter

def find_duplicates(filepath):
    """
    Scans a Javascript translation file for duplicate object keys.
    
    Args:
        filepath (str): Absolute or relative path to the translation js file.
    """
    filename = os.path.basename(filepath)
    print(f"Analyzing {filename} for duplicate keys...")
    
    if not os.path.exists(filepath):
        print(f"Error: File {filepath} does not exist.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches keys that start with a word character and are followed by a colon
    # on their own line inside the Javascript object structure.
    matches = re.findall(r'^\s*([a-zA-Z0-9_-]+)\s*:', content, re.MULTILINE)
    
    counts = Counter(matches)
    duplicates = {k: v for k, v in counts.items() if v > 1}
    
    if duplicates:
        print(f"Duplicate keys found in {filename}:")
        for k, v in duplicates.items():
            print(f"  - {k} (appears {v} times)")
    else:
        print(f"No duplicate keys found in {filename}.")

if __name__ == '__main__':
    # Determine the script directory dynamically to resolve paths relatively
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Resolve translation paths relative to src/py/
    de_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'de.js')
    en_translation = os.path.join(SCRIPT_DIR, '..', 'translations', 'en.js')
    
    find_duplicates(de_translation)
    find_duplicates(en_translation)
