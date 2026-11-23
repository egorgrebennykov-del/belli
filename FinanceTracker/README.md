# Belli — Boutique Clothing Store (React Native / Expo)

**Belli** is a mobile fashion & clothing boutique application built with **Expo SDK 58**, **Expo Router**, **TypeScript**, and **TanStack Query**, featuring a rose-quartz and porcelain aesthetic harmonized with the Belli brand mark.

> **Build Artifact (APK):**
> [Download Belli Android APK (Placeholder — add your EAS Build link before submission)](https://expo.dev/accounts/your-account/projects/belli/builds)

---

## Installation & Running the Project

```bash
cd FinanceTracker
npm install
npx expo start
```

- Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with **Expo Go**.
- **Demo Credentials:** Username `emilys` / Password `emilyspass` (or tap **Use Demo Credentials** on the Login screen, or register a new account).

---

## Functional Guide

### 1. Project Overview
- **Application Name:** Belli
- **Application Category / Topic:** E-Commerce / Fashion & Clothing Boutique
- **Main Purpose:**
  Belli is a curated mobile clothing boutique that lets shoppers browse seasonal dresses, tops, bags, shoes, and jewelry, inspect garment details and sizing, and manage a shopping bag. It also empowers boutique curators to publish new garments, update pricing or stock, and remove discontinued pieces directly from their mobile device.

### 2. User Access & Permissions
- **Guest (Not Authenticated):**
  - Available screens or actions: Only the `(auth)` stack is accessible — **Login** (`/(auth)/login`) and **Register** (`/(auth)/register`). Protected route guards (`Stack.Protected`) prevent manual navigation to internal boutique screens without a valid session token.
- **Authenticated User:**
  - Main sections / tabs: **Boutique** (`/(tabs)/index`), **Bag** (`/(tabs)/bag`), and **Atelier / Profile** (`/(tabs)/profile`).
  - Details screens: **Piece Details** (`/product/[id]`), **Collection Lookbook** (`/collection/[slug]`).
  - Create / Edit / Delete actions: **Publish New Piece** (`/product/manage`), **Edit Piece** (`/product/edit/[id]`), and **Delete Piece** from the Piece Details screen.

### 3. Authentication & Session Handling
- **Authentication Flow:**
  1. When the app starts, `AuthProvider` keeps the native splash screen visible (`isHydrated = false`) while checking `expo-secure-store` for a saved session (`belli_auth_session`).
  2. Authentication status (`isAuthenticated`) is determined by the presence of a valid user object and token.
  3. On successful login (`POST https://dummyjson.com/auth/login`) or registration (`POST https://dummyjson.com/users/add`), the user object and token are persisted in `expo-secure-store` and `Stack.Protected` automatically transitions the user into the `(tabs)` navigator.
  4. On logout, `SecureStore.deleteItemAsync` clears the stored session and returns the user to the `(auth)/login` screen.
- **Session Persistence:**
  - Stored securely via **`expo-secure-store`** (Keychain on iOS / EncryptedSharedPreferences on Android — never `AsyncStorage`).
  - Automatic login is handled on app restart during `AuthProvider` hydration before the root navigator renders.

### 4. Navigation Structure
- **Root Navigation Logic:**
  - `src/app/_layout.tsx` defines a Root `Stack` using `Stack.Protected` guards based on `isAuthenticated` from `useAuth()`.
- **Main Navigation:**
  - 3-tab bottom `Tabs` navigator (`src/app/(tabs)/_layout.tsx`): **Boutique**, **Bag** (with live item count badge), and **Atelier**.
- **Nested Navigation:**
  - Root `Stack` composes the `(auth)` `Stack` navigator, the `(tabs)` `Tabs` navigator, and modal/push detail screens (`/product/[id]`, `/product/manage`, `/product/edit/[id]`, `/collection/[slug]`).

### 5. List → Details Flow
- **List / Overview Screen:**
  - `src/app/(tabs)/index.tsx` displays a 2-column `FlatList` of fashion items fetched from DummyJSON, with live search, category filter chips, and `RefreshControl` pull-to-refresh.
- **Details Screen:**
  - Tapping any `ProductCard` navigates via `<Link href={{ pathname: '/product/[id]', params: { id } }}>` to `src/app/product/[id].tsx`.
  - The details screen reads `id` from `useLocalSearchParams`, fetches the item, lets the user pick a size (`XS`–`XL`), add to bag, favorite, edit, or delete.

### 6. Data Source & Backend
- **Backend Type:** Simulated REST API (`https://dummyjson.com`) managed with `@tanstack/react-query` and `fetch`.
- **Data Operations (CRUD):**
  - **Read (GET):** `fetchBoutiqueProducts` (fetches `womens-dresses`, `tops`, `womens-bags`, `womens-shoes`, `womens-jewellery` or `/products/search`) and `fetchProductById` (`/products/:id`).
  - **Create (POST):** `createBoutiqueProduct` sends `POST /products/add` from `/product/manage` and registers the created item in the React Query cache + session overlay.
  - **Update (PUT):** `updateBoutiqueProduct` sends `PUT /products/:id` from `/product/edit/[id]` and updates the UI immediately.
  - **Delete (DELETE):** `deleteBoutiqueProduct` sends `DELETE /products/:id` from `/product/[id]` after user confirmation and removes the item from the catalog, bag, and wishlist.

### 7. Forms & Validation
- **Forms Used:**
  1. Login Form (`src/app/(auth)/login.tsx`)
  2. Registration Form (`src/app/(auth)/register.tsx`)
  3. Create / Edit Boutique Piece Form (`src/components/product-form.tsx`)
- **Non-Text Input Controls:**
  - `Switch` (Biometric lock toggle on Profile; "Feature in Belli Edit" toggle on Product Form)
  - `@react-native-community/slider` (Quick Price Slider on Product Form)
  - Custom Horizontal Chip Pickers (Category & Size selectors)
- **Validation Rules (`src/utils/validation.ts`):**
  - **Email:** Required + valid email regex format.
  - **Password (Multi-rule):** Required + minimum 6 characters + must include at least one letter and one number.
  - **Piece Title (Multi-rule):** Required + minimum 3 characters + maximum 80 characters.
  - **Price & Stock:** Required + positive numeric / whole-number checks.
- **Keyboard & Safe Area UX:**
  - All forms use `KeyboardAvoidingView` + `ScrollView` with `keyboardShouldPersistTaps="handled"` and `react-native-safe-area-context`.

### 8. Native Device Features
- **Camera & Photo Library (`expo-image-picker`):**
  - Used on the **Atelier / Profile** screen to take or pick a profile avatar, and on the **Product Form** to photograph or attach a garment image.
- **Biometrics (`expo-local-authentication`):**
  - Used on the **Atelier / Profile** screen to enable Face ID / Fingerprint lock and on **Piece Details** to verify identity before deleting a boutique item.

### 9. Typical User Flow
1. User opens **Belli** and signs in (or registers a new account) on the `(auth)` screen; session is saved in `expo-secure-store`.
2. User browses the **Boutique** catalog, filters by category (e.g. *Dresses*), or pulls down to refresh.
3. User taps a garment to open **Piece Details** (`/product/[id]`), chooses size `M`, and adds it to the **Bag** tab.
4. User taps **+ Add Piece**, captures a photo with the camera, adjusts the price slider, and publishes a new garment (`POST /products/add`).
5. User restarts the app and is automatically logged back in via `SecureStore`.

### 10. Error & Edge Case Handling
- **Authentication Errors:** Invalid credentials or network errors display inline alert banners without clearing the user's input.
- **Network / Data Errors:** `BelliStateView` renders a dedicated error state with a **Try Again** retry action; pending mutations prevent double-submission and preserve form drafts on failure.
- **Empty States:** Search queries with zero matches or an empty Shopping Bag display `BelliStateView` with helpful recovery actions (e.g., **Reset Filters**).
