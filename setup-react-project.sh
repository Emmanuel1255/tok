#!/bin/bash

# Create main src directory
mkdir -p src

# Create main subdirectories
mkdir -p src/assets
mkdir -p src/components/{common,blog,layout}
mkdir -p src/context
mkdir -p src/features/{auth,posts}
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/utils

# Create component files
touch src/components/common/{Button,Input,Navbar}.jsx
touch src/components/blog/{PostCard,PostList}.jsx
touch src/components/layout/MainLayout.jsx

# Create context files
touch src/context/AuthContext.jsx

# Create feature files
touch src/features/auth/authSlice.js
touch src/features/posts/postsSlice.js

# Create hooks files
touch src/hooks/useAuth.js

# Create page files
touch src/pages/{Home,Login,Register,Blog}.jsx

# Create service files
touch src/services/api.js

# Create store files
touch src/store/store.js

# Create style files
touch src/styles/index.css

# Create utility files
touch src/utils/helpers.js

# Create root files
touch src/{App,main}.jsx

# Make the script executable
chmod +x setup-react-project.sh

# Print success message
echo "React project structure has been created successfully!"

# Tree view of the created structure (if tree is installed)
if command -v tree >/dev/null 2>&1; then
    tree src
else
    echo "Install 'tree' command to view the directory structure"
fi