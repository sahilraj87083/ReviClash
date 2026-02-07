import { NavLink } from "react-router-dom";
import logo from "../../assets/logo3.png"; // Ensure this path is correct
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Heart
} from "lucide-react";

function Footer() {
  return (
    // HIDDEN ON MOBILE (hidden), VISIBLE ON DESKTOP (md:block)
    <footer className="hidden md:block bg-slate-950 border-t border-slate-800 text-slate-400 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-4 gap-12">

          {/* BRAND COLUMN */}
          <div className="col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                 <img
                    src={logo}
                    alt="ReviClash"
                    className="h-6 w-auto object-contain brightness-0 invert"
                 />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">ReviClash</span>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-400">
              The ultimate platform for developers to practice, compete, and analyze their coding journey. Master algorithms with friends.
            </p>

            <div className="flex gap-4 pt-2">
              <SocialLink href="https://linkedin.com" icon={Linkedin} />
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://github.com" icon={Github} />
              <SocialLink href="mailto:reviclash@gmail.com" icon={Mail} />
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="col-span-3 grid grid-cols-3 gap-8 pl-10">
            <div>
              <h4 className="text-white font-semibold mb-5">Product</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/explore">Explore Questions</FooterLink>
                <FooterLink to="/collections">Collections</FooterLink>
                <FooterLink to="/contests">Live Contests</FooterLink>
                <FooterLink to="/stats">Analytics</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/careers">Careers</FooterLink>
                <FooterLink to="/blog">Engineering Blog</FooterLink>
                <FooterLink to="/contact">Contact Support</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5">Legal</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                <FooterLink to="/terms">Terms of Service</FooterLink>
                <FooterLink to="/cookies">Cookie Policy</FooterLink>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ReviClash Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
                Made with <Heart size={12} className="text-red-500 fill-current" /> by Sahil Singh
            </p>
        </div>
      </div>
    </footer>
  );
}

// Helper Components for cleaner code
function SocialLink({ href, icon: Icon }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 border border-slate-800 hover:border-slate-700"
        >
            <Icon size={18} />
        </a>
    );
}

function FooterLink({ to, children }) {
    return (
        <li>
            <NavLink 
                to={to} 
                className="hover:text-blue-400 transition-colors duration-200 block"
            >
                {children}
            </NavLink>
        </li>
    );
}

export default Footer;