const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Blog = sequelize.define('blog', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    active: {type: DataTypes.BOOLEAN, defaultValue: false},
    popular: {type: DataTypes.BOOLEAN, defaultValue: false},
    link: {type: DataTypes.STRING(255), unique: true, defaultValue: ""},
    header: {type: DataTypes.STRING(255)},
    sub_header: {type: DataTypes.STRING(255)},
    header_ru: {type: DataTypes.STRING()},
    sub_header_ru: {type: DataTypes.STRING(255)},
    image: {type: DataTypes.STRING(255)},
    views_count: {type: DataTypes.INTEGER, defaultValue: 0},
    likes_count: {type: DataTypes.INTEGER, defaultValue: 0},
    comments_count: {type: DataTypes.INTEGER, defaultValue: 0},
    word_count: {type: DataTypes.INTEGER},
    read_time: {type: DataTypes.INTEGER},
    content_menu: {type: DataTypes.JSON()},
    content_menu_ru: {type: DataTypes.JSON()},
    faq: {type: DataTypes.STRING(3000)},
    faq_ru: {type: DataTypes.STRING(3000)},
    text: {type: DataTypes.STRING(50000)},
    text_ru: {type: DataTypes.STRING(50000)}
});
const BlogCategories = sequelize.define('blog_categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255)},
    name_ru: {type: DataTypes.STRING(255)},
    code: {type: DataTypes.STRING(100), unique: true}
});
const BlogAuthors = sequelize.define('blog_authors', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255)},
    name_ru: {type: DataTypes.STRING(255)},
    code: {type: DataTypes.STRING(255), unique: true},
    photo: {type: DataTypes.STRING(255)},
    instagram: {type: DataTypes.STRING(255)},
    telegram: {type: DataTypes.STRING(255)},
    facebook: {type: DataTypes.STRING(255)},
    about: {type: DataTypes.STRING(2000)},
    skills: {type: DataTypes.STRING(2000)}
});
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    profileImage: {type: DataTypes.STRING, defaultValue: ""},
    lastname: {type: DataTypes.STRING, defaultValue: ""},
    firstname: {type: DataTypes.STRING, defaultValue: ""},
    fullname: {type: DataTypes.STRING, defaultValue: ""},
    phone: {type: DataTypes.STRING, defaultValue: ""},
    ref: {type: DataTypes.STRING(30), defaultValue: ""},
});

const Expenses = sequelize.define('expenses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255), defaultValue: ""},
    type: {type: DataTypes.STRING(255), defaultValue: ""},
    money: {type: DataTypes.INTEGER, defaultValue: 0}
});
const BasketDevice = sequelize.define('basket_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, defaultValue: 1}
});

const WishList = sequelize.define('wish_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    notifyInStock: {type: DataTypes.BOOLEAN, defaultValue: false},
});
const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    name: {type: DataTypes.STRING, allowNull: false},
    name_ru: {type: DataTypes.STRING, defaultValue: ""},
    status: {type: DataTypes.STRING(50), defaultValue: ""}, //new
    company: {type: DataTypes.STRING(50), defaultValue: ""}, //delete
    rating: {type: DataTypes.DOUBLE, defaultValue: 0},
    ratingCount: {type: DataTypes.INTEGER, defaultValue: 0},
    disc: {type: DataTypes.STRING(2000), defaultValue: ""},
    disc_ru: {type: DataTypes.STRING(2000), defaultValue: ""},
    weekdiscount: {type: DataTypes.BOOLEAN, defaultValue: false},
    hit: {type: DataTypes.BOOLEAN, defaultValue: false},
    series: {type: DataTypes.STRING(255), defaultValue: ""},
    tags: {type: DataTypes.STRING(1024), defaultValue: ""},
    tags_ru: {type: DataTypes.STRING(1024), defaultValue: ""},
    series_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    stock: {type: DataTypes.BOOLEAN, defaultValue: false},
    link: {type: DataTypes.STRING(255), defaultValue: "", unique: true},
    score: {type: DataTypes.INTEGER, defaultValue: 0}
});
const DeviceImage = sequelize.define('deviceimage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, defaultValue: ""},
    index: {type: DataTypes.INTEGER}
});
const ParfumePart = sequelize.define('parfumepart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER, defaultValue: 0},
    partcount: {type: DataTypes.INTEGER, defaultValue: 0}, //залишок у флаконі
    refund_count: {type: DataTypes.INTEGER, defaultValue: 0}, //залишок поза межами флакона
    on_tab_price: {type: DataTypes.INTEGER, defaultValue: 0}
});
const DeviceOptions = sequelize.define('deviceoption', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER, defaultValue: 0},
    optionName: {type: DataTypes.STRING(255), defaultValue: ""},
    optionName_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.INTEGER, defaultValue: 0},
    saleprice: {type: DataTypes.INTEGER, defaultValue: 0},
    weight: {type: DataTypes.FLOAT, defaultValue: 100},
    startPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    index: {type: DataTypes.INTEGER, defaultValue: 0},
    gtin: {type: DataTypes.STRING(25), defaultValue: ""},
    marketPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    marketPromoPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    marketOldPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    sell_type: {type: DataTypes.STRING(50), defaultValue: ""},
    preorder: {type: DataTypes.BOOLEAN, defaultValue: false}, // під замовлення - до 7 днів
    storage: {type: DataTypes.BOOLEAN, defaultValue: false}, //на складі відправка - завтра
    on_tab: {type: DataTypes.BOOLEAN, defaultValue: false}, //розпив
    sell_bottle: {type: DataTypes.BOOLEAN, defaultValue: false}, // чи продається залишок у флаконі? ( false - якщо dramming\refill)
    code: {type: DataTypes.STRING(100), defaultValue: ""}, // кода товарів у постачальників
    active_code: {type: DataTypes.STRING(20), defaultValue: ""} //активний код, за яким ми взяли ціну товару для дропа
});

