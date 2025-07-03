import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-evenly items-center mb-8">
        <Link to="/play">PLAY</Link>
      </div>
    </main>
  );
}

export default HomePage;
