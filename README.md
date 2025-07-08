# ConnectUS - Decentralized Social Network

A modern, decentralized social media platform built on the Internet Computer Protocol (ICP) using Motoko smart contracts and a modern React frontend.

## 👥 Team
- **Aryan Gupta** – Team Lead, Fullstack & Smart Contract Engineer
- **Arnav Jhalani** – Frontend Developer

## 🏗️ Architecture

```
├── frontend/          # React frontend application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Main app pages (Feed, Explore, Rewards, Profile, etc.)
│       ├── contexts/     # React context (e.g., Auth)
│       ├── hooks/        # Custom React hooks
│       └── ...
├── backend/           # Motoko smart contracts
│   ├── Main.mo        # Main canister logic
│   └── dfx.json       # DFX configuration
└── README.md
```

## 🧑‍💻 Codebase Overview

### Backend (Motoko Smart Contract)
- **File:** `backend/Main.mo`
- **Purpose:** Implements all decentralized logic for posts, user profiles, token rewards, and platform stats on the Internet Computer blockchain.
- **Key Features:**
  - **Post Management:** Users can create posts, which are stored immutably on-chain. Each post has an author, content, timestamp, like count, and reward count.
  - **User Profiles:** Each user is identified by their principal. Profiles track username, token balance (T4T), post count, and total rewards. New users are automatically created with a starting balance.
  - **Token Rewards:** Liking a post rewards the author with T4T tokens. Users can transfer tokens to each other.
  - **Platform Stats:** Functions to retrieve total posts and users.
  - **Security:** All actions are principal-based, ensuring secure, decentralized authentication and authorization.

#### Main Smart Contract Functions
- `createPost(content: Text)`: Create a new post
- `getPosts()`: Retrieve all posts
- `likePost(postId: Nat)`: Like a post and reward the author
- `getUserProfile(userPrincipal: Principal)`: Get any user's profile
- `getMyProfile()`: Get current user's profile
- `transferTokens(to: Principal, amount: Nat)`: Transfer T4T tokens
- `getPlatformStats()`: Get platform statistics

### Frontend (React + Tailwind CSS)
- **Directory:** `frontend/src/`
- **Purpose:** Provides a modern, responsive user interface for interacting with the decentralized backend.
- **Key Features:**
  - **Landing Page:** Prompts users to connect their Internet Identity and highlights platform features.
  - **Navigation/Header:** Persistent navigation bar with links to Feed, Explore, Rewards, and Profile, showing user token balance and avatar.
  - **Pages:**
    - **Feed:** Users can create new posts and view the timeline. (In full implementation, posts are fetched from the backend.)
    - **Explore:** Discover trending topics, suggested users, and popular posts.
    - **Rewards:** View token rewards and stats.
    - **Profile:** Manage user profile and view activity.
    - **NotFound:** 404 page for invalid routes.
  - **Styling:** Uses Tailwind CSS for a clean, minimalist design system.
  - **Routing:** Uses React Router for client-side navigation.
  - **Backend Integration:** Designed to interact with the Motoko canister for all social and token features (API integration required for production).

## 🚀 Features
- **Decentralized Posts:** Content stored permanently on ICP blockchain
- **Token Rewards:** Earn T4T tokens for quality content and engagement
- **Censorship Resistant:** No central authority can modify or delete posts
- **Internet Identity:** Secure, anonymous authentication
- **Minimalist Design:** Clean, professional interface

## 🛠️ Local Development

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install) (latest version)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)

### Backend Setup
1. **Install DFX:**
    ```bash
    sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
    ```
2. **Start local ICP replica:**
    ```bash
    cd backend
    dfx start --background
    ```
3. **Deploy canisters locally:**
    ```bash
    dfx deploy
    ```
4. **Get canister ID:**
    ```bash
    dfx canister id team4_social
    ```

