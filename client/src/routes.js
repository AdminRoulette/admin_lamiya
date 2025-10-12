import React,{ Suspense } from "react";
import Loader from "@/components/Loader/Loader";
import {
    ACCOUNTING_ROUTE,
    BLOG_ROUTE,
    BRANDS_ROUTE,
    CATEGORIES_ROUTE,
    FINANCE_ROUTE,
    LOGIN_ROUTE,
    ORDERS_ROUTE,
    PRICETAGS_ROUTE,
    PRODUCT_ROUTE,
    PROMO_CODES_ROUTE,
    PRRO_ROUTE,
    RATINGS_ROUTE,
    SEARCH_ROUTE,
    SEO_ROUTE, STOCK_HISTORY,
    SUPPLY_ROUTE, TESTING_ROUTE, USERS_ROUTE,
    WAIT_PRODUCTS_ROUTE
} from "@/utils/constants";

const Main = React.lazy(() => import("./pages/Main"));
const LoginPage = React.lazy(() => import("./pages/LoginPage/LoginPage"));
const Accounting = React.lazy(() => import("./pages/Accounting/Accounting"));
const Product = React.lazy(() => import("./pages/Product/Product"));
const Orders = React.lazy(() => import("./pages/Orders/Orders"));
const Search = React.lazy(() => import("./pages/Search/Search"));
const Finance = React.lazy(() => import("./pages/Finance/Finance"));
const Supply = React.lazy(() => import("./pages/Supply/Supply"));
const WaitProducts = React.lazy(() => import("./pages/WaitProducts/WaitProducts"));
const Categories = React.lazy(() => import("./pages/Categories/Categories"));
const PromoCodes = React.lazy(() => import("./pages/PromoCodes/PromoCodes"));
const Testing = React.lazy(() => import("@/pages/Testing/Testing"));
const PriceTags = React.lazy(() => import("./pages/PriceTags/PriceTags"));
const Ratings = React.lazy(() => import("./pages/Ratings/Ratings"));
const Brands = React.lazy(() => import("./pages/Moderations/Brands/Brands"));
const Users = React.lazy(() => import("./pages/Users/Users"));
const Seo = React.lazy(() => import("@/pages/Seo/Seo"));
const Blog = React.lazy(() => import("@/pages/Blog/Blog"));
const PreviewPage  = React.lazy(() => import("@/pages/Blog/PreviewPage/PreviewPage"));
const StockHistory  = React.lazy(() => import("@/pages/StockHistory/StockHistory"));

const LazyMain = () => (
    <Suspense fallback={<Loader />}>
        <Main />
    </Suspense>
);
const LazyStockHistory = () => (
    <Suspense fallback={<Loader />}>
        <StockHistory />
    </Suspense>
);
const LazyAccounting = () => (
    <Suspense fallback={<Loader />}>
        <Accounting />
    </Suspense>
);
const LazyProduct = () => (
    <Suspense fallback={<Loader />}>
        <Product />
    </Suspense>
);
const LazyOrders = () => (
    <Suspense fallback={<Loader />}>
        <Orders />
    </Suspense>
);
const LazyFinance = () => (
    <Suspense fallback={<Loader />}>
        <Finance />
    </Suspense>
);
const LazySearch = () => (
    <Suspense fallback={<Loader />}>
        <Search />
    </Suspense>
);
const LazySupply = () => (
    <Suspense fallback={<Loader />}>
        <Supply />
    </Suspense>
);
const LazyWaitProducts = () => (
    <Suspense fallback={<Loader />}>
        <WaitProducts />
    </Suspense>
);
const LazyCategories = () => (
    <Suspense fallback={<Loader />}>
        <Categories />
    </Suspense>
);
const LazyPromoCodes = () => (
    <Suspense fallback={<Loader />}>
        <PromoCodes />
    </Suspense>
);
const LazyTesting = () => (
    <Suspense fallback={<Loader />}>
        <Testing />
    </Suspense>
);
const LazyRatings = () => (
    <Suspense fallback={<Loader />}>
        <Ratings />
    </Suspense>
);
const LazyBrands = () => (
    <Suspense fallback={<Loader />}>
        <Brands />
    </Suspense>
);
const LazyUsers = () => (
    <Suspense fallback={<Loader />}>
        <Users />
    </Suspense>
);
const LazyPriceTags = () => (
    <Suspense fallback={<Loader />}>
        <PriceTags />
    </Suspense>
);

export const adminRoutes = [
    {
        path: `/`,
        Component: LazyMain
    },
    {
    path: `${STOCK_HISTORY}`,
    Component: LazyStockHistory
    },
    {
        path: `${ACCOUNTING_ROUTE}`,
        Component: LazyAccounting
    },
    {
        path: `${BRANDS_ROUTE}`,
        Component: LazyBrands
    },
    {
        path: `${USERS_ROUTE}/:userParam`,
        Component: LazyUsers
    },
    {
        path: `${PRODUCT_ROUTE}`,
        Component: LazyProduct
    },
    {
        path: `${PRODUCT_ROUTE}/*`,
        Component: LazyProduct
    },
    {
        path: `${ORDERS_ROUTE}/:orderParam`,
        Component: LazyOrders
    },
    {
        path: `${FINANCE_ROUTE}/:financeParam`,
        Component: LazyFinance
    },
    {
        path: `${SEARCH_ROUTE}/:searchParam`,
        Component: LazySearch
    },
    {
        path: `${SUPPLY_ROUTE}/:supplyParam`,
        Component: LazySupply
    },
    {
        path: `${WAIT_PRODUCTS_ROUTE}`,
        Component: LazyWaitProducts
    },
    {
        path: `${PROMO_CODES_ROUTE}`,
        Component: LazyPromoCodes
    },
    {
        path: `${TESTING_ROUTE}`,
        Component: LazyTesting
    },
    {
        path: `${RATINGS_ROUTE}`,
        Component: LazyRatings
    },
    {
        path: `${PRICETAGS_ROUTE}`,
        Component: LazyPriceTags
    }

]

export const filterRoutes = [
    {
        path: `${CATEGORIES_ROUTE}`,
        Component: LazyCategories
    }
]

const LazySeo = () => (
    <Suspense fallback={<Loader />}>
        <Seo />
    </Suspense>
);

export const seoRoutes = [
    {
        path: `${SEO_ROUTE}`,
        Component: LazySeo
    }
]

const LazyBlog = () => (
    <Suspense fallback={<Loader />}>
        <Blog />
    </Suspense>
);
const LazyBlogPreview = () => (
    <Suspense fallback={<Loader />}>
        <PreviewPage />
    </Suspense>
);

export const authorRoutes = [
    {
        path: `${BLOG_ROUTE}`,
        Component: LazyBlog
    },
    {
        path: `${BLOG_ROUTE}/:page`,
        Component: LazyBlog
    },
    {
        path: `${BLOG_ROUTE}/:page/:link`,
        Component: LazyBlog
    },
    {
        path: `${BLOG_ROUTE}/preview/:link`,
        Component: LazyBlogPreview
    },
    {
        path: `${PRODUCT_ROUTE}`,
        Component: LazyProduct
    }
]


const LazyLoginPage = () => (
    <Suspense fallback={<Loader />}>
        <LoginPage />
    </Suspense>
);

export const publicRoutes = [
    {
        path: `${LOGIN_ROUTE}`,
        Component: LazyLoginPage
    }
]