const StockHistory = sequelize.define('stock_history', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    old_count: {type: DataTypes.STRING(10)},
    new_count: {type: DataTypes.STRING(10)},
    action: {type: DataTypes.STRING(50), defaultValue: ""},
});


const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255), defaultValue: ""},
    name_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    name_alter: {type: DataTypes.STRING(255), defaultValue: ""},
    name_alter_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    code: {type: DataTypes.STRING(255), defaultValue: ""}
})
const BodyCarePart = sequelize.define('bodycarepart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER, defaultValue: 0},
    composition: {type: DataTypes.STRING(2000), defaultValue: ""},
    applicationmethod: {type: DataTypes.STRING(500), defaultValue: ""},
    activecomponents: {type: DataTypes.STRING(2501), defaultValue: ""},
    applicationmethod_ru: {type: DataTypes.STRING(500), defaultValue: ""},
    activecomponents_ru: {type: DataTypes.STRING(2501), defaultValue: ""},
});

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING(100), defaultValue: ""},
    empty: {type: DataTypes.BOOLEAN, defaultValue: true},
    popular: {type: DataTypes.BOOLEAN, defaultValue: false},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    name_ru: {type: DataTypes.STRING(100), defaultValue: ""}
});

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    deviceId: {type: DataTypes.INTEGER, defaultValue: 0},
    comment: {type: DataTypes.STRING(2500), defaultValue: ""},
    video: {type: DataTypes.STRING(500), defaultValue: ""},
    moderation: {type: DataTypes.BOOLEAN, defaultValue: false},
    username: {type: DataTypes.STRING(100), defaultValue: ""},
    bought: {type: DataTypes.BOOLEAN, defaultValue: false},
    emailrequest: {type: DataTypes.BOOLEAN, defaultValue: true},
});
const RatingReply = sequelize.define('ratingreply', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    ratingId: {type: DataTypes.INTEGER, defaultValue: 0},
    replycomment: {type: DataTypes.STRING(1500), defaultValue: ""},
    replymoderation: {type: DataTypes.BOOLEAN, defaultValue: false},
    username: {type: DataTypes.STRING(100), defaultValue: ""},
});
const RatingImage = sequelize.define('ratingimage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, defaultValue: ""},
});

