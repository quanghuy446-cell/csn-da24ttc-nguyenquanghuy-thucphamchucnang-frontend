// Tệp tiện ích dùng chung cho toàn bộ website (quản lý tài khoản, yêu thích, sản phẩm, mã giảm giá, logo, chân trang)

const SITE_BRAND = {
    name: 'An Tâm Mart',
    slogan: 'Khỏe Từ Gốc, Sống Trọn Từng Ngày',
    phone: '0914636373',
    email: '110124073@st.tvu.edu.vn',
    address: '126 Nguyễn Thiện Thành, Phường 5, Thành phố Trà Vinh, Tỉnh Trà Vinh'
};

const PRODUCT_CATEGORIES = [
    { name: 'Tăng đề kháng và Miễn dịch', sub: 'Vitamin C, Kẽm, đa sinh tố tăng đề kháng' },
    { name: 'Bổ não và Tăng cường trí nhớ', sub: 'Ginkgo Biloba, dưỡng não, tăng tập trung' },
    { name: 'Tiêu hóa và Sức khỏe đường ruột', sub: 'Men vi sinh Probiotics, chất xơ, êm dịu dạ dày' },
    { name: 'Năng lượng và Thể lực', sub: 'Vitamin nhóm B, tăng sức bền, giảm mệt mỏi' },
    { name: 'Bổ mắt và Sức khỏe thị lực', sub: 'Lutein, DHA, bảo vệ mắt khỏi ánh sáng xanh' },
    { name: 'Đẹp da, Tóc và Móng', sub: 'Collagen Peptide, Biotin, dưỡng da sáng mịn' },
    { name: 'Tim mạch và Tuần hoàn', sub: 'Omega-3, CoQ10, hỗ trợ tuần hoàn và mỡ máu' },
    { name: 'Xương khớp và Cơ bắp', sub: 'Glucosamine, Canxi, bảo vệ sụn khớp linh hoạt' },
    { name: 'Ngủ ngon và Giảm căng thẳng', sub: 'Melatonin, thảo dược hỗ trợ giấc ngủ sâu' },
    { name: 'Mẹ bầu và Em bé', sub: 'Vitamin mẹ bầu, Siro D3 K2, men vi sinh cho bé' },
    { name: 'Thể thao và Kiểm soát cân nặng', sub: 'Whey protein, bột đạm, bổ sung thể thao' }
];

const VALID_EMAIL_TLDS = [
    'com', 'vn', 'net', 'org', 'edu', 'gov', 'info', 'biz', 'io', 'me', 'tech', 'store', 'shop', 'online', 'site', 'xyz',
    'com.vn', 'edu.vn', 'gov.vn', 'net.vn', 'org.vn', 'ac.vn', 'int.vn', 'health.vn', 'co.uk', 'co.jp', 'com.au'
];

function isValidEmailStrict(email) {
    const val = (email || '').trim().toLowerCase();
    const basicPattern = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
    if (!basicPattern.test(val)) return false;
    const domain = val.split('@')[1];
    if (!domain || domain.includes('..')) return false;
    const parts = domain.split('.');
    if (parts.length < 2) return false;
    const lastTwo = parts.slice(-2).join('.');
    const lastOne = parts[parts.length - 1];
    if (VALID_EMAIL_TLDS.includes(lastTwo)) return parts.length >= 3;
    return VALID_EMAIL_TLDS.includes(lastOne);
}

function isValidVietnamPhone10(phone) {
    return /^0\d{9}$/.test((phone || '').trim());
}

function normalizeSearchText(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}

function getCurrentUserEmail() {
    if (localStorage.getItem('isLoggedIn') !== 'true') return null;
    const email = (localStorage.getItem('userEmail') || '').trim().toLowerCase();
    if (email) return email;
    const role = localStorage.getItem('userRole');
    if (role === 'admin') return 'admin@gmail.com';
    const uname = (localStorage.getItem('username') || '').trim().toLowerCase();
    return uname ? `user_${uname}` : null;
}

function getUserStorageKey(baseKey) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return null;
    return `${baseKey}_${userEmail}`;
}

function getFavorites() {
    const key = getUserStorageKey('favoriteProducts');
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveFavorites(list) {
    const key = getUserStorageKey('favoriteProducts');
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(list));
}

function getCartStorageKey() {
    return getUserStorageKey('cartItems');
}

function getVoucherStorageKey() {
    return getUserStorageKey('appliedVoucherCode');
}

function getCartItems() {
    const key = getCartStorageKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCartItems(items) {
    const key = getCartStorageKey();
    if (!key) {
        localStorage.setItem('cart_qty', 0);
        return;
    }
    const list = Array.isArray(items) ? items : [];
    localStorage.setItem(key, JSON.stringify(list));
    const totalQty = list.reduce((sum, it) => sum + (parseInt(it.qty) || 0), 0);
    localStorage.setItem('cart_qty', totalQty);
}

function clearCartItems() {
    const cartKey = getCartStorageKey();
    const voucherKey = getVoucherStorageKey();
    if (cartKey) localStorage.removeItem(cartKey);
    if (voucherKey) localStorage.removeItem(voucherKey);
    localStorage.setItem('cart_qty', 0);
}

function getAppliedVoucherCode() {
    const key = getVoucherStorageKey();
    if (!key) return '';
    return (localStorage.getItem(key) || '').trim();
}

function setAppliedVoucherCode(code) {
    const key = getVoucherStorageKey();
    if (!key) return;
    const clean = (code || '').trim().toUpperCase();
    if (!clean) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, clean);
    }
}

function clearAppliedVoucherCode() {
    const key = getVoucherStorageKey();
    if (key) localStorage.removeItem(key);
}

function getCartItemQtyCommon(prodId) {
    const cartItems = getCartItems();
    const found = cartItems.find(c => c.id === prodId);
    return found ? (parseInt(found.qty) || 0) : 0;
}

function renderQuickCartButtonHtml(item) {
    const stock = parseInt(item.stock) || 0;
    const inCartQty = getCartItemQtyCommon(item.id);
    const disabledAttr = stock <= 0 ? 'disabled title="Hết hàng"' : 'title="Nhấn để thêm vào giỏ hàng"';
    const badgeHtml = inCartQty > 0 ? `<span class="card-cart-badge">${inCartQty}</span>` : '';
    return `
        <button type="button" class="btn-card-cart" data-prod-id="${item.id}" onclick="quickAddToCartCommon('${item.id}', event)" aria-label="Thêm vào giỏ hàng" ${disabledAttr}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            ${badgeHtml}
        </button>
    `;
}

