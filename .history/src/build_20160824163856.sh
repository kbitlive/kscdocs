#! /bin/bash

# Cleanup folder
rm -rf _assets

# Recreate folder
mkdir -p _assets/website/
mkdir -p _assets/ebook/

# Compile JS
cp src/js/table.js _assets/website/table.js

# Compile Website CSS
lessc -clean-css --include-path=$(node -e "console.log(require('gitbook-styleguide').less.paths.join(':'))") src/less/website.less _assets/website/style.css

# Compile eBook CSS
lessc -clean-css src/less/ebook.less _assets/ebook/ebook.css

# Copy styleguide
mkdir -p _assets/website
cp -R node_modules/gitbook-styleguide/assets/ _assets/website/