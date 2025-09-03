import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";

// Imagens de fundo
const backgrounds = [
  "https://images.unsplash.com/photo-1606813902912-08bfbea5e4c9",
  "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5",
  "https://images.unsplash.com/photo-1549924231-f129b911e442",
];

// Jogos fixos (clássicos)
const fixedGames = [
  { name: "Fortnite", img: "https://cdn2.unrealengine.com/Fortnite%2Fbattle-pass%2Fchapter4s4%2FBR04_EGS_Launcher_Blade-1200x1600-65e41ff546f9.jpg", rating: 4.6 },
  { name: "Minecraft", img: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png", rating: 4.8 },
  { name: "GTA V", img: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png", rating: 4.7 },
  { name: "League of Legends", img: "https://upload.wikimedia.org/wikipedia/en/7/77/League_of_Legends_logo.png", rating: 4.5 },
  { name: "Counter-Strike 2", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", rating: 4.4 },
];

export default function App() {
  return (
    <BackgroundSlider>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold text-center neon-text mb-10">
          Notícias Gamer 🎮
        </h1>
        <NewsSection />

        {/* Nova seção de jogos */}
        <h2 className="text-3xl font-bold text-center neon-text mt-20 mb-10">
          🏆 Top Jogos da Comunidade
        </h2>
        <TopGamesSection />
      </div>
    </BackgroundSlider>
  );
}

// === SLIDESHOW DE FUNDO ===
function BackgroundSlider({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % backgrounds.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgrounds[index]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/70" />

      {/* Botões */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-20">
        <button
          onClick={prevSlide}
          className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-3 rounded-full hover:scale-110 shadow-lg transition"
        >
          ⬅️
        </button>
        <button
          onClick={nextSlide}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white p-3 rounded-full hover:scale-110 shadow-lg transition"
        >
          ➡️
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2 z-20">
        {backgrounds.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full cursor-pointer transition ${
              i === index
                ? "bg-gradient-to-r from-blue-500 to-pink-500 animate-pulse shadow-[0_0_15px_rgba(255,0,255,0.8)]"
                : "bg-gray-400"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// === NOTÍCIAS ===
function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.apitube.io/v1/news", {
        headers: { Authorization: "Bearer api_live_JxoXyOSnRfV6HjsQttuQzAVByxNIiGPzuNuS0lbH52" },
      });
      const data = await res.json();
      setNews(data.articles || []);
    } catch (err) {
      console.error("Erro ao carregar notícias", err);
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {loading ? (
        [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/70 rounded-2xl h-48 animate-pulse"
          />
        ))
      ) : (
        news.map((item, i) => (
          <Tilt key={i} glareEnable={true} glareColor="#ff00ff">
            <div className="p-4 bg-black/70 rounded-2xl border border-transparent bg-clip-padding hover:scale-105 transition transform shadow-[0_0_20px_rgba(255,0,255,0.6)]">
              <h3 className="text-lg font-bold neon-text">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.description}</p>
              <a
                href={item.url}
                target="_blank"
                className="text-pink-400 hover:text-blue-400 neon-text"
              >
                Ler mais
              </a>
            </div>
          </Tilt>
        ))
      )}
    </div>
  );
}

// === TOP JOGOS ===
function TopGamesSection() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("https://api.rawg.io/api/games?key=YOUR_API_KEY&ordering=-rating&page_size=5")
      .then((res) => res.json())
      .then((data) => setGames(data.results || []))
      .catch((err) => console.error("Erro ao carregar jogos", err));
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Jogos fixos */}
      {fixedGames.map((game, i) => (
        <Tilt key={i} glareEnable={true} glareColor="#00f">
          <div className="p-4 bg-black/70 rounded-2xl border border-transparent bg-clip-padding hover:scale-105 transition transform shadow-[0_0_20px_rgba(0,200,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold neon-text animate-pulse">{i + 1}º</span>
              <h3 className="text-lg font-bold neon-text">{game.name}</h3>
            </div>
            <img src={game.img} alt={game.name} className="rounded-xl mb-2" />
            <p className="text-gray-300">⭐ {game.rating}</p>
          </div>
        </Tilt>
      ))}

      {/* Jogos da API */}
      {games.map((game, i) => (
        <Tilt key={i} glareEnable={true} glareColor="#f0f">
          <div className="p-4 bg-black/70 rounded-2xl border border-transparent bg-clip-padding hover:scale-105 transition transform shadow-[0_0_20px_rgba(255,0,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold neon-text animate-pulse">{i + 1}º</span>
              <h3 className="text-lg font-bold neon-text">{game.name}</h3>
            </div>
            <img src={game.background_image} alt={game.name} className="rounded-xl mb-2" />
            <p className="text-gray-300">⭐ {game.rating}</p>
          </div>
        </Tilt>
      ))}
    </div>
  );
}

// === CSS EXTRA (neon) ===
const style = document.createElement("style");
style.innerHTML = `
  .neon-text {
    text-shadow: 0 0 5px #00f, 0 0 10px #f0f, 0 0 20px #0ff;
  }
`;
document.head.appendChild(style);
