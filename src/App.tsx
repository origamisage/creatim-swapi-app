import { Navbar } from "./components/navbar";
import { StarWarsCharacters } from "./components/characters/characters";
import { Footer } from "./components/footer";

function App() {
  return (
    <div className="flex h-dvh flex-col items-center">
      <Navbar />

      <main className="max-w-desktop w-full px-4 pt-12 pb-8 sm:px-6 md:px-8 lg:pt-32">
        <StarWarsCharacters />
      </main>

      <Footer />
    </div>
  );
}

export default App;
