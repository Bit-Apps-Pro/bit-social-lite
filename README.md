# Bit Social

Bit Social is a WordPress plugin for social media auto-posting and scheduling.

## Version Support

| Item | Version |
| --- | --- |
| Stable tag | `1.13.1` |
| Requires WordPress | `5.1+` |
| Tested up to | `6.9` |
| Requires PHP | `7.4+` |

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

## Logs

Latest release logs synced from `readme.txt`.

### v1.13.1 (February 25, 2026)

- **Security**
  - Hardened AJAX auto-post flow with strict nonce, capability, and post ID validation.
  - Improved upload handling and input sanitization for safer media processing.
- **Compliance**
  - Added external services and build/source-code documentation for WordPress.org review.

### v1.13.0 (February 18, 2026)

- **Features**
  - WP scheduled posts: Added a new post order option that starts from oldest posts and continues to latest (including upcoming posts).
  - Added a new Smart Tag: `{post_date}` for inserting the post publish date.
- **Improvements**
  - Improved hashtag formatting:
    - Previous: `#new #year`
    - Now: `#newYear`
  - Trimmed Threads topic text to 50 characters to prevent posting errors.
- **Fixed**
  - Few minor bug fixes and improvements.

### v1.12.1 (February 02, 2026)

- **Fixed**
  - Few minor bug fixes and improvements.
