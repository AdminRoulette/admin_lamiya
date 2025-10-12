const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const ratingRouter = require('./ratingRouter');
const ordersRouter = require('./ordersRouter');
const supplysRouter = require('./supplysRouter');
const addressesRouter = require('./addressesRouter');
const promoCodeRouter = require('./promoCodeRouter');
const rozetkaRouter = require('./rozetkaRouter');
const checkBoxRouter = require('./checkBox/checkBoxRouter');
const wishRouter = require('./wishRouter');
const searchRouter = require('./searchRouter');
const monoRouter = require('./monoRouter');
const accountingRouter = require('./accountingRouter');
const waitProductRouter = require('./waitProductRouter');
const seoRouter = require('./seoRouter');
const filtersRouter = require('./filtersRouter');
const blogRouter = require('./blogRouter');
const priceTagsRouter = require('./priceTagsRouter');
const financeRouter = require('./financeRouter');
const storeRouter = require('./storeRouter');

router.use('/finance', financeRouter)
router.use('/blog', blogRouter)
router.use('/price-tags', priceTagsRouter)
router.use('/promo', promoCodeRouter)
router.use('/user', userRouter)
router.use('/seo', seoRouter)
router.use('/category',categoryRouter)
router.use('/checkBox', checkBoxRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/basket', basketRouter)
router.use('/rating', ratingRouter)
router.use('/orders', ordersRouter)
router.use('/supply', supplysRouter)
router.use('/addresses', addressesRouter)
router.use('/rozetka', rozetkaRouter)
router.use('/wish', wishRouter)
router.use('/search', searchRouter)
router.use('/mono', monoRouter)
router.use('/accounting', accountingRouter)
router.use('/wait-product', waitProductRouter)
router.use('/filters', filtersRouter)
router.use('/store', storeRouter)
module.exports = router;
