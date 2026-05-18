"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#14181F] border-t border-[#272C35] px-10 py-[60px] flex flex-col gap-[36px] shrink-0 mt-auto">
      <div className="max-w-[1360px] mx-auto w-full flex justify-between items-start">
        <div className="flex flex-col gap-1 w-[308px]">
          <div className="font-irish text-[32px] leading-none mb-1 text-[#F9FAFB]">{"<M/>"}</div>
          <p className="text-[14px] text-[#9DA6AF]">Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.</p>
        </div>

        <div className="flex gap-[100px]">
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-white mb-1">Navegação</h3>
            <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Home</Link>
            <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Artigos</Link>
            <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Dashboard</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-white mb-1 uppercase tracking-wider">Redes Sociais</h3>
            <div className="flex gap-2 text-[#9DA6AF]">
              <a href="#" className="hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1360px] mx-auto border-t border-[#272C35]"></div>
      
      <div className="w-full text-center text-[12px] text-[#9DA6AF] font-light">
        © 2025 TechBlog. Todos os direitos reservados.
      </div>
    </footer>
  );
}