function renderProductCardHtml(item, options = {}) {
    const colClass = options.colClass || 'col-md-3 col-sm-6';
    const onFavCb = options.onFavCb || 'null';
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isFav = isLoggedIn && getFavorites().includes(item.id);
    const price = parseInt(item.price) || 0;
    const origPrice = parseInt(item.originalPrice) || price;
    const disc = parseInt(item.discountPercent) || 0;
    const hasDiscount = origPrice > price && disc > 0;
    const stockText = item.stock > 0
        ? `<span class="text-success fw-semibold">Còn hàng</span>`
        : `<span class="text-danger fw-bold">Hết hàng</span>`;
    const priceOldHtml = hasDiscount
        ? `<div class="product-price-old-row"><span class="price-original-clean">${origPrice.toLocaleString('vi-VN')}đ</span><span class="price-discount-text">-${disc}%</span></div>`
        : `<div class="product-price-old-row"></div>`;
    const brandOrigin = [item.brand, item.origin].filter(Boolean).join(' · ');
    const ratingSummary = getProductRatingSummary(item.id);
    const subInfoHtml = ratingSummary.count > 0
        ? renderCardRatingHtml(item.id)
        : `<span class="text-muted" style="font-size: 0.78rem;">${item.packaging || 'Chính hãng'}</span>`;

    return `
        <div class="${colClass}">
            <div class="product-card">
                <div class="product-img-wrap">
                    <a href="chitiet.html?id=${encodeURIComponent(item.id)}" class="d-flex align-items-center justify-content-center w-100 h-100 text-decoration-none">
                        <img src="${item.img}" alt="${item.name}" loading="lazy">
                    </a>
                    <button type="button" class="btn-wishlist ${isFav ? 'active' : ''}" onclick="toggleFavoriteCommon('${item.id}', event, ${onFavCb})" title="${isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}">&hearts;</button>
                    ${renderQuickCartButtonHtml(item)}
                </div>
                <div>
                    ${brandOrigin ? `<div class="product-card-meta-top">${brandOrigin}</div>` : ''}
                    <a href="chitiet.html?id=${encodeURIComponent(item.id)}" class="product-name" title="${item.name}">${item.name}</a>
                    <div class="product-price-sale">${price.toLocaleString('vi-VN')}<u>đ</u></div>
                    ${priceOldHtml}
                    <div class="small mt-1 text-truncate">${subInfoHtml}</div>
                    <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top small text-muted">
                        ${stockText}
                        <span>Đã bán ${item.sold || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function syncCardCartBadges(prodId, newQty) {
    document.querySelectorAll(`.btn-card-cart[data-prod-id="${prodId}"]`).forEach(btn => {
        btn.classList.toggle('has-qty', newQty > 0);
        let badge = btn.querySelector('.card-cart-badge');
        if (newQty > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'card-cart-badge';
                btn.appendChild(badge);
            }
            badge.textContent = newQty;
        } else if (badge) {
            badge.remove();
        }
    });
}

function quickAddToCartCommon(prodId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showSiteToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', true);
        return false;
    }
    const products = initInventoryCommon();
    const prod = products.find(p => p.id === prodId);
    if (!prod) return false;
    const stock = parseInt(prod.stock) || 0;
    if (stock <= 0) {
        showSiteToast('Sản phẩm này hiện đã hết hàng.', true);
        return false;
    }
    const cartItems = getCartItems();
    const idx = cartItems.findIndex(c => c.id === prodId);
    const currentQty = idx !== -1 ? (parseInt(cartItems[idx].qty) || 0) : 0;
    if (currentQty + 1 > stock) {
        showSiteToast(`Kho chỉ còn ${stock} sản phẩm cho mặt hàng này.`, true);
        return false;
    }
    const nextQty = currentQty + 1;
    if (idx !== -1) {
        cartItems[idx].qty = nextQty;
        cartItems[idx].price = parseInt(prod.price) || 0;
        cartItems[idx].img = prod.img;
        cartItems[idx].name = prod.name;
    } else {
        cartItems.push({
            id: prod.id,
            name: prod.name,
            price: parseInt(prod.price) || 0,
            qty: 1,
            img: prod.img
        });
    }
    saveCartItems(cartItems);
    syncCardCartBadges(prodId, nextQty);
    renderCommonAuthHeader();
    showAddToCartPopup(prod, nextQty);
    return true;
}

let cartPopupTimer = null;

function closeAddToCartPopup() {
    clearTimeout(cartPopupTimer);
    document.querySelectorAll('.cart-added-popup').forEach(el => el.remove());
}

function showAddToCartPopup(prod, qtyInCart) {
    clearTimeout(cartPopupTimer);
    document.querySelectorAll('.site-toast').forEach(el => el.remove());

    let popup = document.getElementById('cartAddedPopup');
    const priceText = (parseInt(prod.price) || 0).toLocaleString('vi-VN') + 'đ';
    const brandText = prod.brand || 'Chính hãng';

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'cartAddedPopup';
        popup.className = 'cart-added-popup';
        document.body.appendChild(popup);
        popup.addEventListener('mouseenter', () => clearTimeout(cartPopupTimer));
        popup.addEventListener('mouseleave', () => {
            cartPopupTimer = setTimeout(closeAddToCartPopup, 3000);
        });
    }

    popup.innerHTML = `
        <div class="cart-popup-header">
            <div class="d-flex align-items-center gap-2">
                <span class="cart-popup-check" aria-hidden="true">&#10003;</span>
                <span class="fw-bold">Đã thêm vào giỏ hàng</span>
            </div>
            <button type="button" class="cart-popup-close" onclick="closeAddToCartPopup()" aria-label="Đóng">&times;</button>
        </div>
        <div class="cart-popup-body">
            <div class="d-flex align-items-center gap-3 mb-3">
                <img src="${prod.img}" alt="${prod.name}" class="cart-popup-thumb">
                <div class="flex-grow-1 min-w-0">
                    <div class="cart-popup-title">${prod.name}</div>
                    <div class="cart-popup-meta">${brandText} · ${priceText} · <strong>Trong giỏ: ${qtyInCart}</strong></div>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button type="button" class="btn-cart-popup-continue" onclick="closeAddToCartPopup()">Tiếp tục mua sắm</button>
                <a href="giohang.html" class="btn-cart-popup-view">Xem giỏ hàng</a>
            </div>
        </div>
    `;

    cartPopupTimer = setTimeout(closeAddToCartPopup, 4500);
}

function getProductClickCounts() {
    return JSON.parse(localStorage.getItem('productClickCounts')) || {};
}

function getProductClickCount(prodId) {
    if (!prodId) return 0;
    const map = getProductClickCounts();
    return parseInt(map[prodId]) || 0;
}

function trackProductClick(prodId) {
    if (!prodId) return;
    const map = getProductClickCounts();
    map[prodId] = (parseInt(map[prodId]) || 0) + 1;
    localStorage.setItem('productClickCounts', JSON.stringify(map));
}

function trackRecentlyViewed(prodId) {
    if (!prodId) return;
    trackProductClick(prodId);
    const key = getUserStorageKey('recentlyViewed') || 'recentlyViewed_guest';
    let list = JSON.parse(localStorage.getItem(key)) || [];
    list = [prodId, ...list.filter(id => id !== prodId)].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(list));
}

function getRecentlyViewedProducts(excludeId = '') {
    const key = getUserStorageKey('recentlyViewed') || 'recentlyViewed_guest';
    const ids = JSON.parse(localStorage.getItem(key)) || [];
    const inventory = initInventoryCommon();
    return ids
        .filter(id => id !== excludeId)
        .map(id => inventory.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 4);
}

function toggleFavoriteCommon(prodId, event, onAfterChange) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showSiteToast('Vui lòng đăng nhập để lưu sản phẩm yêu thích!', true);
        return false;
    }
    let favs = getFavorites();
    if (favs.includes(prodId)) {
        favs = favs.filter(id => id !== prodId);
        showSiteToast('Đã bỏ sản phẩm khỏi danh sách yêu thích.');
    } else {
        favs.push(prodId);
        showSiteToast('Đã thêm sản phẩm vào danh sách yêu thích!');
    }
    saveFavorites(favs);
    if (typeof onAfterChange === 'function') onAfterChange();
    renderCommonAuthHeader();
    return true;
}

const VOUCHERS_LIST = [
    { code: 'SUCKHOE10', type: 'percent', value: 10, minOrder: 0, maxDiscount: 150000, desc: 'Giảm 10% tối đa 150.000đ cho mọi đơn hàng' },
    { code: 'GIAM50K', type: 'fixed', value: 50000, minOrder: 500000, maxDiscount: 50000, desc: 'Giảm ngay 50.000đ cho đơn từ 500.000đ' },
    { code: 'NEWUSER30', type: 'fixed', value: 30000, minOrder: 200000, maxDiscount: 30000, desc: 'Ưu đãi 30.000đ cho đơn từ 200.000đ' },
    { code: 'VIP100K', type: 'fixed', value: 100000, minOrder: 1000000, maxDiscount: 100000, desc: 'Giảm 100.000đ cho đơn từ 1.000.000đ' }
];

function calculateVoucherDiscount(code, subTotal) {
    const clean = (code || '').trim().toUpperCase();
    const voucher = VOUCHERS_LIST.find(v => v.code === clean);
    if (!voucher) return { valid: false, message: 'Mã giảm giá không tồn tại!', discount: 0 };
    if (subTotal < voucher.minOrder) {
        return {
            valid: false,
            message: `Mã ${voucher.code} áp dụng cho đơn từ ${voucher.minOrder.toLocaleString('vi-VN')}đ.`,
            discount: 0
        };
    }
    let discount = voucher.type === 'percent'
        ? Math.min(Math.round(subTotal * voucher.value / 100), voucher.maxDiscount)
        : voucher.value;
    discount = Math.min(discount, subTotal);
    return { valid: true, voucher, discount, message: `Áp dụng mã ${voucher.code} thành công (-${discount.toLocaleString('vi-VN')}đ).` };
}

function getBestVoucherForAmount(amount) {
    let best = null;
    VOUCHERS_LIST.forEach(v => {
        const res = calculateVoucherDiscount(v.code, amount);
        if (res.valid && (!best || res.discount > best.discount)) {
            best = res;
        }
    });
    return best;
}

function getDefaultProducts() {
    if (typeof CATALOG_PRODUCTS_50 !== 'undefined' && Array.isArray(CATALOG_PRODUCTS_50) && CATALOG_PRODUCTS_50.length > 0) {
        return CATALOG_PRODUCTS_50.map(p => ({ ...p }));
    }
    const baseList = [
        {
            id: 'SP01',
            name: 'Viên Uống Dầu Cá Omega-3 Tinh Khiết 1000mg',
            brand: 'NatureCare',
            category: 'Vitamin và Khoáng Chất',
            price: 455000,
            originalPrice: 555000,
            discountPercent: 18,
            stock: 45,
            sold: 178,
            img: 'https://i.etsystatic.com/33109327/r/il/a53262/3869921903/il_fullxfull.3869921903_4qg4.jpg',
            description: 'Bổ sung EPA và DHA hàm lượng cao hỗ trợ tim mạch, trí não và thị lực mỗi ngày.'
        },
        {
            id: 'SP02',
            name: 'Vitamin C 500mg Kết Hợp Kẽm Tăng Đề Kháng',
            brand: 'DHC',
            category: 'Vitamin và Khoáng Chất',
            price: 230000,
            originalPrice: 280000,
            discountPercent: 18,
            stock: 30,
            sold: 170,
            img: 'https://www.planetorganic.com/cdn/shop/files/Easy_Swallow_Mini_Lifestyle_NEW.jpg?v=1766496913',
            description: 'Bổ sung vitamin C và kẽm hữu cơ giúp nâng cao sức đề kháng, giảm mệt mỏi.'
        },
        {
            id: 'SP03',
            name: 'Collagen Peptide Thủy Phân Dưỡng Da Sáng Mịn',
            brand: 'BioGlow',
            category: 'Chăm Sóc Sắc Đẹp',
            price: 690000,
            originalPrice: 830000,
            discountPercent: 17,
            stock: 12,
            sold: 182,
            img: 'https://ybclondon.com/cdn/shop/files/IMG-7933.png?v=1780937044&width=1946',
            description: 'Hỗ trợ cấp ẩm, cải thiện độ đàn hồi da, giảm nếp nhăn từ bên trong.'
        },
        {
            id: 'SP04',
            name: 'Glucosamine 1500mg Hỗ Trợ Xương Khớp Linh Hoạt',
            brand: 'Blackmores',
            category: 'Hỗ Trợ Xương Khớp',
            price: 549000,
            originalPrice: 649000,
            discountPercent: 15,
            stock: 25,
            sold: 174,
            img: 'https://i.etsystatic.com/33109327/r/il/a53262/3869921903/il_fullxfull.3869921903_4qg4.jpg',
            description: 'Hỗ trợ bôi trơn ổ khớp, bảo vệ sụn khớp và giúp vận động dẻo dai.'
        },
        {
            id: 'SP05',
            name: 'Siro Vitamin D3 K2 MK7 Hỗ Trợ Chiều Cao Cho Bé',
            brand: 'KidsWell',
            category: 'Mẹ và Bé',
            price: 295000,
            originalPrice: 350000,
            discountPercent: 16,
            stock: 40,
            sold: 146,
            img: 'https://www.planetorganic.com/cdn/shop/files/Easy_Swallow_Mini_Lifestyle_NEW.jpg?v=1766496913',
            description: 'Hỗ trợ hấp thu canxi tối ưu, giúp hệ xương và răng của bé phát triển vững chắc.'
        }
    ];
    return [
        ...baseList,
        {
            id: 'SP06',
            name: 'Men Vi Sinh Probiotics 30 Tỷ Lợi Khuẩn Hỗ Trợ Tiêu Hóa',
            brand: 'BioCare',
            category: 'Hỗ Trợ Tiêu Hóa',
            price: 385000,
            originalPrice: 450000,
            discountPercent: 14,
            stock: 35,
            sold: 112,
            img: baseList[1].img,
            description: 'Bổ sung lợi khuẩn đường ruột, hỗ trợ cân bằng hệ vi sinh và giảm đầy bụng khó tiêu.'
        },
        {
            id: 'SP07',
            name: 'Viên Uống Ginkgo Biloba 2000mg Bổ Não Tăng Trí Nhớ',
            brand: 'Healthy Care',
            category: 'Thần Kinh và Giấc Ngủ',
            price: 340000,
            originalPrice: 410000,
            discountPercent: 17,
            stock: 28,
            sold: 134,
            img: baseList[0].img,
            description: 'Hỗ trợ tuần hoàn máu não, cải thiện trí nhớ, giảm hoa mắt và hỗ trợ giấc ngủ sâu.'
        },
        {
            id: 'SP08',
            name: 'Viên Uống CoQ10 150mg Hỗ Trợ Tim Mạch Khỏe Mạnh',
            brand: 'Blackmores',
            category: 'Hỗ Trợ Tim Mạch',
            price: 520000,
            originalPrice: 620000,
            discountPercent: 16,
            stock: 22,
            sold: 95,
            img: baseList[0].img,
            description: 'Cung cấp Coenzyme Q10 hỗ trợ sức khỏe tim mạch, chống oxy hóa và giảm mệt mỏi.'
        },
        {
            id: 'SP09',
            name: 'Viên Uống Giải Độc Gan Kế Sữa Milk Thistle 35000mg',
            brand: 'NatureCare',
            category: 'Hỗ Trợ Gan và Giải Độc',
            price: 415000,
            originalPrice: 495000,
            discountPercent: 16,
            stock: 32,
            sold: 108,
            img: baseList[2].img,
            description: 'Chiết xuất kế sữa hỗ trợ giải độc gan, bảo vệ tế bào gan và tăng cường chức năng gan.'
        }
    ];
}

function initInventoryCommon() {
    let inventory = JSON.parse(localStorage.getItem('inventoryProducts'));
    if (!Array.isArray(inventory) || inventory.length === 0) {
        inventory = getDefaultProducts();
        localStorage.setItem('inventoryProducts', JSON.stringify(inventory));
        localStorage.setItem('seededFullCategoriesV2', 'true');
    } else {
        let updated = false;
        const categoryMigrationMap = {
            'Thực Phẩm Chức Năng': 'Tăng đề kháng và Miễn dịch',
            'Vitamin và Khoáng Chất': 'Tăng đề kháng và Miễn dịch',
            'Hỗ Trợ Xương Khớp': 'Xương khớp và Cơ bắp',
            'Chăm Sóc Sắc Đẹp': 'Đẹp da, Tóc và Móng',
            'Chăm Sóc Bé': 'Mẹ bầu và Em bé',
            'Mẹ và Bé': 'Mẹ bầu và Em bé',
            'Hỗ Trợ Tiêu Hóa': 'Tiêu hóa và Sức khỏe đường ruột',
            'Thần Kinh và Giấc Ngủ': 'Bổ não và Tăng cường trí nhớ',
            'Hỗ Trợ Tim Mạch': 'Tim mạch và Tuần hoàn',
            'Hỗ Trợ Gan và Giải Độc': 'Năng lượng và Thể lực'
        };
        inventory = inventory.map((p) => {
            const copy = { ...p };
            if (categoryMigrationMap[copy.category]) {
                copy.category = categoryMigrationMap[copy.category];
                updated = true;
            }
            const price = parseInt(copy.price) || 0;
            if (!copy.originalPrice || parseInt(copy.originalPrice) <= price) {
                const disc = parseInt(copy.discountPercent) || 15;
                copy.discountPercent = disc;
                copy.originalPrice = Math.round(price / (1 - disc / 100) / 1000) * 1000;
                updated = true;
            }
            if (!copy.discountPercent) {
                copy.discountPercent = Math.max(0, Math.round((1 - price / copy.originalPrice) * 100));
                updated = true;
            }
            return copy;
        });
        if (localStorage.getItem('seededCatalog50V1') !== 'true' && typeof CATALOG_PRODUCTS_50 !== 'undefined' && Array.isArray(CATALOG_PRODUCTS_50)) {
            const defaultIds = new Set(CATALOG_PRODUCTS_50.map(d => d.id));
            const customUserItems = inventory.filter(p => !defaultIds.has(p.id));
            inventory = [...CATALOG_PRODUCTS_50.map(d => ({ ...d })), ...customUserItems];
            localStorage.setItem('seededCatalog50V1', 'true');
            localStorage.setItem('seededCatalog82V1', 'true');
            localStorage.setItem('seededFullCategoriesV2', 'true');
            updated = true;
        } else if (localStorage.getItem('seededCatalog82V1') !== 'true' && typeof CATALOG_PRODUCTS_50 !== 'undefined' && Array.isArray(CATALOG_PRODUCTS_50)) {
            const existingIds = new Set(inventory.map(p => p.id));
            CATALOG_PRODUCTS_50.forEach(def => {
                if (!existingIds.has(def.id)) {
                    inventory.push({ ...def });
                    updated = true;
                }
            });
            localStorage.setItem('seededCatalog82V1', 'true');
        } else if (localStorage.getItem('seededFullCategoriesV2') !== 'true') {
            const defaults = getDefaultProducts();
            defaults.forEach(def => {
                if (!inventory.some(p => p.id === def.id)) {
                    inventory.push(def);
                    updated = true;
                }
            });
            localStorage.setItem('seededFullCategoriesV2', 'true');
        }
        if (localStorage.getItem('syncedRealSoldFromOrdersV1') !== 'true') {
            const orders = JSON.parse(localStorage.getItem('ordersList')) || [];
            const realSoldById = {};
            const realSoldByName = {};
            orders.forEach(ord => {
                const st = ord.orderStatus || ord.status || '';
                if (st === 'Đã hủy' || st === 'Đã trả hàng') return;
                if (Array.isArray(ord.items)) {
                    ord.items.forEach(it => {
                        const qty = parseInt(it.qty) || 0;
                        if (it.id) realSoldById[it.id] = (realSoldById[it.id] || 0) + qty;
                        else if (it.name) realSoldByName[it.name] = (realSoldByName[it.name] || 0) + qty;
                    });
                }
            });
            inventory = inventory.map(p => ({
                ...p,
                sold: (realSoldById[p.id] || 0) + (realSoldByName[p.name] || 0),
                reviewCount: 0
            }));
            localStorage.setItem('syncedRealSoldFromOrdersV1', 'true');
            updated = true;
        }
        if (updated) {
            localStorage.setItem('inventoryProducts', JSON.stringify(inventory));
        }
    }
    return inventory;
}

function getProductReviews(prodId) {
    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    return Array.isArray(allReviews[prodId]) ? allReviews[prodId] : [];
}

function getProductRatingSummary(prodId) {
    const reviews = getProductReviews(prodId);
    if (reviews.length === 0) return { count: 0, avg: 0 };
    const avg = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length;
    return { count: reviews.length, avg: Number(avg.toFixed(1)) };
}

function renderCardRatingHtml(prodId) {
    const summary = getProductRatingSummary(prodId);
    if (summary.count === 0) {
        return `<span class="text-muted" style="font-size: 0.78rem;">Chưa có đánh giá</span>`;
    }
    return `${renderStarsHtml(summary.avg)} <span class="text-muted" style="font-size: 0.78rem;">${summary.avg} (${summary.count})</span>`;
}

function hasCurrentUserPurchasedProduct(prodId, prodName) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    const orders = JSON.parse(localStorage.getItem('ordersList')) || [];
    return orders.some((ord) => {
        const ordStatus = ord.orderStatus || ord.status || '';
        if (ordStatus === 'Đã hủy' || ordStatus === 'Đã trả hàng') return false;
        const ordOwner = (ord.userEmail || ord.email || '').trim().toLowerCase();
        if (ordOwner !== userEmail) return false;
        if (Array.isArray(ord.items)) {
            return ord.items.some(it => it.id === prodId || (prodName && it.name === prodName));
        }
        return (ord.productName || '').includes(prodName || prodId);
    });
}

function renderStarsHtml(rating) {
    const full = Math.round(rating || 0);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= full ? 'text-warning' : 'text-muted'}" style="font-size: 0.9rem;">&#9733;</span>`;
    }
    return html;
}

