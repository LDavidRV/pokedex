import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import styles from "../styles/Home.module.css";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20"
      );
      const data = await response.json();
      setPokemonList(data.results);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleLoadMore = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"
      );
      const data = await response.json();
      setPokemonList((prevList) => [...prevList, ...data.results]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePokemonClick = (id) => {
    router.push(`/pokemon/${id}`);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${styles.container} ${
        darkMode ? styles.darkMode : styles.lightMode
      }`}
    >
      <Head>
        <title>Pokédex</title>
      </Head>

      <h1 className={styles.title}>Pokédex</h1>

      {/* <button className={styles.darkModeButton} onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button> */}

      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.pokemonList}>
            {filteredPokemonList.map((pokemon) => (
              <div key={pokemon.name} className={styles.pokemonCard}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    pokemon.url.split("/")[6]
                  }.png`}
                  alt={pokemon.name}
                  onClick={() => handlePokemonClick(pokemon.url.split("/")[6])}
                  className={styles.pokemonImage}
                />
                <p className={styles.pokemonName}>{pokemon.name}</p>
              </div>
            ))}
          </div>

          {pokemonList.length >= 20 && (
            <button className={styles.loadMoreButton} onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
