import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#b7bfff] to-[#f9af91] dark:from-[#392a82] dark:to-[#783629]">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-center text-center text-[#2e2e2e] sm:justify-between sm:text-left dark:text-[#fefefe]">
          <div className="flex w-full justify-center p-6 sm:w-1/3 sm:justify-start">
            <div>
              <div className="text-sm font-medium">&copy; VISTYO 2025</div>
              <div className="text-sm font-black text-[#2e2e2e] uppercase dark:text-[#ffb1a7]">
                Made By Parth Ahuja&hearts;
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center p-6 sm:w-1/3">
            <div>
              <h3 className="tracking-px mb-4 text-xs font-bold text-[#aa2a50] uppercase dark:text-[#ffb1a7]">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <a
                    href="/readme"
                    target="_blank"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Features
                  </a>
                </li>
                <li className="mb-4">
                  <Link
                    to="/app/pricing"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <a
                    href="https://github.com/ParthAhuja4/vistyo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Github Repository
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex w-full justify-center p-6 text-center sm:w-1/3 sm:justify-end sm:text-right">
            <div>
              <h3 className="tracking-px mb-4 text-xs font-bold text-[#aa2a50] uppercase dark:text-[#ffb1a7]">
                About Me
              </h3>
              <ul>
                <li className="mb-4">
                  <a
                    target="_blank"
                    href="https://parth-portfolio-dusky.vercel.app/"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Portfolio Website
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    target="_blank"
                    href="https://github.com/ParthAhuja4"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Github Profile
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/parthahuja4/"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://parth-portfolio-dusky.vercel.app/#projects"
                    className="text-base font-medium text-gray-900 transition hover:text-gray-700 dark:text-[#fefefe] dark:hover:text-gray-300"
                  >
                    Other Projects
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