let logoArcUid = 0;

function getBrandLogoMarkup() {
    logoArcUid += 1;
    const topId = `atmTopArc_${logoArcUid}`;
    const botId = `atmBotArc_${logoArcUid}`;
    return `
        <span class="brand-logo-mark" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path id="${topId}" d="M 13.5,50 A 36.5,36.5 0 1,1 86.5,50"/>
                    <path id="${botId}" d="M 11.5,50 A 38.5,38.5 0 0,0 88.5,50"/>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#0f4c3a"/>
                <circle cx="50" cy="50" r="45.5" fill="none" stroke="#f3d27a" stroke-width="1.2" stroke-opacity="0.75"/>
                <circle cx="50" cy="50" r="28.5" fill="#f4faf7" stroke="#f3d27a" stroke-width="1.4"/>
                <text fill="#f3d27a" font-family="Be Vietnam Pro, sans-serif" font-size="10.8" font-weight="800" letter-spacing="1.5">
                    <textPath href="#${topId}" startOffset="50%" text-anchor="middle" dominant-baseline="central">AN TÂM MART</textPath>
                </text>
                <text fill="#ffffff" font-family="Be Vietnam Pro, sans-serif" font-size="8.6" font-weight="700" letter-spacing="1.1">
                    <textPath href="#${botId}" startOffset="50%" text-anchor="middle" dominant-baseline="central">SỨC KHỎE XANH</textPath>
                </text>
                <circle cx="12.5" cy="50" r="2" fill="#f3d27a"/>
                <circle cx="87.5" cy="50" r="2" fill="#f3d27a"/>
                <path d="M50 32C42.5 36.5 38 42.8 38 50.5C38 57.5 43.4 63 50 63C56.6 63 62 57.5 62 50.5C62 42.8 57.5 36.5 50 32Z" fill="#0f4c3a" fill-opacity="0.14"/>
                <rect x="46.8" y="39" width="6.4" height="22" rx="2.5" fill="#0f4c3a"/>
                <rect x="39" y="46.8" width="22" height="6.4" rx="2.5" fill="#0f4c3a"/>
                <circle cx="50" cy="50" r="2.4" fill="#f3d27a"/>
            </svg>
        </span>
        <span class="brand-logo-words">
            <span class="brand-logo-name">${SITE_BRAND.name}</span>
            <span class="brand-logo-sub">Sức Khỏe Xanh</span>
        </span>
    `;
}

