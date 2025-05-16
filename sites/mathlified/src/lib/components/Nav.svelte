<div class="navbar">
  <nav>
    <a href='/'>Mathlified</a>
    <a href='https://github.com/kelvinsjk/mathlified'>Github</a>
  </nav>
</div>

<style>
  nav {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    align-items: center;
  }
  .navbar {
    background-color: midnightblue;
    padding: 1rem;
    height: var(--nav-height, 4.5rem);
    display: grid;
  }
  a:first-child {
    font-size: 1.5rem;
  }
  a {
    text-decoration: none;
    color: white;
  }
  a:hover{
    color: goldenrod;
  }
</style>