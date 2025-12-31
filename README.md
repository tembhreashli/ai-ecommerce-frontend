# AI E-Commerce Frontend

A modern, full-featured e-commerce frontend application built with React 18, TypeScript, and Vite. This application provides a complete shopping experience with AI-powered features, state management using Redux Toolkit, and a beautiful UI styled with Tailwind CSS.

## 🚀 Features

- **Modern React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized production builds
- **Redux Toolkit** for powerful state management
- **React Router v6** for seamless navigation
- **Tailwind CSS** for beautiful, responsive design
- **Axios** for efficient API communication
- **Form validation** with custom validators
- **JWT Authentication** with protected routes
- **Shopping Cart** with local storage persistence
- **Product filtering and search** capabilities
- **Order management** system
- **Responsive design** for all devices
- **Error handling** and loading states

## 📁 Project Structure

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component
├── App.css                  # App-specific styles
├── index.css                # Global styles with Tailwind
├── vite-env.d.ts           # Vite environment types
├── components/
│   ├── Layout/
│   │   ├── Header.tsx      # Navigation header with cart icon
│   │   ├── Footer.tsx      # Footer with links
│   │   └── Navbar.tsx      # Navigation menu
│   ├── Product/
│   │   ├── ProductCard.tsx # Product display card
│   │   ├── ProductList.tsx # Product grid/list view
│   │   └── ProductDetail.tsx # Detailed product page
│   ├── Cart/
│   │   ├── CartPage.tsx    # Shopping cart page
│   │   └── CartItem.tsx    # Individual cart item
│   ├── Order/
│   │   ├── OrderPage.tsx   # Order history
│   │   └── OrderDetail.tsx # Order details page
│   ├── Auth/
│   │   ├── LoginPage.tsx   # Login form
│   │   ├── RegisterPage.tsx # Registration form
│   │   └── ProfilePage.tsx  # User profile
│   └── Common/
│       └── NotFound.tsx     # 404 error page
├── pages/
│   ├── Home.tsx             # Home page with hero and features
│   ├── Products.tsx         # Products page with filters
│   ├── Checkout.tsx         # Checkout page
│   └── NotFound.tsx         # 404 page
├── services/
│   ├── api.ts               # Axios instance with interceptors
│   ├── authService.ts       # Authentication API calls
│   ├── productService.ts    # Product API calls
│   ├── cartService.ts       # Cart API calls
│   ├── orderService.ts      # Order API calls
│   └── userService.ts       # User profile API calls
├── store/
│   ├── store.ts             # Redux store configuration
│   ├── authSlice.ts         # Authentication state
│   ├── cartSlice.ts         # Cart state
│   ├── productSlice.ts      # Product state
│   └── orderSlice.ts        # Order state
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   ├── useCart.ts           # Cart operations hook
│   └── useFetch.ts          # Data fetching hook
├── types/
│   ├── index.ts             # Type exports
│   └── models.ts            # Data model types
├── utils/
│   ├── constants.ts         # Application constants
│   ├── helpers.ts           # Helper functions
│   └── validators.ts        # Form validators
└── routes/
    ├── index.tsx            # Route configuration
    └── PrivateRoute.tsx     # Protected route wrapper
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_JWT_SECRET=your-jwt-secret-key
VITE_APP_NAME=AI E-Commerce
VITE_APP_VERSION=1.0.0
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building

Build for production:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview production build:
```bash
npm run preview
```

## 🧹 Linting

Run ESLint:
```bash
npm run lint
```

## 🎨 Key Technologies

### Frontend Framework
- **React 18.2.0** - Latest React with concurrent features
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Vite 5.0.8** - Next-generation frontend tooling

### State Management
- **Redux Toolkit 2.0.1** - Official Redux toolset
- **React Redux 9.0.4** - React bindings for Redux

### Routing
- **React Router DOM 6.21.0** - Declarative routing

### HTTP Client
- **Axios 1.6.2** - Promise-based HTTP client

### Styling
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **PostCSS 8.4.32** - CSS transformations
- **Autoprefixer 10.4.16** - Vendor prefix automation

## 🔐 Authentication

The application includes a complete authentication system:

- JWT-based authentication
- Token storage in localStorage
- Automatic token refresh
- Protected routes for authenticated users
- Login and registration forms with validation
- User profile management

## 🛒 Shopping Features

### Product Management
- Product listing with pagination
- Product search and filtering
- Category filtering
- Product detail pages with image gallery
- Product ratings and reviews

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart (localStorage)
- Real-time total calculation
- Cart synchronization for authenticated users

### Checkout Process
- Shipping address form
- Multiple payment methods
- Form validation
- Order summary
- Order confirmation

### Order Management
- Order history
- Order details
- Order status tracking
- Order cancellation

## 🎯 API Integration

The application is designed to work with a RESTful API. Configure the API endpoint in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Expected API Endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

#### Products
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get product by ID
- `GET /products/featured` - Get featured products
- `GET /products/category/:category` - Get products by category
- `GET /products/search?q=query` - Search products

#### Cart
- `GET /cart` - Get user cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove cart item
- `DELETE /cart` - Clear cart

#### Orders
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id/cancel` - Cancel order

#### User
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/password` - Change password
- `POST /users/avatar` - Upload avatar

## 🎨 Customization

### Theme Colors
Customize the primary color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
}
```

### Constants
Update application constants in `src/utils/constants.ts`

### Categories
Modify product categories in `src/utils/constants.ts`:

```typescript
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  // Add your categories
] as const;
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- XSS protection through React's built-in sanitization
- CSRF token support ready
- Secure authentication flow
- Protected routes
- Input validation
- Error handling

## 🚧 Future Enhancements

- [ ] AI-powered product recommendations
- [ ] Social authentication (Google, Facebook)
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Multiple image upload
- [ ] Real-time notifications
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] PWA support
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@ai-ecommerce.com or create an issue in the repository.