const MEGA_MENU_GROUPS = [
    {
        id: 'vitamin',
        title: 'Vitamin và Thực phẩm chức năng',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
        sectionTitle: 'CHỌN THEO NHU CẦU SỨC KHỎE',
        allHref: 'sanpham.html',
        items: [
            { label: 'Bổ não và Tăng cường trí nhớ', cat: 'Bổ não và Tăng cường trí nhớ', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>' },
            { label: 'Tăng đề kháng và Miễn dịch', cat: 'Tăng đề kháng và Miễn dịch', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' },
            { label: 'Tiêu hóa và Sức khỏe đường ruột', cat: 'Tiêu hóa và Sức khỏe đường ruột', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12s1.5 2 4 2 4-2 4-2"/></svg>' },
            { label: 'Năng lượng và Thể lực', cat: 'Năng lượng và Thể lực', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
            { label: 'Bổ mắt và Sức khỏe thị lực', cat: 'Bổ mắt và Sức khỏe thị lực', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' },
            { label: 'Đẹp da, Tóc và Móng', cat: 'Đẹp da, Tóc và Móng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>' },
            { label: 'Tim mạch và Tuần hoàn', cat: 'Tim mạch và Tuần hoàn', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
            { label: 'Xương khớp và Cơ bắp', cat: 'Xương khớp và Cơ bắp', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/></svg>' },
            { label: 'Ngủ ngon và Giảm căng thẳng', cat: 'Ngủ ngon và Giảm căng thẳng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' }
        ]
    },
    {
        id: 'mom-baby',
        title: 'Mẹ bầu và Em bé',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
        sectionTitle: 'THỰC PHẨM BỔ SUNG CHO MẸ VÀ BÉ',
        allHref: 'sanpham.html?cat=' + encodeURIComponent('Mẹ bầu và Em bé'),
        items: [
            { label: 'Men vi sinh cho bé', cat: 'Mẹ bầu và Em bé', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12h6"/></svg>' },
            { label: 'Vitamin D3 K2 phát triển chiều cao', cat: 'Mẹ bầu và Em bé', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 12h14"/></svg>' },
            { label: 'Vitamin cho mẹ bầu và phụ nữ', cat: 'Mẹ bầu và Em bé', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
            { label: 'Tăng đề kháng cho trẻ nhỏ', cat: 'Tăng đề kháng và Miễn dịch', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
        ]
    },
    {
        id: 'sports',
        title: 'Thể thao và Thể hình',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
        sectionTitle: 'DINH DƯỠNG THỂ THAO VÀ VÓC DÁNG',
        allHref: 'sanpham.html?cat=' + encodeURIComponent('Thể thao và Kiểm soát cân nặng'),
        items: [
            { label: 'Thực phẩm bổ sung thể thao', cat: 'Thể thao và Kiểm soát cân nặng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
            { label: 'Whey protein và Bột đạm', cat: 'Thể thao và Kiểm soát cân nặng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2h6v2"/></svg>' },
            { label: 'Kiểm soát cân nặng', cat: 'Thể thao và Kiểm soát cân nặng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' },
            { label: 'Năng lượng và Thể lực', cat: 'Năng lượng và Thể lực', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>' }
        ]
    },
    {
        id: 'deals',
        title: 'Ưu đãi giá tốt',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
        sectionTitle: 'THỰC PHẨM CHỨC NĂNG ĐANG GIẢM GIÁ',
        allHref: 'sanpham.html',
        items: [
            { label: 'Tất cả sản phẩm khuyến mãi', cat: '', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' },
            { label: 'Đẹp da, Tóc và Móng ưu đãi', cat: 'Đẹp da, Tóc và Móng', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>' },
            { label: 'Tim mạch và Tuần hoàn ưu đãi', cat: 'Tim mạch và Tuần hoàn', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
            { label: 'Xương khớp và Cơ bắp ưu đãi', cat: 'Xương khớp và Cơ bắp', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 12h14"/></svg>' }
        ]
    }
];

function renderMegaMenuRightPanel(groupId) {
    const group = MEGA_MENU_GROUPS.find(g => g.id === groupId) || MEGA_MENU_GROUPS[0];
    const rightEl = document.getElementById('megaMenuRightPanel');
    if (!rightEl) return;

    document.querySelectorAll('.mega-left-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.groupId === group.id);
    });

    const products = initInventoryCommon();
    const catSet = new Set(group.items.map(i => i.cat).filter(Boolean));
    let featured = group.id === 'deals'
        ? products.slice().sort((a, b) => (parseInt(b.discountPercent) || 0) - (parseInt(a.discountPercent) || 0)).slice(0, 3)
        : products.filter(p => catSet.has(p.category)).slice(0, 3);
    if (featured.length < 3) {
        const extra = products.filter(p => !featured.some(f => f.id === p.id)).slice(0, 3 - featured.length);
        featured = [...featured, ...extra];
    }

    const brands = [...new Set(products.map(p => (p.brand || 'Chính hãng').trim()))].slice(0, 5);

    rightEl.innerHTML = `
        <div class="mega-right-header">
            <span class="fw-bold text-uppercase small text-dark">${group.title}</span>
            <a href="${group.allHref}" class="small fw-semibold text-success text-decoration-none">Xem tất cả +</a>
        </div>
        <div class="mega-right-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="mega-section-label">${group.sectionTitle}</span>
                <a href="${group.allHref}" class="small fw-semibold text-success text-decoration-none">Xem tất cả &rsaquo;</a>
            </div>
            <div class="row g-2 mb-3">
                ${group.items.map(it => `
                    <div class="col-md-6">
                        <a href="${it.cat ? 'sanpham.html?cat=' + encodeURIComponent(it.cat) : 'sanpham.html'}" class="mega-need-link">
                            <span class="mega-need-icon">${it.icon}</span>
                            <span>${it.label}</span>
                        </a>
                    </div>
                `).join('')}
            </div>
            <div class="mega-section-label mb-2">SẢN PHẨM NỔI BẬT</div>
            <div class="row g-2 mb-3">
                ${featured.map(p => `
                    <div class="col-4">
                        <a href="chitiet.html?id=${encodeURIComponent(p.id)}" class="mega-prod-mini">
                            <img src="${p.img}" alt="${p.name}">
                            <div class="mega-prod-mini-name">${p.name}</div>
                            <div class="mega-prod-mini-price">${(parseInt(p.price) || 0).toLocaleString('vi-VN')}đ</div>
                        </a>
                    </div>
                `).join('')}
            </div>
            <div class="mega-section-label mb-2">THƯƠNG HIỆU NỔI BẬT</div>
            <div class="d-flex flex-wrap gap-2">
                ${brands.map(b => `<a href="sanpham.html?q=${encodeURIComponent(b)}" class="mega-brand-pill">${b}</a>`).join('')}
            </div>
        </div>
    `;
}

function positionMegaMenu() {
    const panel = document.getElementById('storeMegaMenuPanel');
    const backdrop = document.getElementById('megaMenuBackdrop');
    if (!panel) return;
    const sticky = document.querySelector('.sticky-top') || document.querySelector('.header-main');
    const cont = document.querySelector('.header-main .container');
    const topPos = sticky ? Math.max(60, Math.round(sticky.getBoundingClientRect().bottom)) : 110;
    const panelW = Math.min(940, window.innerWidth - 24);
    let leftPos = cont ? Math.round(cont.getBoundingClientRect().left) : 12;
    if (leftPos + panelW > window.innerWidth - 12) {
        leftPos = Math.max(12, window.innerWidth - panelW - 12);
    }
    panel.style.top = (topPos + 4) + 'px';
    panel.style.left = leftPos + 'px';
    panel.style.width = panelW + 'px';
    if (backdrop) backdrop.style.top = topPos + 'px';
}

function toggleMegaMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const panel = document.getElementById('storeMegaMenuPanel');
    const backdrop = document.getElementById('megaMenuBackdrop');
    const trigger = document.getElementById('megaMenuTriggerBtn');
    if (!panel) return;
    const willOpen = !panel.classList.contains('open');
    if (willOpen) {
        positionMegaMenu();
        renderMegaMenuRightPanel('vitamin');
    }
    panel.classList.toggle('open', willOpen);
    if (backdrop) backdrop.classList.toggle('open', willOpen);
    if (trigger) trigger.classList.toggle('active', willOpen);
}

function closeMegaMenu() {
    const panel = document.getElementById('storeMegaMenuPanel');
    const backdrop = document.getElementById('megaMenuBackdrop');
    const trigger = document.getElementById('megaMenuTriggerBtn');
    if (panel) panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (trigger) trigger.classList.remove('active');
}

function upgradeStorefrontNav() {
    const navList = document.querySelector('.nav-menu .nav');
    const headerMain = document.querySelector('.header-main');
    if (document.body.classList.contains('admin-page')) return;

    const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const activeCat = params.get('cat') || '';

    // Đặt nút "Danh mục" ngay bên trái thanh tìm kiếm trên header
    const searchWrapper = headerMain ? headerMain.querySelector('.search-wrapper') : null;
    const searchForm = document.getElementById('headerSearchForm');
    if (searchWrapper && searchForm && !document.getElementById('megaMenuTriggerBtn')) {
        const barRow = document.createElement('div');
        barRow.className = 'd-flex align-items-center gap-2';
        const triggerBtn = document.createElement('button');
        triggerBtn.type = 'button';
        triggerBtn.id = 'megaMenuTriggerBtn';
        triggerBtn.className = 'mega-trigger-btn';
        triggerBtn.onclick = toggleMegaMenu;
        triggerBtn.innerHTML = `
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span>Danh mục</span>
        `;
        searchForm.classList.add('flex-grow-1');
        searchForm.style.minWidth = '0';
        searchWrapper.insertBefore(barRow, searchForm);
        barRow.appendChild(triggerBtn);
        barRow.appendChild(searchForm);
    }

    if (navList) {
        navList.innerHTML = `
            <li class="nav-item"><a class="nav-link ${page === 'index.html' || page === '' ? 'active' : ''}" href="index.html">Trang Chủ</a></li>
            <li class="nav-item"><a class="nav-link ${page === 'gioithieu.html' ? 'active' : ''}" href="gioithieu.html">Giới Thiệu</a></li>
            <li class="nav-item"><a class="nav-link ${page === 'sanpham.html' && !activeCat ? 'active' : ''}" href="sanpham.html">Tất Cả Sản Phẩm</a></li>
            <li class="nav-item"><a class="nav-link ${activeCat === 'Tăng đề kháng và Miễn dịch' ? 'active' : ''}" href="sanpham.html?cat=${encodeURIComponent('Tăng đề kháng và Miễn dịch')}">Tăng đề kháng</a></li>
            <li class="nav-item"><a class="nav-link ${activeCat === 'Bổ não và Tăng cường trí nhớ' ? 'active' : ''}" href="sanpham.html?cat=${encodeURIComponent('Bổ não và Tăng cường trí nhớ')}">Bổ não</a></li>
            <li class="nav-item"><a class="nav-link ${activeCat === 'Đẹp da, Tóc và Móng' ? 'active' : ''}" href="sanpham.html?cat=${encodeURIComponent('Đẹp da, Tóc và Móng')}">Đẹp da, Tóc, Móng</a></li>
            <li class="nav-item"><a class="nav-link ${activeCat === 'Mẹ bầu và Em bé' ? 'active' : ''}" href="sanpham.html?cat=${encodeURIComponent('Mẹ bầu và Em bé')}">Mẹ bầu và Em bé</a></li>
            <li class="nav-item"><a class="nav-link ${page === 'lienhe.html' ? 'active' : ''}" href="lienhe.html">Liên Hệ</a></li>
        `;
    }

    if (!document.getElementById('storeMegaMenuPanel')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'megaMenuBackdrop';
        backdrop.className = 'mega-menu-backdrop';
        backdrop.onclick = closeMegaMenu;
        document.body.appendChild(backdrop);

        const megaDiv = document.createElement('div');
        megaDiv.id = 'storeMegaMenuPanel';
        megaDiv.className = 'mega-menu-panel';
        megaDiv.innerHTML = `
            <div class="mega-menu-left">
                ${MEGA_MENU_GROUPS.map((g, i) => `
                    <button type="button" class="mega-left-item ${i === 0 ? 'active' : ''}" data-group-id="${g.id}" onmouseenter="renderMegaMenuRightPanel('${g.id}')" onclick="renderMegaMenuRightPanel('${g.id}')">
                        <span class="mega-left-icon">${g.icon}</span>
                        <span>${g.title}</span>
                    </button>
                `).join('')}
            </div>
            <div class="mega-menu-right" id="megaMenuRightPanel"></div>
        `;
        document.body.appendChild(megaDiv);

        window.addEventListener('resize', () => {
            if (megaDiv.classList.contains('open')) positionMegaMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMegaMenu();
        });
    }
}

function upgradeLogosAndFooters() {
    document.querySelectorAll('a.logo-text').forEach((el) => {
        el.innerHTML = getBrandLogoMarkup();
    });
    upgradeStorefrontNav();

    if (document.title.includes('[TÊN THƯƠNG HIỆU]')) {
        document.title = document.title.replace(/\[TÊN THƯƠNG HIỆU\]/g, SITE_BRAND.name);
    }

    const footerEl = document.querySelector('footer');
    if (footerEl && !document.body.classList.contains('admin-page')) {
        const footerCatLinks = PRODUCT_CATEGORIES.map(c =>
            `<li class="mb-1"><a href="sanpham.html?cat=${encodeURIComponent(c.name)}">${c.name}</a></li>`
        ).join('');
        footerEl.className = 'site-footer-modern pt-5 pb-3';
        footerEl.innerHTML = `
            <div class="container">
                <div class="row g-4 pb-4 footer-divider">
                    <div class="col-lg-3 col-md-6">
                        <a href="index.html" class="logo-text mb-3 d-inline-flex">${getBrandLogoMarkup()}</a>
                        <p class="small footer-desc mb-3">${SITE_BRAND.name} chuyên cung cấp thực phẩm chức năng, vitamin và sản phẩm chăm sóc sức khỏe chính hãng với nguồn gốc minh bạch.</p>
                        <div class="footer-slogan-pill mb-3">${SITE_BRAND.slogan}</div>
                        <ul class="list-unstyled small mb-0 footer-contact-list">
                            <li class="mb-1">Hotline: <a href="tel:${SITE_BRAND.phone}" class="fw-semibold">${SITE_BRAND.phone}</a></li>
                            <li class="mb-1">Email: <a href="mailto:${SITE_BRAND.email}" class="fw-semibold">${SITE_BRAND.email}</a></li>
                            <li>Địa chỉ: <span>${SITE_BRAND.address}</span></li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h6 class="footer-heading mb-3">DANH MỤC</h6>
                        <ul class="list-unstyled small mb-0 footer-links">
                            <li class="mb-1"><a href="sanpham.html">Tất cả sản phẩm</a></li>
                            ${footerCatLinks}
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h6 class="footer-heading mb-3">CHÍNH SÁCH VÀ HỖ TRỢ</h6>
                        <ul class="list-unstyled small mb-0 footer-links">
                            <li class="mb-2"><a href="gioithieu.html">Về chúng tôi</a></li>
                            <li class="mb-2"><a href="donhang.html">Đơn hàng của tôi</a></li>
                            <li class="mb-2"><a href="chinhsach-doitra.html">Chính sách đổi trả</a></li>
                            <li class="mb-2"><a href="chinhsach-vanchuyen.html">Chính sách vận chuyển</a></li>
                            <li class="mb-2"><a href="chinhsach-baomat.html">Chính sách bảo mật</a></li>
                            <li class="mb-2"><a href="chinhsach-thanhtoan.html">Chính sách thanh toán</a></li>
                            <li><a href="lienhe.html">Liên hệ và Hỗ trợ</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h6 class="footer-heading mb-3">KẾT NỐI VÀ ƯU ĐÃI</h6>
                        <p class="small footer-desc mb-2">Nhận thông tin mã giảm giá và kiến thức chăm sóc sức khỏe hàng tuần.</p>
                        <form class="d-flex gap-2 mb-3" onsubmit="handleFooterSubscribe(event)">
                            <input type="email" id="footerSubEmail" class="form-control form-control-sm" placeholder="Nhập email của bạn..." required>
                            <button type="submit" class="btn btn-success btn-sm px-3 text-nowrap">Đăng ký</button>
                        </form>
                        <div class="footer-trust-badges">
                            <span class="trust-chip">Chính hãng 100%</span>
                            <span class="trust-chip">COD toàn quốc</span>
                            <span class="trust-chip">Đổi trả 7 ngày</span>
                        </div>
                    </div>
                </div>
                <div class="footer-disclaimer mt-3 mb-3">
                    Lưu ý: Thực phẩm bảo vệ sức khỏe không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.
                </div>
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 small footer-bottom">
                    <span>&copy; 2026 ${SITE_BRAND.name}. Bảo lưu mọi quyền.</span>
                    <span>Thiết kế cho Đồ án Cơ sở ngành Công nghệ Thông tin</span>
                </div>
            </div>
        `;
    }
}

function handleFooterSubscribe(e) {
    e.preventDefault();
    const input = document.getElementById('footerSubEmail');
    if (!input) return;
    if (!isValidEmailStrict(input.value)) {
        showSiteToast('Vui lòng nhập email hợp lệ.', true);
        return;
    }
    showSiteToast('Đăng ký nhận ưu đãi thành công. Mã giảm giá: SUCKHOE10');
    input.value = '';
}

function renderCommonAuthHeader() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username') || 'Khách';
    const userEmail = getCurrentUserEmail() || '';
    const authContainer = document.getElementById('authContainer');
    const cartItems = getCartItems();
    const savedQty = cartItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    localStorage.setItem('cart_qty', savedQty);

    if (!authContainer) return;
    if (!isLoggedIn) {
        localStorage.setItem('cart_qty', 0);
        authContainer.innerHTML = `
            <a href="dangnhap.html" class="btn btn-success btn-sm px-3 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Đăng nhập</span>
            </a>
        `;
        return;
    }

    const favCount = getFavorites().length;
    const avatarChar = (username.trim().charAt(0) || 'U').toUpperCase();
    const shortName = username.length > 14 ? username.slice(0, 14) + '…' : username;

    const adminMenuItem = (userRole === 'admin')
        ? `<li><a class="dropdown-item account-menu-item account-menu-admin" href="quantri.html">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Trang Quản trị</span>
           </a></li>`
        : '';

    authContainer.innerHTML = `
        <a href="yeuthich.html" class="header-fav-pill" title="Sản phẩm yêu thích" aria-label="Sản phẩm yêu thích">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Yêu thích</span>
            ${favCount > 0 ? `<span class="header-fav-count">${favCount}</span>` : ''}
        </a>

        <a href="giohang.html" class="header-cart-pill" title="Giỏ hàng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Giỏ hàng</span>
            <span class="header-cart-count">${savedQty}</span>
        </a>

        <div class="dropdown">
            <button class="account-dropdown-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="account-avatar">${avatarChar}</span>
                <span class="account-name">${shortName}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end account-dropdown-menu shadow-lg border-0">
                <li class="account-menu-header">
                    <div class="fw-bold text-dark small">${username}</div>
                    <div class="text-muted" style="font-size: 11px;">${userEmail}</div>
                    ${userRole === 'admin' ? '<span class="badge bg-warning text-dark mt-1" style="font-size: 10px;">Quản trị viên</span>' : ''}
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                    <a class="dropdown-item account-menu-item" href="donhang.html">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        <span>Đơn hàng của tôi</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item account-menu-item" href="yeuthich.html">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <span>Sản phẩm yêu thích (${favCount})</span>
                    </a>
                </li>
                ${adminMenuItem}
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                    <button type="button" class="dropdown-item account-menu-item text-danger" onclick="commonLogout()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        <span>Đăng xuất</span>
                    </button>
                </li>
            </ul>
        </div>
    `;
}

function showSiteToast(msg, isError = false) {
    document.querySelectorAll('.site-toast').forEach(el => el.remove());
    const t = document.createElement('div');
    t.className = 'site-toast' + (isError ? ' toast-error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.remove(); }, 3000);
}

function commonLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    showSiteToast('Đã đăng xuất tài khoản!');
    setTimeout(() => { window.location.href = 'index.html'; }, 700);
}

function bindCommonHeaderSearch() {
    const searchInput = document.getElementById('headerSearchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const searchForm = document.getElementById('headerSearchForm');
    if (searchInput && suggestionsBox) {
        const renderSuggestions = () => {
            const kw = normalizeSearchText(searchInput.value);
            if (!kw) {
                suggestionsBox.style.display = 'none';
                suggestionsBox.innerHTML = '';
                return;
            }
            const matches = initInventoryCommon().filter(p => {
                const hay = normalizeSearchText(`${p.name || ''} ${p.id || ''} ${p.brand || ''} ${p.origin || ''} ${p.category || ''} ${p.uses || ''}`);
                return hay.includes(kw);
            }).slice(0, 6);
            if (matches.length === 0) {
                suggestionsBox.innerHTML = `<div class="p-3 small text-muted text-center">Không tìm thấy sản phẩm phù hợp</div>`;
                suggestionsBox.style.display = 'block';
                return;
            }
            suggestionsBox.innerHTML = matches.map(p => `
                <a href="chitiet.html?id=${encodeURIComponent(p.id)}" class="search-suggestion-item">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="flex-grow-1 min-w-0">
                        <div class="fw-semibold small text-truncate">${p.name}</div>
                        <div class="text-muted" style="font-size: 11px;">${p.brand || 'Chính hãng'} · ${p.category}</div>
                    </div>
                    <span class="fw-bold text-danger small text-nowrap">${(parseInt(p.price) || 0).toLocaleString('vi-VN')}đ</span>
                </a>
            `).join('');
            suggestionsBox.style.display = 'block';
        };
        searchInput.addEventListener('input', renderSuggestions);
        searchInput.addEventListener('focus', renderSuggestions);
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) suggestionsBox.style.display = 'none';
        });
    }
    if (searchForm && !searchForm.dataset.customHandler) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const kw = document.getElementById('headerSearchInput').value.trim();
            window.location.href = kw ? `sanpham.html?q=${encodeURIComponent(kw)}` : 'sanpham.html';
        });
    }
}

function initBackToTopButton() {
    if (document.body.classList.contains('admin-page') || document.getElementById('backToTopBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.type = 'button';
    btn.className = 'back-to-top-btn';
    btn.title = 'Lên đầu trang';
    btn.setAttribute('aria-label', 'Lên đầu trang');
    btn.innerHTML = '&#8593;';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 360);
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
    upgradeLogosAndFooters();
    renderCommonAuthHeader();
    bindCommonHeaderSearch();
    initBackToTopButton();
});
