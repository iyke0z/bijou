import Api from "./Api";

export default {
  // About
  createAbout(form) {
    return Api.post(`/website/create-about?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  showAbout() {
    return Api.get(`/website/about?shop_id=${localStorage.getItem('shopId')}`);
  },

  // Contact
  createContact(form) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return Api.post(`/website/create-contact?shop_id=${localStorage.getItem('shopId')}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  showContact() {
    return Api.get(`/website/contact?shop_id=${localStorage.getItem('shopId')}`);
  },

  // FAQ
  createFAQ(form) {
    return Api.post(`/website/create-faq?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  updateFAQ(id, form) {
    return Api.post(`/website/update-faq/${id}?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  deleteFAQ(id) {
    return Api.delete(`/website/delete-faq/${id}?shop_id=${localStorage.getItem('shopId')}`);
  },
  showFAQ() {
    return Api.get(`/website/faq?shop_id=${localStorage.getItem('shopId')}`);
  },

  // Hero Banner
  createHeroBanner(form) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return Api.post(`/website/create-hero?shop_id=${localStorage.getItem('shopId')}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateHeroBanner(id, form) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return Api.post(`/website/update-hero/${id}?shop_id=${localStorage.getItem('shopId')}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteHeroBanner(id) {
    return Api.delete(`/website/delete-hero/${id}?shop_id=${localStorage.getItem('shopId')}`);
  },
  showHeroBanners() {
    return Api.get(`/website/hero?shop_id=${localStorage.getItem('shopId')}`);
  },

  // Payment Config
  createPaymentConfig(form) {
    return Api.post(`/website/create-payment-config?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  updatePaymentConfig(id, form) {
    return Api.post(`/website/update-payment-config/${id}?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  showPaymentConfig() {
    return Api.get(`/website/payment-config?shop_id=${localStorage.getItem('shopId')}`);
  },

  // Theme Settings
  createThemeSettings(form) {
    return Api.post(`/website/create-theme-config?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  showThemeSettings() {
    return Api.get(`/website/theme-config?shop_id=${localStorage.getItem('shopId')}`);
  },
  updateThemeSettings(id, form) {
    return Api.post(`/website/update-theme-config/${id}?shop_id=${localStorage.getItem('shopId')}`, form);
  },

  // Return Policy
  createReturnPolicy(form) {
    return Api.post(`/website/create-return-policy?shop_id=${localStorage.getItem('shopId')}`, form);
  },
  showReturnPolicy() {
    return Api.get(`/website/return-policy?shop_id=${localStorage.getItem('shopId')}`);
  },
  deleteAboutItem(id) {
    return Api.delete(`/website/about-item/${id}`);
  },
  updateSettings(data) {
    return Api.post('/website/create-settings', data);
  },
  showSettings() {
    return Api.get('/website/settings');
  },
  createSocialLinks(data) {
    return Api.post('/website/social-links', data);
  },
  showSocialLinks() {
    return Api.get('/website/social-links');
  },
};