import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/70 backdrop-blur-sm">
      <div className="wrapper flex-center flex-col gap-2 py-8 text-center">
        <div className="text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {APP_NAME}
        </div>
        <p className="text-sm text-muted-foreground">
          {currentYear} {APP_NAME}. Homemade flavours, packed fresh with care.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
