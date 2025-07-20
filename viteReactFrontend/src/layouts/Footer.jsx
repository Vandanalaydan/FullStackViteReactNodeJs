// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white border-t py-4">
      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} VideoHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