const PromoCodes = sequelize.define('promocode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING(20), defaultValue: ""},
    privacy: {type: DataTypes.BOOLEAN, defaultValue: true},
    percent: {type: DataTypes.BOOLEAN, defaultValue: true},
    sum: {type: DataTypes.INTEGER, defaultValue: 0},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    expdate: {type: DataTypes.DATE},
    minOrder: {type: DataTypes.INTEGER, defaultValue: 0},
})
const Orders = sequelize.define('orders', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    postMethod: {type: DataTypes.STRING, defaultValue: ""},
    userId: {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
    totalPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    moneyLose: {type: DataTypes.INTEGER, defaultValue: 0},
    comment: {type: DataTypes.STRING, defaultValue: ""},
    privacy_comment: {type: DataTypes.STRING, defaultValue: ""},
    moneyCard: {type: DataTypes.INTEGER, defaultValue: 0},
    paymentMethods: {type: DataTypes.JSON, allowNull: false, defaultValue: []},
    promo: {type: DataTypes.STRING(20), defaultValue: ""},
    source: {type: DataTypes.STRING(30), defaultValue: ""},
    totalProfit: {type: DataTypes.INTEGER, defaultValue: 0},
    statusId: {type: DataTypes.INTEGER, defaultValue: 10000}, //delete
    status_id: {type: DataTypes.STRING(20), defaultValue: "new"},
    preorder: {type: DataTypes.BOOLEAN, defaultValue: false},
    finance_phone: {type: DataTypes.STRING(25), defaultValue: ""},
})
const DeliveryOrder = sequelize.define('delivery_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    poshta_status_id: {type: DataTypes.STRING(25), defaultValue: null},
    firstName: {type: DataTypes.STRING, defaultValue: ""},
    lastName: {type: DataTypes.STRING, defaultValue: ""},
    mobile: {type: DataTypes.STRING(20), defaultValue: ""},
    email: {type: DataTypes.STRING(50), defaultValue: ""},
    ttn: {type: DataTypes.STRING, defaultValue: ""},
    warehouseRef: {type: DataTypes.STRING(100), defaultValue: ""},
    apartment: {type: DataTypes.STRING(20), defaultValue: ""},
    house: {type: DataTypes.STRING(20), defaultValue: ""},
    streetRef: {type: DataTypes.STRING(100), defaultValue: ""},
    full_delivery_address: {type: DataTypes.STRING(255), defaultValue: ""},
    full_delivery_address_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    cityRef: {type: DataTypes.STRING(100), defaultValue: ""},
    ttnRef: {type: DataTypes.STRING(100), defaultValue: ""},
    recipientRef: {type: DataTypes.STRING(100), defaultValue: ""},
    deliveryDate: {type: DataTypes.STRING(100), defaultValue: ""},
    deliveryPrice: {type: DataTypes.INTEGER, defaultValue: 0},
    deliveryPay: {type: DataTypes.STRING(20), defaultValue: ""},
    moneyBack: {type: DataTypes.INTEGER, defaultValue: 0},
    contactRecipientRef: {type: DataTypes.STRING(100), defaultValue: ""},
})
const nova_poshta_cities = sequelize.define('nova_poshta_cities', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), defaultValue: ""},
    name_ru: {type: DataTypes.STRING(100), defaultValue: ""},
    type: {type: DataTypes.INTEGER, defaultValue: 0},
    fullName: {type: DataTypes.STRING(255), defaultValue: ""},
    fullName_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    ref: {type: DataTypes.STRING(36), unique: true}
})
const nova_poshta_warehouses = sequelize.define('nova_poshta_warehouses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.BOOLEAN, defaultValue: true},
    name: {type: DataTypes.STRING(255), defaultValue: ""},
    name_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    cityRef: {type: DataTypes.STRING(55)},
    warehouse_id: {type: DataTypes.STRING(55), unique: true},
    number: {type: DataTypes.INTEGER},
    type: {type: DataTypes.STRING(10)},
    longitude: {type: DataTypes.STRING(100)},
    latitude: {type: DataTypes.STRING(100)},
    schedule: {type: DataTypes.STRING(550)},
    index: {type: DataTypes.STRING(36)}
})
const nova_poshta_streets = sequelize.define('nova_poshta_streets', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255), defaultValue: ""},
    cityRef: {type: DataTypes.STRING(55)},
    ref: {type: DataTypes.STRING(55), defaultValue: ""},
    type: {type: DataTypes.STRING(20), defaultValue: ""},
    typeRef: {type: DataTypes.STRING(20), defaultValue: ""}
})
const ukr_poshta_cities = sequelize.define('ukr_poshta_cities', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), defaultValue: ""},
    fullName: {type: DataTypes.STRING(255), defaultValue: ""},
    city_id: {type: DataTypes.STRING(10), unique: true},
    region_id: {type: DataTypes.STRING(10)},
    district_id: {type: DataTypes.STRING(10)},
    population: {type: DataTypes.INTEGER},
    KATOTTG: {type: DataTypes.STRING(36)},
    KOATUU: {type: DataTypes.STRING(36)},
    longitude: {type: DataTypes.STRING(36)},
    latitude: {type: DataTypes.STRING(36)}
})
const ukr_poshta_warehouses = sequelize.define('ukr_poshta_warehouses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.BOOLEAN, defaultValue: true},
    name: {type: DataTypes.STRING(255), defaultValue: ""},
    index: {type: DataTypes.STRING(10), defaultValue: ""},
    postcode: {type: DataTypes.STRING(10), defaultValue: ""},
    warehouse_id: {type: DataTypes.STRING(10), defaultValue: ""},
    city_id: {type: DataTypes.STRING(10)},
    type: {type: DataTypes.STRING(10)},
    longitude: {type: DataTypes.STRING(50)},
    latitude: {type: DataTypes.STRING(50)},
    schedule: {type: DataTypes.STRING(255)},
    type_acr: {type: DataTypes.STRING(36)}
})

