# Bit Social

Bit Social is a WordPress plugin for social media auto-posting and scheduling.

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/Bit-Apps-Pro/bit-social-lite.git bit-social
```

2. Navigate into the project directory:

```bash
cd bit-social
```

3. Install dependencies:

```bash
pnpm install
composer install
```

4. Run the development server:

```bash
pnpm dev
```

5. Build for production:

```bash
pnpm prod:free-zip
```

## Directory Structure

```text
.
├── backend/                 # Backend PHP logic
├── frontend/                # Frontend app source (React/TS)
├── src/                     # Plugin source and references
├── tests/                   # Automated tests
├── scripts/                 # Build/dev utility scripts
├── config/                  # Project configuration files
├── cli/                     # CLI utilities
├── bin/                     # Executable helper scripts
├── _bitapps-plugin-commons/ # Shared internal package
├── bit-social.php           # WordPress plugin bootstrap
├── composer.json            # PHP dependencies
├── package.json             # Node/pnpm dependencies
└── readme.txt               # WordPress.org plugin readme
```
