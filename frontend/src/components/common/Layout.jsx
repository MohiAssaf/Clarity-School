import Navbar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navbar />
      <main className="flex-1 p-8 ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
