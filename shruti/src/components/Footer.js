import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { isAuthenticated } = useAuth();

  const quickLinks = isAuthenticated
    ? [["Dashboard", "/dashboard"], ["My Portfolio", "/my-portfolio"], ["Templates", "/templates"], ["Preview", "/preview"]]
    : [["Home", "/"], ["Login", "/login"], ["Sign Up", "/signup"], ["Preview", "/preview"]];

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div>
            <h3>Portfolio Builder</h3>
            <p>Create professional developer portfolios. Build stunning portfolios and resumes in minutes.</p>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />

          <FooterColumn
            title="Support"
            links={[["About", "#"], ["Contact", "#"], ["Support", "#"]]}
          />

          <FooterColumn
            title="Legal"
            links={[["Privacy Policy", "#"], ["Terms & Conditions", "#"]]}
          />
        </div>

        <div className="footer__bottom">
          Copyright {new Date().getFullYear()} Portfolio Builder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4>{title}</h4>
      <div className="footer__links">
        {links.map(([label, path]) => (
          <Link key={path} to={path} className="footer__link">{label}</Link>
        ))}
      </div>
    </div>
  );
}

export default Footer;
