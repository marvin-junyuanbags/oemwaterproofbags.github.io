#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
404 Article Fix Script for OEM Waterproof Bags Website
This script copies articles from the articles/ folder to the root directory
and updates the internal links to work correctly.
"""

import os
import shutil
import re
from pathlib import Path

def fix_article_links(content):
    """
    Fix internal links in article content to work from root directory
    """
    # Fix CSS links
    content = re.sub(r'href="\.\./', 'href="', content)
    
    # Fix image links
    content = re.sub(r'src="\.\./', 'src="', content)
    
    # Fix navigation links
    content = re.sub(r'href="\.\./(\w+\.html)"', r'href="\1"', content)
    
    # Fix canonical URLs
    content = re.sub(r'https://oemwaterproofbags\.com/articles/', 'https://oemwaterproofbags.com/', content)
    
    # Fix breadcrumb links
    content = re.sub(r'<a href="\.\./(\w+\.html)">', r'<a href="\1">', content)
    
    return content

def copy_and_fix_article(source_path, dest_path):
    """
    Copy article from articles folder to root and fix links
    """
    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix the links
        fixed_content = fix_article_links(content)
        
        # Write to destination
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"✓ Fixed and copied: {os.path.basename(dest_path)}")
        return True
    except Exception as e:
        print(f"✗ Error processing {os.path.basename(source_path)}: {e}")
        return False

def main():
    """
    Main function to fix 404 articles
    """
    # Define the articles that need to be fixed
    articles_to_fix = [
        'waterproof-business-bags-complete-guide-2024.html',
        'waterproof-beach-bags-complete-guide-2024.html',
        'waterproof-cycling-bags-complete-guide-2024.html',
        'waterproof-kayaking-bags-complete-guide-2024.html',
        'waterproof-sailing-bags-complete-guide-2024.html',
        'waterproof-camping-bags-complete-guide-2024.html'
    ]
    
    base_dir = Path('.')
    articles_dir = base_dir / 'articles'
    
    print("Starting 404 Article Fix Process...")
    print("=" * 50)
    
    success_count = 0
    total_count = len(articles_to_fix)
    
    for article in articles_to_fix:
        source_path = articles_dir / article
        dest_path = base_dir / article
        
        if source_path.exists():
            if copy_and_fix_article(source_path, dest_path):
                success_count += 1
        else:
            print(f"✗ Source file not found: {article}")
    
    print("\n" + "=" * 50)
    print(f"Fix Complete: {success_count}/{total_count} articles processed successfully")
    
    if success_count == total_count:
        print("\n🎉 All 404 errors have been fixed!")
        print("The following URLs should now work:")
        for article in articles_to_fix:
            print(f"  - https://oemwaterproofbags.com/{article}")
    else:
        print(f"\n⚠️  {total_count - success_count} articles still need attention")

if __name__ == "__main__":
    main()