### Frontend Setup
1. **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```
2. **Start development server:**
    ```bash
    npm run dev
    ```
3. **Open in browser:** http://localhost:5173

## 📦 Deployment to ICP Mainnet

### Prerequisites
- ICP tokens for canister creation and cycles
- Internet Identity for authentication

### Deploy Steps
1. **(Optional) Use your identity:**
    ```bash
    dfx identity use aryan
    ```
2. **Add cycles to your identity:**
    ```bash
    dfx ledger account-id
    # Transfer ICP to this account, then convert to cycles
    dfx ledger create-canister <principal-id> --amount <amount>
    ```
3. **Deploy to mainnet:**
    ```bash
    cd backend
    dfx deploy --network ic
    ```
4. **Get mainnet canister ID:**
    ```bash
    dfx canister --network ic id team4_social
    ```
5. **Update frontend configuration** with mainnet canister ID
6. **Build and deploy frontend:**
    ```bash
    cd frontend
    npm run build
    # Deploy dist/ folder to your preferred hosting service
    ```

## 🔧 Configuration

### Environment Variables
Create `.env` file in frontend directory:
```env
VITE_CANISTER_ID=your_canister_id_here
VITE_NETWORK=local # or 'ic' for mainnet
```

### DFX Configuration
The `dfx.json` file contains canister configuration:
- Local network: `127.0.0.1:8000`
- IC mainnet: `https://ic0.app`

## 🏪 Token Economics
- **T4T Token:** Platform native token
- **Starting Balance:** 100 T4T for new users
- **Like Rewards:** 1 T4T per like received
- **Post Creation:** Free (no cost)
- **Token Transfers:** Enable peer-to-peer transactions

## 🔐 Security Features
- **Internet Identity:** Secure, anonymous authentication
- **Immutable Posts:** Content cannot be modified after creation
- **Decentralized Storage:** No single point of failure
- **Principal-based:** User identification via cryptographic principals

## 🎯 Roadmap
- [ ] Image/media upload support
- [ ] Comment system
- [ ] User following/followers
- [ ] Content moderation via community voting
- [ ] NFT integration
- [ ] Cross-chain token bridges

## 📄 License
MIT License - see LICENSE file for details

## 🆘 Support
For issues and questions:
1. Check the [ICP Developer Documentation](https://internetcomputer.org/docs)
2. Visit [ICP Community Forum](https://forum.dfinity.org/)
3. Join [ICP Discord](https://discord.gg/cA7y6ezyE2)

## 🎨 Design & Accessibility
- **Dark Mode by Default:** The entire app uses a dark theme for reduced eye strain and modern aesthetics. All backgrounds and text use theme-aware classes for perfect contrast.
- **Unified Design System:** Headers, navigation, and all major UI elements are visually consistent across all pages (Landing, Feed, Explore, Rewards, Profile).
- **Accessible Components:** All interactive elements have high-contrast colors, large tap targets, and clear focus states. Placeholder text and labels meet WCAG AA contrast standards.
- **Consistent Progress Bars:** A reusable ProgressBar component ensures all progress indicators are thick, visible, and accessible everywhere (Profile, Achievements, Dashboard, etc.).
- **Leaderboard Table:** The Rewards/Leaderboard page uses a proper grid-based table for perfect alignment, clear hierarchy, and mobile accessibility. The "What is this?" link is now readable and easy to tap.
- **Sidebar Improvements:** Explore and Profile sidebars are decluttered, with clear labels, uniform buttons, and no ambiguous icons.

## 🖼️ Updated Features
- **Modern Dark UI:** All pages and cards adapt to dark mode, with no white-on-white or low-contrast issues.
- **Accessible Navigation:** Headers, buttons, and links are large, bold, and easy to use on all devices.
- **Leaderboard:** Now a visually distinct, accessible table with clear columns and headers.
- **Profile & Achievements:** Progress bars are thick, colored, and labeled for clarity. Stats have text labels, not just icons.
- **Explore:** Sidebars are clean, with uniform filter buttons and readable contributor lists.

---

Built with ❤️ on the Internet Computer Protocol