const ChecksOrder = sequelize.define('checks_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    checkuuid: {type: DataTypes.STRING(50), defaultValue: ""},
    return: {type: DataTypes.BOOLEAN, defaultValue: false},
    sent_to_email: {type: DataTypes.BOOLEAN, defaultValue: false} // відмічати після натискання на кнопку отримати на емейл шоб не спамили через чекбокс
})

const PaymentOrder = sequelize.define('payment_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING(100), defaultValue: ""},
    sub_status: {type: DataTypes.STRING(100), defaultValue: ""},
    invoiceId: {type: DataTypes.STRING(100), defaultValue: ""},
    lastInvoiceUpdate: {type: DataTypes.DATE, defaultValue: null},
    link: {type: DataTypes.STRING(255), defaultValue: ""},
})
const Supply = sequelize.define('supply', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING(20), defaultValue: "new"},
    invoice: {type: DataTypes.STRING, defaultValue: ""},
    comment: {type: DataTypes.STRING(500), defaultValue: ""},
    company: {type: DataTypes.STRING(50), defaultValue: ""},
    deposit: {type: DataTypes.BOOLEAN, defaultValue: false},
    cost: {type: DataTypes.INTEGER, defaultValue: 0},
    extra_costs: {type: DataTypes.INTEGER, defaultValue: 0}
})
const SupplyProducts = sequelize.define('supply_products', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER, defaultValue: 0},
    sell_price: {type: DataTypes.INTEGER, defaultValue: 0},
    market_price: {type: DataTypes.INTEGER, defaultValue: 0},
    count: {type: DataTypes.INTEGER, defaultValue: 0}
})

const OrderDevice = sequelize.define('order_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order_id: {type: DataTypes.INTEGER, allowNull: false},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.INTEGER, defaultValue: 0},
    saleprice: {type: DataTypes.INTEGER, defaultValue: 0},
    option_id: {type: DataTypes.INTEGER, allowNull: false},
    product_name: {type: DataTypes.STRING(255), defaultValue: ""},
    product_name_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    series: {type: DataTypes.STRING(255), defaultValue: ""},
    series_ru: {type: DataTypes.STRING(255), defaultValue: ""},
    special_type: {type: DataTypes.STRING, defaultValue: ''},
})
const Category = sequelize.define('categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING(100), defaultValue: ""},
    name: {type: DataTypes.STRING},
    name_ru: {type: DataTypes.STRING, defaultValue: ""},
    level: {type: DataTypes.INTEGER, defaultValue: 2},
    vision: {type: DataTypes.BOOLEAN, defaultValue: true}
})
const Product_Category = sequelize.define('product_categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    categoryId: {type: DataTypes.INTEGER},
    productId: {type: DataTypes.INTEGER}
})

