import os
import re

# 定义需要修复的链接映射
link_fixes = {
    r'href="index\.html"': 'href="../index.html"',
    r'href="products/index\.html"': 'href="../products.html"',
    r'href="products\.html"': 'href="../products.html"',
    r'href="about\.html"': 'href="../about.html"',
    r'href="articles\.html"': 'href="../articles.html"',
    r'href="contact\.html"': 'href="../contact.html"',
    r'href="services\.html"': 'href="../services.html"',
    r'href="quality\.html"': 'href="../quality.html"'
}

# 获取articles文件夹路径
articles_dir = 'articles'

# 遍历articles文件夹中的所有HTML文件
for filename in os.listdir(articles_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(articles_dir, filename)
        print(f'Processing {filename}...')
        
        # 读取文件内容
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 应用所有链接修复
        modified = False
        for pattern, replacement in link_fixes.items():
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
        
        # 如果文件被修改，写回文件
        if modified:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Fixed links in {filename}')
        else:
            print(f'No changes needed for {filename}')

print('All articles links have been fixed!')