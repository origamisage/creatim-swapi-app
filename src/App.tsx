import { Navbar } from "./components/navbar";
import { StarWarsCharacters } from "./components/star-wars-characters/star-wars-characters";
import { StarWarsContextProvider } from "./hooks/test-query";

function App() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* STAR WARS CHARACTERS */}
      <main className="max-w-desktop mx-auto px-4 py-12 sm:px-6 md:px-8">
        <StarWarsContextProvider>
          <StarWarsCharacters />
        </StarWarsContextProvider>
      </main>
    </>
  );
}

export default App;
