class ProductPageDetector {
    static _getParentsSelectors() {
        return [
            'header',
            '#header',
            '.header',
            '#header-main',
            '.header-main',
            '#head',
            '.head',
            '#menu',
            '.menu',
            'footer',
            '#footer',
            '.footer',
            '#footerNav',
            '.footerNav'
        ];
    }

    static _getTopExactSites() {
        return [
            'letyshops.com',
            'letyshops.ru',
            'mail.ru',
            'gmail.com',
            'lenta.ru',
            'drom.ru',
            'rambler.ru',
            'rbc.ru',
            'iz.ru',
            'mk.ru',
            'hh.ru',
            'gazeta.ru',
            'vesti.ru',
            'ngs.ru',
            '2gis.ru',
            'pikabu.ru',
            'rt.com',
            'rg.ru',
            'farpost.ru',
            'life.ru',
            'woman.ru',
            'smi2.ru',
            'sport-express.ru',
            'cosmo.ru',
            'echo.msk.ru',
            'aif.ru',
            'fishki.net',
            'glavbukh.ru',
            'irecommend.ru',
            'championat.com',
            'eg.ru',
            'lentainform.com',
            'rutube.ru',
            'tass.ru',
            'cian.ru',
            'zaycev.net',
            'e1.ru',
            'sportbox.ru',
            'teleprogramma.pro',
            'dni.ru',
            'russianfood.com',
            'mirtesen.ru',
            'yaplakal.com',
            'vz.ru',
            '360tv.ru',
            'babyblog.ru',
            'rusprofile.ru',
            'wday.ru',
            'baby.ru',
            'starhit.ru',
            'banki.ru',
            'rugion.ru',
            'kommersant.ru',
            'ura.ru',
            'nbs.su',
            'tvzvezda.ru',
            'superjob.ru',
            'vokrug.tv',
            'ren.tv',
            'russian7.ru',
            'inosmi.ru',
            '1mediainvest.ru',
            '4pda.ru',
            'riafan.ru',
            'progorod43.ru',
            'animevost.org',
            'svpressa.ru',
            '1tv.ru',
            'mediafort.ru',
            'rabota.ru',
            '7dn.ru',
            '7ya.ru',
            'tnt-online.ru',
            'rlsnet.ru',
            'regnum.ru',
            'kulturologia.ru',
            'ntv.ru',
            'utro.ru',
            'fotostrana.ru',
            'avtovzglyad.ru',
            'tophotels.ru',
            'fssprus.ru',
            'povar.ru',
            'irr.ru',
            'rutracker.org',
            'news.ru',
            'hsdigital.ru',
            'kp.ru',
            'ria.ru',
            'hearst-shkulev-media.ru',
            'rt.com',
            'rsport.ru',
            'habr.com'
        ];
    }

    static _getTopSites() {
        return [
            'yandex',
            'ya',
            'vkontakte',
            'vk',
            'google',
            'youtube',
            'facebook',
            'ok',
            'odnoklassniki',
            'twitter',
            'instagram',
            'localhost'
        ];
    }

    static checkTopSites() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const pattern = /(^|\.)[-\d\w]{2,256}\.(com|com\.ua|ru|msk\.ru|by|pro|info|ua|su|tv|net|xn--p1ai)$/gmi;
            const currentHostName = window.location.hostname.toLowerCase();
            const currentHost = window.location.host.toLowerCase();

            // exclude ya market
            if (currentHostName.indexOf('market.yandex') === 0) return resolve(0);