const SearchResult = sequelize.define('search_result', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
})
const WaitProducts = sequelize.define('wait_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    product: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    place: {type: DataTypes.STRING},
})
const Seo = sequelize.define('seo', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    url: {type: DataTypes.STRING(255), defaultValue: ""},
    title: {type: DataTypes.STRING(255), defaultValue: ""},
    header: {type: DataTypes.STRING(255), defaultValue: ""},
    desc: {type: DataTypes.STRING(1000), defaultValue: ""},
    keywords: {type: DataTypes.STRING(1000), defaultValue: ""},
    article: {type: DataTypes.STRING(10000), defaultValue: ""},
    noindex: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const Cashiers = sequelize.define('cashiers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    bearer: {type: DataTypes.STRING(350), defaultValue: ""},
    shift: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const FopsList = sequelize.define('fops_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), defaultValue: ""},
    ipn: {type: DataTypes.STRING(20), defaultValue: ""},
    iban: {type: DataTypes.STRING(40), defaultValue: ""},
    np_city_ref: {type: DataTypes.STRING(50), defaultValue: ""},
    np_sender_ref: {type: DataTypes.STRING(50), defaultValue: ""},
    np_sender_address_ref: {type: DataTypes.STRING(50), defaultValue: ""},
    np_sender_contact_ref: {type: DataTypes.STRING(50), defaultValue: ""},
    ukr_sender_uuid: {type: DataTypes.STRING(50), defaultValue: ""},
    sender_phone: {type: DataTypes.STRING(20), defaultValue: ""},
    total_sell: {type: DataTypes.INTEGER, defaultValue: 0},
    key: {type: DataTypes.STRING(50), defaultValue: ""},//check box ключ каси
    np_api_key: {type: DataTypes.STRING(50), defaultValue: ""},
    ukr_token: {type: DataTypes.STRING(50), defaultValue: ""},
    ukr_tracking_token: {type: DataTypes.STRING(50), defaultValue: ""},
    ukr_bearer: {type: DataTypes.STRING(50), defaultValue: ""},
    mono_account_key: {type: DataTypes.STRING(50), defaultValue: ""},
    mono_fop_key: {type: DataTypes.STRING(50), defaultValue: ""},
})

const Shops = sequelize.define('shops', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    city: {type: DataTypes.STRING(100), defaultValue: ""},
    address: {type: DataTypes.STRING(255), defaultValue: ""},
    phone: {type: DataTypes.STRING(20), defaultValue: ""},
    schedule: {type: DataTypes.STRING(500), defaultValue: ""},
    description: {type: DataTypes.STRING(255), defaultValue: ""},
    cash: {type: DataTypes.INTEGER, defaultValue: 0},
})
const PriceTags = sequelize.define('price_tags', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING(50), defaultValue: ""},
    printed: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const Collection = sequelize.define('collection', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    cash_count: {type: DataTypes.INTEGER, allowNull: false},
    shop_id: {type: DataTypes.INTEGER, allowNull: false},
    comment: {type: DataTypes.STRING(500), defaultValue: ""},
});
const UserStats = sequelize.define('user_stats', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completed_orders: { type: DataTypes.INTEGER, defaultValue: 1 },
    completed_percent: { type: DataTypes.DOUBLE, defaultValue: 100 },
    total_orders: { type: DataTypes.INTEGER, defaultValue: 1 },
    failed_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
    phone: {type: DataTypes.STRING(13), defaultValue: "", allowNull: false},
    comment: {type: DataTypes.STRING(255), defaultValue: ""},
});

const SimilarDevices = sequelize.define('similar_devices', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: {type: DataTypes.INTEGER, allowNull: false},
    similarId: {type: DataTypes.INTEGER, allowNull: false},
});

//---------------------------
const Filters = sequelize.define('filters', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(50), defaultValue: ""},
    name_ru: {type: DataTypes.STRING(50), defaultValue: ""},
    code: {type: DataTypes.STRING(50), defaultValue: ""}
})

const FilterValues = sequelize.define('filter_values', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), defaultValue: ""},
    name_ru: {type: DataTypes.STRING(100), defaultValue: ""},
    code: {type: DataTypes.STRING(100), defaultValue: ""},
    filter_id: {type: DataTypes.INTEGER}
})

const FilterProductValue = sequelize.define('filter_product_value', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER },
    filter_value_id: { type: DataTypes.INTEGER }
});

const FilterCategoryValue = sequelize.define('filter_category_values', {
    category_id: {type: DataTypes.INTEGER},
    filter_value_id: {type: DataTypes.INTEGER},
});

Filters.hasMany(FilterValues, { foreignKey: 'filter_id', onDelete: 'CASCADE' });
FilterValues.belongsTo(Filters, { foreignKey: 'filter_id', onDelete: 'CASCADE' });

