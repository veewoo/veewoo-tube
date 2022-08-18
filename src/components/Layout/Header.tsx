function Header() {
  return (
    <header className="flex p-4">
      <form>
        <label className="mr-2">User name: </label>
        <input className="mr-4" type="text" />
        <label className="mr-2">Password: </label>
        <input type="password" />
        <button className="ml-4">Login</button>
      </form>
    </header>
  );
}

export default Header;
