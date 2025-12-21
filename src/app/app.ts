import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = 'netCenter';

  // reuseable service map
  private readonly serviceData: { [key: string]: string[] } = {
    aadhar: [
      "Aadhaar Card Address update",
      "Aadhaar Card Name Change",
      "Aadhaar Card DOB Change",
      "Aadhaar Card Phone Number Update",
      "Aadhaar Card Photo Update"
    ],
    pan: [
      "New PAN Card Application",
      "Minor PAN Card Application",
      "PAN Card Correction",
      "Link PAN with Aadhaar",
      "Phone No and Email Address Update"
    ],
    voter: [
      "New Voter ID Application",
      "Voter ID Correction (Name, DOB, Father’s Name)",
      "Voter ID Address Change",
      "Voter ID Mobile Number & Email ID Update",
      "Voter ID Download / Lamination",
      "Voter ID Name Removal"
    ],
    passport: [
      "New Passport Application",
      "Passport Renewal",
      "Passport Correction",
      "Any other Passport related Services"
    ],
    license: [
      "New Driving License",
      "Renewal of Driving License",
      "Duplicate Driving License",
      "Address Change in Driving License"
    ],
    TNEGA: [
      "Community Certificate",
      "Nativity Certificate",
      "Income Certificate",
      "OBC Certificate",
      "PSTM Application",
      "First Graduate Certificate",
      "Unmarried Certificate",
      "Inter-Caste Marriage Certificates",
      "Residence Certificate",
      "Legal Heir Certificate",
      "Small / Marginal Farmer",
      "Widow Certificate"
    ],
    ExamApplication: [
      "TNPSC (Tamil Nadu Public Service Commission)",
      "IBPS Bank Exams (PO, Clerk, SO)",
      "SBI Bank Exams (PO, Clerk)",
      "UPSC Civil Services Exam",
      "SSC CGL (Staff Selection Commission) Exam",
      "Police Department Exams",
      "Defence Exams (NDA, CDS)",
      "Teaching Exams (CTET, TET)",
      "Other Exams"
    ],
    college: [
      "TNEA (engineering admissions)",
      "TNGASA (arts and science colleges)"
    ],
    scholar: ["Scholarship Applications"],
    pf: [
      "Full Claim Forms (31, 19, 10C & 13)",
      "Claim Advance Cash",
      "UAN Activation",
      "Password Change for PF",
      "Balance Check",
      "Merge PF Accounts",
      "Add Bank Details, PAN",
      "E-Nomination",
      "Name Correction",
      "Mobile Number Change"
    ],
    patta: ["Patta / Chitta Online Services"],
    ec: ["EC, Land Ownership Transfers"],
    stamp: ["Stamp Duty Calculations"],
    document: ["Document Printing & Scanning"],
    print: ["Printing & Xerox"],
    scanning: ["Scanning & Emailing"],
    lamination: ["Lamination & Spiral Binding"],
    typing: ["Typing Work"]
  };

  // store cleanup callbacks
  private _cleanups: Array<() => void> = [];

  ngAfterViewInit(): void {
    /* ---------------- Navbar logic ---------------- */
    const navItems: NodeListOf<HTMLElement> = document.querySelectorAll(".head");
    const sections: NodeListOf<HTMLElement> = document.querySelectorAll(".section");

    navItems.forEach((item: HTMLElement) => {
      const navClick = () => {
        const targetId: string | null = item.getAttribute("data-target");
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      item.addEventListener("click", navClick);
      this._cleanups.push(() => item.removeEventListener("click", navClick));
    });

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((nav) => nav.classList.remove("active"));
            sections.forEach((sec) => sec.classList.remove("active"));
            (entry.target as HTMLElement).classList.add("active");
            const sectionId = (entry.target as HTMLElement).id;
            document.querySelector(`.head[data-target="${sectionId}"]`)?.classList.add("active");
          }
        });
      },
      { root: null, threshold: 0, rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((section: HTMLElement) => observer.observe(section));
    this._cleanups.push(() => observer.disconnect());

    /* ---------------- Sub-service popup logic ---------------- */
    const serviceItems = document.querySelectorAll('.serviceList li');
    serviceItems.forEach(item => {
      const clickHandler = () => {
        const service = item.getAttribute('data-service') as string;
        this.openSubServicePopup(service);
      };
      item.addEventListener('click', clickHandler);
      this._cleanups.push(() => item.removeEventListener('click', clickHandler));
    });

    document.getElementById('subServiceClose')?.addEventListener('click', this.closePopup);
    document.getElementById('overlay')?.addEventListener('click', this.closePopup);
  }

  openSubServicePopup(service: string) {
    const subServiceBox = document.getElementById('subServiceBox')!;
    const overlay = document.getElementById('overlay')!;
    const list = document.getElementById('subServiceList')!;

    list.innerHTML = '';
    this.serviceData[service]?.forEach(sub => {
      const li = document.createElement('li');
      li.textContent = sub;
      list.appendChild(li);
    });

    subServiceBox.style.display = 'block';
    overlay.style.display = 'block';
  }

  closePopup() {
    document.getElementById('subServiceBox')!.style.display = 'none';
    document.getElementById('overlay')!.style.display = 'none';
  } 
  /** WhatsApp / Call functions */
  openWhatsApp(): void {
    const phoneNumber = "9715561331";
    const message = "Hello";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  }

  showCallPopup() {
    document.getElementById("call-popup")!.style.display = "block";
  }

  closeCallPopup() {
    document.getElementById("call-popup")!.style.display = "none";
  }

  ngOnDestroy(): void {
    this._cleanups.forEach(cleanup => cleanup());
  }
}