Device.belongsToMany(FilterValues, {
    through: FilterProductValue,
    foreignKey: 'product_id',
    otherKey: 'filter_value_id',
    onDelete: 'CASCADE'
});

FilterValues.belongsToMany(Device, {
    through: FilterProductValue,
    foreignKey: 'filter_value_id',
    otherKey: 'product_id',
    onDelete: 'CASCADE'
});

Device.belongsToMany(Device, {
    as: 'similarDevices',
    through: SimilarDevices,
    foreignKey: 'deviceId',
    otherKey: 'similarId',
});

Category.hasMany(FilterCategoryValue, {foreignKey: 'category_id', onDelete: 'CASCADE'});
FilterCategoryValue.belongsTo(Category, {foreignKey: 'category_id', onDelete: 'CASCADE'});
FilterValues.hasMany(FilterCategoryValue, {foreignKey: 'filter_value_id', onDelete: 'CASCADE'});
FilterCategoryValue.belongsTo(FilterValues, {foreignKey: 'filter_value_id', onDelete: 'CASCADE'});

DeviceOptions.hasOne(SupplyProducts, {foreignKey: 'id', targetKey: 'option_id'});
SupplyProducts.belongsTo(DeviceOptions, {foreignKey: 'option_id', targetKey: 'id'});
SupplyProducts.belongsTo(User, {foreignKey: 'user_id'});

Supply.hasMany(SupplyProducts, {foreignKey: 'id', targetKey: 'supply_id'});
SupplyProducts.belongsTo(Supply, {foreignKey: 'supply_id', targetKey: 'id'});
Supply.belongsTo(User, {foreignKey: 'user_id'});

Collection.belongsTo(User, {foreignKey: 'user_id'});
User.hasMany(Collection, {foreignKey: 'user_id'});
Collection.belongsTo(Shops, {foreignKey: 'shop_id'});
Shops.hasMany(Collection, {foreignKey: 'shop_id'});

PriceTags.belongsTo(Shops, {foreignKey: 'shop_id'});
Shops.hasMany(PriceTags, {foreignKey: 'shop_id'});