            let matchDomain = currentHostName.match(pattern);
            if (matchDomain && matchDomain.length) {
                const sitesOnlyHostName = self._getTopSites();
                let domainArray = matchDomain[0].split('.').filter(Boolean);
                const hostName = domainArray[0];
                if (sitesOnlyHostName.indexOf(hostName) >= 0) {
                    return resolve(-1000);
                }

                const siteExact = self._getTopExactSites();
                let domainName = domainArray.join('.');
                if (siteExact.indexOf(domainName) >= 0) {
                    return resolve(-1000);
                }
            }
            if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(currentHost) || /:\d{2,}/.test(currentHost)) {
                return resolve(-1000);
            }
            return resolve(0);
        });
    }

    static checkHomePageOrStaticPages() {
        return new Promise((resolve) => {
            const locationPathName = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
            const locationHash = window.location.hash.toLowerCase();
            const locationSearch = window.location.search.toLowerCase();
            const pathEquals = [
                '',
                'index.php',
                'index.html',
                'index.htm',
                'index.aspx',
                'default.aspx',
                'index.asp',
                'default.asp',
                'catalog',
                'shop',
                'shops',
                'opt',
                'partner',
                'job',
                'vendors',
                'basket',
                'card',
                'products',
                'sale',
                'about'
            ];
            const pathContains = [
                'login',
                'registration',
                'auth',
                'delivery',
                'dostavka',
                'contact',
                'contacts',
                'kontakti',
                'kontakty',
                'feedback',
                'favorites',
                'favorite',
                'news',
                'guaranty',
                'services',
                'blog',
                'uslugi',
                'garantiya',
                'warranty',
                'oplata',
                'about-us',
                'o-nas',
                'payment',
                'sitemap',
                'forum',
                'help',
                'payment',
                'kak_zakazat'
            ];
            if (!locationHash && !locationSearch && pathEquals.indexOf(locationPathName) >= 0) {
                return resolve(-1000);
            }
            for (let i = 0; i < pathContains.length; i++) {
                if (locationPathName.indexOf(pathContains[i]) >= 0) {
                    return resolve(-1000);
                }
            }
            return resolve(0);
        });
    }

    static checkUrlRegExpTerms() {
        return new Promise((resolve) => {
            const locationPathFull = window.location.pathname + window.location.search + window.location.hash;

            const checkRegExpsNotProduct = [
                /product\/category/gmi
            ];

            for (let regexp of checkRegExpsNotProduct) {
                if (regexp.test(locationPathFull)) {
                    return resolve(-0.9);
                }
            }

            const checkRegExps = [
                /product_id[/=]\w+/gmi,
                /productid[/=]\w+/gmi,
                /product_ids[/=]\w+/gmi,
                /product_by_id[/=]\w+/gmi,
                /prod[/=]\w+/gmi,
                /product[/=]\w+/gmi,
                /products[/=]\w+/gmi,
                /id_product[/=]\w+/gmi,
                /idproduct[/=]\w+/gmi,
                /product\d+/gmi,
                /product_\d+/gmi,
                /\/p\d+/gmi,
                /\W+id[/=]\w+/gmi,
                /\W+pid[/=]\w+/gmi,
                /\W+uid[/=]\w+/gmi,
                /\W+gid[/=]\w+/gmi,
                /\W+uid_\d+/gmi,
                /tid[/=]\w+/gmi,
                /item_id[/=]\w+/gmi,
                /item[/=]+/gmi,
                /itm[/=]\w+/gmi,
                /item\d+/gmi,
                /idtov[/=]\w+/gmi,
                /tovar_id[/=]\w+/gmi,
                /tovarid[/=]\w+/gmi,
                /produkt[/=]\w+/gmi,
                /goodid[/=]\w+/gmi,
                /good_id[/=]\w+/gmi,
                /idgoods[/=]\w+/gmi,
                /id_goods[/=]\w+/gmi,
                /goods[/=]\w+/gmi,
                /good[/=]\w+/gmi,
                /good\d+/gmi,
                /model_id[/=]\w+/gmi,
                /modelid[/=]\w+/gmi,
                /model[/=]\w+/gmi,
                /articul[/=]\w+/gmi,
                /offer_id[/=]\w+/gmi,
                /offerid[/=]\w+/gmi,
                /offer[/=]\w+/gmi,
                /view\/\d+/gmi,
                /show\/\d+/gmi,
                /detail\/\w+/gmi,
                /catalog\/\d+\/\d+/gmi
            ];

            for (let regexp of checkRegExps) {
                if (regexp.test(locationPathFull)) {
                    return resolve(0.9);
                }
            }
            return resolve(0);
        });
    }

    static checkSortBlock() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const dropDownSelectors = {
                'select': 'option',
                '[class*="dropdown"]': 'li'
            };
            const searchValuesReg = /(по умолчанию|дешевых|дешевле|дороже|дорогим|название|цене|цена|высокая|низкая|имени|рейтингу)/gmi;

            for (let key in dropDownSelectors) {
                let $selectList = self._findAll(document, key);
                for (let k = 0; k < $selectList.length && k < 10; k++) {
                    let $optionList = self._findAll($selectList[k], dropDownSelectors[key]);
                    let optionLength = $optionList.length;
                    if (optionLength > 2 && optionLength < 20) {
                        let txt = $optionList.map(elem => elem.innerText).join(' ').trim().toLowerCase();
                        if (!txt.length) break;
                        let matches = txt.match(searchValuesReg);

                        if (matches && matches.length >= 2) {
                            return resolve(-0.4);
                        }
                    }
                }
            }
            return resolve(0);
        });
    }

    static checkSchemaTags() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            let countOfSchema = self._findAll(document, '[itemtype*="schema.org/Product" i]').length;
            if (countOfSchema > 0 && countOfSchema < 10) {
                return resolve(0.8);
            }
            if (countOfSchema >= 40) {
                return resolve(-0.8);
            }

            countOfSchema = self._findAll(document, '[itemtype*="schema.org/Offer" i]').length;
            if (countOfSchema > 0 && countOfSchema < 10) {
                return resolve(0.8);
            }
            if (countOfSchema >= 40) {
                return resolve(-0.8);
            }

            countOfSchema = self._findAll(document, '[itemtype*="schema.org/AggregateRating" i]').length;
            if (countOfSchema > 0 && countOfSchema < 10) {
                return resolve(0.8);
            }
            if (countOfSchema >= 40) {
                return resolve(-0.8);
            }
            return resolve(0);
        });
    }

    static checkMetaOGTag() {
        return new Promise((resolve) => {
            let countOfMetaTagType = ProductPageDetector._findAll(document, 'meta[property="og:type"][content="product" i], meta[property="og:type"][content*="item" i]').length;
            return resolve(countOfMetaTagType === 1 ? 0.8 : 0);
        });
    }

    static _isHasParents(elem, selector, maxCheckParents) {
        try {
            if (!maxCheckParents) maxCheckParents = 50;
            const isHaveSelector = selector !== undefined;
            while ((elem = elem.parentElement) !== null && maxCheckParents-- > 0) {
                if (elem.nodeType !== Node.ELEMENT_NODE) continue;

                if (!isHaveSelector || elem.matches(selector)) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    static _checkVisibility(elem, isVisible) {
        try {
            let style = getComputedStyle(elem);
            if (style.display === 'none') return !isVisible;
            if (style.visibility !== 'visible') return !isVisible;
            if (style.opacity < 0.1) return !isVisible;
            if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
                elem.getBoundingClientRect().width === 0) {
                return !isVisible;
            }
            return isVisible;
        } catch (e) {
            return false;
        }
    }

    // code from jQuery v.3.1.0
    static _offset($elem) {
        let rect = $elem.getBoundingClientRect();
        let getWindow = (elem) => {
            return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
        };
        let isWindow = (obj) => {
            return obj != null && obj === obj.window;
        };

        // Make sure element is not hidden (display: none)
        if (rect.width || rect.height) {
            let doc = $elem.ownerDocument;
            let win = getWindow(doc);
            let docElem = doc.documentElement;

            return {
                top: rect.top + win.pageYOffset - docElem.clientTop,
                left: rect.left + win.pageXOffset - docElem.clientLeft
                // top: rect.top + win.pageYOffset - docElem.clientTop,
                // left: rect.left + win.pageXOffset - docElem.clientLeft
            };
        }

        // Return zeros for disconnected and hidden elements (gh-2310)
        return rect;
    }

    static _findSingle($parentElem, selector) {
        let checkVisibility = false;
        if (selector.indexOf(':visible') !== -1) {
            selector = selector.replace(/:visible/gi, '');
            checkVisibility = true;
        }
        let result;
        let element = $parentElem.querySelector(selector);
        if (!checkVisibility || ProductPageDetector._checkVisibility(element, true)) {
            result = element;
        }

        return result;
    }

    static _findAll($parentElem, selector) {
        let checkVisibility = false;
        if (selector.indexOf(':visible') !== -1) {
            selector = selector.replace(/:visible/gi, '');
            checkVisibility = true;
        }
        let result = [];
        let elements = $parentElem.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            if (!checkVisibility || ProductPageDetector._checkVisibility(elements[i], true)) {
                result.push(elements[i]);
            }
        }

        return result;
    }

    static _findFirstFromSelector(selectors) {
        for (let selector of selectors) {
            let $findElem = ProductPageDetector._findAll(document, selector);
            if ($findElem.length === 1) {
                let contentText = $findElem[0].getAttribute('content');
                if (!contentText || !contentText.length) contentText = $findElem[0].innerText;
                if (contentText && contentText.length) return contentText;
            }
        }
        return null;
    }

    static checkPriceTag() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const maxOffsetTop = 1300;
            const minOffsetTop = 120;

            // todo check google tag `ecomm_totalvalue` https://dom-podarka.ru/catalog/useful-accessories/home-accessories/429-772-vesi-napolnie/
            const checkTerms = {
                '#price:visible': 'text',
                '.price .js-product-price': 'text', // occurs sometimes
                '.price:visible': 'text',
                '.price2:visible': 'text',
                '.price3:visible': 'text',
                '.prices:visible': 'text',
                '.bk_price:visible': 'text',
                '.product-price:visible': 'text',
                '.productPrice:visible': 'text',
                '.new-price:visible': 'text',
                '.item_current_price:visible': 'text',
                '.item_old_price:visible': 'text',
                '.item_price:visible': 'text',
                '.product__price:visible': 'text',
                '.b-products__price-value:visible': 'text',
                '.prod-price-new:visible': 'text',
                '.price-new:visible': 'text',
                '.totalPrice:visible': 'text',
                '.cena:visible': 'text',
                '.cena2:visible': 'text',
                '#cost:visible': 'text',
                '.cost:visible': 'text',
                '.price_block:visible': 'text',
                '.price-block:visible': 'text',
                '.item-price:visible': 'text',
                '.master_price:visible': 'text',
                '.prod_price:visible': 'text',
                '.amount:visible': 'text',
                '.pricebox:visible': 'text',
                '.shk-price:visible': 'text',
                '.default-price:visible': 'text',
                '.goods-price .goods-price__value': 'text',
                '[data-price]': 'attr-data-price',
                'uprice': 'text', // todo occurs not often
                '[name="price_now" i]': 'attr-value'
                // '[name="product_price" i]':'attr-value',
                // '[name="goodPriceMain" i]':'attr-value' // special for megafon.ru
            };
            const metaSelectors = [
                '[itemtype*="//schema.org/Offer" i] meta[itemprop="price" i]',
                '[itemtype*="//schema.org/Offer" i] [itemprop="price" i]',
                'meta[itemprop="price" i]',
                '[itemprop="price" i]',
                'meta[property="product:price:amount" i]',
                '[property="product:price:amount" i]'
            ];

            let checkNotInParents = self._getParentsSelectors().join(',');

            for (let selector of metaSelectors) {
                let metaPriceAll = self._findAll(document, selector);
                if (metaPriceAll.length === 1) {
                    let price = metaPriceAll[0].getAttribute('content');
                    if (!price || !price.length) {
                        price = metaPriceAll[0].innerText;
                    }
                    if (price && price.length && price.length < 100) {
                        self.itemPrice = self.sanitizePrice(price);
                        return resolve(0.8);
                    }
                }
            }

            // searching for GA analytics
            let gaMatch = self.hasHtmlInDoc() ? document.body.innerHTML.match(/["']*ecomm_totalvalue["']*\s*:\s*["']*\d+["']*\s*/gmi) : null;
            if (gaMatch && gaMatch.length === 1) {
                gaMatch = gaMatch[0].match(/(\d+)/mi);
                if (gaMatch && gaMatch.length === 2) {
                    self.itemPrice = self.sanitizePrice(gaMatch[1]);
                    return resolve(0.8);
                }
            }
            // searching for YA analytics
            //dataLayer[0]["ecommerce"]["detail"].products[0].price
            if (window && window.dataLayer && window.dataLayer.length) {
                for (let i = 0; i < window.dataLayer.length; i++) {
                    let dataLayer = window.dataLayer[i];
                    if (dataLayer &&
                        dataLayer['ecommerce'] &&
                        dataLayer['ecommerce']['detail'] &&
                        dataLayer['ecommerce']['detail']['products'] &&
                        dataLayer['ecommerce']['detail']['products'].hasOwnProperty('length') &&
                        dataLayer['ecommerce']['detail']['products'].length === 1 &&
                        dataLayer['ecommerce']['detail']['products'][0] &&
                        dataLayer['ecommerce']['detail']['products'][0]['price']
                    ) {
                        self.itemPrice = self.sanitizePrice(dataLayer['ecommerce']['detail']['products'][0]['price'] + '');
                        return resolve(0.8);
                    }
                }
            }

            for (let term in checkTerms) {
                let priceBlocks = self._findAll(document, term).filter(($item) => {
                    // check position
                    let currentPosition = self._offset($item);
                    if (currentPosition.top > 0 && (currentPosition.top > maxOffsetTop || currentPosition.top < minOffsetTop)) {
                        return false;
                    }
                    return !self._isHasParents($item, checkNotInParents);
                });

                if (priceBlocks.length === 1) {
                    if (!self.itemPrice) {
                        let priceText;

                        if (checkTerms[term].indexOf('attr-') === 0) {
                            priceText = priceBlocks[0].getAttribute(checkTerms[term].replace('attr-', ''));
                        } else {
                            priceText = priceBlocks[0].innerText;
                        }

                        if (priceText) {
                            priceText = priceText.trim();
                            if (priceText.length > 0 && priceText.length < 100) self.itemPrice = self.sanitizePrice(priceText);
                        }
                    }

                    return resolve(0.8);
                } else if (priceBlocks.length > 0 && priceBlocks.length <= 3) {
                    let samePrice;
                    for (let i in priceBlocks) {
                        let currElemPrice;
                        if (checkTerms[term].indexOf('attr-') === 0) {
                            currElemPrice = priceBlocks[i].getAttribute(checkTerms[term].replace('attr-', ''));
                        } else {
                            currElemPrice = priceBlocks[i].innerText;
                        }
                        if (!samePrice) samePrice = currElemPrice;
                        if (!samePrice || samePrice !== currElemPrice) {
                            samePrice = null;
                            break;
                        }
                    }
                    if (samePrice && typeof samePrice === 'string' && samePrice.length > 1 && samePrice.length < 20) {
                        self.itemPrice = self.sanitizePrice(samePrice);
                        return resolve(0.8);
                    }
                }
            }
            return resolve(0);
        });
    }

    static checkItemBlocks() {
        return new Promise((resolve) => {
            const minBlockHeight = 200;
            const minBlockWidth = 400;
            const checkTerms = {
                '.product:visible': true,
                '#product-info:visible': true,
                '.product-info:visible': true,
                '.product__info:visible': true,
                '#prod-info:visible': true,
                '.prod-info:visible': true,
                '#products-item:visible': true,
                '.products-item:visible': true,
                '#product-view:visible': true,
                '.product-view:visible': true,
                '#product-data:visible': true,
                '.product-data:visible': true,
                '#page-product:visible': true,
                '.page-product:visible': true,
                '[name="product_id"]:visible': false,
                '.in-stock:visible': false,
                '#product-description:visible': true,
                '.product-description:visible': true,
                '#item-description:visible': true,
                '.item-description:visible': true,
                '.item-detail-page:visible': true,
                '.item_info_section:visible': true,
                '.product-text:visible': true,
                '#product-gallery:visible': true,
                '#product-attributes:visible': true,
                '.product-full-details:visible': true,
                '#product-desc:visible': true,
                '.product_desc:visible': true,
                '.product_info:visible': true,
                '#description:visible': true,
                '.b-good-description:visible': true,
                '.b-gallery:visible': true,
                '.product-description-specifications:visible': true,
                '.easyzoom:visible': true,
                '#item-page:visible': true,
                '.item-page:visible': true,
                '#item_page:visible': true,
                '.item_page:visible': true,
                '.good-wrapper:visible': true,
                '#bk_product:visible': true,
                '.bk_product:visible': true,
                '#product_inf:visible': true,
                '.product_inf:visible': true,
                '.productdetails:visible': true,
                '.productfull:visible': true,
                '.buy-block:visible': true,
                '.single-product-page:visible': true,
                '.itemInfo:visible': true
            };
            for (let term of Object.keys(checkTerms)) {
                let $block = ProductPageDetector._findAll(document, term);
                if ($block.length !== 1 || (checkTerms[term] && ($block[0].clientHeight < minBlockHeight || $block.clientWidth < minBlockWidth))) {
                    continue;
                }
                return resolve(0.8);
            }
            return resolve(0);
        });
    }

    static checkAddToCartButton() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const maxOffsetTop = 1300;
            const minOffsetTop = 140;
            const maxCountBtn = 2;
            const maxTextLength = 50;

            const checkWordsBeginContains = [
                'добавить в корзину',
                'купить или добавить в корзину',
                'оформить заказ',
                'в корзину',
                'to cart',
                'buy it',
                'купить сейчас',
                'купить в один клик',
                'купить в 1 клик',
                'купить за',
                'до кошика',
                'быстрый заказ',
                'заказ в один клик',
                'заказ в 1 клик',
                'нет в наличии',
                'нет на складе',
                'нет в продаже',
                'товар отсутствует',
                'ожидается поступление',
                'уведомить о поступлении',
                'узнать о появлении',
                'наличие в магазин',
                'быстрая покупка',
                'купить в кредит',
                'в кредит',
                'купить товар',
                'положить в корзину'
            ];

            const checkWordsEqual = [
                'купить',
                'buy',
                'заказать',
                'отсутствует',
                'заказ'
            ];

            const checkTerms = {
                'button:visible': ['text', 'attrTitle'],
                'input:visible': ['attrValue', 'attrTitle', 'attrAlt'],
                'a:visible': ['text', 'attrTitle'],
                '.btn:visible': ['text', 'attrTitle'],
                'img:visible': ['attrTitle', 'attrAlt']
            };

            const checkSelectors = [
                '.add-to-cart:visible',
                '.add-to-basket:visible',
                '.to-basket:visible',
                '.buy-btn:visible',
                '.buyButton:visible',
                '.addtocart:visible',
                '.toCart:visible'
            ];

            const checkNotInParents = self._getParentsSelectors().join(',');
            let res = {};

            for (let term of Object.keys(checkTerms)) {
                let $termList = self._findAll(document, term);
                if ($termList.length > 500) continue;
                $termList.forEach(($self) => {
                    // check position
                    let currentPosition = self._offset($self);
                    if (currentPosition.top > 0 && (currentPosition.top > maxOffsetTop || currentPosition.top < minOffsetTop)) {
                        return null;
                    }

                    let text;
                    for (let textSelector of checkTerms[term]) {
                        if (textSelector === 'text') {
                            text = $self.innerText;
                        } else if (textSelector === 'attrTitle') {
                            text = $self.getAttribute('title');
                        } else if (textSelector === 'attrAlt') {
                            text = $self.getAttribute('alt');
                        } else if (textSelector === 'attrValue') {
                            text = $self.getAttribute('value');
                        }

                        if (text) break;
                    }
                    if (!text) {
                        return null;
                    }
                    text = text.toLowerCase().replace(/\s{2,}/g, ' ').trim();
                    if (!text.length || text.length > maxTextLength) {
                        return null;
                    }

                    let curRes = {};
                    let shouldCheckParents = false;
                    for (let i = 0; i < checkWordsBeginContains.length; i++) {
                        let resKey = 'contain--' + term + '--' + i;

                        if (typeof curRes[resKey] === 'undefined') {
                            curRes[resKey] = typeof res[resKey] === 'undefined' ? 0 : res[resKey];
                        }

                        if (curRes[resKey] > maxCountBtn) continue;

                        if (text.indexOf(checkWordsBeginContains[i]) === 0) {
                            curRes[resKey]++;
                            shouldCheckParents = true;
                        }
                    }
                    for (let i = 0; i < checkWordsEqual.length; i++) {
                        let resKey = 'equal--' + term + '--' + i;
                        if (typeof curRes[resKey] === 'undefined') {
                            curRes[resKey] = typeof res[resKey] === 'undefined' ? 0 : res[resKey];
                        }

                        if (curRes[resKey] > maxCountBtn) continue;

                        if (text === checkWordsEqual[i]) {
                            curRes[resKey]++;
                            shouldCheckParents = true;
                        }
                    }

                    // check parents blocks
                    // if (shouldCheckParents && $self.parents(checkNotInParents).length === 0) {
                    //     res = $.extend(res, curRes);
                    // }
                    if (shouldCheckParents && !self._isHasParents($self, checkNotInParents)) {
                        res = Object.assign(res, curRes);
                    }
                });
            }

            for (let selector of checkSelectors) {
                let resKey = 'selector--' + selector;
                let $selector = self._findAll(document, selector);
                if ($selector.length > 100) continue;
                res[resKey] = $selector.filter(($item) => {
                    // check position
                    let currentPosition = self._offset($item);
                    return !(currentPosition.top > 0 && (currentPosition.top > maxOffsetTop || currentPosition.top < minOffsetTop));
                }).length;
            }
            // console.log('counts buy buttons', Object.values(res));
            // console.log('counts buy buttons', res);

            for (let key of Object.keys(res)) {
                if (res[key] > 0 && res[key] <= maxCountBtn) {
                    return resolve(0.8);
                }
            }
            return resolve(0);
        });
    }

    static checkPaginator() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const maxHeight = 300;
            const minTop = 150;
            let $pagerBlocks = self._findAll(document, '[class*="pagination" i],' +
                '[id*="pagination" i]:visible,' +
                '[class*="paginator" i]:visible,' +
                '[id*="paginator" i]:visible,' +
                '[class*="pages" i]:visible,' +
                '[id*="pages" i]:visible,' +
                '[class*="page-navigation" i]:visible,' +
                '[id*="page-navigation" i]:visible,' +
                '[class*="pager" i]:visible,' +
                '[id*="pager" i]:visible,' +
                '[class*="paging" i]:visible,' +
                '[data-pagination-num]:visible,' +
                '[data-pagination]:visible').filter(($item) => {
                let offset = self._offset($item);
                return $item.clientHeight && $item.clientHeight < maxHeight && $item.clientWidth && offset.top > minTop;
            });

            if ($pagerBlocks.length && $pagerBlocks.map($item => $item.innerText).join('').trim().length) {
                return resolve(-0.8);
            }
            return resolve(0);
        });
    }

    static checkPagerParamsInUrl() {
        return new Promise((resolve) => {
            const checkRegExpsInPath = [
                {reg: /page\/\d+/gmi, score: -0.9},
                {reg: /\Wpage-\d+/gmi, score: -0.9},
                {reg: /\/search/gmi, score: -10},
                {reg: /\/search[/]/gmi, score: -10}
            ];
            const getPath = window.location.pathname;
            for (let row of checkRegExpsInPath) {
                if (row.reg.test(getPath)) {
                    return resolve(row.score);
                }
            }

            const checkRegExpsInSearch = [
                /page=\d+/gmi,
                /sort=[\w.-_]+/gmi,
                /order=[\w.-_]+/gmi,
                /sorttype=[\w.-_]+/gmi,
                /sort_type=[\w.-_]+/gmi,
                /sortorder=[\w.-_]+/gmi,
                /sort_order=[\w.-_]+/gmi,
                /orderby=[\w.-_]+/gmi,
                /order_by=[\w.-_]+/gmi,
                /sortby=[\w.-_]+/gmi,
                /sort_by=[\w.-_]+/gmi,
                /[?&]search=/gmi,
                /[?&]search_performed=/gmi,
                /[?&]q=/gmi,
                /[?&]search_term=/gmi
            ];
            const getQuery = window.location.search;
            for (let regexp of checkRegExpsInSearch) {
                if (regexp.test(getQuery)) {
                    return resolve(-0.9);
                }
            }
            return resolve(0);
        });
    }

    static checkProductImage() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            if (self.checkProductImageCache !== undefined) {
                return resolve(self.checkProductImageCache);
            }
            const minTop = 150;
            const maxTop = 1150;
            const minLeft = 100;
            const maxLeft = 1920;
            const minHeight = 100;
            const minWidth = 100;
            const maxRatio = 2.5;
            const rejectSelector = '[id*=promo i],[id*=banner i],[id*=logo i],[class*=promo i],[class*=banner i],[class*=logo i]';
            const carouselSelector = '[id*=carousel i],[id*=slider i],[id*=fancybox i],[class*=carousel i],[class*=slider i],[class*=fancybox i]';
            const rejectSelectorCnt = 8;

            self.biggestImg = {square: null, url: null};
            let $isProduct = self._findSingle(document, '[property="og:type"][content="product"]');
            if ($isProduct) {
                let $ogImage = self._findSingle(document, '[property="og:image" i ]');
                if ($ogImage) {
                    self.biggestImg = {square: Math.pow(9, 9), url: $ogImage.getAttribute('content')};
                    // console.log('Image found. Thanks Zuckerberg');
                }
            }

            let collectedImages = [];
            let $allImages = self._findAll(document, 'img[src]:not([src*=".icon" i]):not([src*=".svg" i]):not([src*=".gif" i]):visible');
            if ($allImages.length > 200) return resolve(0);
            $allImages.forEach(($img) => {
                if (!$img.complete) {
                    return null;
                }
                let offset = self._offset($img);
                if (offset.top < minTop || offset.top > maxTop || offset.left < minLeft || offset.left > maxLeft) {
                    return null;
                }
                let width = $img.clientWidth;
                let height = $img.clientHeight;
                if (width < minWidth || height < minHeight || $img.naturalWidth < minWidth || $img.naturalHeight < minHeight) {
                    return null;
                }
                let ratio = Number((width >= height ? width / height : height / width).toFixed(2));
                if (ratio > maxRatio) {
                    return null;
                }

                let isCarousel = false;
                if (self._isHasParents($img, rejectSelector, rejectSelectorCnt)) return null;
                if (self._isHasParents($img, carouselSelector, rejectSelectorCnt)) isCarousel = true;
                let imgSquare = width * height;
                collectedImages.push({
                    minTopCoef: Math.ceil(offset.top / 100),
                    top: offset.top,
                    minLeftCoef: Math.ceil(offset.left / 100),
                    left: offset.left,
                    width: width,
                    height: height,
                    square: imgSquare,
                    isCarousel: isCarousel
                });
                if (imgSquare > self.biggestImg.square) {
                    self.biggestImg.square = imgSquare;
                    self.biggestImg.url = $img.src;
                }
            });
            // console.log('collectedImages', collectedImages);
            // console.log('biggestImg', biggestImg);

            if (collectedImages.length < 1) {
                self.checkProductImageCache = 0;
                return resolve(self.checkProductImageCache);
            } else if (collectedImages.length === 1) {
                if (collectedImages[0].isCarousel) {
                    self.checkProductImageCache = 0.7;
                    return resolve(self.checkProductImageCache);
                }
            } else {
                let isCarouselCount = 0;
                let horizontalGrid = {};
                let verticalGrid = {};
                for (let img of collectedImages) {
                    if (img.isCarousel) {
                        isCarouselCount++;
                    } else {
                        if (img.minLeftCoef > 0) {
                            if (horizontalGrid[img.minLeftCoef] === undefined) {
                                horizontalGrid[img.minLeftCoef] = 0;
                            }
                            horizontalGrid[img.minLeftCoef]++;
                        }
                        if (img.minTopCoef > 0) {
                            if (verticalGrid[img.minTopCoef] === undefined) {
                                verticalGrid[img.minTopCoef] = 0;
                            }
                            verticalGrid[img.minTopCoef]++;
                        }
                    }
                }

                let horizontalGridCf = Object.keys(horizontalGrid);
                let verticalGridCf = Object.keys(verticalGrid);
                if (horizontalGridCf.length >= 3 && verticalGridCf.length >= 2) {
                    if (horizontalGrid[horizontalGridCf[0]] >= 2 && verticalGrid[verticalGridCf[0]] >= 3) {
                        self.checkProductImageCache = -0.8;
                        return resolve(self.checkProductImageCache);
                    }
                }

                if (horizontalGridCf.length >= 1 && horizontalGridCf.length <= 2 && verticalGridCf.length >= 4) {
                    let cnt = 0;
                    for (let value of Object.values(verticalGrid)) {
                        if (value === 1) {
                            cnt++;
                        }
                        if (cnt >= 4) {
                            self.checkProductImageCache = -0.2;
                            return resolve(self.checkProductImageCache);
                        }
                    }
                }

                if (isCarouselCount >= 3) {
                    self.checkProductImageCache = 0.4;
                    return resolve(self.checkProductImageCache);
                }
            }
            self.checkProductImageCache = 0;
            return resolve(self.checkProductImageCache);
        });
    }

    static checkPredefinedTextPatterns() {
        return new Promise((resolve) => {
            const checkRegExps = [
                /код(?:\s+товара)?.{0,2}:.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
                /артикул(?:\s+товара)?.{0,2}:.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
                // /id.{0,2}:.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi, can not use it now
                /id товара.{0,2}:.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
                /наличие.{0,2}:.{0,2}(?:на складе|в наличии|под заказ|есть|отсутствует)/gi,
                /(?:нет|есть) в наличии/gi,
                /товар отсутствует/gi,
                /отсутствует в продаже/gi,
                /товар не найден/gi,
                /нет в наличии/gi,
                /нет на складе/gi,
                /снят с продажи/gi,
                /узнать о появлении/gi
            ];
            if (!ProductPageDetector.hasTextInDoc()) return resolve(0);
            const bodyVisibleText = document.body.innerText; // it's better but to long :(( $('body *:not(:has(*)):visible').text();
            for (let regexp of checkRegExps) {
                let matches = bodyVisibleText.match(regexp);
                if (matches && matches.length === 1) {
                    return resolve(0.2);
                }
            }
            return resolve(0);
        });
    }

    static checkAmountPerPage() {
        return new Promise((resolve) => {
            const self = ProductPageDetector;
            const perPageValues = ['все', 'показать все', 'all'];
            let $selectList = self._findAll(document, 'select');

            for (let k = 0; k < $selectList.length && k < 10; k++) {
                let $optionList = self._findAll($selectList[k], 'option');

                if ($optionList.length > 2 && $optionList.length < 8) {
                    let isNumberLocal = false;

                    for (let i = 0; i < $optionList.length; i++) {
                        let txt = $optionList[i].innerText.trim().toLowerCase();

                        if (txt.length) {
                            if (perPageValues.indexOf(txt) >= 0) {
                                isNumberLocal = true;
                            } else {
                                let parsed = parseInt(txt, 10);
                                if (parsed > 0 && parsed.toString().length === txt.length) {
                                    isNumberLocal = true;
                                } else {
                                    isNumberLocal = false;
                                    break;
                                }
                            }
                        } else {
                            isNumberLocal = false;
                            break;
                        }
                    }

                    if (isNumberLocal) {
                        return resolve(-0.4);
                    }
                }
            }

            return resolve(0);
        });
    }

    static sanitizePrice(price) {
        price = price.replace(new RegExp(String.fromCharCode(160), 'g'), '');

        for (let reg of [/\s+/g, /руб\.?/mi, /р\.?/mi, /rub\.?/mi, 'цена', 'стоимость', 'скидка', /['"]/g]) {
            price = price.replace(reg, '');
        }

        price = price.replace(String.fromCharCode(160), '');
        let match = price.match(/(\d+[,.']?\d+)/mi);
        if (match && match.length) {
            return match[0].trim();
        } else {
            return null;
        }
    }

    /**
     * return {itemName, brand, articleId, category}
     */
    static searchProductInfo() {
        const self = ProductPageDetector;
        let result = {};
        const metaSelectors = [
            '[itemtype*="//schema.org/Offer" i] meta[itemprop="name" i]',
            '[itemtype*="//schema.org/Offer" i] [itemprop="name" i]',
            'meta[itemprop="name" i]',
            '[itemprop="name" i]',
            'meta[property="product:retailer_title" i]',
            '[property="product:retailer_title" i]'
        ];

        if (!result.itemName) {
            let title = self._findFirstFromSelector(metaSelectors);
            if (title && title.length) {
                result.itemName = title.slice(0, 512);
            }
        }

        for (let selector of metaSelectors) {
            let metaPriceAll = self._findAll(document, selector);
            if (metaPriceAll.length === 1) {
                let title = metaPriceAll[0].getAttribute('content');
                if (!title || !title.length) {
                    title = metaPriceAll[0].innerText;
                }
                if (title && title.length) {
                    result.itemName = title.slice(0, 512);
                    break;
                }
            }
        }
        // searching for YA analytics
        //dataLayer[0]["ecommerce"]["detail"].products[0].name
        if (window !== undefined && window['dataLayer'] !== undefined && window['dataLayer'].hasOwnProperty('length')) {
            for (let i = 0; i < window['dataLayer'].length; i++) {
                let dataLayer = window['dataLayer'][i];
                if (dataLayer && dataLayer['ecommerce']) {
                    if (dataLayer['ecommerce']['currencyCode']) {
                        result.currencyCode = dataLayer['ecommerce']['currencyCode'];
                    }
                    if (dataLayer['ecommerce']['detail'] &&
                        dataLayer['ecommerce']['detail']['products'] &&
                        dataLayer['ecommerce']['detail']['products'].hasOwnProperty('length') &&
                        dataLayer['ecommerce']['detail']['products'].length === 1 &&
                        dataLayer['ecommerce']['detail']['products'][0]
                    ) {
                        let productInfo = dataLayer['ecommerce']['detail']['products'][0];
                        if (!result.itemName && productInfo['name']) {
                            result.itemName = productInfo['name'];
                        }
                        if (productInfo['brand']) {
                            result.brand = productInfo['brand'];
                        }
                        if (productInfo['category']) {
                            result.category = [productInfo['category']];
                        }
                        break;
                    }
                }
            }
        }

        return result;
    }

    static getCurrencyCode() {
        const selectors = ['[property="product:price:currency" i]', '[itemprop="priceCurrency" i]'];

        let currencyCode = ProductPageDetector._findFirstFromSelector(selectors);
        return currencyCode && currencyCode.length ? currencyCode : null;
    }

    static getBrand() {
        const selectors = ['[property="product:brand" i]', '[itemprop="brand" i]'];

        let brandText = ProductPageDetector._findFirstFromSelector(selectors);
        return brandText && brandText.length ? brandText : null;
    }

    static getArticleId() {
        const checkRegExps = [
            /код(?:\s+товара)?.{0,2}:?.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
            /артикул(?:\s+товара)?.{0,2}:?.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
            /арт\.\s+(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi,
            /id товара.{0,2}:?.{0,2}(?:[\d-]+|[-а-яa-z0-9]{4,30})/gi
        ];
        let self = ProductPageDetector;
        if (!self.hasTextInDoc()) return null;
        let bodyVisibleText = document.body.innerText; // it's better but to long :(( $('body *:not(:has(*)):visible').text();
        for (let regexp of checkRegExps) {
            let matches = bodyVisibleText.match(regexp);
            if (matches && matches.length === 1) {
                matches = matches[0].match(/[\d-_a-z]+/gmi);
                if (matches && matches.length) {
                    return matches[0];
                }
            }
        }
        let articleText = self._findFirstFromSelector(['[property="product:retailer_item_id" i]', '[itemprop="sku" i]']);
        if (articleText) return articleText;

        return null;
    }

    static hasHtmlInDoc() {
        return document && document.body && document.body.innerHTML && document.body.innerHTML.length;
    }

    static hasTextInDoc() {
        return document && document.body && document.body.innerText && document.body.innerText.length;
    }

    static getCategories() {
        const self = ProductPageDetector;
        const breadcrumbsSelectors = [
            '#breadcrumb:visible',
            '.breadcrumb:visible',
            '#breadcrumbs:visible',
            '.breadcrumbs:visible',
            '.b-breadcrumbs:visible'
        ];

        const metaSelectors = [
            '[property="og:category" i]',
            '[itemprop="category" i]'
        ];

        let categories = [];

        for (let selector of breadcrumbsSelectors) {
            let $breadcrumb = self._findAll(document, selector);
            if ($breadcrumb.length) {
                let $breadItems = self._findAll($breadcrumb[0], 'li');
                for (let k = 0; k < $breadItems.length; k++) {
                    let breadText = $breadItems[k].innerText.trim();
                    if (breadText.length > 3) {
                        categories.push(breadText);
                    }
                }
                if (!$breadItems.length) {
                    let fullCategoryText = $breadcrumb[0].innerText.trim();
                    if (fullCategoryText.length) categories.push(fullCategoryText);
                }
            }
            if (categories.length) break;
        }

        if (!categories.length) {
            let categoryText = self._findFirstFromSelector(metaSelectors);
            if (categoryText && categoryText.length) {
                categories.push(categoryText);
            }
        }

        return categories.length ? categories : null;
    }

    static check() {
        return new Promise(function (resolve) {
            // check if document is ready
            let waitForDomContent = () => {
                return new Promise(function (res, rej) {
                    let isFinished = false;
                    let attempts = 0;
                    const maxAttempts = 120;
                    const checkTimer = 500;
                    let complete = () => {
                        if (!isFinished) {
                            isFinished = true;
                            // when body is not valid
                            if (!ProductPageDetector.hasTextInDoc() || !ProductPageDetector.hasHtmlInDoc() || document.body.innerHTML.length < 1000) {
                                rej(new Error('Document html not valid'));
                            } else {
                                res();
                            }
                        }
                    };
                    let checkIsReady = () => {
                        attempts++;
                        if (!isFinished) {
                            if (document && document.readyState === 'complete') {
                                complete();
                            } else if (attempts > maxAttempts) {
                                rej(new Error('Document not ready'));
                            } else {
                                setTimeout(checkIsReady, checkTimer);
                            }
                        }
                    };

                    if (!document) {
                        return rej(new Error('Document object not found'));
                    } else {
                        document.addEventListener('DOMContentLoaded', complete);
                    }
                    if (!window) {
                        return rej(new Error('Window object not found'));
                    } else {
                        window.addEventListener('load', complete);
                    }

                    checkIsReady();
                });
            };

            ProductPageDetector.scoreSum = 0;
            ProductPageDetector.scoreDetails = {};
            let callChecker = (checkerName) => {
                return new Promise(function (res, rej) {
                    if (Math.abs(ProductPageDetector.scoreSum) > 2) { // ignore next checkers
                        return res();
                    }
                    setTimeout(() => {
                        let funcTimeStart = Date.now();
                        ProductPageDetector[checkerName]()
                            .then((score) => {
                                ProductPageDetector.scoreSum += score;
                                ProductPageDetector.scoreDetails[checkerName] = {
                                    score: score,
                                    time: Date.now() - funcTimeStart
                                };
                                res();
                            })
                            .catch((err) => {
                                rej(err);
                            });
                    }, 1);
                });
            };
            Promise.resolve()
                .then(() => waitForDomContent())
                .then(() => callChecker('checkTopSites'))
                .then(() => callChecker('checkHomePageOrStaticPages'))
                .then(() => callChecker('checkUrlRegExpTerms'))
                .then(() => callChecker('checkSchemaTags'))
                .then(() => callChecker('checkMetaOGTag'))
                .then(() => callChecker('checkPriceTag'))
                .then(() => callChecker('checkAmountPerPage'))
                .then(() => callChecker('checkSortBlock'))
                .then(() => callChecker('checkPaginator'))
                .then(() => callChecker('checkPagerParamsInUrl'))
                .then(() => callChecker('checkItemBlocks'))
                .then(() => callChecker('checkAddToCartButton'))
                .then(() => callChecker('checkProductImage'))
                .then(() => callChecker('checkPredefinedTextPatterns'))
                .then(() => {
                    // console.log('result', JSON.stringify(ProductPageDetector.scoreDetails, null, ' '), currentScore);
                    return resolve(ProductPageDetector.scoreSum > 0);
                })
                .catch(() => {
                    return resolve(false);
                });
        });
    }

    static getAdditionalParams() {
        let self = ProductPageDetector;
        return self.checkProductImage()
            .then(() => {
                if (typeof self.itemPrice === 'undefined') {
                    return self.checkPriceTag();
                }
                return Promise.resolve();
            })
            .then(() => {
                let result = {
                    title: null,
                    h1: null,
                    img: self.biggestImg && self.biggestImg.url ? self.biggestImg.url.slice(0, 2048) : null,
                    price: null,
                    itemName: null,
                    currencyCode: null,
                    category: null,
                    brand: null,
                    articleId: null,
                    scoreSummary: self.scoreSum,
                    // scoreDetails: self.scoreDetails,
                    scoreTime: null
                };
                let data = self._findSingle(document, 'title');
                if (data) {
                    result.title = data.innerText.trim().slice(0, 512);
                }
                data = self._findSingle(document, 'h1');
                if (data) {
                    result.h1 = data.innerText.trim().slice(0, 512);
                }
                data = self.searchProductInfo();
                if (data) {
                    result = Object.assign(result, data);
                }
                if (!result.articleId) {
                    data = self.getArticleId();
                    if (data) {
                        result.articleId = data;
                    }
                }
                if (!result.category || result.category.length === 1) {
                    data = self.getCategories();
                    if (data) {
                        result.category = data;
                    }
                }
                if (!result.brand) {
                    data = self.getBrand();
                    if (data) {
                        result.brand = data;
                    }
                }
                if (!result.currencyCode) {
                    data = self.getCurrencyCode();
                    if (data) {
                        result.currencyCode = data;
                    }
                }
                if (self.scoreDetails) {
                    let scoreTime = 0;
                    for (let item in self.scoreDetails) {
                        if (self.scoreDetails[item].time) scoreTime += self.scoreDetails[item].time;
                    }
                    if (scoreTime) {
                        result.scoreTime = scoreTime;
                    }
                }

                if (self.itemPrice) result.price = self.itemPrice;
                return Promise.resolve(result);
            })
            .catch(() => {
                return Promise.resolve({});
            });
    }
}