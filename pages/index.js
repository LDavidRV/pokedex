import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import styles from "../styles/Home.module.css";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchPokemonList();
  }, []);
  
  const fetchPokemonList = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await response.json();
      setPokemonList(data.results);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
    
  const handleLoadMore = () => {
    const offset = displayedPokemon.length;
    const nextPokemon = pokemonList.slice(offset, offset + 20);
    setDisplayedPokemon((prevPokemon) => [...prevPokemon, ...nextPokemon]);
  };
  
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPokemonList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    setDisplayedPokemon(filteredPokemonList.slice(0, 20));
    setSearchTerm(e.target.value);
  };
  
  const handlePokemonClick = (id) => {
    router.push(`/pokemon/${id}`);
  };

  useEffect(() => {
    const filteredPokemonList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedPokemon(filteredPokemonList.slice(0, 20));
  }, [pokemonList, searchTerm]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokédex</title>
      </Head>

      <h1 className={styles.title}>Pokédex</h1>

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
            {displayedPokemon.map((pokemon) => (
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

          {displayedPokemon.length < pokemonList.length && (
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