DeviceOptions.hasMany(PriceTags, {foreignKey: 'option_id'});
PriceTags.belongsTo(DeviceOptions,
    {
        foreignKey: {name: 'option_id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
);

StockHistory.belongsTo(Orders, {foreignKey: 'order_id', targetKey: 'id'});
StockHistory.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
StockHistory.belongsTo(DeviceOptions, {foreignKey: 'option_id', targetKey: 'id'});

FopsList.hasMany(Cashiers, { foreignKey: 'fop_id' });
Cashiers.belongsTo(FopsList, { foreignKey: 'fop_id' });

Cashiers.belongsTo(Shops, {foreignKey: 'shop_id', targetKey: 'id'});

Orders.belongsTo(FopsList, {foreignKey: 'fop_id', targetKey: 'id'});

Category.hasMany(Category, {as: 'child', foreignKey: 'parentId'});
Category.belongsTo(Category, {as: 'parent', foreignKey: 'parentId'});

Device.hasMany(Product_Category, {foreignKey: {name: 'productId'}, onDelete: 'CASCADE'});
Product_Category.belongsTo(Category, {foreignKey: 'categoryId', as: 'category'});
Category.hasMany(Product_Category, {foreignKey: 'categoryId', as: 'category'});

Blog.belongsTo(BlogAuthors, {foreignKey: 'author_id'});
BlogAuthors.hasMany(Blog, {foreignKey: 'author_id'});

Blog.belongsTo(BlogCategories, {foreignKey: 'category_id'});
BlogCategories.hasMany(Blog, {foreignKey: 'category_id'});

Orders.hasMany(ChecksOrder);
ChecksOrder.belongsTo(Orders, {onDelete: 'CASCADE'});

Country.hasMany(Device, {
    foreignKey: {name: 'countryId'},
});
Device.belongsTo(Country);

User.hasOne(Cashiers);
Cashiers.belongsTo(User);

Rating.hasMany(RatingReply);
RatingReply.belongsTo(Rating, {
    foreignKey: {name: 'ratingId'},
    onDelete: 'CASCADE',
});

Device.hasMany(Rating);
Rating.belongsTo(Device, {
    foreignKey: {name: 'deviceId'},
    onDelete: 'CASCADE',
});

Rating.hasMany(RatingImage);
RatingImage.belongsTo(Rating, {
    foreignKey: {name: 'ratingId'}
});

User.hasMany(Orders);
Orders.belongsTo(User,
    {
        foreignKey: {name: 'userId'},
        onDelete: 'CASCADE',
    }
);
Orders.hasMany(OrderDevice, {foreignKey: 'order_id'});
OrderDevice.belongsTo(Orders,
    {
        foreignKey: {name: 'order_id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
);
DeviceOptions.hasMany(OrderDevice, {foreignKey: 'option_id'});
OrderDevice.belongsTo(DeviceOptions,
    {
        foreignKey: {name: 'option_id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
);

Orders.hasOne(DeliveryOrder);
DeliveryOrder.belongsTo(Orders);
Orders.hasOne(PaymentOrder);
PaymentOrder.belongsTo(Orders);

Device.hasMany(DeviceOptions);
DeviceOptions.belongsTo(Device);

DeviceOptions.hasMany(WishList);
WishList.belongsTo(DeviceOptions,
    {
        foreignKey: {name: 'deviceoptionId'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
);
DeviceOptions.hasMany(BasketDevice);
BasketDevice.belongsTo(DeviceOptions,
    {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
User.hasMany(BasketDevice);
BasketDevice.belongsTo(User);

User.hasMany(WishList);
WishList.belongsTo(User);

DeviceImage.belongsTo(DeviceOptions, {foreignKey: 'option_id'});
DeviceOptions.hasMany(DeviceImage, {foreignKey: 'option_id'});

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasOne(ParfumePart);
ParfumePart.belongsTo(Device);

Device.hasOne(BodyCarePart);
BodyCarePart.belongsTo(Device);

DeliveryOrder.belongsTo(nova_poshta_warehouses, {
    foreignKey: 'warehouseRef',
    targetKey: 'warehouse_id'
});

DeliveryOrder.belongsTo(ukr_poshta_warehouses, {
    foreignKey: 'warehouseRef',
    targetKey: 'postcode'
});
DeliveryOrder.belongsTo(nova_poshta_cities, {
    foreignKey: 'cityRef',
    targetKey: 'ref'
});

DeliveryOrder.belongsTo(ukr_poshta_cities, {
    foreignKey: 'cityRef',
    targetKey: 'city_id'
});

nova_poshta_cities.hasMany(nova_poshta_warehouses, {
    foreignKey: 'cityRef',
    sourceKey: 'ref',
});
nova_poshta_warehouses.belongsTo(nova_poshta_cities, {
    foreignKey: 'cityRef',
    targetKey: 'ref',
});
nova_poshta_cities.hasMany(nova_poshta_streets, {
    foreignKey: 'cityRef',
    sourceKey: 'ref',
});
nova_poshta_streets.belongsTo(nova_poshta_cities, {
    foreignKey: 'cityRef',
    targetKey: 'ref',
});
ukr_poshta_cities.hasMany(ukr_poshta_warehouses, {
    foreignKey: 'city_id',
    sourceKey: 'city_id',
});
ukr_poshta_warehouses.belongsTo(ukr_poshta_cities, {
    foreignKey: 'city_id',
    targetKey: 'city_id',
});


module.exports = {
    Seo,
    SimilarDevices,
    SearchResult,
    SupplyProducts,
    WaitProducts,
    PaymentOrder,
    WishList,
    DeviceOptions,
    DeviceImage,
    RatingImage,
    PromoCodes,
    User,
    Cashiers,
    FopsList,
    ParfumePart,
    BodyCarePart,
    BasketDevice,
    Device,
    Brand,
    DeliveryOrder,
    ChecksOrder,
    Rating,
    RatingReply,
    Product_Category,
    Expenses,
    Collection,
    Country,
    Orders,
    OrderDevice,
    Supply,
    Category,
    Shops,
    Blog,
    BlogCategories,
    StockHistory,
    BlogAuthors,
    nova_poshta_cities,
    nova_poshta_warehouses,
    ukr_poshta_cities,
    ukr_poshta_warehouses,
    PriceTags,
    FilterCategoryValue,
    FilterValues,
    Filters,
    FilterProductValue,
    UserStats,
    nova_poshta_streets
}
