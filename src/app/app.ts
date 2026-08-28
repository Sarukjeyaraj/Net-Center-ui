import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import enTranslations from '../assets/i18n/en.json';
import taTranslations from '../assets/i18n/ta.json';

export type Language = 'en' | 'ta';

export const TRANSLATIONS: Record<Language, any> = {
  en: enTranslations,
  ta: taTranslations
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = 'Karthick Net Center';

  // Active Language State
  currentLang: Language = 'en';

  // Theme Mode State (Default Light Theme as requested)
  isDarkTheme = false;
  
  // Mobile Menu State
  isMobileMenuOpen = false;

  // Active Section for Navbar Highlight
  activeSection = 'home';

  // Sub-Service Popup State
  isSubServiceOpen = false;
  selectedCategoryTitle = '';
  selectedSubServices: string[] = [];

  // Call Popup State
  isCallPopupOpen = false;

  // Toast Notification State
  toastMessage = '';
  showToast = false;

  get t(): any {
    return TRANSLATIONS[this.currentLang];
  }

  ngOnInit(): void {
    // 1. Language Preference
    const savedLang = localStorage.getItem('knc_lang') as Language;
    if (savedLang === 'en' || savedLang === 'ta') {
      this.currentLang = savedLang;
    }

    // 2. Theme Preference (Default Light)
    const savedTheme = localStorage.getItem('knc_theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.isDarkTheme = false;
      document.body.classList.remove('dark-theme');
    }
  }

  // Toggle Light / Dark Theme Mode
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('knc_theme', 'dark');
      this.showToastNotification(this.currentLang === 'ta' ? 'இருள் தீம் தேர்வானது' : 'Dark Theme Enabled');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('knc_theme', 'light');
      this.showToastNotification(this.currentLang === 'ta' ? 'வெளிச்ச தீம் தேர்வானது' : 'Light Theme Enabled');
    }
  }

  // Switch Language
  setLanguage(lang: Language): void {
    this.currentLang = lang;
    localStorage.setItem('knc_lang', lang);
    this.showToastNotification(lang === 'ta' ? 'தமிழ் மொழி தேர்வு செய்யப்பட்டது' : 'English language selected');
  }

  // Toggle Language between English and Tamil for compact mobile button
  toggleLanguage(): void {
    const nextLang: Language = this.currentLang === 'en' ? 'ta' : 'en';
    this.setLanguage(nextLang);
  }

  // Toggle Mobile Navigation Menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Smooth Scroll to Section
  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Open Sub-Services Modal for Category
  openSubServiceCategory(catKey: string): void {
    const categories: Record<string, string> = {
      aadhar: this.t.services.catAadhar,
      online: this.t.services.catOnline,
      land: this.t.services.catLand,
      print: this.t.services.catPrint
    };

    this.selectedCategoryTitle = categories[catKey] || 'Service Details';
    this.selectedSubServices = this.t.serviceItems[catKey] || [];
    this.isSubServiceOpen = true;
    document.body.classList.add('modal-open');
  }

  closeSubServicePopup(): void {
    this.isSubServiceOpen = false;
    this.checkBodyModalLock();
  }

  // Open / Close Call Popup
  openCallPopup(): void {
    this.isCallPopupOpen = true;
    document.body.classList.add('modal-open');
  }

  closeCallPopup(): void {
    this.isCallPopupOpen = false;
    this.checkBodyModalLock();
  }

  private checkBodyModalLock(): void {
    if (!this.isSubServiceOpen && !this.isCallPopupOpen) {
      document.body.classList.remove('modal-open');
    }
  }

  // WhatsApp API Service Inquiry Integration
  inquireServiceOnWhatsApp(serviceName?: string): void {
    const phoneNumber = "919585556858";
    let message = "Hello Karthick Net Center! I would like to inquire about your services.";
    if (serviceName) {
      message = `Hello Karthick Net Center! I am interested in applying for:\n📌 *${serviceName}*\n\nPlease send me the required documents list, fee details, and estimated processing time. Thank you!`;
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  openWhatsApp(): void {
    this.inquireServiceOnWhatsApp();
  }

  openInstagram(): void {
    const instagramUrl = "https://instagram.com/karthick_net_center";
    window.open(instagramUrl, '_blank');
  }

  makePhoneCall(phoneNum: string = "9585556858"): void {
    window.location.href = `tel:+91${phoneNum}`;
  }

  openGoogleMaps(): void {
    const address = "Karthick Net Center Anna Salai Chengalpattu";
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  }

  // Copy text helper
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToastNotification(this.t.contact.copySuccess || 'Copied to clipboard!');
    });
  }

  private showToastNotification(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  // Listen to scroll events to update active section link in navbar
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const sections = ['home', 'services', 'about', 'hours', 'contact'];
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const top = el.offsetTop - 100;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.activeSection = section;
          break;
        }
      }
    }
  }
}
